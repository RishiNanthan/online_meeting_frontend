import React, { Component } from 'react';
import { Link } from 'react-router-dom';



class NewMeeting extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            name: "",
            meeting_code: "abcdefg"
        }
    }

    handleName(name){
        this.setState(prev => {
            return {
                ...prev, 
                name: name,
            }
        })
    }

    render(){
        return (
            <div className="new-meeting">
                <h1>New Meeting</h1>
                <div>
                    <input type="text" value={ this.state.name } placeholder="Name" onChange={ event => {
                        this.handleName(event.target.value);
                    }} />
                </div>
                <div>
                    <h3>
                        <span style={{userSelect: "none"}}>Meeting code: </span>
                        <span style={{background: "lightgray", padding: "5px", border: "2px solid black"}}>{ this.state.meeting_code }</span>
                    </h3>
                </div>
                <Link to="meeting"><input type="button" value="Create" /></Link>
            </div>
        );
    }

}

export default NewMeeting;