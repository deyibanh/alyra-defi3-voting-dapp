import React, { useState } from "react";
import "./VoterForm.css";

function VoterForm(props) {
    const state = props.state;
    const [inputAddVoterAddress, setInputAddVoterAddress] = useState("");
    const [inputGetVoterAddress, setInputGetVoterAddress] = useState("");
    const [showVoterInfo, setShowVoterInfo] = useState(false);
    const [voter, setVoter] = useState({});

    function onChangeInputAddVoterAddress(event) {
        event.preventDefault();
        setInputAddVoterAddress(event.target.value);
    }

    function onChangeInputGetVoterAddress(event) {
        event.preventDefault();
        setInputGetVoterAddress(event.target.value);
    }

    async function onSubmitAddVoter() {
        await state.contract.methods.addVoter(inputAddVoterAddress).send({from: state.accounts[0]});
    }

    async function onSubmitGetVoter() {
        const voter = await state.contract.methods.getVoter(inputGetVoterAddress).call({from: state.accounts[0]});
        setVoter(voter);
        setShowVoterInfo(true);
    }

    return (
        <div>
            <div>
                <label>Add new voter : </label>
                <input type="text" value={ inputAddVoterAddress } onChange={ onChangeInputAddVoterAddress }  />
                <input type="submit" value="Add voter" onClick={ onSubmitAddVoter }/>
            </div>

            <div>
                <label>Search voter : </label>
                <input type="text" value={ inputGetVoterAddress } onChange={ onChangeInputGetVoterAddress }  />
                <input type="submit" value="Search" onClick={ onSubmitGetVoter } />
            </div>
            { showVoterInfo &&
                <div>
                    { !voter.isRegistered
                        ? <span>This address is not registered as voter.</span>
                        : <div>
                            <div>Is registered: { voter.isRegistered.toString() }</div>
                            <div>Has voted: { voter.hasVoted.toString() }</div>
                        </div>
                    }
                </div>
            }
        </div>
    );
}

export default VoterForm;
