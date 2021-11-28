import React, { useState } from "react";
import { Card, Container, Row, Col, Button, FormControl, InputGroup } from 'react-bootstrap';
import { PersonCircle, CheckCircleFill, XCircleFill, PersonPlusFill, Search } from 'react-bootstrap-icons';

import "./Voter.css";

function Voter(props) {
    const state = props.state;
    const [inputVoterAddress, setInputVoterAddress] = useState("");
    const [showVoterInfo, setShowVoterInfo] = useState(false);
    // const [voterSearch, setVoterSearch] = useState({});
    // const [voterSearchAddress, setVoterSearchAddress] = useState("");

    function onChangeInputVoterAddress(event) {
        event.preventDefault();
        setInputVoterAddress(event.target.value);
    }

    async function onSubmitAddVoter() {
        await state.contract.methods.addVoter(inputVoterAddress).send({from: state.accounts[0]});
        // setVoterSearch({});
        // setVoterSearchAddress("");
        // props.onChangeShowVoterInfo(false);
        // setShowVoterInfo(false);
    }

    async function onSubmitGetVoter() {
        const voterSearch = await state.contract.methods.getVoter(inputVoterAddress).call({from: state.accounts[0]});
        // setVoterSearch(voterSearch);
        // setVoterSearchAddress(inputVoterAddress);
        props.onChangeVoterSearch(inputVoterAddress, voterSearch);
        props.onChangeShowVoterInfo(true);
        // setShowVoterInfo(true);
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
                            <Button variant="outline-secondary" onClick={ onSubmitGetVoter } >
                                <Search />
                            </Button>
                            { state.workflowStatus === "0"
                                && state.accounts[0] === state.owner
                                &&
                                    <Button variant="outline-secondary" onClick={ onSubmitAddVoter } >
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
