import React, { useState } from "react";
import { Container, Row, Col, Button, FormControl, InputGroup } from 'react-bootstrap';
import { PersonPlusFill, Search } from 'react-bootstrap-icons';

import "./Voter.css";

function Voter(props) {
    const state = props.state;
    const [inputVoterAddress, setInputVoterAddress] = useState("");

    function onChangeInputVoterAddress(event) {
        event.preventDefault();
        setInputVoterAddress(event.target.value);
    }

    async function onSubmitAddVoter() {
        try {
            await state.contract.methods.addVoter(inputVoterAddress).send({from: state.accounts[0]});
            props.onChangeVoterSearch("", {});
            props.onChangeShowVoterInfo(false);
        } catch (error) {
            console.error(error);
        }
    }

    async function onSubmitGetVoter() {
        try {
            const voterSearch = await state.contract.methods.getVoter(inputVoterAddress).call({from: state.accounts[0]});
            props.onChangeVoterSearch(inputVoterAddress, voterSearch);
            props.onChangeShowVoterInfo(true);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="Voter">
            <Container>
                <Row>
                    <Col md={8}>
                        <InputGroup>
                            <FormControl 
                                placeholder="Wallet address"
                                aria-label="Wallet address"
                                value={ inputVoterAddress }
                                onChange={ onChangeInputVoterAddress }
                            />
                            <Button disabled={ inputVoterAddress === "" } variant="outline-secondary" onClick={ onSubmitGetVoter } >
                                <Search />
                            </Button>
                            { state.workflowStatus === "0"
                                && state.accounts[0] === state.owner
                                &&
                                    <Button disabled={ inputVoterAddress === "" } variant="outline-secondary" onClick={ onSubmitAddVoter } >
                                        <PersonPlusFill />
                                    </Button>
                            }
                        </InputGroup>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Voter;
