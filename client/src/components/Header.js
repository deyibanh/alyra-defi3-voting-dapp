import React from "react";
import "./Header.css";

function Header(props) {
    const title = "Alyra London - Défi 3 - Voting System";
    const state = props.state;

    return (
        <header>
            <div>{ title }</div>
            <div>
                Your wallet:
                { window.ethereum !== "undefined" && state.accounts
                    ? <span> Address { state.accounts[0] }</span>
                    : <span> Not connected.</span>
                }
                { window.ethereum !== "undefined"
                    && state.accounts
                    && state.accounts[0] === state.owner
                    && 
                    <div>
                        You are the owner.
                    </div>
                }
            </div>
        </header>
    );
}

export default Header;
