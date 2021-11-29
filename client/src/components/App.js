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
    const [loadingState, setLoadingState] = useState(true);
    const [voter, setVoter] = useState({});
    const [proposalIdsWinners, setProposalIdsWinners] = useState([]);

    useEffect(() => {
        (async () => {
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
                setLoadingState(false);
                setVoter(voter);

                if (workflowStatus === "5") {
                    const winnersIds = await contract.methods.getWinningProposalIds().call();
                    setProposalIdsWinners(winnersIds);
                }

                // Try "once" methods
                // await contract.once('WorkflowStatusChange', {}, async function(error, event){ 
                //     const newStatus = event.returnValues.newStatus;
                //     setState({
                //         web3: web3,
                //         accounts: accounts,
                //         contract: contract,
                //         owner: owner,
                //         workflowStatus: newStatus
                //     });
                //     console.log("Workflow status have been changed: " + newStatus);
                // });

                // await contract.once('VoterRegistered', {}, async function(error, event){ 
                //     const voterAddress = event.returnValues.voterAddress;
                    
                //     if (voterAddress === accounts[0]) {
                //         const voterInfo = await contract.methods.getVoter(accounts[0]).call();
                //         setVoter(voterInfo);
                //     }

                //     console.log("New voter have been registered: " + voterAddress);
                // });

                // await contract.once('Voted', {}, async function(error, event){ 
                //     const voterAddress = event.returnValues.voterAddress;
                //     // const proposalId = event.returnValues.proposalId;

                //     if (voterAddress === accounts[0]) {
                //         const voter = await contract.methods.getVoter(accounts[0]).call();
                //         setVoter(voter);
                //     }

                //     console.log("New voter have voted: " + voterAddress);
                // });


                // To fix: Calling many times the proposal event without reason.
                await contract.events.WorkflowStatusChange({
                        fromBlock: 'latest'
                    })
                    .on("data", async event => {
                        const newStatus = event.returnValues.newStatus;
                        setState({
                            web3: web3,
                            accounts: accounts,
                            contract: contract,
                            owner: owner,
                            workflowStatus: newStatus
                        });

                        if (newStatus === "5") {
                            const winnersIds = await contract.methods.getWinningProposalIds().call();
                            setProposalIdsWinners(winnersIds);
                        }

                        console.log("Workflow status have been changed: " + newStatus);
                    })
                    .on("changed", changed => console.log(changed))
                    .on("error", err => console.error(err))
                    .on("connected", str => console.log(str));

                await contract.events.VoterRegistered({
                        fromBlock: 'latest'
                    })
                    .on("data", async event => {
                        const voterAddress = event.returnValues.voterAddress;

                        if (voterAddress === accounts[0]) {
                            const voterInfo = await contract.methods.getVoter(accounts[0]).call();
                            setVoter(voterInfo);
                        }

                        console.log("New voter have been registered: " + voterAddress);
                    })
                    .on("changed", changed => console.log(changed))
                    .on("error", err => console.error(err))
                    .on("connected", str => console.log(str));
                
                await contract.events.Voted({
                        fromBlock: 'latest'
                    })
                    .on("data", async event => {
                        const voterAddress = event.returnValues.voterAddress;
                        // const proposalId = event.returnValues.proposalId;

                        if (voterAddress === accounts[0]) {
                            const voter = await contract.methods.getVoter(accounts[0]).call();
                            setVoter(voter);
                        }

                        console.log("New voter have voted: " + voterAddress);
                    })
                    .on("changed", changed => console.log(changed))
                    .on("error", err => console.error(err))
                    .on("connected", str => console.log(str));
            } catch (error) {
                setLoadingState(false);
                console.error(error);
            }
        })();
    }, []);

    return (
        <div className="App">
            <Header state={ state } />
            <Content state={ state } loadingState={ loadingState } voter={ voter } proposalIdsWinners={ proposalIdsWinners } />
            <hr />
            <Footer />
        </div>
    );
}

export default App;
