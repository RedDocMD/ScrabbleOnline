import React from 'react';
import ReactDOM from 'react-dom';
import Board from './board';
import BagOfTiles from './tilegen';
import Rack from './rack';
import Player from './player';
import StartForm from './start-form';
import './index.css';
import Swal from 'sweetalert2';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.removeTileFromRack = this.removeTileFromRack.bind(this);
        this.addTileToRack = this.addTileToRack.bind(this);
        this.removeTileFromCell = this.removeTileFromCell.bind(this);
        this.addTileToCell = this.addTileToCell.bind(this);
        this.initializeGame = this.initializeGame.bind(this);
        this.setInitialData = this.setInitialData.bind(this);
        this.passMove = this.passMove.bind(this);
        this.changeTiles = this.changeTiles.bind(this);
        this.makeMove = this.makeMove.bind(this);

        this.bag = new BagOfTiles();
        this.maxNoOfTiles = 7;

        let racks = {};
        let players = {};

        this.rows = 15;
        this.columns = 15;
        let cellContent = new Array(this.rows);
        for (let i = 0; i < this.rows; i++)
            cellContent[i] = new Array(this.columns);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                cellContent[i][j] = '';
            }
        }

        let gameState = {
            state: 'to-start',
            noOfPlayers: 0,
            maxNoOfPlayers: 4,
            minNoOfPlayers: 2
        };

        let tilesPlacedThisMove = [];

        this.state = {
            racks: racks,
            cellContent: cellContent,
            players: players,
            gameState: gameState,
            activePlayer: undefined,
            tilesPlacedThisMove: tilesPlacedThisMove
        };
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
                        newState[key] = {
                            rack: (
                                <Rack
                                    active={this.state.activePlayer}
                                    letters={newLetters}
                                    id={key}
                                    addTileToRack={this.addTileToRack}
                                    removeTileFromRack={this.removeTileFromRack}
                                    removeTileFromCell={this.removeTileFromCell}
                                />
                            ),
                            letters: newLetters
                        };
                    } else {
                        newState[key] = prevState.racks[key];
                    }
                }
            }
            let players = {};
            for (let rackID in newState) {
                let playerID = rackID.replace('rack', 'player');
                players[playerID] = {
                    player: (
                        <Player
                            id={playerID}
                            active={this.state.activePlayer}
                            passMove={this.passMove}
                            changeTiles={this.changeTiles}
                            makeMove={this.makeMove}
                        >
                            {newState[rackID].rack}
                        </Player>
                    ),
                    rack: rackID
                };
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
                        newState[key] = {
                            rack: (
                                <Rack
                                    active={this.state.activePlayer}
                                    letters={newLetters}
                                    id={key}
                                    addTileToRack={this.addTileToRack}
                                    removeTileFromRack={this.removeTileFromRack}
                                    removeTileFromCell={this.removeTileFromCell}
                                />
                            ),
                            letters: newLetters
                        };
                    } else {
                        newState[key] = prevState.racks[key];
                    }
                }
            }
            let players = {};
            for (let rackID in newState) {
                let playerID = rackID.replace('rack', 'player');
                players[playerID] = {
                    player: (
                        <Player
                            id={playerID}
                            active={this.state.activePlayer}
                            passMove={this.passMove}
                            changeTiles={this.changeTiles}
                            makeMove={this.makeMove}
                        >
                            {newState[rackID].rack}
                        </Player>
                    ),
                    rack: rackID
                };
            }
            let newTilesPlacedThisMove = prevState.tilesPlacedThisMove.slice();
            for (let i = 0; i < newTilesPlacedThisMove.length; i++) {
                if (newTilesPlacedThisMove[i].letter === letter)
                    newTilesPlacedThisMove.splice(i, 1);
            }
            return {
                racks: newState,
                players: players,
                tilesPlacedThisMove: newTilesPlacedThisMove
            };
        });
    }

    addTileToCell(row, col, content) {
        this.setState((prevState, props) => {
            let oldContent = prevState.cellContent;
            let cellContent = new Array(this.rows);
            for (let i = 0; i < this.rows; i++)
                cellContent[i] = new Array(this.columns);
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.columns; j++) {
                    cellContent[i][j] = oldContent[i][j];
                }
            }
            cellContent[row][col] = content;
            let newTilesPlacedThisMove = prevState.tilesPlacedThisMove.slice();
            newTilesPlacedThisMove.push({
                letter: content,
                row: row,
                col: col
            });
            return {
                cellContent: cellContent,
                tilesPlacedThisMove: newTilesPlacedThisMove
            };
        });
    }

    removeTileFromCell(row, col) {
        this.setState((prevState, props) => {
            let oldContent = prevState.cellContent;
            let cellContent = new Array(this.rows);
            for (let i = 0; i < this.rows; i++)
                cellContent[i] = new Array(this.columns);
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.columns; j++) {
                    cellContent[i][j] = oldContent[i][j];
                }
            }
            cellContent[row][col] = '';

            let newTilesPlacedThisMove = prevState.tilesPlacedThisMove.slice();
            for (let i = 0; i < newTilesPlacedThisMove.length; i++) {
                let move = newTilesPlacedThisMove[i];
                if (move.row === row && move.col === col) {
                    newTilesPlacedThisMove.splice(i, 1);
                    break;
                }
            }
            return {
                cellContent: cellContent,
                tilesPlacedThisMove: newTilesPlacedThisMove
            };
        });
    }

    initializeGame() {
        if (
            this.state.gameState.state === 'to-start' ||
            this.state.gameState.state === 'ended'
        ) {
            let newGameState = {};
            Object.assign(newGameState, this.state.gameState);
            newGameState['state'] = 'initializing';
            this.setState({ gameState: newGameState });
        }
    }

    setInitialData(names) {
        if (names === null) {
            let newGameState = {};
            Object.assign(newGameState, this.state.gameState);
            newGameState['state'] = 'to-start';
            this.setState({ gameState: newGameState });
        } else {
            let noOfPlayers = names.length;
            let gameState = {
                state: 'started',
                noOfPlayers: noOfPlayers,
                maxNoOfPlayers: 4,
                minNoOfPlayers: 2
            };
            let activePlayer = 1;
            let racks = {};
            for (let i = 1; i <= noOfPlayers; i++) {
                let letters = this.bag.getTiles(this.maxNoOfTiles);
                racks['rack-' + i] = {
                    rack: (
                        <Rack
                            active={activePlayer}
                            letters={letters}
                            id={'rack-' + i}
                            addTileToRack={this.addTileToRack}
                            removeTileFromRack={this.removeTileFromRack}
                            removeTileFromCell={this.removeTileFromCell}
                        />
                    ),
                    letters: letters
                };
            }
            let players = {};
            for (let i = 1; i <= noOfPlayers; i++) {
                let playerID = 'player-' + i;
                let rackID = 'rack-' + i;
                players[playerID] = {
                    player: (
                        <Player
                            id={playerID}
                            name={names[i - 1]}
                            active={activePlayer}
                            passMove={this.passMove}
                            changeTiles={this.changeTiles}
                            makeMove={this.makeMove}
                        >
                            {racks[rackID].rack}
                        </Player>
                    ),
                    rack: rackID
                };
            }
            this.setState({
                racks: racks,
                players: players,
                gameState: gameState,
                activePlayer: activePlayer
            });
        }
    }

    passMove(id) {
        if (id === 'player-' + this.state.activePlayer) {
            this.setState((state, props) => {
                let activePlayer = state.activePlayer;
                activePlayer = activePlayer + 1;
                activePlayer =
                    activePlayer > state.gameState.noOfPlayers
                        ? 1
                        : activePlayer;
                let players = {};
                let racks = {};
                let oldContent = state.cellContent;
                let cellContent = new Array(this.rows);
                for (let i = 0; i < this.rows; i++)
                    cellContent[i] = new Array(this.columns);
                for (let i = 0; i < this.rows; i++) {
                    for (let j = 0; j < this.columns; j++) {
                        cellContent[i][j] = oldContent[i][j];
                    }
                }
                for (let i = 1; i <= state.gameState.noOfPlayers; i++) {
                    let letters = state.racks['rack-' + i].letters;
                    if (i === this.state.activePlayer) {
                        for (
                            let j = 0;
                            j < state.tilesPlacedThisMove.length;
                            j++
                        ) {
                            letters.push(state.tilesPlacedThisMove[j].letter);
                            cellContent[state.tilesPlacedThisMove[j].row][
                                state.tilesPlacedThisMove[j].col
                            ] = '';
                        }
                    }
                    racks['rack-' + i] = {
                        rack: (
                            <Rack
                                active={activePlayer}
                                letters={letters}
                                id={'rack-' + i}
                                addTileToRack={this.addTileToRack}
                                removeTileFromRack={this.removeTileFromRack}
                                removeTileFromCell={this.removeTileFromCell}
                            />
                        ),
                        letters: letters
                    };
                }
                for (let i = 1; i <= state.gameState.noOfPlayers; i++) {
                    let playerID = 'player-' + i;
                    let rackID = 'rack-' + i;
                    players[playerID] = {
                        player: (
                            <Player
                                id={playerID}
                                active={activePlayer}
                                passMove={this.passMove}
                                changeTiles={this.changeTiles}
                                makeMove={this.makeMove}
                            >
                                {racks[rackID].rack}
                            </Player>
                        ),
                        rack: rackID
                    };
                }
                return {
                    activePlayer: activePlayer,
                    players: players,
                    racks: racks,
                    tilesPlacedThisMove: [],
                    cellContent: cellContent
                };
            });
        }
    }

    changeTiles(id) {
        if (id === 'player-' + this.state.activePlayer) {
            this.setState((state, props) => {
                let oldContent = state.cellContent;
                let cellContent = new Array(this.rows);
                for (let i = 0; i < this.rows; i++)
                    cellContent[i] = new Array(this.columns);
                for (let i = 0; i < this.rows; i++) {
                    for (let j = 0; j < this.columns; j++) {
                        cellContent[i][j] = oldContent[i][j];
                    }
                }
                let rackToReset = 'rack-' + state.activePlayer;
                let oldLetters = state.racks[rackToReset].letters;
                for (let j = 0; j < state.tilesPlacedThisMove.length; j++) {
                    oldLetters.push(state.tilesPlacedThisMove[j].letter);
                    cellContent[state.tilesPlacedThisMove[j].row][
                        state.tilesPlacedThisMove[j].col
                    ] = '';
                }
                this.bag.returnTiles(oldLetters);
                let newLetters = this.bag.getTiles(this.maxNoOfTiles);
                let racks = {};
                let activePlayer = state.activePlayer;
                activePlayer = activePlayer + 1;
                activePlayer =
                    activePlayer > state.gameState.noOfPlayers
                        ? 1
                        : activePlayer;
                for (let key in state.racks) {
                    if (state.racks.hasOwnProperty(key)) {
                        if (key === rackToReset) {
                            racks[key] = {
                                rack: (
                                    <Rack
                                        active={activePlayer}
                                        letters={newLetters}
                                        id={key}
                                        addTileToRack={this.addTileToRack}
                                        removeTileFromRack={
                                            this.removeTileFromRack
                                        }
                                        removeTileFromCell={
                                            this.removeTileFromCell
                                        }
                                    />
                                ),
                                letters: newLetters
                            };
                        } else {
                            racks[key] = {
                                rack: (
                                    <Rack
                                        active={activePlayer}
                                        letters={state.racks[key].letters}
                                        id={key}
                                        addTileToRack={this.addTileToRack}
                                        removeTileFromRack={
                                            this.removeTileFromRack
                                        }
                                        removeTileFromCell={
                                            this.removeTileFromCell
                                        }
                                    />
                                ),
                                letters: state.racks[key].letters
                            };
                        }
                    }
                }
                let players = {};
                for (let i = 1; i <= state.gameState.noOfPlayers; i++) {
                    let playerID = 'player-' + i;
                    let rackID = 'rack-' + i;
                    players[playerID] = {
                        player: (
                            <Player
                                id={playerID}
                                active={activePlayer}
                                passMove={this.passMove}
                                changeTiles={this.changeTiles}
                                makeMove={this.makeMove}
                            >
                                {racks[rackID].rack}
                            </Player>
                        ),
                        rack: rackID
                    };
                }
                return {
                    activePlayer: activePlayer,
                    players: players,
                    racks: racks,
                    tilesPlacedThisMove: [],
                    cellContent: cellContent
                };
            });
        }
    }

    makeMove(id) {
        if (id === 'player-' + this.state.activePlayer) {
            this.setState((state, props) => {
                let tilesPlaced = state.tilesPlacedThisMove;
                if (tilesPlaced.length === 0) return state;

                const checkInRow = placed => {
                    let row = null;
                    for (let key in placed) {
                        if (row === null) row = placed[key].row;
                        else if (row !== placed[key].row) return false;
                    }
                    return true;
                };
                const checkInColumn = placed => {
                    let col = null;
                    for (let key in placed) {
                        if (col === null) col = placed[key].col;
                        else if (col !== placed[key].col) return false;
                    }
                    return true;
                };
                let orientation = null;
                if (checkInRow(tilesPlaced)) orientation = 'row';
                else if (checkInColumn(tilesPlaced)) orientation = 'col';
                else {
                    Swal.fire({
                        title: 'Invalid move!',
                        text: 'Moves must be in a row or a column.',
                        icon: 'error',
                        confirmButtonText: 'Continue'
                    });
                    return state;
                }

                const checkWhereExtends = (placed, orientation) => {
                    if (orientation === 'row') {
                        placed.sort((a, b) => {
                            return a.col < b.col;
                        });
                        let minCol = placed[0].col;
                        let maxCol = placed[placed.length - 1].col;
                        let row = placed[0].row;
                        let config = Array.new();
                        let distance = maxCol - minCol + 1;
                        if (distance === placed.length + 1)
                            config.push('middle');
                        else if (distance !== placed.length) return config;

                        if (
                            minCol > 0 &&
                            state.cellContent[row][minCol - 1] !== ''
                        )
                            config.push('right');
                        if (
                            maxCol < this.columns &&
                            state.cellContent[row][maxCol + 1] !== ''
                        )
                            config.push('left');
                        if (
                            row > 0 &&
                            state.cellContent[row - 1][minCol] !== ''
                        )
                            config.push('bottom-left');
                        if (
                            row > 0 &&
                            state.cellContent[row - 1][maxCol] !== ''
                        )
                            config.push('bottom-right');
                        if (
                            row < this.rows &&
                            state.cellContent[row + 1][minCol] !== ''
                        )
                            config.push('top-left');
                        if (
                            row < this.rows &&
                            state.cellContent[row + 1][maxCol] !== ''
                        )
                            config.push('top-right');
                    } else {
                        placed.sort((a, b) => {
                            return a.row < b.row;
                        });
                        let minRow = placed[0].row;
                        let maxRow = placed[placed.length - 1].row;
                        let col = placed[0].col;
                        let config = Array.new();
                        let distance = maxRow - minRow + 1;
                        if (distance === placed.length + 1)
                            config.push('middle');
                        else if (distance !== placed.length) return config;

                        if (
                            col > 0 &&
                            state.cellContent[minRow][col - 1] !== ''
                        )
                            config.push('right-top');
                        if (
                            col > 0 &&
                            state.cellContent[maxRow][col - 1] !== ''
                        )
                            config.push('right-bottom');
                        if (
                            col < this.columns &&
                            state.cellContent[minRow][col + 1] !== ''
                        )
                            config.push('left-top');
                        if (
                            col < this.columns &&
                            state.cellContent[maxRow][col + 1] !== ''
                        )
                            config.push('left-bottom');
                        if (
                            minRow > 0 &&
                            state.cellContent[minRow - 1][col] !== ''
                        )
                            config.push('bottom');
                        if (
                            maxRow < this.rows &&
                            state.cellContent[maxRow + 1][col] !== ''
                        )
                            config.push('top');
                    }
                    return config;
                };

                let config = checkWhereExtends(tilesPlaced, orientation);
                if (config.length === 0) {
                    Swal.fire({
                        title: 'Invalid move!',
                        text: 'New tiles must extend or hook on previous word',
                        icon: 'error',
                        confirmButtonText: 'Continue'
                    });
                    return state;
                }

                const getWordLimits = (placed, cells, config) => {
                    let words = Array.new();
                    if (config === 'row') {
                        placed.sort((a, b) => {
                            return a.col < b.col;
                        });
                        let minCol = placed[0].col;
                        let maxCol = placed[placed.length - 1].col;
                        let row = placed[0].row;
                        let startCol = minCol;
                        let stopCol = maxCol;
                        if (config.indexOf('right') >= 0) {
                            startCol = minCol - 2;
                            while (cells[row][startCol] !== '') --startCol;
                            ++startCol;
                        }
                        if (config.indexOf('left') >= 0) {
                            stopCol = maxCol + 2;
                            while (cells[row][stopCol] !== '') ++stopCol;
                            --stopCol;
                        }
                        words.push({
                            start: startCol,
                            stop: stopCol,
                            orientation: 'row'
                        });
                        if (config.indexOf('bottom-left') >= 0) {
                        }
                    }
                };
            });
        }
    }

    render() {
        let board = (
            <Board
                rows={this.rows}
                columns={this.columns}
                removeTileFromRack={this.removeTileFromRack}
                addTileToCell={this.addTileToCell}
                removeTileFromCell={this.removeTileFromCell}
                cellContent={this.state.cellContent}
            />
        );
        let toRender = <div></div>;
        if (this.state.gameState.state === 'to-start') {
            toRender = (
                <div className="flex flex-row">
                    <div className="flex flex-col flex-1"></div>
                    {board}
                    <div className="flex flex-col flex-1"></div>
                </div>
            );
        } else if (this.state.gameState.state === 'started') {
            if (this.state.gameState.noOfPlayers === 2) {
                toRender = (
                    <div className="flex flex-row">
                        <div className="flex flex-col flex-1">
                            {this.state.players['player-1'].player}
                        </div>
                        {board}
                        <div className="flex flex-col flex-1">
                            {this.state.players['player-2'].player}
                        </div>
                    </div>
                );
            } else if (this.state.gameState.noOfPlayers === 3) {
                toRender = (
                    <div className="flex flex-row">
                        <div className="flex flex-col flex-1">
                            {this.state.players['player-1'].player}
                            {this.state.players['player-3'].player}
                        </div>
                        {board}
                        <div className="flex flex-col flex-1">
                            {this.state.players['player-2'].player}
                        </div>
                    </div>
                );
            } else if (this.state.gameState.noOfPlayers === 4) {
                toRender = (
                    <div className="flex flex-row">
                        <div className="flex flex-col flex-1">
                            {this.state.players['player-1'].player}
                            {this.state.players['player-4'].player}
                        </div>
                        {board}
                        <div className="flex flex-col flex-1">
                            {this.state.players['player-2'].player}
                            {this.state.players['player-3'].player}
                        </div>
                    </div>
                );
            }
        } else if (this.state.gameState.state === 'initializing') {
            toRender = (
                <div className="flex flex-row">
                    <div className="flex-1"></div>
                    <div className="flex-1 flex flex-row">
                        <div className="flex-1"></div>
                        <div className="flex-1">
                            <StartForm
                                finalSubmit={this.setInitialData}
                                minPlayers={this.state.gameState.minNoOfPlayers}
                                maxPlayers={this.state.gameState.maxNoOfPlayers}
                            />
                        </div>
                        <div className="flex-1"></div>
                    </div>
                    <div className="flex-1"></div>
                </div>
            );
        }
        return (
            <div>
                <header className="bg-black text-white text-center align-middle text-4xl mb-6 flex">
                    <span className="flex-1"></span>
                    <span className="flex-1">Scrabble Game</span>
                    <span className="flex flex-row-reverse flex-1">
                        <span
                            className="text-2xl text-red-400 hover:text-red-600 align-text-bottom mr-4 mt-2 mb-2 ml-10 cursor-pointer"
                            onClick={this.initializeGame}
                        >
                            Start
                        </span>
                        <span className="text-xl text-gray-400 hover:text-gray-200 align-text-bottom mr-4 mt-2 mb-2 cursor-pointer">
                            Point
                        </span>
                    </span>
                </header>
                {toRender}
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
