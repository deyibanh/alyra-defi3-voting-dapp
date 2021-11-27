import React, { useState, useEffect } from "react";
import "./Proposal.css";

function Proposal(props) {
    const state = props.state;
    const voter = props.voter;
    const proposalWinners = props.proposalWinners;
    const [proposals, setProposals] = useState([]);

    useEffect(() => {
        (async function () {
            try {            
                const proposals = await state.contract.methods.getProposals().call();
                setProposals([...proposals]);

                await state.contract.events.ProposalRegistered()
                    .on("data", async event => {
                        const proposalId = event.returnValues.proposalId;
                        const proposal = await state.contract.methods.getProposal(proposalId).call();
                        const newProposals = proposals;
                        newProposals.push(proposal);
                        setProposals([...newProposals]);
                        console.log("New proposal ID: " + proposalId);
                    })
                    .on("changed", changed => console.log(changed))
                    .on("error", err => console.error(err))
                    .on("connected", str => console.log(str));
            } catch (error) {
                alert("Failed to get proposals.");
                console.error(error);
            }
        })();
    }, [state.contract.methods, state.contract.events]);

    async function vote(proposalId) {
        await state.contract.methods.vote(proposalId).send({from: state.accounts[0]});
    }

    async function tallyVotes() {
        console.log("tallyVotes");
        await state.contract.methods.tallyVotes().send({from: state.accounts[0]});
    }

    return (
        <div>
            { voter.isRegistered
                ?
                    <div>
                        { proposals.length > 0 
                            ? 
                                <div>
                                    { parseInt(state.workflowStatus) === 4
                                        && state.accounts[0] === state.owner
                                        &&
                                            <button onClick={ tallyVotes } >Tally votes</button>
                                    }
                                    { parseInt(state.workflowStatus) === 5
                                        && 
                                            <div>
                                                Winners:
                                                { proposalWinners.map((proposalWinner, index) =>
                                                    <div key={ index }>
                                                        <p>Proposal ID: { index }</p>
                                                        <p>Description: { proposalWinner.description }</p>
                                                        { voter.hasVoted
                                                            && parseInt(voter.votedProposalId) === index
                                                            &&
                                                                <span>You have voted for this proposal!</span>
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                    }
                                    <div>Proposals:</div>
                                    { proposals.map((proposal, index) =>
                                        <div key={ index }>
                                            <p>Proposal ID: { index }</p>
                                            <p>Description: { proposal.description }</p>
                                            { state.workflowStatus === "3"
                                                && !voter.hasVoted
                                                &&
                                                    <button onClick={ () => vote(index) }>Vote</button>
                                            }

                                            { voter.hasVoted
                                                && parseInt(voter.votedProposalId) === index
                                                &&
                                                    <span>You have voted for this proposal!</span>
                                            }
                                        </div>
                                    )}
                                </div>
                            :
                                <div>
                                    <span>No proposals.</span>
                                </div>
                        }
                    </div>
                :
                    <div>
                        <span>You are not registered as voter.</span>
                    </div>
            }
        </div>
    );
}

export default Proposal;
