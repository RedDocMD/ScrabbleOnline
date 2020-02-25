import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const letterValues = {
    "": { letter: "", value: 0, nos: 2 },
    "A": { letter: "A", value: 1, nos: 9 },
    "B": { letter: "B", value: 3, nos: 2 },
    "C": { letter: "C", value: 3, nos: 2 },
    "D": { letter: "D", value: 2, nos: 4 },
    "E": { letter: "E", value: 1, nos: 12 },
    "F": { letter: "F", value: 4, nos: 2 },
    "G": { letter: "G", value: 2, nos: 3 },
    "H": { letter: "H", value: 4, nos: 2 },
    "I": { letter: "I", value: 1, nos: 9 },
    "J": { letter: "J", value: 8, nos: 1 },
    "K": { letter: "K", value: 5, nos: 1 },
    "L": { letter: "L", value: 1, nos: 4 },
    "M": { letter: "M", value: 3, nos: 2 },
    "N": { letter: "N", value: 1, nos: 6 },
    "O": { letter: "O", value: 1, nos: 8 },
    "P": { letter: "P", value: 3, nos: 2 },
    "Q": { letter: "Q", value: 10, nos: 1 },
    "R": { letter: "R", value: 1, nos: 6 },
    "S": { letter: "S", value: 1, nos: 4 },
    "T": { letter: "T", value: 1, nos: 6 },
    "U": { letter: "U", value: 1, nos: 4 },
    "V": { letter: "V", value: 4, nos: 2 },
    "W": { letter: "W", value: 4, nos: 2 },
    "X": { letter: "X", value: 8, nos: 1 },
    "Y": { letter: "Y", value: 4, nos: 2 },
    "Z": { letter: "Z", value: 10, nos: 1 }
}

function getCellTypes(size) {
    let types = new Array(size);
    for (let i = 0; i < size; i++) types[i] = new Array(size);

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            types[i][j] = "normal";
            if ((i === 0 || i === 14) && (j === 3 || j === 11)) types[i][j] = "double-letter";
            if ((j === 0 || j === 14) && (i === 3 || i === 11)) types[i][j] = "double-letter";
            if ((i === 1 || i === 13) && (j === 5 || j === 9)) types[i][j] = "triple-letter";
            if ((j === 1 || j === 13) && (i === 5 || i === 9)) types[i][j] = "triple-letter";
            if ((i === 2 || i === 12) && (j === 6 || j === 8)) types[i][j] = "double-letter";
            if ((j === 2 || j === 12) && (i === 6 || i === 8)) types[i][j] = "double-letter";
            if ((i === 3 || i === 11) && (j === 7)) types[i][j] = "double-letter";
            if ((j === 3 || j === 11) && (i === 7)) types[i][j] = "double-letter";
        }
    }

    for (let i = 1; i < size - 1; i++) {
        for (let j = 1; j < size - 1; j++) {
            if (i === j || i + j === size - 1) {
                if (i <= 4 || i >= 10) types[i][j] = "double-word";
                else if (i === 7) types[i][j] = "star";
                else if (i === 6 || i === 8) types[i][j] = "double-letter";
                else types[i][j] = "triple-letter";
            }
        }
    }

    types[0][0] = "triple-word";
    types[0][Math.floor(size / 2)] = "triple-word";
    types[0][size - 1] = "triple-word";
    types[Math.floor(size / 2)][0] = "triple-word";
    types[Math.floor(size / 2)][size - 1] = "triple-word";
    types[size - 1][0] = "triple-word";
    types[size - 1][Math.floor(size / 2)] = "triple-word";
    types[size - 1][size - 1] = "triple-word";

    return types;
}

class BagOfTiles {
    constructor() {
        let tilesLeft = ["", ""];
        for (let letterCode = 0; letterCode < 26; letterCode++) {
            let letter = String.fromCharCode(65 + letterCode);
            let nos = letterValues[letter].nos;
            for (let i = 1; i <= nos; i++) tilesLeft.push(letter);
        }
        this.tileLeft = tilesLeft;
        this.getTiles = this.getTiles.bind(this);
    }

    getTiles(n) {
        let tiles = [];
        let size = this.tileLeft.length;
        for (let i = 0; i < n; i++) {
            let idx = Math.floor(Math.random() * size);
            --size;
            tiles.push(this.tileLeft[idx]);
            this.tileLeft.splice(idx, 1);
        }
        return tiles;
    }
}

class Board extends React.Component {

    render() {
        let rows = [];
        let types = getCellTypes(this.props.rows);
        for (let i = 0; i < this.props.rows; i++) {
            let row = [];
            for (let j = 0; j < this.props.columns; j++) {
                row.push(<td key={i + " " + j}><Cell className={types[i][j]} removeTileFromRack={this.props.removeTileFromRack} row={i} column={j} content={this.props.cellContent[i][j]} addTileToCell={this.props.addTileToCell} removeTileFromCell={this.props.removeTileFromCell} /></td>);
            }
            rows.push(<tr key={i + ''}>{row}</tr>);
        }

        return (
            <table id="board-table">
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
}

class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.type = this.props.className;
        if (this.type === "star") this.type = "double-letter";
        this.dragOver = this.dragOver.bind(this);
        this.dropOn = this.dropOn.bind(this);
    }

    dragOver(ev) {
        ev.preventDefault();
    }

    dropOn(ev) {
        let droppedLetter = ev.dataTransfer.getData("drag-item");
        let fromRack = ev.dataTransfer.getData("from-rack");
        if (fromRack !== "not-from-rack") {
            this.props.removeTileFromRack(droppedLetter, fromRack);
        } else {
            let position = ev.dataTransfer.getData("position");
            let coords = position.split(" ");
            this.props.removeTileFromCell(parseInt(coords[0], 10), parseInt(coords[1], 10));
        }
        this.props.addTileToCell(this.props.row, this.props.column, droppedLetter);
    }

    render() {
        if (this.props.content !== "") {
            let content = letterValues[this.props.content];
            return (
                <Tile letter={content.letter} dataItem={content.letter} value={content.value} className="in-cell-tile" row={this.props.row} column={this.props.column} />
            );
        } else {
            return (
                <div className={"cell " + this.props.className} onDragOver={this.dragOver} onDrop={this.dropOn} />
            );
        }
    }
}

class Tile extends React.Component {
    constructor(props) {
        super(props);
        this.dragStart = this.dragStart.bind(this);
        this.mouseEnter = this.mouseEnter.bind(this);
        this.state = { cursorType: "default" };
    }

    dragStart(ev) {
        ev.dataTransfer.setData("drag-item", this.props.dataItem);
        let rackValue = this.props.rack === undefined ? "not-from-rack" : this.props.rack;
        ev.dataTransfer.setData("from-rack", rackValue);
        ev.dataTransfer.setData("position", this.props.row + " " + this.props.column);
    }

    mouseEnter() {
        this.setState({ cursorType: "grab" });
    }

    render() {
        return (
            <span className={"tile " + this.props.className + " " + this.state.cursorType} draggable onDragStart={this.dragStart} onMouseEnter={this.mouseEnter}>
                <div className="tile-text">{this.props.letter}</div>
                <div className="tile-value">{this.props.value === 0 ? "" : this.props.value}</div>
            </span>
        );
    }
}

class Rack extends React.Component {
    constructor(props) {
        super(props);
        this.dragOver = this.dragOver.bind(this);
        this.dropOn = this.dropOn.bind(this);
    }


    dragOver(ev) {
        ev.preventDefault();
    }

    dropOn(ev) {
        let droppedLetter = ev.dataTransfer.getData("drag-item");
        let fromRack = ev.dataTransfer.getData("from-rack");
        if (fromRack === "not-from-rack") {
            let position = ev.dataTransfer.getData("position");
            let coords = position.split(" ");
            this.props.removeTileFromCell(parseInt(coords[0], 10), parseInt(coords[1], 10));
            this.props.addTileToRack(droppedLetter, this.props.id);
        } else if (fromRack !== this.props.id) {
            this.props.addTileToRack(droppedLetter, this.props.id);
            this.props.removeTileFromRack(droppedLetter, fromRack);
        }

    }


    render() {
        let tiles = [];
        this.props.letters.forEach(letter => {
            let letterObj = letterValues[letter];
            tiles.push(<Tile letter={letterObj.letter} key={letter + " " + this.props.id + " " + Math.random()} value={letterObj.value} dataItem={letter} rack={this.props.id} className="normal-tile" />);
        });
        return (
            <div className="rack" onDragOver={this.dragOver} onDrop={this.dropOn}>
                {tiles}
            </div>
        );
    }
}

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.playerName = this.props.name;
    }

    render() {
        return (
            <div className="flex-auto flex flex-col">
                <div className="text-white name">Hell</div>
                <div className="text-4xl font-medium text-center  underline">
                    {this.playerName}
                </div>
                <div className="flex justify-around">
                    {this.props.children}
                </div>
                <div className="flex justify-around">
                    <button className="player-btn">Make move</button>
                    <button className="player-btn">Change tiles</button>
                    <button className="player-btn">Pass turn</button>
                </div>
                <div className="text-white name">Hell</div>
            </div>
        );
    }
}

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
                this.setState({ position: 2, playerNames: playerNames });
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

class App extends React.Component {
    constructor(props) {
        super(props);
        this.removeTileFromRack = this.removeTileFromRack.bind(this);
        this.addTileToRack = this.addTileToRack.bind(this);
        this.removeTileFromCell = this.removeTileFromCell.bind(this);
        this.addTileToCell = this.addTileToCell.bind(this);
        this.initializeGame = this.initializeGame.bind(this);
        this.setInitialData = this.setInitialData.bind(this);

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

        this.state = { racks: racks, cellContent: cellContent, players: players, gameState: gameState };
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
                        <Player>
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
                        <Player>
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
        let newGameState = {};
        Object.assign(newGameState, this.state.gameState);
        newGameState["state"] = "initializing";
        this.setState({ gameState: newGameState });
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
            for (let i = 1; i <= noOfPlayers; i++) {
                let playerID = "player-" + i;
                let rackID = "rack-" + i;
                players[playerID] = {
                    player:
                        <Player id={playerID} name={names[i - 1]}>
                            {racks[rackID].rack}
                        </Player>,
                    rack: rackID
                }
            }
            this.setState({ racks: racks, players: players, gameState: gameState });
        }
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
            console.log(this.state.players);
            if (this.state.gameState.noOfPlayers === 2) {
                console.log(this.state.players);
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