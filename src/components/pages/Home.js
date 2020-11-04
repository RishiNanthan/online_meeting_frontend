import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Home extends Component{

    constructor(props){
        super(props);
        this.state = {
            meeting_code: "",
            error_message: "",
        }

        this.handleCode = this.handleCode.bind(this);
        this.joinMeeting = this.joinMeeting.bind(this);
        this.createMeeting = this.createMeeting.bind(this);
    }

    handleCode(event){
        event.persist();
        this.setState(
            prev => {
                return {
                    ...prev,
                    meeting_code: event.target.value,
                }
            }
        )
    }

    joinMeeting(){
        this.setState(prev => {
            return {
                ...prev,
                error_message: "No such Meeting found",
            }
        })
    }

    createMeeting(){

    }

    render(){
        return (
            <div className="home">
                <h1>Online Streaming</h1>
                <div className="join-meeting">
                    <input type="text" placeholder="Meeting code" maxLength={15} value={ this.state.meeting_code }
                    onChange={ event => this.handleCode(event) }/>
                    <input type="button" value="Join" onClick={
                        event => this.joinMeeting()
                    } />
                    <br />
                    <span style={{color: "red"}}>{ this.state.error_message }</span>
                </div>
                <div className="create-meeting">
                    <br />
                    <Link to="/new-meeting">
                        <input type="button" value="Create Meeting" onClick={ this.createMeeting } />
                    </Link>
                </div>
            </div>
        );
    }
}

export default Home;