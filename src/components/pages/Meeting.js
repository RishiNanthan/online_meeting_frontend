import React, { Component } from 'react';

const video_constraint = {video: {width: {exact: 640}, height: {exact: 480}}};

const sample_user = {
    name: "Rishi Nanthan",
    image: null,

    video: false,
    audio: false,
    present: true,
};

class Meeting extends Component{

    constructor(props){
        super(props);
        this.state = {
            client_name: "Hello World",

            video_capture: false,
            present_screen: false,
            audio_capture: false,

            users: [ sample_user, sample_user, sample_user, sample_user, sample_user ],
            presenting_user: null,
        }


        this.presenting_user = null;

        this.video_stream = null;
        this.video_streamer = null;

        this.showVideo = this.showVideo.bind(this);
        this.hideVideo = this.hideVideo.bind(this);
        this.streamVideo = this.streamVideo.bind(this);
        this.stopScreen = this.stopScreen.bind(this);
        this.shareScreen = this.shareScreen.bind(this);
        this.captureAudio = this.captureAudio.bind(this);
        this.muteAudio = this.muteAudio.bind(this);
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

    }

    muteAudio(){

    }


    render(){
        return (
            <div className="meeting">
                <div className="video-frame">
                    <center>
                        <h3>{ this.state.client_name }</h3>
                        {
                            this.state.present_screen || this.state.video_capture ?
                                <video id="screen" className="screen" autoPlay={true}></video>
                                :
                                this.presenting_user != null ?
                                    <img src={ this.presenting_user.image } id="imagescreen" alt="User Presenting" className="screen" />
                                    :
                                    <div className="screen">

                                    </div>
                        }
                    </center>
                </div>
                <div className="bottom-navbar">
                    <div className="meeting-details-btn">
                        Meeting Details
                    </div>
                    
                    <input type="button" value="Leave" className="button"/>
                    {
                        !this.state.video_capture ?
                        <input className="button" type="button" value="Camera" onClick={ event => this.showVideo() } /> :
                        <input className="button" type="button" value="Close Camera" onClick={ event => this.hideVideo() } />
                    }
                    {
                        !this.state.audio_capture ?
                        <input className="button" type="button" value="Unmute" onClick={ event => this.captureAudio() } /> :
                        <input className="button" type="button" value="Mute" onClick={ event => this.muteAudio() } />
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