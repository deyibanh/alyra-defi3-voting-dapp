import React from "react";
import { Navbar, Container } from 'react-bootstrap';
import { CircleFill } from 'react-bootstrap-icons';
import "./Header.css";

function Header(props) {
    const title = "Alyra Voting System";
    const state = props.state;

    return (
        <header>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#">{ title }</Navbar.Brand>
                    <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text id="walletInfo">
                            { window.ethereum !== "undefined" && state.accounts
                                ?
                                    <div>
                                        <div>
                                            <span className="walletInfoLabel">Wallet connected</span>
                                            <CircleFill color="green" />
                                        </div>
                                        <div>
                                            <u>{ state.accounts[0] }</u>
                                        </div>
                                    </div>
                                :   <div>
                                        <span className="walletInfoLabel">Your wallet is not connected</span>
                                        <CircleFill color="red" />
                                    </div>
                            }
                            { window.ethereum !== "undefined"
                                && state.accounts
                                && state.accounts[0] === state.owner
                                && 
                                    <div>
                                        (Owner)
                                    </div>
                            }
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;
