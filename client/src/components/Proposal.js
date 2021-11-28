import React, { useState, useEffect } from "react";
import { Alert, Card, Container, Row, Col, Button } from 'react-bootstrap';
import { CheckCircleFill } from 'react-bootstrap-icons';
import ProposalForm from "./ProposalForm";
import "./Proposal.css";

function Proposal(props) {
    const state = props.state;
    const contract = state.contract;
    const voter = props.voter;
    const proposalIdsWinners = props.proposalIdsWinners;
    const [proposals, setProposals] = useState([]);

    useEffect(() => {
        (async function () {
            try {            
                const proposals = await contract.methods.getProposals().call();
                setProposals([...proposals]);

                await contract.events.ProposalRegistered()
                    .on("data", async event => {
                        const proposalId = event.returnValues.proposalId;
                        const proposal = await contract.methods.getProposal(proposalId).call();
                        const newProposals = proposals;
                        newProposals.push(proposal);
                        setProposals([...newProposals]);
                    })
                    .on("changed", changed => console.log(changed))
                    .on("error", err => console.error(err))
                    .on("connected", str => console.log(str));
            } catch (error) {
                alert("Failed to get proposals.");
                console.error(error);
            }
        })();
    }, [contract]);

    async function vote(proposalId) {
        await state.contract.methods.vote(proposalId).send({from: state.accounts[0]});
    }

    return (
        <div className="Proposal">
            <div>
                { state.workflowStatus === "1"
                    && <ProposalForm state={ state } voter={ voter } />
                }
                { state.workflowStatus === "2"
                    && 
                        <Alert variant="info" className="AlertBox">
                            <Alert.Heading>Proposals registration ended.</Alert.Heading>
                            <p>
                                The proposals registration have been ended.<br />
                                The voting session will be started soon.<br />
                                Please wait... 
                            </p>
                        </Alert>
                }
                { state.workflowStatus === "4"
                    && 
                        <Alert variant="info" className="AlertBox">
                            <Alert.Heading>Voting session ended.</Alert.Heading>
                            <p>
                                The voting session have been ended.<br />
                                All votes will be tally now.<br />
                                Please wait, the final result is coming soon... 
                            </p>
                        </Alert>
                }
            </div>
            <div className="ProposalList">
                { state.workflowStatus === "5"
                    && 
                        <div>
                            <h2 className="text-success">
                                <CheckCircleFill color="green" /> Winners
                            </h2>
                            { proposals.length > 0
                                && proposalIdsWinners.length > 0 
                                ? 
                                    <div>
                                        <Container>
                                            <Row xs={4}>
                                                { proposalIdsWinners.map((proposalIdWinner) =>
                                                    <Col key={ proposalIdWinner }>
                                                        <Card style={{ width: '18rem', height: '12rem', marginTop: '18px' }}>
                                                            <Card.Body style={{ textAlign: 'left' }}>
                                                                <Card.Title style={{ fontSize: '15px' }}>
                                                                    <Row className="InputRowSm">
                                                                        <Col sm={8}>
                                                                            ID#{ proposalIdWinner }
                                                                        </Col>
                                                                        <Col sm={4} style={{ textAlign: 'right' }}>
                                                                            <CheckCircleFill color="green" /> 
                                                                        </Col>
                                                                    </Row>
                                                                </Card.Title>
                                                                <Card.Text>
                                                                    <b>{ proposals[proposalIdWinner].voteCount } { proposals[proposalIdWinner].voteCount > 1 ? <span>votes</span> : <span>vote</span> }</b>
                                                                </Card.Text>
                                                                <Card.Text>
                                                                    { proposals[proposalIdWinner].description }
                                                                </Card.Text>
                                                                <Card.Text>
                                                                    { voter.hasVoted
                                                                        && voter.votedProposalId === proposalIdWinner
                                                                        &&
                                                                            <span className={ state.workflowStatus === '5' ? 'text-success' : 'text-primary' }>
                                                                                You have voted for this proposal.
                                                                            </span>
                                                                    }
                                                                </Card.Text>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                )}
                                            </Row>
                                        </Container>
                                    </div>
                                :
                                    <div>
                                        <Container>
                                            <Row>
                                                <Col>There is no proposals.</Col>
                                            </Row>
                                        </Container>
                                    </div>
                            }
                            <hr />
                        </div>
                }
                <h2>Proposals</h2>
                { proposals.length > 0 
                    ? 
                        <div>
                            <Container>
                                <Row xs={4}>
                                    { proposals.map((proposal, index) =>
                                        <Col key={ index }>
                                            <Card style={{ width: '18rem', height: '12rem', 'marginTop': '18px' }}>
                                                <Card.Body style={{ textAlign: 'left' }}>
                                                    <Card.Title style={{ fontSize: '15px' }}>
                                                        <Row className="InputRowSm">
                                                            <Col>
                                                                ID#{ index }
                                                            </Col>
                                                        </Row>
                                                    </Card.Title>
                                                    { state.workflowStatus === "5"
                                                        &&
                                                            <Card.Text>
                                                                <b>{ proposal.voteCount } { proposal.voteCount > 1 ? <span>votes</span> : <span>vote</span> }</b>
                                                            </Card.Text>
                                                    }
                                                    <Card.Text>
                                                        { proposal.description }
                                                    </Card.Text>
                                                    <Card.Text>
                                                        { voter.hasVoted
                                                            && parseInt(voter.votedProposalId) === index
                                                            &&
                                                                <span className={ state.workflowStatus === '5' ? 'text-success' : 'text-primary' }>
                                                                    You have voted for this proposal.
                                                                </span>
                                                        }
                                                    </Card.Text>
                                                </Card.Body>
                                                { state.workflowStatus === "3"
                                                    && !voter.hasVoted
                                                    &&
                                                        <Card.Body>
                                                            <Button onClick={ () => vote(index) }>Vote</Button>
                                                        </Card.Body>
                                                }
                                            </Card>
                                        </Col>
                                    )}
                                </Row>
                            </Container>
                        </div>
                    :
                        <div>
                            <Container>
                                <Row>
                                    <Col>There is no proposals.</Col>
                                </Row>
                            </Container>
                        </div>
                }
            </div>
        </div>
    );
}

export default Proposal;
