import React from "react";
import { Alert } from 'react-bootstrap';
import WorkflowStepper from "./WorkflowStepper";
import Proposal from "./Proposal";
import "./Content.css";

function Content(props) {
    const state = props.state;
    const loadingState = props.loadingState;
    const voter = props.voter;
    const proposalIdsWinners = props.proposalIdsWinners;

    return (
        <div className="Content">
            { window.ethereum !== "undefined"
                && state.accounts
                ?
                    <div>
                        { (voter.isRegistered || state.workflowStatus === "5")
                            ?
                                <div>
                                    <WorkflowStepper state={ state } voter={ voter } />
                                    { state.workflowStatus === "0"
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
                                    <hr />
                                    { parseInt(state.workflowStatus) >= 1
                                        && parseInt(state.workflowStatus) <= 5
                                        && <Proposal state={ state } voter={ voter } proposalIdsWinners={ proposalIdsWinners } />
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
