import React, { useState } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap';
import "./ProposalForm.css";

function ProposalForm(props) {
    const state = props.state;
    const [inputAddProposalDescription, setInputAddProposalDescription] = useState("");

    function onChangeInputAddProposalDescription(event) {
        event.preventDefault();
        setInputAddProposalDescription(event.target.value);
    }

    async function onSubmitAddProposal(event) {
        event.preventDefault();
        await state.contract.methods.addProposal(inputAddProposalDescription).send({from: state.accounts[0]});
        setInputAddProposalDescription("");
    }

    return (
        <div className="ProposalForm">
            <Container>
                <Row style={{ margin: 'auto', width: '50%' }}>
                    <Col>
                        <InputGroup>
                            <FormControl
                                placeholder="Describe your proposal..."
                                aria-label="Describe your proposal..."
                                value={ inputAddProposalDescription }
                                onChange={ onChangeInputAddProposalDescription }
                            />
                            <Button disabled={ inputAddProposalDescription === "" } onClick={ onSubmitAddProposal } >
                                Submit
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ProposalForm;
