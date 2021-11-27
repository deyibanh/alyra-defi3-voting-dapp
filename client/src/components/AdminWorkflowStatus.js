import React from "react";
import "./AdminWorkflowStatus.css";

function AdminWorkflowStatus(props) {
    const state = props.state;
    const workflowStatusLabels = [
        "Registering Voters",
        "Proposals Registration Started",
        "Proposals Registration Ended",
        "Voting Session Started",
        "Voting Session Ended",
        "Votes Tallied"
    ];

    async function startRegisteringProposals() {
        console.log("startRegisteringProposals");
        await state.contract.methods.startRegisteringProposals().send({from: state.accounts[0]});
    }

    async function stopRegisteringProposals() {
        console.log("stopRegisteringProposals");
        await state.contract.methods.stopRegisteringProposals().send({from: state.accounts[0]});
    }

    async function startVotingSession() {
        console.log("startVotingSession");
        await state.contract.methods.startVotingSession().send({from: state.accounts[0]});
    }

    async function stopVotingSession() {
        console.log("stopVotingSession");
        await state.contract.methods.stopVotingSession().send({from: state.accounts[0]});
    }

    return (
        <div>
            <div>State: { workflowStatusLabels[state.workflowStatus] }</div> 
            <button disabled={ state.workflowStatus !== "0" } onClick={ startRegisteringProposals } >Start registering proposals</button>
            <button disabled={ state.workflowStatus !== "1" } onClick={ stopRegisteringProposals } >Stop registering proposals</button>
            <button disabled={ state.workflowStatus !== "2" } onClick={ startVotingSession } >Start voting session</button>
            <button disabled={ state.workflowStatus !== "3" } onClick={ stopVotingSession } >Stop voting session</button>
            
        </div>
    );
}

export default AdminWorkflowStatus;
