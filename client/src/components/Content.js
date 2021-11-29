import React from "react";
import { Alert } from 'react-bootstrap';
import WorkflowStepper from "./WorkflowStepper";
import Proposal from "./Proposal";
import "./Content.css";

function Content(props) {
    const state = props.state;
    const workflowStatus = props.workflowStatus;
    const loadingState = props.loadingState;
    const voter = props.voter;
    const proposals = props.proposals;
    const proposalIdsWinners = props.proposalIdsWinners;

    return (
        <div className="Content">
            { window.ethereum !== "undefined"
                && state.accounts
                ?
                    <div>
                        { (voter.isRegistered || workflowStatus === "5")
                            ?
                                <div>
                                    <WorkflowStepper state={ state } workflowStatus={ workflowStatus } voter={ voter } />
                                    <hr />
                                    { workflowStatus === "0"
                                        && 
                                            <Alert variant="info" className="AlertBox">
                                                <Alert.Heading>You are a voter.</Alert.Heading>
                                                <p>
                                                    Congratulations!<br />
                                                    You are registered as a voter.<br />
                                                    The proposal session will be started soon.<br />
                                                    Please wait... 
                                                </p>
                                            </Alert>
                                    }
                                    { parseInt(workflowStatus) >= 1
                                        && parseInt(workflowStatus) <= 5
                                        &&
                                            <Proposal
                                                state={ state }
                                                workflowStatus={ workflowStatus }
                                                voter={ voter }
                                                proposals={ proposals }
                                                proposalIdsWinners={ proposalIdsWinners }
                                            />
                                    }
                                </div>
                            :
                                <div>
                                    <Alert variant="warning" className="AlertBox">
                                        <Alert.Heading>You are not a voter.</Alert.Heading>
                                        <p>
                                            You are not registered as a voter.<br />
                                            The admin may add you soon.<br />
                                            Please wait...
                                        </p>
                                    </Alert>
                                </div>
                        }
                    </div>
                :
                    <div>
                        { !loadingState
                            && 
                                <div>
                                    <Alert variant="danger" className="AlertBox">
                                        <Alert.Heading>Wallet not found.</Alert.Heading>
                                        <p>
                                            Your wallet is not connected.<br />
                                            Please check your wallet connection and refresh the page.
                                        </p>
                                    </Alert>
                                </div>
                        }
                    </div>
            }
        </div>
    );
}

export default Content;
