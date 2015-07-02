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
                    dispatchClick={stepListThis.handleClick}
                    ref={'step'+i}
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
