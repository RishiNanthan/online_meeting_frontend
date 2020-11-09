import React, { Component } from 'react';

import Messages from '../layouts/Messages';
import Persons from '../layouts/Persons';


const video_constraint = {video: {width: {exact: 640}, height: {exact: 480}}};

const sample_user = {
    name: "Rishi Nanthan",
    image: null,

    video: false,
    audio: false,
    present: false,
};

const sample_message = {
    username: "Rishi Nanthan",
    message: "Hello World",
}


class Meeting extends Component{

    constructor(props){
        super(props);
        this.state = {
            client_name: "You (Rishi Nanthan)",

            video_capture: false,
            present_screen: false,
            audio_capture: false,

            show_chat: false,
            show_people: false,

            messages: [ sample_message ],
            unread_messages: 1,
            new_message: "",

            users: [ sample_user ],
            presenting_user: null,
        }

        this.video_stream = null;
        this.video_streamer = null;

        this.showVideo = this.showVideo.bind(this);
        this.hideVideo = this.hideVideo.bind(this);
        this.streamVideo = this.streamVideo.bind(this);
        this.stopScreen = this.stopScreen.bind(this);
        this.shareScreen = this.shareScreen.bind(this);
        this.captureAudio = this.captureAudio.bind(this);
        this.muteAudio = this.muteAudio.bind(this);
        this.showMessages = this.showMessages.bind(this);
        this.showPeople = this.showPeople.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.pinPerson = this.pinPerson.bind(this);
    }

    showVideo(){
        navigator.mediaDevices.getUserMedia(video_constraint).then(
            stream => {
                this.setState( prev => {
                    let new_state = {
                        ...prev,
                        video_capture: true,
                    }
                    if(prev.present_screen && this.video_stream != null){
                        this.video_stream.getVideoTracks()[0].stop();
                        this.video_stream = null;
                        new_state.present_screen = false;
                        clearInterval(this.video_streamer);
                    }
                    return new_state;
                });
                this.video_stream = stream;
                document.getElementById("screen").srcObject = stream;
            }
        ).catch( err => {
            console.log("No Camera found");
        })
        this.streamVideo();
    }

    hideVideo(){
        clearInterval(this.video_streamer);
        document.getElementById("screen").srcObject = null;
        this.video_stream.getVideoTracks()[0].stop();
        this.setState( prev => {
            return {
                ...prev,
                video_capture: false,
            }
        });
    }

    shareScreen(){
        navigator.mediaDevices.getDisplayMedia({cursor: "always"}).then( stream => {
            this.setState( prev => {
                let new_state = {
                    ...prev,
                    present_screen: true,
                }
                if(prev.video_capture && this.video_stream != null){
                    this.video_stream.getVideoTracks()[0].stop();
                    this.video_stream = null;
                    new_state.video_capture = false;
                    clearInterval(this.video_streamer);
                }
                return new_state;
            });
            this.video_stream = stream;
            document.getElementById("screen").srcObject = stream;
        }).catch( err => {
            console.log("Cannot share screen");
        })
        this.streamVideo();
    }

    stopScreen(){
        clearInterval(this.video_streamer);
        document.getElementById("screen").srcObject = null;
        this.video_stream.getVideoTracks()[0].stop();
        this.setState( prev => {
            return {
                ...prev,
                present_screen: false,
            }
        });
    }

    streamVideo(){
        let canvas = document.getElementById("canvas");
        let context = canvas.getContext('2d');
        canvas.width = 640;
        canvas.height = 480;
        this.video_streamer = setInterval(() => {
            let data;
            if(this.video_stream == null || !this.video_stream.active){
                data = null;
            }
            else{
                let screen = document.getElementById("screen");
                if(screen == null){
                    data = null;
                }
                else{
                    context.drawImage(screen, 0, 0, 640, 480);
                    data = canvas.toDataURL('image/png');
                }
            }
             // use data

        }, (500));
    }

    captureAudio(){
        this.setState( prev => {
            return {
                ...prev,
                audio_capture: true,
            }
        });
    }

    muteAudio(){
        this.setState( prev => {
            return {
                ...prev,
                audio_capture: false,
            }
        });
    }

    showMessages(){
        this.setState( prev => {
            return {
                ...prev,
                unread_messages: 0,
                show_chat: true,
                show_people: false,
            }
        });
    }

    showPeople(){
        this.setState( prev => {
            return {
                ...prev,
                show_chat: false,
                show_people: true,
            }
        })
    }

    sendMessage(){

    }

    pinPerson(user){
        this.setState( prev => {
            console.log(user);
            return {
                ...prev,
                presenting_user: user == null ? null : prev.users[user],
            }
        })
    }


    render(){

        const adjust_width = this.state.show_chat || this.state.show_people ? "reduce-width" : "" ;

        return (
            <div className="meeting">
                {
                    !(this.state.show_chat || this.state.show_people) &&
                    <div className="top-navbar">
                        <button onClick={ event => this.showMessages() }>
                            <i className="fa fa-comment fa-2x"></i>
                            {
                                this.state.unread_messages === 0 ? " "
                                : 
                                <sup style={{color: "red", fontSize: 15}}> ( { this.state.unread_messages } ) </sup>
                            }
                        </button>

                        <button onClick={ event => this.showPeople() }>
                            <i className="fa fa-user fa-2x"></i>
                            <sup style={{color: "green", fontSize: 15}}> ( { 1 + this.state.users.length } ) </sup>
                        </button>
                    </div>
                }


                {
                    (this.state.show_chat || this.state.show_people) && 
                    <div className="sidebar">
                        <div className="navigation">
                            <button className={ !this.state.show_chat ? "not-selected": "" } onClick={ event => {
                                this.showMessages();
                            }}>
                                Chat &nbsp;
                                <i className="fa fa-comment"></i>
                            </button> |
                            <button className={ !this.state.show_people ? "not-selected": "" } onClick={ event => {
                                this.showPeople();
                            }}>
                                People &nbsp;
                                <i className="fa fa-user"></i>
                            </button>
                            <span className="close-btn" onClick={ event => {
                                this.setState( prev => {
                                    return {
                                        ...prev,
                                        show_chat: false,
                                        show_people: false,
                                    }
                                })
                            }}>
                                &times;
                            </span>
                        </div>
                        {
                            this.state.show_chat ? 
                            <div className="content">
                                <Messages messages={ this.state.messages } />
                                <div className="new-msg">
                                    <input type="text" placeholder="Type your msg" value={ this.state.new_message }
                                    onChange={ event => {
                                        event.persist();
                                        this.setState( prev => {
                                            return {
                                                ...prev,
                                                new_message: event.target.value,
                                            }
                                        })
                                    }}/>
                                    <i className="fa fa-send-o send-btn" onClick={ event => {
                                        if(this.state.new_message.length > 0){
                                            this.sendMessage(this.state.new_message);
                                            let msgs = this.state.messages.slice(0);
                                            msgs.push({
                                                username: "You",
                                                message: this.state.new_message,
                                            });
                                            this.setState( prev => {
                                                return {
                                                    ...prev,
                                                    new_message: "",
                                                    messages: msgs,
                                                }
                                            })
                                        }
                                    }}></i>
                                </div>
                            </div>
                            :
                            <div className="content">
                                <Persons persons={ this.state.users } pin_person={ this.pinPerson }
                                you={{name: this.state.client_name, audio: this.state.audio_capture, video: this.state.video_capture}} />
                            </div>
                        }
                    </div>
                }

                <div className={ `video-frame ${ adjust_width }` }>
                    <center>
                        <h3>
                            { 
                                this.state.presenting_user === null || this.state.video_capture || this.state.present_screen ? 
                                    this.state.client_name : this.state.presenting_user.name
                            }
                        </h3>
                        {
                            this.state.present_screen || this.state.video_capture ?
                                <video id="screen" className="screen" autoPlay={true}></video>
                                :
                                this.state.presenting_user != null ?
                                    this.state.presenting_user.image != null ?
                                        <img src={ this.presenting_user.image } 
                                        id="imagescreen" alt="User Presenting" className="screen" />
                                        :
                                        <div className="screen">
                                            <div>
                                                {
                                                    !this.state.presenting_user.audio ?
                                                    <i className="fa fa-microphone-slash fa-5x" 
                                                    style={{color:"orange", marginTop: "100px"}}></i>
                                                    :
                                                    <i className="fa fa-microphone fa-5x" 
                                                    style={{color:"lightblue", marginTop: "100px"}}></i>
                                                }
                                            </div>
                                        </div>
                                    :
                                    <div className="screen">
                                        <div>
                                        {
                                            !this.state.audio_capture ?
                                            <i className="fa fa-microphone-slash fa-5x" 
                                            style={{color:"orange", marginTop: "100px"}}></i>
                                            :
                                            <i className="fa fa-microphone fa-5x" 
                                            style={{color:"lightblue", marginTop: "100px"}}></i>
                                        }
                                        </div>
                                        
                                    </div>
                        }
                    </center>
                </div>

                <div className={ `bottom-navbar ${ adjust_width }` }>
                    <div className="meeting-details-btn">
                        Meeting Details
                    </div>
                    
                    <button className="button" style={{color: "red"}}>
                        <i className="fa fa-phone fa-3x" aria-hidden="true"></i>
                    </button>
                    {
                        !this.state.video_capture ?
                            <button className="button" onClick={ event => this.showVideo() }>
                                <i className="fa fa-stop-circle fa-3x"></i>
                            </button>
                             :
                            <button className="button" onClick={ event => this.hideVideo() }>
                                <i className="fa fa-camera fa-3x" aria-hidden="true"></i>
                            </button>
                    }
                    {
                        !this.state.audio_capture ?
                            <button className="button" onClick={ event => this.captureAudio() }>
                                <i className="fa fa-microphone-slash fa-3x"></i>
                            </button>
                             :
                            <button className="button" onClick={ event => this.muteAudio() }>
                                <i className="fa fa-microphone fa-3x"></i>
                            </button>
                    }


                    <div className="share-screen-btn" onClick={ event => { 
                        !this.state.present_screen ? this.shareScreen() : this.stopScreen()
                    }}>
                        {
                            !this.state.present_screen ? "Share Screen" : "Stop Sharing"
                        }
                    </div>
                    
                </div>
                <canvas id="canvas" style={{display: "none"}}></canvas>
            </div>
        );
    }
}


export default Meeting;