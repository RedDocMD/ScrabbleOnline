import React from 'react';
import ReactDOM from 'react-dom';
import Board from './board';
import BagOfTiles from './tilegen';
import Rack from './rack';
import Player from './player';
import StartForm from './start-form';

import './index.css'; class App extends React.Component {
    constructor(props) {
        super(props);
        this.removeTileFromRack = this.removeTileFromRack.bind(this);
        this.addTileToRack = this.addTileToRack.bind(this);
        this.removeTileFromCell = this.removeTileFromCell.bind(this);
        this.addTileToCell = this.addTileToCell.bind(this);
        this.initializeGame = this.initializeGame.bind(this);
        this.setInitialData = this.setInitialData.bind(this);
        this.passMove = this.passMove.bind(this);

        this.bag = new BagOfTiles();
        this.maxNoOfTiles = 7;

        let racks = {};
        let players = {};

        this.rows = 15;
        this.columns = 15;
        let cellContent = new Array(this.rows);
        for (let i = 0; i < this.rows; i++) cellContent[i] = new Array(this.columns);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                cellContent[i][j] = "";
            }
        }

        let gameState = { state: "to-start", noOfPlayers: 0, maxNoOfPlayers: 4, minNoOfPlayers: 2 };

        this.state = { racks: racks, cellContent: cellContent, players: players, gameState: gameState, activePlayer: undefined };
    }

    removeTileFromRack(letter, rack) {
        this.setState((prevState, props) => {
            let rackElement = prevState.racks[rack];
            let oldLetters = rackElement.letters;
            let newLetters = oldLetters.slice();
            for (let i = 0; i < newLetters.length; i++) {
                if (newLetters[i] === letter) {
                    newLetters.splice(i, 1);
                    break;
                }
            }
            let newState = {};
            for (let key in prevState.racks) {
                if (prevState.racks.hasOwnProperty(key)) {
                    if (key === rack) {
                        newState[key] = { rack: <Rack letters={newLetters} id={key} addTileToRack={this.addTileToRack} removeTileFromRack={this.removeTileFromRack} removeTileFromCell={this.removeTileFromCell} />, letters: newLetters };
                    } else {
                        newState[key] = prevState.racks[key];
                    }
                }
            }
            let players = {};
            for (let rackID in newState) {
                let playerID = rackID.replace("rack", "player");
                players[playerID] = {
                    player:
                        <Player id={playerID} active={this.state.activePlayer} passMove={this.passMove}>
                            {newState[rackID].rack}
                        </Player>,
                    rack: rackID
                }
            }
            return { racks: newState, players: players };
        });
    }

    addTileToRack(letter, rack) {
        this.setState((prevState, props) => {
            let rackElement = prevState.racks[rack];
            let oldLetters = rackElement.letters;
            let newLetters = oldLetters.slice();
            if (newLetters.length < this.maxNoOfTiles) {
                newLetters.push(letter);
            }
            let newState = {};
            for (let key in prevState.racks) {
                if (prevState.racks.hasOwnProperty(key)) {
                    if (key === rack) {
                        newState[key] = { rack: <Rack letters={newLetters} id={key} addTileToRack={this.addTileToRack} removeTileFromRack={this.removeTileFromRack} removeTileFromCell={this.removeTileFromCell} />, letters: newLetters };
                    } else {
                        newState[key] = prevState.racks[key];
                    }
                }
            }
            let players = {};
            for (let rackID in newState) {
                let playerID = rackID.replace("rack", "player");
                players[playerID] = {
                    player:
                        <Player id={playerID} active={this.state.activePlayer} passMove={this.passMove}>
                            {newState[rackID].rack}
                        </Player>,
                    rack: rackID
                }
            }
            return { racks: newState, players: players };
        });
    }

    addTileToCell(row, col, content) {
        this.setState((prevState, props) => {
            let oldContent = prevState.cellContent;
            let cellContent = new Array(this.rows);
            for (let i = 0; i < this.rows; i++) cellContent[i] = new Array(this.columns);
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.columns; j++) {
                    cellContent[i][j] = oldContent[i][j];
                }
            }
            cellContent[row][col] = content;
            return { cellContent: cellContent };
        });
    }

    removeTileFromCell(row, col) {
        this.setState((prevState, props) => {
            let oldContent = prevState.cellContent;
            let cellContent = new Array(this.rows);
            for (let i = 0; i < this.rows; i++) cellContent[i] = new Array(this.columns);
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.columns; j++) {
                    cellContent[i][j] = oldContent[i][j];
                }
            }
            cellContent[row][col] = "";
            return { cellContent: cellContent };
        });

    }

    initializeGame() {
        if (this.state.gameState.state === "to-start" || this.state.gameState.state === "ended") {
            let newGameState = {};
            Object.assign(newGameState, this.state.gameState);
            newGameState["state"] = "initializing";
            this.setState({ gameState: newGameState });
        }
    }

    setInitialData(names) {
        if (names === null) {
            let newGameState = {};
            Object.assign(newGameState, this.state.gameState);
            newGameState["state"] = "to-start";
            this.setState({ gameState: newGameState });
        } else {
            let noOfPlayers = names.length;
            let gameState = { state: "started", noOfPlayers: noOfPlayers, maxNoOfPlayers: 4, minNoOfPlayers: 2 };
            let racks = {};
            for (let i = 1; i <= noOfPlayers; i++) {
                let letters = this.bag.getTiles(this.maxNoOfTiles);
                racks["rack-" + i] = { rack: <Rack letters={letters} id={"rack-" + i} addTileToRack={this.addTileToRack} removeTileFromRack={this.removeTileFromRack} removeTileFromCell={this.removeTileFromCell} />, letters: letters };
            }
            let players = {};
            let activePlayer = 1;
            for (let i = 1; i <= noOfPlayers; i++) {
                let playerID = "player-" + i;
                let rackID = "rack-" + i;
                players[playerID] = {
                    player:
                        <Player id={playerID} name={names[i - 1]} active={activePlayer} passMove={this.passMove}>
                            {racks[rackID].rack}
                        </Player>,
                    rack: rackID
                };
            }
            this.setState({ racks: racks, players: players, gameState: gameState, activePlayer: activePlayer });
        }
    }

    passMove() {
        this.setState((state, props) => {
            let activePlayer = state.activePlayer;
            activePlayer = activePlayer + 1;
            activePlayer = activePlayer > state.gameState.noOfPlayers ? 1 : activePlayer;
            let players = {};
            for (let i = 1; i <= state.gameState.noOfPlayers; i++) {
                let playerID = "player-" + i;
                let rackID = "rack-" + i;
                players[playerID] = {
                    player:
                        <Player id={playerID} active={activePlayer} passMove={this.passMove}>
                            {state.racks[rackID].rack}
                        </Player>,
                    rack: rackID
                };
            }
            return { activePlayer: activePlayer, players: players };
        });
    }

    render() {
        let board = <Board rows={this.rows} columns={this.columns} removeTileFromRack={this.removeTileFromRack} addTileToCell={this.addTileToCell} removeTileFromCell={this.removeTileFromCell} cellContent={this.state.cellContent} />;
        let toRender = <div></div>
        if (this.state.gameState.state === "to-start") {
            toRender = (
                <div className="flex flex-row">
                    <div className="flex flex-col flex-1">
                    </div>
                    {board}
                    <div className="flex flex-col flex-1">
                    </div>
                </div>
            );
        } else if (this.state.gameState.state === "started") {
            if (this.state.gameState.noOfPlayers === 2) {
                toRender = (
                    <div className="flex flex-row">
                        <div className="flex flex-col flex-1">
                            {this.state.players["player-1"].player}
                        </div>
                        {board}
                        <div className="flex flex-col flex-1">
                            {this.state.players["player-2"].player}
                        </div>
                    </div>
                );
            } else if (this.state.gameState.noOfPlayers === 3) {
                toRender = (
                    <div className="flex flex-row">
                        <div className="flex flex-col flex-1">
                            {this.state.players["player-1"].player}
                            {this.state.players["player-3"].player}
                        </div>
                        {board}
                        <div className="flex flex-col flex-1">
                            {this.state.players["player-2"].player}
                        </div>
                    </div>
                );
            } else if (this.state.gameState.noOfPlayers === 4) {
                toRender = (
                    <div className="flex flex-row">
                        <div className="flex flex-col flex-1">
                            {this.state.players["player-1"].player}
                            {this.state.players["player-4"].player}
                        </div>
                        {board}
                        <div className="flex flex-col flex-1">
                            {this.state.players["player-2"].player}
                            {this.state.players["player-3"].player}
                        </div>
                    </div>
                );
            }
        } else if (this.state.gameState.state === "initializing") {
            toRender = (
                <div className="flex flex-row">
                    <div className="flex-1"></div>
                    <div className="flex-1 flex flex-row">
                        <div className="flex-1"></div>
                        <div className="flex-1">
                            <StartForm finalSubmit={this.setInitialData} minPlayers={this.state.gameState.minNoOfPlayers} maxPlayers={this.state.gameState.maxNoOfPlayers} />
                        </div>
                        <div className="flex-1"></div>
                    </div>
                    <div className="flex-1"></div>
                </div>
            );
        }
        return (
            <div>
                <header className="bg-black text-white text-center align-middle text-4xl mb-6">
                    Scrabble Game
                    <span className="float-right flex flex-row-reverse">
                        <span className="text-2xl text-red-400 hover:text-red-600 align-text-bottom mr-4 mt-2 mb-2 ml-10 cursor-pointer" onClick={this.initializeGame}>Start</span>
                        <span className="text-xl text-gray-400 hover:text-gray-200 align-text-bottom mr-4 mt-2 mb-2 cursor-pointer">Point</span>
                    </span>
                </header>
                {toRender}
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);