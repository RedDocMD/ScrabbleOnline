import React from 'react'

class StartForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            position: 1,
            noOfPlayers: "",
            playerNames: [],
            warning: ""
        };
        this.incrementPosition = this.incrementPosition.bind(this);
        this.submit = this.submit.bind(this);
    }

    incrementPosition(ev) {
        ev.preventDefault();
        if (isNaN(this.state.noOfPlayers) || this.state.noOfPlayers === "") {
            this.setState({ warning: "You must enter a number!" });
        } else {
            let noOfPlayers = parseInt(this.state.noOfPlayers, 10);
            if (noOfPlayers < this.props.minPlayers || noOfPlayers > this.props.maxPlayers) {
                this.setState({ warning: `Number of players must be between ${this.props.minPlayers} and ${this.props.maxPlayers}!` });
            } else {
                let playerNames = [];
                for (let i = 0; i < noOfPlayers; i++) {
                    playerNames.push("");
                }
                this.setState({ position: 2, playerNames: playerNames, warning: "" });
            }
        }
    }

    submit(ev) {
        ev.preventDefault();
        let flag = false;
        for (let i = 0; i < this.state.noOfPlayers; i++) {
            if (this.state.playerNames[i] === "") {
                flag = true;
                break;
            }
        }
        if (flag) {
            this.setState({ warning: "Player name cannot be empty" });
        } else {
            this.props.finalSubmit(this.state.playerNames);
        }
    }

    render() {
        if (this.state.position === 1) {
            return (
                <form onSubmit={this.incrementPosition}>
                    <div className="text-center text-2xl font-semibold">Number of Players</div>
                    <input type="text" className="border-gray-400 border-2 rounded mt-3 mb-5" onChange={(ev) => {
                        this.setState({ noOfPlayers: ev.target.value });
                    }} />
                    <br />
                    <div className="flex justify-around">
                        <input type="submit" value="Continue" className="bg-green-400 px-4 py-2 rounded font-light" />
                        <button className="bg-red-400 px-4 py-2 rounded font-light" onClick={
                            (ev) => {
                                this.props.finalSubmit(null);
                            }
                        }>Cancel</button>
                    </div>
                    <div className="mt-4 text-center text-red-600">
                        {this.state.warning}
                    </div>
                </form>
            )
        } else if (this.state.position === 2) {
            let inputFields = [];
            for (let i = 0; i < this.state.noOfPlayers; i++) {
                let inputField = (
                    <div key={i + ""}>
                        <span className="text-center text-xl font-semibold pr-3">{"Player " + (i + 1)}</span>
                        <input type="text" className="border-gray-400 border-2 rounded mt-3 mb-5" onChange={(ev) => {
                            let playerNames = this.state.playerNames;
                            playerNames[i] = ev.target.value;
                            this.setState({ playerNames: playerNames });
                        }} />
                    </div>
                );
                inputFields.push(inputField);
            }
            return (
                <form onSubmit={this.submit}>
                    {inputFields}
                    < br />
                    <div className="flex justify-around">
                        <input type="submit" value="Continue" className="bg-green-400 px-4 py-2 rounded font-light" />
                        <button className="bg-red-400 px-4 py-2 rounded font-light" onClick={
                            (ev) => {
                                this.props.finalSubmit(null);
                            }
                        }>Cancel</button>
                    </div>
                    <div className="mt-4 text-center text-red-600">
                        {this.state.warning}
                    </div>
                </form>
            );
        }
    }
}

export default StartForm