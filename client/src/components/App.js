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
        owner: null
    });
    const [workflowStatus, setWorkflowStatus] = useState("0");
    const [loadingState, setLoadingState] = useState(true);
    const [voter, setVoter] = useState({});
    const [proposals, setProposals] = useState([]);
    const [proposalIdsWinners, setProposalIdsWinners] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const web3 = await getWeb3();
                console.log(web3.version);
                const accounts = await web3.eth.getAccounts();
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = VotingContract.networks[networkId];
                const instance = new web3.eth.Contract(
                    VotingContract.abi,
                    deployedNetwork && deployedNetwork.address
                );
                const owner = await instance.methods.owner().call();
                const workflowStatus = await instance.methods.getWorkflowstatus().call();
                const voter = await instance.methods.getVoter(accounts[0]).call();

                setState({
                    web3,
                    accounts,
                    contract: instance,
                    owner
                });
                setWorkflowStatus(workflowStatus);
                setLoadingState(false);
                setVoter(voter);

                if (parseInt(workflowStatus) >= 1 && voter.isRegistered) {
                    const proposalsResult = await instance.methods.getProposals().call({from: accounts[0]});
                    setProposals(proposalsResult);
                }

                if (workflowStatus === "5") {
                    const winnersIds = await instance.methods.getWinningProposalIds().call();
                    setProposalIdsWinners(winnersIds);
                }

                await instance.events.WorkflowStatusChange()
                    .on("data", event => {
                        const newStatus = event.returnValues.newStatus;
                        setWorkflowStatus(newStatus);
                        console.log("Workflow status have been changed: " + newStatus);
                    })
                    .on("changed", changed => console.log(changed))
                    .on("error", err => console.error(err))
                    .on("connected", str => console.log(str));

                await instance.events.VoterRegistered()
                    .on("data", async event => {
                        const voterAddress = event.returnValues.voterAddress;

                        if (voterAddress === accounts[0]) {
                            const voterInfo = await instance.methods.getVoter(accounts[0]).call();
                            setVoter(voterInfo);
                        }

                        console.log("New voter have been registered: " + voterAddress);
                    })
                    .on("changed", changed => console.log(changed))
                    .on("error", err => console.error(err))
                    .on("connected", str => console.log(str));


                await instance.events.ProposalRegistered()
                    .on("data", async event => {
                        const proposalsResult = await instance.methods.getProposals().call({from: accounts[0]});
                        setProposals(proposalsResult);
                        console.log("New proposal pushed.");
                    })
                    .on("changed", changed => console.log(changed))
                    .on("error", err => console.error(err))
                    .on("connected", str => console.log(str));

                await instance.events.Voted()
                    .on("data", async event => {
                        const voterAddress = event.returnValues.voterAddress;
                        // const proposalId = event.returnValues.proposalId;

                        if (voterAddress === accounts[0]) {
                            const voter = await instance.methods.getVoter(accounts[0]).call();
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
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        (async () => {
            if (state && state.contract && state.contract.methods) {
                if (workflowStatus === "5") {
                    const proposals = await state.contract.methods.getProposals().call();
                    const winningProposalIds = await state.contract.methods.getWinningProposalIds().call();
                    setProposals(proposals);
                    setProposalIdsWinners(winningProposalIds);
                }
            }
        })()
        // eslint-disable-next-line
    }, [workflowStatus]);

    return (
        <div className="App">
            <Header state={ state } />
            <Content 
                state={ state }
                workflowStatus={ workflowStatus }
                loadingState={ loadingState }
                voter={ voter }
                proposals={ proposals }
                proposalIdsWinners={ proposalIdsWinners } />
            <hr />
            <Footer />
        </div>
    );
}

export default App;
