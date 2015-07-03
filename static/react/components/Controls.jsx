var InputControl = React.createClass({
    render: function() {
        var classes = {
            "12u$(xsmall)": true
        };
        classes[this.props.widthClass] = true;
        return (
            <div className={classNames(classes)}>
                <input type={this.props.inputType} name={this.props.id} id={this.props.id} placeholder={this.props.text} />
            </div>
        );
    }
});

var TextControl = React.createClass({
    render: function() {
        return (
            <InputControl inputType="text" id={this.props.id} name={this.props.id} text={this.props.text} widthClass={this.props.widthClass} />
        );
    }
});

var EmailControl = React.createClass({
    render: function() {
        return (
            <InputControl inputType="email" id={this.props.id} name={this.props.id} text={this.props.text} widthClass={this.props.widthClass} />
        );
    }
});

var DuplicateFormControl = React.createClass({
    handleClick: function() {
    },
    render: function() {
        var classes = {
            "12u$(xsmall)": true,
            "actions": true
        };
        classes[this.props.widthClass] = true;
        return (
            <div className={classNames(classes)}>
                <div className="button alt fit" onClick={this.handleClick}>{this.props.text}</div>
            </div>
        );
    }
});

var typeControlMap = {
    "name": "TextControl",
    "ssn": "TextControl",
    "email": "EmailControl",
    "phone": "TextControl",
    "duplicate-form": "DuplicateFormControl"
};

var controlIdCounts = {
    "name": 0,
    "ssn": 0,
    "email": 0,
    "phone": 0,
    "duplicate-form": 0
};


var RowControl = React.createClass({
    render: function() {
        var width=0;
        var elements = this.props.row.map(function(control) {
            width += control.width;
            var widthClass = "" + control.width + "u";
            if (width >= 12) {
                widthClass += "$";
            }
            var id = control.type + controlIdCounts[control.type];
            var Tag = typeControlMap[control.type];
            switch (control.type) {
                case "name":
                    return <TextControl widthClass={widthClass} id={id} text={control.text} />;
                case "ssn":
                    return <TextControl widthClass={widthClass} id={id} text={control.text} />;
                case "email":
                    return <EmailControl widthClass={widthClass} id={id} text={control.text} />;
                case "phone":
                    return <TextControl widthClass={widthClass} id={id} text={control.text} />;
                case "duplicate-form":
                    return <DuplicateFormControl widthClass={widthClass} id={id} text={control.text} />;
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

var RowControlList = React.createClass({
    render: function() {
        if (!this.props.rows) {
            return null;
        }
        var rows = this.props.rows.map(function(row) {
            return <RowControl row={row} />;
        });
        return (
            <div className="12u$">
                {rows}
            </div>
        );
    }
});
