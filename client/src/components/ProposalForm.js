import React, { useState } from "react";
import "./ProposalForm.css";

function ProposalForm(props) {
    const state = props.state;
    const voter = props.voter;
    const [inputAddProposalDescription, setInputAddProposalDescription] = useState("");

    function onChangeInputAddProposalDescription(event) {
        event.preventDefault();
        setInputAddProposalDescription(event.target.value);
    }

    async function onSubmitAddProposal(event) {
        event.preventDefault();
        await state.contract.methods.addProposal(inputAddProposalDescription).send({from: state.accounts[0]});
    }

    return (
        <div>
            <div>
                <label>Proposal description: </label>
                <input type="text" value={ inputAddProposalDescription } onChange={ onChangeInputAddProposalDescription }  />
                <input type="submit" value="Add proposal" onClick={ onSubmitAddProposal }/>
            </div>
        </div>
    );
}

export default ProposalForm;
