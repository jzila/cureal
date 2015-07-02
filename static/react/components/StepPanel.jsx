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
