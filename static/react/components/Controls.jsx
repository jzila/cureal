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
        var name = this.props.name || this.props.id;
        return (
            <div className={classNames(classes)}>
                <input type={this.props.inputType} name={name} id={this.props.id} placeholder={this.props.text} defaultValue={this.props.value} onChange={this.handleChange} />
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
        console.log("Selected home " + this.state.homes[i].id);
    },
    mapClicked: function() {
        this.setState({selectedMarker: -1});
        console.log("Deselected home");
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
    "ssn": TextControl,
    "email": EmailControl,
    "phone": TextControl,
    "label": LabelControl,
    "duplicate-form": DuplicateFormControl,
    "map": MapControl
};

var ControlRow = React.createClass({
    handleChange: function(id, value) {
        this.props.data[id] = value;
        this.props.handleChange(this.props.data);
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
            var name = id;
            if (control.name) {
                name = name + "-" + _this.props.formId;
            }
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
            var props = jQuery.extend({}, control, {
                "widthClass": widthClass,
                "id": id,
                "key": id,
                "text": text,
                "value": value,
                "handleChange": _this.handleChange,
                "handleRemove": _this.handleRemove,
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
