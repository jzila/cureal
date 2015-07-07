var ActiveStep = React.createClass({
    getInitialState: function() {
        return {stepActive: this.props.initialStepActive};
    },
    render: function() {
        if (!this.props.form) {
            return null;
        }
        var classes = classNames({
            "step-form-container": true,
            "hidden": this.state.stepActive !== StepActive.ACTIVE
        });
        return (
            <div className={classes}>
                <Form data={this.props.form.data} controls={this.props.form.controls} actions={this.props.form.actions} />
            </div>
        );
    }
});

var StepContainer = React.createClass({
    getInitialState: function() {
        return {
            stepState: this.props.initialStepState,
            stepActive: this.props.initialStepActive
        };
    },
    setInactive: function() {
        if (this.state.stepActive === StepActive.ACTIVE) {
            this.setState({stepActive: StepActive.INACTIVE});
            this.refs.activeStep.setState({stepActive: StepActive.INACTIVE});
        }
    },
    handleClick: function() {
        if (this.state.stepActive !== StepActive.DISABLED) {
            this.props.dispatchClick();
            if (this.state.stepActive !== StepActive.ACTIVE) {
                this.setState({stepActive: StepActive.ACTIVE});
                this.refs.activeStep.setState({stepActive: StepActive.ACTIVE});
            }
        }
    },
    render: function() {
        var classes = classNames({
            'step': true,
            'done': this.state.stepActive === StepActive.INACTIVE && this.state.stepState === StepState.DONE,
            'todo': this.state.stepActive === StepActive.INACTIVE && this.state.stepState === StepState.TODO,
            'active': this.state.stepActive === StepActive.ACTIVE,
            'disabled': this.state.stepActive === StepActive.DISABLED,
            'step-submit': this.props.submit
        });
        return (
            <li className={classes}>
                <div onClick={this.handleClick} className="step-heading">{this.props.text}</div>
                <ActiveStep initialStepActive={this.state.stepActive} form={this.props.form} ref="activeStep" />
            </li>
        );
    }
});

var StepList = React.createClass({
    handleClick: function(index) {
        var stepListThis = this;
        Object.keys(this.refs).map(function(k) {
            var child = stepListThis.refs[k];
            child.setInactive();
        });
    },
    render: function() {
        var stepListThis = this;
        var steps = this.props.data.map(function(step, i) {
            return (
                <StepContainer
                    initialStepState={step.stepState}
                    initialStepActive={step.stepActive}
                    text={step.text}
                    submit={step.submit}
                    form={step.form}
                    dispatchClick={stepListThis.handleClick}
                    ref={'step'+i}
                    key={i}
                />
            );
        });
        return (
            <ul className="steps 12u$">
                <form method="post" action="#">
                    {steps}
                </form>
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
