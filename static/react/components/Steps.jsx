var ActiveStep = React.createClass({
    render: function() {
        if (!this.props.form) {
            return null;
        }
        var classes = classNames({
            "step-form-container": true,
            "hidden": !this.props.stepActive
        });
        return (
            <div className={classes}>
                <Form data={this.props.form.data} controls={this.props.form.controls} actions={this.props.form.actions} isActive={this.props.stepActive} />
            </div>
        );
    }
});

var StepContainer = React.createClass({
    handleClick: function() {
        this.props.dispatchClick(this.props.id);
    },
    render: function() {
        var classes = classNames({
            'step': true,
            'done': !this.props.stepActive && this.props.stepState === StepState.DONE,
            'todo': !this.props.stepActive && this.props.stepState === StepState.TODO,
            'active': this.props.stepActive,
            'disabled': this.props.stepState === StepState.DISABLED,
            'step-submit': this.props.submit
        });
        return (
            <li className={classes}>
                <div onClick={this.handleClick} className="step-heading">{this.props.text}</div>
                <ActiveStep stepActive={this.props.stepActive} form={this.props.form} ref="activeStep" />
            </li>
        );
    }
});

var StepList = React.createClass({
    getInitialState: function() {
        return {
            activeStep: -1
        };
    },
    handleClick: function(ref) {
        var activeStep = this.state.activeStep;
        var refInt = parseInt(ref, 10);
        if (this.state.activeStep === refInt) {
            activeStep = -1;
        } else {
            activeStep = refInt;
        }
        this.setState({activeStep: activeStep});
    },
    render: function() {
        var _this = this;
        var steps = this.props.data.map(function(step, i) {
            return (
                <StepContainer
                    stepState={step.stepState}
                    stepActive={i === _this.state.activeStep}
                    text={step.text}
                    submit={step.submit}
                    form={step.form}
                    dispatchClick={_this.handleClick}
                    ref={i}
                    key={i}
                    id={i}
                />
            );
        });
        return (
            <ul className="steps 12u$">
                {steps}
            </ul>
        );
    }
});

var StepPanel = React.createClass({
    render: function() {
        return (
            <div className="step-panel 12u$">
                <h2>Make an Offer</h2>

                <StepList data={this.props.data} />
            </div>
        );
    }
});
