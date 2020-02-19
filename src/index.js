import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const letter_values = {
    "A": { letter: "A", value: 1 },
    "B": { letter: "B", value: 3 },
    "C": { letter: "C", value: 3 },
    "D": { letter: "D", value: 2 },
    "E": { letter: "E", value: 1 },
    "F": { letter: "F", value: 4 },
    "G": { letter: "G", value: 2 },
    "H": { letter: "H", value: 4 },
    "I": { letter: "I", value: 1 },
    "J": { letter: "J", value: 8 },
    "K": { letter: "K", value: 5 },
    "L": { letter: "L", value: 1 },
    "M": { letter: "M", value: 3 },
    "N": { letter: "N", value: 1 },
    "O": { letter: "O", value: 1 },
    "P": { letter: "P", value: 3 },
    "Q": { letter: "Q", value: 10 },
    "R": { letter: "R", value: 1 },
    "S": { letter: "S", value: 1 },
    "T": { letter: "T", value: 1 },
    "U": { letter: "U", value: 1 },
    "V": { letter: "V", value: 4 },
    "W": { letter: "W", value: 4 },
    "X": { letter: "X", value: 8 },
    "Y": { letter: "Y", value: 4 },
    "Z": { letter: "Z", value: 10 }
}

function get_cell_types(size) {
    let types = new Array(size);
    for (let i = 0; i < size; i++) types[i] = new Array(size);

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            types[i][i] = "normal";
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

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.rows = parseInt(this.props.rows, 10);
        this.columns = parseInt(this.props.columns, 10);
        let cellContent = new Array(this.rows);
        for (let i = 0; i < this.rows; i++) cellContent[i] = new Array(this.columns);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                cellContent[i][j] = "";
            }
        }
        this.state = { cellContent: cellContent };
        this.tileAdded = this.tileAdded.bind(this);
        this.tileRemoved = this.tileRemoved.bind(this);
    }

    tileAdded(row, col, content) {
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

    tileRemoved(row, col) {
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

    render() {
        let rows = [];
        let types = get_cell_types(this.props.rows);
        for (let i = 0; i < this.props.rows; i++) {
            let row = [];
            for (let j = 0; j < this.props.columns; j++) {
                row.push(<td key={i + " " + j}><Cell className={types[i][j]} elementAdded={this.props.elementAdded} row={i} column={j} content={this.state.cellContent[i][j]} tileAdded={this.tileAdded} tileRemoved={this.tileRemoved} /></td>);
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
        let droppedItem = letter_values[droppedLetter];
        if (droppedItem) {
            this.setState({ content: droppedItem });
        }
        if (fromRack !== "not-from-rack") {
            this.props.elementAdded(droppedLetter, fromRack);
        } else {
            let position = ev.dataTransfer.getData("position");
            let coords = position.split(" ");
            this.props.tileRemoved(parseInt(coords[0], 10), parseInt(coords[1], 10));
        }
        this.props.tileAdded(this.props.row, this.props.column, droppedLetter);
    }

    render() {
        if (this.props.content !== "") {
            let content = letter_values[this.props.content];
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
    }

    dragStart(ev) {
        ev.dataTransfer.setData("drag-item", this.props.dataItem);
        let rackValue = this.props.rack === undefined ? "not-from-rack" : this.props.rack;
        ev.dataTransfer.setData("from-rack", rackValue);
        ev.dataTransfer.setData("position", this.props.row + " " + this.props.column);
    }

    render() {
        return (
            <span className={"tile " + this.props.className} draggable onDragStart={this.dragStart}>
                <div className="tile-text">{this.props.letter}</div>
                <div className="tile-value">{this.props.value}</div>
            </span>
        );
    }
}

class Rack extends React.Component {
    render() {
        let tiles = [];
        this.props.letters.forEach(letter => {
            let letter_obj = letter_values[letter];
            tiles.push(<Tile letter={letter_obj.letter} key={letter + " " + this.props.id} value={letter_obj.value} dataItem={letter} rack={this.props.id} className="normal-tile" />);
        });
        return (
            <div className="rack">
                {tiles}
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        let letters = ["A", "B", "C", "D", "E", "F"];
        let racks = {};
        racks["rack-1"] = { rack: <Rack letters={letters} id="rack-1" />, letters: letters };
        this.state = { racks: racks };
        this.removeTileFunc = this.removeTileFunc.bind(this);
    }

    removeTileFunc(letter, rack) {
        this.setState((prevState, props) => {
            let rackElement = prevState.racks[rack];
            let old_letters = rackElement.letters;
            let new_letters = old_letters.slice();
            for (let i = 0; i < new_letters.length; i++) {
                if (new_letters[i] === letter) {
                    new_letters.splice(i, 1);
                    break;
                }
            }
            let newState = {};
            for (let key in prevState.racks) {
                if (prevState.racks.hasOwnProperty(key)) {
                    if (key === rack) {
                        newState[key] = { rack: <Rack letters={new_letters} id={key} />, letters: new_letters };
                    } else {
                        newState[key] = prevState.racks[key];
                    }
                }
            }
            return { racks: newState };
        });
    }

    render() {
        let board = <Board rows="15" columns="15" elementAdded={this.removeTileFunc} />;
        return (
            <div>
                {board}
                {this.state.racks["rack-1"].rack}
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);