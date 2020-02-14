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

class Board extends React.Component {
    render() {
        var rows = [];
        for (let i = 0; i < this.props.rows; i++) {
            var row = [];
            for (let j = 0; j < this.props.columns; j++) {
                row.push(<td key={i + " " + j}><Cell /></td>);
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
    render() {
        return (
            <span className="cell">
                All izz well!
            </span>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);