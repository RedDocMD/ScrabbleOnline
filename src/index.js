import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component {
    render() {
        return (
            <Board rows="15" columns="15" />
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
    }

    render() {
        return (
            <div className={"cell " + this.props.className} />
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);