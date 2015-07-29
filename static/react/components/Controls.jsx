var InputControl = React.createClass({
    change: function(evt, sanitizeValueHandler) {
        var value = evt.target.value;
        if (this.props.sanitizeData) {
            value = this.props.sanitizeData(value);
        }
        if (sanitizeValueHandler) {
            value = sanitizeValueHandler(value);
        }
        var key = this.props.name.substring(0, this.props.name.lastIndexOf("-"));
        this.props.handleChange(this.props.formId, key, value);
        if (this.props.formatValue) {
            evt.target.value = this.props.formatValue(value);
        } else {
            evt.target.value = value;
        }
    },
    backspaceHandler: function(value) {
        return value.substring(0, value.length - 1);
    },
    handleKeyDown: function(evt) {
        switch (evt.keyCode) {
            case 8:
                if (window.getSelection().type !== 'Range') {
                    this.change(evt, this.backspaceHandler);
                    evt.preventDefault();
                }
                break;
        }
    },
    handleChange: function(evt) {
        this.change(evt, null);
    },
    render: function() {
        var name = this.props.name || this.props.id;
        return (
            <div className={"12u$(xsmall) " + this.props.widthClass + " " + this.props.className}>
                <input type={this.props.inputType} name={name} id={this.props.id} placeholder={this.props.text} defaultValue={this.props.value} onKeyDown={this.handleKeyDown} onChange={this.handleChange} />
            </div>
        );
    }
});

var TextControl = React.createClass({
    render: function() {
        return (
            <InputControl {...this.props} inputType="text"/>
        );
    }
});

var SSNControl = React.createClass({
    validRegex: /[^0-9]/g,
    ssnRegex: /(\d{0,3})(\d{0,3})(\d{0,3}).*/,
    replaceSSN: function(m, p1, p2, p3) {
        return p1 + (p1.length==3 ?
                    '-' + p2 + (p2.length == 3 ?
                                '-' + p3 :
                                '') :
                    '');
    },
    sanitizeData: function(value) {
        return value.replace(this.validRegex, '').substr(0, 9);
    },
    formatValue: function(value) {
        return value.replace(this.ssnRegex, this.replaceSSN);
    },
    render: function() {
        return (
            <TextControl {...this.props} formatValue={this.formatValue} sanitizeData={this.sanitizeData} />
        );
    }
});

var RadioControl = React.createClass({
    handleChange: function(evt) {
        var key = this.props.name.substring(0, this.props.name.lastIndexOf("-"));
        var id = this.props.id.substring(0, this.props.id.lastIndexOf("-"));
        this.props.handleChange(this.props.formId, key, id);
    },
    render: function() {
        var classes = {
            "radio": true,
            "12u$(xsmall)": true,
            "disabled": this.props.disabled
        };
        classes[this.props.widthClass] = true;
        var helpTip = null;
        if (this.props.helptip) {
            helpTip = <span className="helptip">{this.props.helptip}</span>;
        }
        return (
            <div className={classNames(classes)}>
                <input type="radio" name={this.props.name} id={this.props.id} onChange={this.handleChange} disabled={this.props.disabled} checked={this.props.checked} value={this.props.value} />
                <label className="12u$" htmlFor={this.props.id}>{this.props.text} {helpTip}</label>
            </div>
        );
    }
});

var CheckControl = React.createClass({
    handleChange: function(evt) {
        var key = this.props.name.substring(0, this.props.name.lastIndexOf("-"));
        this.props.handleChange(this.props.formId, key, !this.props.checked);
    },
    render: function() {
        var classes = {
            "check": true,
            "12u$(xsmall)": true,
            "disabled": this.props.disabled
        };
        classes[this.props.widthClass] = true;
        var helpTip = null;
        if (this.props.helptip) {
            helpTip = <span className="helptip">{this.props.helptip}</span>;
        }
        return (
            <div className={classNames(classes)}>
                <input type="checkbox" name={this.props.name} id={this.props.id} onChange={this.handleChange} disabled={this.props.disabled} checked={this.props.checked} value={this.props.value} />
                <label className="12u$" htmlFor={this.props.id}>{this.props.text} {helpTip}</label>
            </div>
        );
    }
});

var RemoveLabelControl = React.createClass({
    handleRemove: function() {
        this.props.handleRemove(this.props.formId);
    },
    render: function() {
        return (
            <div className={"label 12u$(xsmall) " + this.props.widthClass}>
                <div className="text">{this.props.text}</div>
                <div className="remove" onClick={this.handleRemove}></div>
            </div>
        );
    }
});

var LabelControl = React.createClass({
    render: function() {
        return (
            <div className={"label 12u$(xsmall) " + this.props.widthClass}>
                <div className="text">{this.props.text}</div>
            </div>
        );
    }
});

var EmailControl = React.createClass({
    render: function() {
        return (
            <InputControl {...this.props} inputType="email" />
        );
    }
});

var PhoneControl = React.createClass({
    validRegex: /[^0-9]/g,
    phoneRegex: /(\d{0,3})(\d{0,3})(\d{0,4}).*/,
    replacePhone: function(m, p1, p2, p3) {
        return p1 + (p1.length==3 ?
                    '-' + p2 + (p2.length == 3 ?
                                '-' + p3 :
                                '') :
                    '');
    },
    sanitizeData: function(value) {
        return value.replace(this.validRegex, '').substr(0, 10);
    },
    formatValue: function(value) {
        return value.replace(this.phoneRegex, this.replacePhone);
    },
    render: function() {
        return (
            <InputControl {...this.props} inputType="tel" formatValue={this.formatValue} sanitizeData={this.sanitizeData} />
        );
    }
});

var MoneyControl = React.createClass({
    validRegex: /[^0-9]/g,
    moneyRegex: /(\d{0,3})(\d{0,3})(\d{0,3})/,
    replaceMoney: function(m, p1, p2, p3) {
        return p1 + (p1.length===3 && p2.length > 0 ?
                    ',' + p2 + (p2.length === 3 && p3.length > 0 ?
                                ',' + p3 :
                                '') :
                    '');
    },
    reverseString: function(val) {
        var o = '';
        for (i=val.length - 1; i>=0; --i) {
            o += val[i];
        }
        return o;
    },
    sanitizeData: function(value) {
        return value.replace(this.validRegex, '');
    },
    formatValue: function(value) {
        return this.reverseString(this.reverseString(value).replace(this.moneyRegex, this.replaceMoney));
    },
    render: function() {
        return (
            <InputControl {...this.props} className="money" inputType="num" formatValue={this.formatValue} sanitizeData={this.sanitizeData} />
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

var bigIconSize = new google.maps.Size(32, 32);
var smallIconSize = new google.maps.Size(24, 24);
var bigIcon = new google.maps.MarkerImage(
    "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png",
    null, /* size is determined at runtime */
    null, /* origin is 0,0 */
    null, /* anchor is bottom center of the scaled image */
    new google.maps.Size(33, 60)
);
var smallIcon = new google.maps.MarkerImage(
    "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png",
    null, /* size is determined at runtime */
    null, /* origin is 0,0 */
    null, /* anchor is bottom center of the scaled image */
    new google.maps.Size(22, 40)
);

var MapControl = React.createClass({
    map: null,
    markers: [],
    mapMarkerClicked: function(i) {
        this.setState({selectedMarker: i});
    },
    mapClicked: function() {
        this.setState({selectedMarker: -1});
    },
    getInitialState: function() {
        var homes = this.props.homes || [];
        return {
            homes: homes,
            markers: [],
            selectedMarker: -1,
        };
    },
    markersFromHomes: function(homes, markers) {
        var _this = this;
        for (var i=0; i<markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
        for (var j=0; j<homes.length; j++) {
            var home = homes[j];
            var marker = new google.maps.Marker({
                position: {lat: home.lat, lng: home.lng},
                map: this.map,
                title: 'home'
            });
            markers.push(marker);
            google.maps.event.addListener(marker, 'click', this.mapMarkerClicked.bind(this, j));
            if (j == this.state.selectedMarker) {
                marker.setIcon(bigIcon);
            } else {
                marker.setIcon(smallIcon);
            }
        }
        return markers;
    },
    componentDidMount: function() {
        var _this = this;
        var mapOptions = {
            center: {lat: 0, lng: 0},
            zoom: 12,
            disableDefaultUI: true
        };
        var map = this.map = new google.maps.Map(this.refs[this.props.id].getDOMNode(), mapOptions);
        google.maps.event.addListener(map, 'click', function() {
            _this.mapClicked();
        });
        navigator.geolocation.getCurrentPosition(function(position) {
            map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
        });
        this.markers = this.markersFromHomes(this.state.homes, this.markers);
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
        if (this.props.isActive === false && nextProps.isActive === true) {
            this.resetMap();
            return false;
        }
        if (this.state.selectedMarker != nextState.selectedMarker && this.markers.length) {
            var map = this.map;
            if (this.state.selectedMarker >= 0) {
                this.markers[this.state.selectedMarker].setIcon(smallIcon);
            }
            if (nextState.selectedMarker >= 0) {
                this.markers[nextState.selectedMarker].setIcon(bigIcon);
            }
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
    "ssn": SSNControl,
    "email": EmailControl,
    "phone": PhoneControl,
    "money": MoneyControl,
    "remove-label": RemoveLabelControl,
    "label": LabelControl,
    "radio": RadioControl,
    "check": CheckControl,
    "duplicate-form": DuplicateFormControl,
    "map": MapControl
};

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
            var id = control.type;
            if (control.id) {
                id = control.id;
            }
            id = id + "-" + _this.props.formId;
            var name = id;
            if (control.name) {
                name = control.name + "-" + _this.props.formId;
            }
            var text = "";
            if (control.text) {
                text = control.text.replace(/{{form-id}}/, function(match) {
                    return _this.props.formSequence + 1;
                });
            }
            var dataKey = control.name || control.id;
            var value = control.value || "";
            var checked = false;
            if (dataKey && _this.props.data && _this.props.data[dataKey]) {
                value = _this.props.data[dataKey];
                checked = (value === true || value === control.value);
            }
            var props = jQuery.extend({}, control, {
                "widthClass": widthClass,
                "name": name,
                "id": id,
                "formId": _this.props.formId,
                "key": id,
                "text": text,
                "value": value,
                "checked": checked,
                "handleChange": _this.props.handleChange,
                "handleRemove": _this.props.handleRemove,
                "isActive": _this.props.isActive,
                "handleSelectHome": _this.props.handleSelectHome,
            });
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
            nextIndex: i,
            selectedHome: null
        };
    },
    addData: function() {
        var data = this.state.data;
        data[this.state.nextIndex] = {"id": this.state.nextIndex};
        this.setState({data: data, nextIndex: this.state.nextIndex + 1});
    },
    updateData: function(formId, keyId, value) {
        var data = this.state.data;
        var curVal = data[formId][keyId];
        if (value !== curVal) {
            data[formId][keyId] = value;
            this.setState({data: data});
        }
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
    componentDidUpdate: function(prevProps, prevState) {
        this.dispatchData();
    },
    dispatchData: function() {
        console.log(JSON.stringify(this.state.data));
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
        var classes = classNames({
            "step-form-container": true,
            "hidden": !this.props.isActive
        });
        return (
            <div className={classes}>
                {rows}
            </div>
        );
    }
});
