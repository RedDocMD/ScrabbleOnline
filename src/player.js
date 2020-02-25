import React from 'react';

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.playerName = this.props.name;
    }

    render() {
        return (
            <div className="flex-auto flex flex-col">
                <div className="text-white name">Hell</div>
                <div className="text-4xl font-medium text-center  underline">
                    {this.playerName}
                </div>
                <div className="flex justify-around">
                    {this.props.children}
                </div>
                <div className="flex justify-around">
                    <button className="player-btn">Make move</button>
                    <button className="player-btn">Change tiles</button>
                    <button className="player-btn">Pass turn</button>
                </div>
                <div className="text-white name">Hell</div>
            </div>
        );
    }
}

export default Player