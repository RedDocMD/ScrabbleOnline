import React from 'react';

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

export default Tile