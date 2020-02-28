import React from 'react';

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.playerName = this.props.name;
        this.backgroundColor = "bg-white";
        if (this.props.id === "player-" + this.props.active) {
            this.backgroundColor = "bg-blue-100";
        }
    }

    render() {
        this.backgroundColor = "bg-white";
        if (this.props.id === "player-" + this.props.active) {
            this.backgroundColor = "bg-blue-100";
        }
        return (
            <div className={"flex-auto flex flex-col " + this.backgroundColor}>
                <div className="text-white name">Hell</div>
                <div className="text-4xl font-medium text-center  underline">
                    {this.playerName}
                </div>
                <div className="flex justify-around">
                    {this.props.children}
                </div>
                <div className="flex justify-around">
                    <button className="player-btn">Make move</button>
                    <button className="player-btn" onClick={(ev) => this.props.changeTiles(this.props.id)}>Change tiles</button>
                    <button className="player-btn" onClick={(ev) => this.props.passMove(this.props.id)}>Pass turn</button>
                </div>
                <div className="text-white name">Hell</div>
            </div>
        );
    }
}

export default Player