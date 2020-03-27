import React from 'react';
import ReactDOM from 'react-dom';
import { Board, getCellTypes } from './board';
import BagOfTiles from './tilegen';
import Rack from './rack';
import Player from './player';
import StartForm from './start-form';
import letterValues from './letter-values';
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
        this.showPoints = this.showPoints.bind(this);

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

        let points = [];

        let moveCount = 0;

        this.state = {
            racks: racks,
            cellContent: cellContent,
            players: players,
            gameState: gameState,
            activePlayer: undefined,
            tilesPlacedThisMove: tilesPlacedThisMove,
            points: points,
            moveCount: moveCount,
            names: undefined
        };
    }

    showPoints() {
        if (this.state.activePlayer !== undefined) {
            let html = '<ul>';
            for (let i = 0; i < this.state.gameState.noOfPlayers; i++)
                html =
                    html +
                    '<li>' +
                    this.state.names[i] +
                    ': ' +
                    this.state.points[i] +
                    '</li>';
            html += '</ul>';
            Swal.fire({
                title: 'Points',
                html: html,
                icon: 'info',
                confirmButtonText: 'Okay!'
            });
        }
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
            let points = [];
            for (let i = 0; i < noOfPlayers; i++) points.push(0);
            this.setState({
                racks: racks,
                players: players,
                gameState: gameState,
                activePlayer: activePlayer,
                points: points,
                names: names
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
                    cellContent: cellContent,
                    moveCount: state.moveCount + 1
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
                    cellContent: cellContent,
                    moveCount: state.moveCount + 1
                };
            });
        }
    }

    makeMove(id) {
        if (id === 'player-' + this.state.activePlayer) {
            this.setState((state, props) => {
                let tilesPlaced = state.tilesPlacedThisMove.slice();
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
                const checkWhereExtends = (placedTiles, orientation) => {
                    let config = [];
                    if (orientation === 'row') {
                        let placed = placedTiles.sort((a, b) => {
                            return a.col - b.col;
                        });
                        let minCol = placed[0].col;
                        let maxCol = placed[placed.length - 1].col;
                        let row = placed[0].row;
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
                            maxCol < this.columns - 1 &&
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
                            row < this.rows - 1 &&
                            state.cellContent[row + 1][minCol] !== ''
                        )
                            config.push('top-left');
                        if (
                            row < this.rows - 1 &&
                            state.cellContent[row + 1][maxCol] !== ''
                        )
                            config.push('top-right');
                    } else {
                        let placed = placedTiles.sort((a, b) => {
                            return a.row - b.row;
                        });
                        let minRow = placed[0].row;
                        let maxRow = placed[placed.length - 1].row;
                        let col = placed[0].col;
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
                            col < this.column - 1 &&
                            state.cellContent[minRow][col + 1] !== ''
                        )
                            config.push('left-top');
                        if (
                            col < this.columns - 1 &&
                            state.cellContent[maxRow][col + 1] !== ''
                        )
                            config.push('left-bottom');
                        if (
                            minRow > 0 &&
                            state.cellContent[minRow - 1][col] !== ''
                        )
                            config.push('bottom');
                        if (
                            maxRow < this.rows - 1 &&
                            state.cellContent[maxRow + 1][col] !== ''
                        )
                            config.push('top');
                    }
                    return config;
                };

                console.log(tilesPlaced);
                console.log(orientation);
                let config = checkWhereExtends(tilesPlaced, orientation);
                console.log(config);
                if (config.length === 0 && state.moveCount > 0) {
                    Swal.fire({
                        title: 'Invalid move!',
                        text: 'New tiles must extend or hook on previous word',
                        icon: 'error',
                        confirmButtonText: 'Continue'
                    });
                    return state;
                }

                const getWordLimits = (placed, cells, config, orientation) => {
                    let words = [];
                    if (orientation === 'row') {
                        placed.sort((a, b) => {
                            return a.col - b.col;
                        });
                        let minCol = placed[0].col;
                        let maxCol = placed[placed.length - 1].col;
                        let row = placed[0].row;
                        let startCol = minCol;
                        let stopCol = maxCol;
                        if (config.indexOf('right') >= 0) {
                            startCol = minCol - 2;
                            while (startCol > 0 && cells[row][startCol] !== '')
                                --startCol;
                            ++startCol;
                        }
                        if (config.indexOf('left') >= 0) {
                            stopCol = maxCol + 2;
                            while (
                                stopCol < this.columns - 1 &&
                                cells[row][stopCol] !== ''
                            )
                                ++stopCol;
                            --stopCol;
                        }
                        words.push({
                            start: startCol,
                            stop: stopCol,
                            other: row,
                            orientation: 'row'
                        });
                        if (config.indexOf('bottom-left') >= 0) {
                            let stopRow = row + 2;
                            while (
                                stopRow < this.rows - 1 &&
                                cells[stopRow][minCol] !== ''
                            )
                                stopRow++;
                            --stopRow;
                            words.push({
                                start: row,
                                stop: stopRow,
                                other: minCol,
                                orientation: 'column'
                            });
                        }
                        if (config.indexOf('bottom-right') >= 0) {
                            let stopRow = row + 2;
                            while (
                                stopRow < this.rows - 1 &&
                                cells[stopRow][maxCol] !== ''
                            )
                                stopRow++;
                            --stopRow;
                            words.push({
                                start: row,
                                stop: stopRow,
                                other: maxCol,
                                orientation: 'column'
                            });
                        }
                        if (config.indexOf('top-left') >= 0) {
                            let startRow = row - 2;
                            while (
                                startRow > 0 &&
                                cells[startRow][minCol] !== ''
                            )
                                startRow--;
                            ++startRow;
                            words.push({
                                start: startRow,
                                stop: row,
                                other: minCol,
                                orientation: 'column'
                            });
                        }
                        if (config.indexOf('top-right') >= 0) {
                            let startRow = row - 2;
                            while (
                                startRow > 0 &&
                                cells[startRow][maxCol] !== ''
                            )
                                startRow--;
                            ++startRow;
                            words.push({
                                start: startRow,
                                stop: row,
                                other: maxCol,
                                orientation: 'column'
                            });
                        }
                    } else {
                        // TODO: Implement this
                    }
                    return words;
                };

                let words = getWordLimits(
                    tilesPlaced,
                    state.cellContent,
                    config,
                    orientation
                );
                console.log(words);
                if (words.length === 0) {
                    Swal.fire({
                        title: 'Invalid move!',
                        text: 'New tiles must extend or hook on previous word',
                        icon: 'error',
                        confirmButtonText: 'Continue'
                    });
                    return state;
                }
                let cellTypes = getCellTypes(this.rows);

                const calculatePoints = (words, cells, cellTypes) => {
                    let points = state.points[state.activePlayer - 1];
                    for (let i = 0; i < words.length; i++) {
                        let wordPoints = 0;
                        let word = words[i];
                        let doubleWord = false;
                        let tripleWord = false;
                        for (let j = word.start; j <= word.stop; j++) {
                            if (word.orientation === 'row') {
                                let point =
                                    letterValues[cells[word.other][j]].value;
                                if (
                                    cellTypes[word.other][j] === 'double-letter'
                                )
                                    point *= 2;
                                else if (
                                    cellTypes[word.other][j] === 'triple-letter'
                                )
                                    point *= 3;
                                wordPoints += point;

                                if (
                                    cellTypes[word.other][j] ===
                                        'double-word' ||
                                    cellTypes[word.other][j] === 'star'
                                )
                                    doubleWord = true;
                                else if (
                                    cellTypes[word.other][j] === 'triple-word'
                                )
                                    tripleWord = true;
                            } else {
                                let point =
                                    letterValues[cells[j][word.other]].value;
                                if (
                                    cellTypes[j][word.other] === 'double-letter'
                                )
                                    point *= 2;
                                else if (
                                    cellTypes[j][word.other] === 'triple-letter'
                                )
                                    point *= 3;
                                wordPoints += point;
                                if (
                                    cellTypes[j][word.other] ===
                                        'double-word' ||
                                    cellTypes[word.other][j] === 'star'
                                )
                                    doubleWord = true;
                                else if (
                                    cellTypes[j][word.other] === 'triple-word'
                                )
                                    tripleWord = true;
                            }
                        }
                        if (doubleWord) wordPoints *= 2;
                        if (tripleWord) wordPoints *= 3;
                        points += wordPoints;
                    }
                    return points;
                };
                let point = calculatePoints(
                    words,
                    state.cellContent,
                    cellTypes
                );
                if (tilesPlaced.length === 7) point += 50;

                let points = state.points.slice();
                points[state.activePlayer - 1] = point;
                let rackToReset = 'rack-' + state.activePlayer;
                let oldLetters = state.racks[rackToReset].letters;
                let lettersToAdd = this.bag.getTiles(
                    this.maxNoOfTiles - oldLetters.length
                );
                let newLetters = oldLetters.concat(lettersToAdd);
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
                    points: points,
                    moveCount: state.moveCount + 1
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
                        <span
                            className="text-xl text-gray-400 hover:text-gray-200 align-text-bottom mr-4 mt-2 mb-2 cursor-pointer"
                            onClick={this.showPoints}
                        >
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
