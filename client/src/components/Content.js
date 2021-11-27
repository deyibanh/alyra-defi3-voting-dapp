import React from "react";
import AdminWorkflowStatus from "./AdminWorkflowStatus";
import VoterForm from "./VoterForm";
import Proposal from "./Proposal";
import ProposalForm from "./ProposalForm";
import "./Content.css";

function Content(props) {
    const state = props.state;
    const voter = props.voter;
    const proposalWinners = props.proposalWinners;

    return (
        <div>
            { window.ethereum !== "undefined"
                && state.accounts
                && state.accounts[0] === state.owner
                && <AdminWorkflowStatus state={ state } />
            }
            { window.ethereum !== "undefined"
                && state.accounts
                && state.accounts[0] === state.owner
                && state.workflowStatus === "0"
                && <VoterForm state={ state } />
            }
            
            { window.ethereum !== "undefined"
                && state.accounts
                && state.workflowStatus === "1"
                && <ProposalForm state={ state } voter={ voter } />
            }
            { window.ethereum !== "undefined"
                && state.accounts
                && parseInt(state.workflowStatus) >= 1
                && parseInt(state.workflowStatus) <= 5
                && <Proposal state={ state } voter={ voter }  proposalWinners={ proposalWinners } />
            }
        </div>
    );
}

export default Content;
