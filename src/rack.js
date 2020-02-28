import React from 'react';
import letterValues from './letter-values';
import Tile from './tile';

class Rack extends React.Component {
    constructor(props) {
        super(props);
        this.dragOver = this.dragOver.bind(this);
        this.dropOn = this.dropOn.bind(this);
    }


    dragOver(ev) {
        let isActive = ("rack-" + this.props.active) === this.props.id;
        if (isActive) {
            ev.preventDefault();
        }
    }

    dropOn(ev) {
        let isActive = ("rack-" + this.props.active) === this.props.id;
        if (isActive) {
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
    }


    render() {
        let tiles = [];
        let isActive = ("rack-" + this.props.active) === this.props.id;
        console.log(this.props.id + " " + isActive);
        this.props.letters.forEach(letter => {
            let letterObj = letterValues[letter];
            tiles.push(<Tile isActive={isActive} letter={letterObj.letter} key={letter + " " + this.props.id + " " + Math.random()} value={letterObj.value} dataItem={letter} rack={this.props.id} className="normal-tile" />);
        });
        return (
            <div className="rack" onDragOver={this.dragOver} onDrop={this.dropOn}>
                {tiles}
            </div>
        );
    }
}

export default Rack