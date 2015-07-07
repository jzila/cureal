var InputControl = React.createClass({
    render: function() {
        var classes = {
            "12u$(xsmall)": true
        };
        classes[this.props.widthClass] = true;
        return (
            <div className={classNames(classes)}>
                <input type={this.props.inputType} name={this.props.id} id={this.props.id} placeholder={this.props.text} defaultValue={this.props.value} />
            </div>
        );
    }
});

var TextControl = React.createClass({
    render: function() {
        return (
            <InputControl inputType="text" id={this.props.id} name={this.props.id} text={this.props.text} widthClass={this.props.widthClass} value={this.props.value} />
        );
    }
});

var LabelControl = React.createClass({
    render: function() {
        return (
            <div className="label" widthClass={this.props.widthClass}>{this.props.text}</div>
        );
    }
});


var EmailControl = React.createClass({
    render: function() {
        return (
            <InputControl inputType="email" id={this.props.id} name={this.props.id} text={this.props.text} widthClass={this.props.widthClass} value={this.props.value} />
        );
    }
});

var DuplicateFormControl = React.createClass({
    render: function() {
        return (
            <div className={"actions 12u$(xsmall) " + this.props.widthClass}>
                <div className="button alt fit" onClick={this.props.handleClick}>{this.props.text}</div>
            </div>
        );
    }
});

var ControlRow = React.createClass({
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
                return _this.props.formId;
            });
            var value = "";
            if (control.id && _this.props.data && _this.props.data[control.id]) {
                value = _this.props.data[control.id];
            }
            switch (control.type) {
                case "name":
                    return <TextControl widthClass={widthClass} id={id} text={text} value={value} />;
                case "ssn":
                    return <TextControl widthClass={widthClass} id={id} text={text} value={value} />;
                case "email":
                    return <EmailControl widthClass={widthClass} id={id} text={text} value={value} />;
                case "phone":
                    return <TextControl widthClass={widthClass} id={id} text={text} value={value} />;
                case "label":
                    return <LabelControl widthClass={widthClass} text={text} />;
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
        var rows = [];
        var form_id = 1;
        var state = {};
        if (this.props.form) {
            var makeCreateRow = function(data, key) {
                return function(row) {
                    return {
                        "row": jQuery.extend(true, [], row),
                        "key": key++,
                        "form-id": form_id,
                        "data": data
                    };
                };
            };
            if (this.props.form.controls && this.props.form.controls.length) {
                if (this.props.form.data) {
                    for (var i=0; i<this.props.form.data.length; i++) {
                        var data = this.props.form.data[i];
                        Array.prototype.push.apply(rows, this.props.form.controls.map(makeCreateRow(data, rows.length)));
                        form_id++;
                    }
                } else {
                    rows = this.props.form.controls.map(makeCreateRow(null, rows.length));
                    form_id++;
                }
            }
            state.actionsIndex = rows.length;
            if (this.props.form.actions && this.props.form.actions.length) {
                Array.prototype.push.apply(rows, this.props.form.actions.map(makeCreateRow(null, rows.length)));
            }
        }
        state.rows = rows;
        state["form-id"] = form_id;
        return state;
    },
    handleDuplicateFormClick: function() {
        if (this.props.form.controls && this.props.form.controls.length) {
            var rows = this.state.rows;
            var form_id = this.state["form-id"];
            var key = rows.length;
            newRows = this.props.form.controls.map(function(row) {
                return {
                    "row": jQuery.extend(true, [], row),
                    "key": key++,
                    "form-id": form_id
                };
            });
            Array.prototype.splice.apply(rows, [this.state.actionsIndex, 0].concat(newRows));
            this.setState({
                rows: rows,
                actionsIndex: this.state.actionsIndex + newRows.length,
                "form-id": form_id + 1
            });
        }
    },
    render: function() {
        if (!this.state.rows || this.state.rows.length===0) {
            return null;
        }
        var _this = this;
        var rows = this.state.rows.map(function(obj) {
            return <ControlRow row={obj.row} handleClick={_this.handleDuplicateFormClick} key={obj.key} formId={obj["form-id"]} data={obj.data} />;
        });
        return (
            <div className="12u$">
                {rows}
            </div>
        );
    }
});
