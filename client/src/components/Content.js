import React, { useState, useEffect } from "react";
import { Alert } from 'react-bootstrap';
import WorkflowStepper from "./WorkflowStepper";
import Voter from "./Voter";
import Proposal from "./Proposal";
import ProposalForm from "./ProposalForm";
import "./Content.css";

function Content(props) {
    const state = props.state;
    const loadingState = props.loadingState;
    const voter = props.voter;
    const proposalWinners = props.proposalWinners;
    // const [voter, setVoter] = useState({});
    
    // useEffect(() => {
    //     (async function () {
    //         setVoter(props.voter);
    //     })();
    // }, [props.voter]);

    return (
        <div className="Content">
            { window.ethereum !== "undefined"
                && state.accounts
                ?
                    <div>
                        { voter.isRegistered
                            ?
                                <div>
                                    <WorkflowStepper state={ state } />
                                    { state.workflowStatus === "0"
                                        && state.accounts[0] === state.owner
                                        && <Voter state={ state } />
                                    }
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
                                    { state.workflowStatus === "1"
                                        && voter.isRegistered
                                        && <ProposalForm state={ state } voter={ voter } />
                                    }
                                    { parseInt(state.workflowStatus) >= 1
                                        && parseInt(state.workflowStatus) <= 5
                                        && voter.isRegistered
                                        && <Proposal state={ state } voter={ voter }  proposalWinners={ proposalWinners } />
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
