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
        this.props.dispatchClick();
        if (this.state.stepActive !== StepActive.ACTIVE) {
            this.setState({stepActive: StepActive.ACTIVE});
            this.refs.activeStep.setState({stepActive: StepActive.ACTIVE});
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
                <Step onClick={this.handleClick}
                      className="step-heading"
                      text={this.props.text}
                />
                <ActiveStep initialStepActive={this.state.stepActive} ref='activeStep' />
            </li>
        );
    }
});

var Step = React.createClass({
    render: function() {
        return (
            <div onClick={this.props.onClick} className="step-heading">{this.props.text}</div>
        );
    }
});

var ActiveStep = React.createClass({
    getInitialState: function() {
        return {stepActive: this.props.initialStepActive};
    },
    render: function() {
        var classes = classNames({
            "row": true,
            "uniform": true,
            "step-form-container": true,
            "hidden": this.state.stepActive !== StepActive.ACTIVE
        });
        return (
            <div className={classes}>
                <div className="8u 12u$(xsmall)">
                    <input type="text" name="name" id="name" placeholder="Legal Name"/>
                </div>
                <div className="4u$ 12u$(xsmall)">
                    <input type="text" name="ssn" id="ssn" placeholder="SSN"/>
                </div>
                <div className="6u 12u$(xsmall)">
                    <input type="email" name="email" id="email" placeholder="Email"/>
                </div>
                <div className="6u 12u$(xsmall)">
                    <input type="text" name="phone" id="phone" placeholder="Phone Number"/>
                </div>
                <div className="actions 12u$">
                    <div className="button alt fit">Add Another Buyer</div>
                </div>
            </div>
        );
    }
});
