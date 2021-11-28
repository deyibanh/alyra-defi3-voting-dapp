import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { PersonCircle, CheckCircleFill, XCircleFill, CaretRight } from 'react-bootstrap-icons';
import { Box, Step, Stepper, StepLabel } from '@mui/material';
import Voter from "./Voter";
import "./WorkflowStepper.css";

function WorkflowStepper(props) {
    const state = props.state;
    const voter = props.voter;
    const steps = [
        "Voters Registration",
        "Proposals Registration",
        "Voting session",
        "Results"
    ];
    const [activeStep, setActiveStep] = useState(0);
    const workflowStatusLabels = [
        "Registering Voters",
        "Proposals Registration Started",
        "Proposals Registration Ended",
        "Voting Session Started",
        "Voting Session Ended",
        "Votes Tallied"
    ];

    const [voterSearch, setVoterSearch] = useState({});
    const [voterSearchAddress, setVoterSearchAddress] = useState("");
    const [showVoterInfo, setShowVoterInfo] = useState(false);


    useEffect(() => {
        (function () {
            if (state.workflowStatus === "0") {
                setActiveStep(0);
            } else if (
                state.workflowStatus === "1" ||  
                state.workflowStatus === "2"
            ) {
                setActiveStep(1);
            } else if (
                state.workflowStatus === "3" ||  
                state.workflowStatus === "4"
            ) {
                setActiveStep(2);
            } else if (state.workflowStatus === "5") {
                setActiveStep(4);
            }
        })();
    }, [state]);

    async function startRegisteringProposals() {
        await state.contract.methods.startRegisteringProposals().send({from: state.accounts[0]});
        setShowVoterInfo(false);
        setVoterSearchAddress("");
        setVoterSearch({});
    }

    async function stopRegisteringProposals() {
        await state.contract.methods.stopRegisteringProposals().send({from: state.accounts[0]});
        setShowVoterInfo(false);
        setVoterSearchAddress("");
        setVoterSearch({});
    }

    async function startVotingSession() {
        await state.contract.methods.startVotingSession().send({from: state.accounts[0]});
        setShowVoterInfo(false);
        setVoterSearchAddress("");
        setVoterSearch({});
    }

    async function stopVotingSession() {
        await state.contract.methods.stopVotingSession().send({from: state.accounts[0]});
        setShowVoterInfo(false);
        setVoterSearchAddress("");
        setVoterSearch({});
    }

    async function tallyVotes() {
        await state.contract.methods.tallyVotes().send({from: state.accounts[0]});
        setShowVoterInfo(false);
        setVoterSearchAddress("");
        setVoterSearch({});
    }

    function onChangeShowVoterInfo(showVoterInfoValue) {
        setShowVoterInfo(showVoterInfoValue);
    }

    function onChangeVoterSearch(inputVoterAddress, voterSearch) {
        setVoterSearchAddress(inputVoterAddress);
        setVoterSearch(voterSearch);
    }
    

    return (
        <div className="WorkflowStepper">
            <Container className="WorkflowStepperContainer">
                <Row>
                    <Box sx={{ width: '100%', mb: 5 }}>
                        <Stepper activeStep={ activeStep } alternativeLabel>
                            { steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                </Row>
                <Row className="InputRow">
                    <Col sm={9}>
                        { (voter.isRegistered || state.accounts[0] === state.owner)
                            && <Voter state={ state } onChangeShowVoterInfo={ onChangeShowVoterInfo } onChangeVoterSearch={ onChangeVoterSearch }/>
                        }
                    </Col>
                    <Col sm={3}>
                        <Row>
                            <div className="WorflowStatus">State: <b>{ workflowStatusLabels[state.workflowStatus] }</b></div> 
                        </Row>
                        <Row>
                            { state.accounts[0] === state.owner
                                && state.workflowStatus === "0"
                                &&
                                    <Button variant="primary" onClick={ startRegisteringProposals }>
                                        Start registering proposals
                                        <CaretRight />
                                    </Button>
                            }
                            { state.accounts[0] === state.owner
                                && state.workflowStatus === "1"
                                &&
                                    <Button variant="primary" onClick={ stopRegisteringProposals }>
                                        Stop registering proposals
                                        <CaretRight />
                                    </Button>
                            }
                            { state.accounts[0] === state.owner
                                && state.workflowStatus === "2"
                                &&
                                    <Button variant="primary" onClick={ startVotingSession }>
                                        Start voting session
                                        <CaretRight />
                                    </Button>
                            }
                            { state.accounts[0] === state.owner
                                && state.workflowStatus === "3"
                                &&
                                    <Button variant="primary" onClick={ stopVotingSession }>
                                        Stop voting session
                                        <CaretRight />
                                    </Button>
                            }
                            { state.accounts[0] === state.owner
                                && state.workflowStatus === "4"
                                &&
                                    <Button variant="primary" onClick={ tallyVotes }>
                                        Tally votes
                                        <CaretRight />
                                    </Button>
                            }
                        </Row>
                    </Col>
                </Row>
                <Row>
                    { showVoterInfo &&
                        <div className="VoterSearchRegisteringInfo">
                            <div>
                                <Card style={{ width: '30rem' }}>
                                    <Card.Body style={{ textAlign: 'left' }}>
                                        <Card.Title style={{ fontSize: '15px' }}>
                                            <Row className="InputRowSm">
                                                <Col md={1}>
                                                    <PersonCircle />
                                                </Col>
                                                <Col md={11}>
                                                    { voterSearchAddress }
                                                </Col>
                                            </Row>
                                        </Card.Title>
                                        <Card.Text>
                                            <span>
                                                { voterSearch.isRegistered
                                                    ?
                                                        <span>
                                                            <CheckCircleFill color="green" /> is registered.
                                                        </span>
                                                    :
                                                        <span>
                                                            <XCircleFill color="red" /> is not registered yet.
                                                        </span>
                                                }<br />
                                                { voterSearch.hasVoted
                                                    ?
                                                        <span>
                                                            <CheckCircleFill color="green" /> has voted <b>Proposal ID#{voterSearch.votedProposalId}</b> 
                                                        </span>
                                                    :
                                                        <span>
                                                            <XCircleFill color="red" /> has not voted yet.
                                                        </span>
                                                }
                                            </span>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    }
                </Row>
            </Container>
        </div>
    );
}

export default WorkflowStepper;
