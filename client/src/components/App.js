import React, { useState, useEffect } from "react";
import VotingContract from "../contracts/Voting.json";
import getWeb3 from "../utils/getWeb3";
import Content from "./Content";
import Footer from "./Footer";
import Header from "./Header";
import "./App.css";

function App() {
    const [state, setState] = useState({
        web3: null,
        accounts: null,
        contract: null,
        owner: null,
        workflowStatus: null
    });
    const [voter, setVoter] = useState({});
    const [proposalWinners, setProposalWinners] = useState([]);

    useEffect(() => {
        (async function () {
            try {
                const web3 = await getWeb3();
                const accounts = await web3.eth.getAccounts();
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = VotingContract.networks[networkId];
                const contract = new web3.eth.Contract(
                    VotingContract.abi,
                    deployedNetwork && deployedNetwork.address
                );
                const owner = await contract.methods.owner().call();
                const workflowStatus = await contract.methods.getWorkflowstatus().call();
                const voter = await contract.methods.getVoter(accounts[0]).call();

                setState({
                    web3: web3,
                    accounts: accounts,
                    contract: contract,
                    owner: owner,
                    workflowStatus: workflowStatus
                });
                setVoter(voter);

                if (voter.isRegistered && workflowStatus === "5") {
                    const winners = await contract.methods.getWinners().call();
                    setProposalWinners(winners);
                    console.log(winners);

                }

                await contract.events.WorkflowStatusChange()
                    .on("data", event => {
                        const newStatus = event.returnValues.newStatus;
                        setState({
                            web3: web3,
                            accounts: accounts,
                            contract: contract,
                            owner: owner,
                            workflowStatus: newStatus
                        });
                    })
                    .on("changed", changed => console.log(changed))
                    .on("error", err => console.error(err))
                    .on("connected", str => console.log(str));

                await contract.events.VoterRegistered()
                    .on("data", async event => {
                        const voterAddress = event.returnValues.voterAddress;

                        if (voterAddress === state.accounts[0]) {
                            const voter = await contract.methods.getVoter(accounts[0]).call();
                            setVoter(voter);
                        }

                        console.log("New voter has been registered: " + voterAddress);
                    })
                    .on("changed", changed => console.log(changed))
                    .on("error", err => console.error(err))
                    .on("connected", str => console.log(str));
                
                await contract.events.Voted()
                    .on("data", async event => {
                        console.log(event);
                        const voterAddress = event.returnValues.voterAddress;
                        // const proposalId = event.returnValues.proposalId;

                        if (voterAddress === state.accounts[0]) {
                            const voter = await contract.methods.getVoter(accounts[0]).call();
                            setVoter(voter);
                        }

                        console.log("New vote: " + voterAddress);
                    })
                    .on("changed", changed => console.log(changed))
                    .on("error", err => console.error(err))
                    .on("connected", str => console.log(str));
            } catch (error) {
                alert("Failed to load web3, accounts, or contract. Check console for details.");
                console.error(error);
            }
        })();
    }, [state]);

    return (
        <div className="App">
            <Header state={ state } />
            <Content state={ state } voter={ voter } proposalWinners={ proposalWinners } />
            <Footer />
        </div>
    );
}

export default App;
