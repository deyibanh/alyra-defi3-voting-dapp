import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row } from 'react-bootstrap';
import { CaretRight } from 'react-bootstrap-icons';
import { Box, Step, Stepper, StepLabel } from '@mui/material';
import "./WorkflowStepper.css";

function WorkflowStepper(props) {
    const state = props.state;
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
    }

    async function stopRegisteringProposals() {
        await state.contract.methods.stopRegisteringProposals().send({from: state.accounts[0]});
    }

    async function startVotingSession() {
        await state.contract.methods.startVotingSession().send({from: state.accounts[0]});
    }

    async function stopVotingSession() {
        await state.contract.methods.stopVotingSession().send({from: state.accounts[0]});
    }

    async function tallyVotes() {
        await state.contract.methods.tallyVotes().send({from: state.accounts[0]});
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
                    <Col sm={8}>
                        <div className="WorflowStatus">State: { workflowStatusLabels[state.workflowStatus] }</div> 
                    </Col>
                    <Col sm={4}>
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
                                <Button variant="primary" size="sm" onClick={ tallyVotes }>
                                    Tally votes
                                    <CaretRight />
                                </Button>
                        }
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default WorkflowStepper;
