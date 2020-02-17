import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component {
    render() {
        let letters = [{ letter: "A", value: 1 },
        { letter: "B", value: 3 },
        { letter: "C", value: 3 },
        { letter: "D", value: 2 }];
        return (
            <div>
                <Board rows="15" columns="15" />
                <Rack letters={letters} />
            </div>
        );
    }
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
    render() {
        let rows = [];
        let types = get_cell_types(this.props.rows);
        for (let i = 0; i < this.props.rows; i++) {
            let row = [];
            for (let j = 0; j < this.props.columns; j++) {
                row.push(<td key={i + " " + j}><Cell className={types[i][j]} /></td>);
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
        this.state = { content: null };
    }

    dragOver(ev) {
        ev.preventDefault();
    }

    dropOn(ev) {
        const droppedItem = ev.dataTransfer.getData("drag-item");
        if (droppedItem) {
            this.setState({ content: droppedItem });
        }
    }

    render() {
        if (this.state.content) {
            return (
                <Tile letter={this.state.content} dataItem={this.state.content} value={0} />
            );
        } else {
            return (
                <div className={"cell " + this.props.className} onDragOver={this.dragOver} onDrop={this.dropOn} />
            );
        }
    }
}

class Tile extends React.Component {
    render() {
        return (
            <span className="tile" draggable onDragStart={(ev => {
                ev.dataTransfer.setData("drag-item", this.props.dataItem);
            })}>
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
            tiles.push(<Tile letter={letter.letter} key={letter.letter} value={letter.value} dataItem={letter.letter} />);
        });
        return (
            <div className="rack">
                {tiles}
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);