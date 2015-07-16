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
            <div className={"label 12u$(xsmall) " + this.props.widthClass}>
                <div className="text">{this.props.text}</div>
                <div className="remove" onClick={this.props.handleRemove}></div>
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

var MapControl = React.createClass({
    map: null,
    componentDidMount: function() {
        var mapOptions = {
            center: {lat: 0, lng: 0},
            zoom: 12,
            disableDefaultUI: true
        };
        var map = this.map = new google.maps.Map(this.refs[this.props.id].getDOMNode(), mapOptions);
        navigator.geolocation.getCurrentPosition(function(position) {
            map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
        });
    },
    resetMap: function() {
        var map = this.map;
        x = map.getZoom();
        c = map.getCenter();
        google.maps.event.trigger(map, 'resize');
        map.setZoom(x);
        map.setCenter(c); 
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        if (nextProps.isActive === true) {
            this.resetMap();
            return false;
        }
        return true;
    },
    render: function() {
        return (
            <div className={"12u$(xsmall) " + this.props.widthClass}>
                <div className="map" id={this.props.id} ref={this.props.id} >
                </div>
            </div>
        );
    }
});

var controlLookupTable = {
    "name": TextControl,
    "ssn": TextControl,
    "email": EmailControl,
    "phone": TextControl,
    "label": LabelControl,
    "duplicate-form": DuplicateFormControl,
    "map": MapControl
};

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
            var id = control.type;
            if (control.id) {
                id = control.id;
            }
            id = id + "-" + _this.props.formId;
            var text = "";
            if (control.text) {
                text = control.text.replace(/{{form-id}}/, function(match) {
                    return _this.props.formSequence + 1;
                });
            }
            var value = "";
            if (control.id && _this.props.data && _this.props.data[control.id]) {
                value = _this.props.data[control.id];
            }
            var props = {
                "widthClass": widthClass,
                "id": id,
                "key": id,
                "text": text,
                "value": value,
                "handleChange": _this.handleChange,
                "handleRemove": _this.handleRemove,
                "isActive": _this.props.isActive,
            };
            if (_this.props.handleClick) {
                props.handleClick = _this.props.handleClick;
            }
            var reactControl = controlLookupTable[control.type];
            if (reactControl) {
                return React.createElement(reactControl, props);
            }
            return null;
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
        var i=0;
        return {
            data: this.props.data.reduce(function(obj, d) {
                var dd = jQuery.extend({}, d);
                dd.id = i;
                obj[i++] = dd;
                return obj;
            }, {}),
            nextIndex: i
        };
    },
    addData: function() {
        var data = this.state.data;
        data[this.state.nextIndex] = {"id": this.state.nextIndex};
        this.setState({data: data, nextIndex: this.state.nextIndex + 1});
    },
    updateData: function(newData) {
        var data = this.state.data;
        data[newData.id] = newData;
        console.log(JSON.stringify(data));
        this.setState({data: data});
    },
    removeData: function(formId) {
        var data = this.state.data;
        delete data[formId];
        if (Object.keys(data).length === 0) {
            this.addData();
        } else {
            this.setState({data: data});
        }
    },
    render: function() {
        var rows = [];
        var _this = this;
        var makeCreateRow = function(data, formSequence) {
            var key = 0;
            var form_id = data.id;
            return function(row) {
                return <ControlRow row={row} handleRemove={_this.removeData} handleClick={_this.addData} handleChange={_this.updateData} key={"" + form_id + "-" + key++} formId={form_id} data={data} formSequence={formSequence} isActive={_this.props.isActive} />;
            };
        };
        var i = 0;
        for (var k in this.state.data) {
            var data = this.state.data[k];
            Array.prototype.push.apply(rows, this.props.controls.map(makeCreateRow(data, i++)));
        }
        if (this.props.actions) {
            Array.prototype.push.apply(rows, this.props.actions.map(makeCreateRow({"id": "a"})));
        }
        return (
            <div className="12u$">
                {rows}
            </div>
        );
    }
});
