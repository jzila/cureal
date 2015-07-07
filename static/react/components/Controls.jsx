var InputControl = React.createClass({
    handleChange: function(evt) {
        var key = this.props.id.substring(0, this.props.id.lastIndexOf("-"));
        var value = evt.target.value;
        this.props.handleChange(key, value);
    },
    render: function() {
        var classes = {
            "12u$(xsmall)": true
        };
        classes[this.props.widthClass] = true;
        return (
            <div className={classNames(classes)}>
                <input type={this.props.inputType} name={this.props.id} id={this.props.id} placeholder={this.props.text} defaultValue={this.props.value} onChange={this.handleChange} />
            </div>
        );
    }
});

var TextControl = React.createClass({
    render: function() {
        return (
            <InputControl inputType="text" id={this.props.id} name={this.props.id} text={this.props.text} widthClass={this.props.widthClass} value={this.props.value} handleChange={this.props.handleChange} />
        );
    }
});

var LabelControl = React.createClass({
    render: function() {
        return (
            <div className="12u$">
                <div className="label" widthClass={this.props.widthClass}>
                    <div className="text">{this.props.text}</div>
                    <div className="remove" onClick={this.props.handleRemove}></div>
                </div>
            </div>
        );
    }
});


var EmailControl = React.createClass({
    render: function() {
        return (
            <InputControl inputType="email" id={this.props.id} name={this.props.id} text={this.props.text} widthClass={this.props.widthClass} value={this.props.value} handleChange={this.props.handleChange} />
        );
    }
});

var DuplicateFormControl = React.createClass({
    render: function() {
        return (
            <div className={"actions 12u$(xsmall) " + this.props.widthClass}>
                <div className="button alt fit user-add" onClick={this.props.handleClick}>{this.props.text}</div>
            </div>
        );
    }
});

var ControlRow = React.createClass({
    handleChange: function(id, value) {
        var data = jQuery.extend({}, this.props.data);
        data[id] = value;
        this.props.handleChange(data);
    },
    handleRemove: function() {
        this.props.handleRemove(this.props.formId);
    },
    render: function() {
        var _this = this;
        var width=0;
        var elements = this.props.row.map(function(control) {
            width += control.width;
            var widthClass = "" + control.width + "u";
            if (width >= 12) {
                widthClass += "$";
            }
            var id = control.id + "-" + _this.props.formId;
            var text = control.text.replace(/{{form-id}}/, function(match) {
                return _this.props.formId + 1;
            });
            var value = "";
            if (control.id && _this.props.data && _this.props.data[control.id]) {
                value = _this.props.data[control.id];
            }
            switch (control.type) {
                case "name":
                    return <TextControl handleChange={_this.handleChange} widthClass={widthClass} id={id} text={text} value={value} />;
                case "ssn":
                    return <TextControl handleChange={_this.handleChange} widthClass={widthClass} id={id} text={text} value={value} />;
                case "email":
                    return <EmailControl handleChange={_this.handleChange} widthClass={widthClass} id={id} text={text} value={value} />;
                case "phone":
                    return <TextControl handleChange={_this.handleChange} widthClass={widthClass} id={id} text={text} value={value} />;
                case "label":
                    return <LabelControl handleRemove={_this.handleRemove} widthClass={widthClass} text={text} />;
                case "duplicate-form":
                    return <DuplicateFormControl widthClass={widthClass} id={id} text={control.text} handleClick={_this.props.handleClick} />;
                default:
                    return null;
            }
        });
        return (
            <div className="row uniform">
                {elements}
            </div>
        );
    }
});

var Form = React.createClass({
    getInitialState: function() {
        return {
            data: this.props.data.map(function(d, i) {
                var dd = jQuery.extend({}, d);
                dd.id = i;
                return dd;
            })
        };
    },
    addData: function() {
        var data = this.state.data.slice();
        data.push({"id": data[data.length-1].id + 1});
        this.setState({data: data});
    },
    updateData: function(newData) {
        var data = this.state.data.slice();
        data[newData.id] = newData;
        this.setState({data: data});
    },
    removeData: function(formId) {
        var data = this.state.data.slice();
        data.splice(data[formId], 1);
        if (data.length === 0) {
            this.addData();
        } else {
            this.setState({data: data});
        }
    },
    render: function() {
        var rows = [];
        var _this = this;
        var makeCreateRow = function(data) {
            var key = 0;
            var form_id = data.id;
            return function(row) {
                return <ControlRow row={row} handleRemove={_this.removeData} handleClick={_this.addData} handleChange={_this.updateData} key={"" + form_id + "-" + key++} formId={form_id} data={data} />;
            };
        };
        for (var i=0; i<this.state.data.length; i++) {
            var data = this.state.data[i];
            Array.prototype.push.apply(rows, this.props.controls.map(makeCreateRow(data)));
        }
        Array.prototype.push.apply(rows, this.props.actions.map(makeCreateRow({"id": "a"})));
        return (
            <div className="12u$">
                {rows}
            </div>
        );
    }
});
