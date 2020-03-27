import React from 'react';
import letterValues from './letter-values.js';
import Tile from './tile.js';

class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.type = this.props.className;
        if (this.type === 'star') this.type = 'double-letter';
        this.dragOver = this.dragOver.bind(this);
        this.dropOn = this.dropOn.bind(this);
    }

    dragOver(ev) {
        ev.preventDefault();
    }

    dropOn(ev) {
        let droppedLetter = ev.dataTransfer.getData('drag-item');
        let fromRack = ev.dataTransfer.getData('from-rack');
        if (fromRack !== 'not-from-rack') {
            this.props.removeTileFromRack(droppedLetter, fromRack);
        } else {
            let position = ev.dataTransfer.getData('position');
            let coords = position.split(' ');
            this.props.removeTileFromCell(
                parseInt(coords[0], 10),
                parseInt(coords[1], 10)
            );
        }
        this.props.addTileToCell(
            this.props.row,
            this.props.column,
            droppedLetter
        );
    }

    render() {
        if (this.props.content !== '') {
            let content = letterValues[this.props.content];
            return (
                <Tile
                    isActive={true}
                    letter={content.letter}
                    dataItem={content.letter}
                    value={content.value}
                    className="in-cell-tile"
                    row={this.props.row}
                    column={this.props.column}
                />
            );
        } else {
            return (
                <div
                    className={'cell ' + this.props.className}
                    onDragOver={this.dragOver}
                    onDrop={this.dropOn}
                />
            );
        }
    }
}

export default Cell;
