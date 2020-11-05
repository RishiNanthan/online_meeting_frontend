import React, { Component } from 'react';

const video_constraint = {video: {width: {exact: 640}, height: {exact: 480}}};

class Meeting extends Component{

    constructor(props){
        super(props);
        this.state = {
            video_capture: false,
            present_screen: false,
            video_stream: null,
        }

        this.video_stream = null;
        this.video_streamer = null;

        this.showVideo = this.showVideo.bind(this);
        this.hideVideo = this.hideVideo.bind(this);
        this.streamVideo = this.streamVideo.bind(this);
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
        let screen = document.getElementById("screen");
        let canvas = document.getElementById("canvas");
        let context = canvas.getContext('2d');
        canvas.width = 640;
        canvas.height = 480;
        this.video_streamer = setInterval(() => {
            context.drawImage(screen, 0, 0, 640, 480);
            let data = canvas.toDataURL('image/png');
        }, (100));
    }

    render(){
        return (
            <div className="meeting">
                <h1>Meeting</h1>
                <center>
                    <video id="screen" style={{background: "black", height: "500px", width: "60%"}} autoPlay={true}></video>
                    <br />
                    <div>
                        {
                            !this.state.video_capture ?
                            <input type="button" value="Camera" onClick={ event => this.showVideo() } /> :
                            <input type="button" value="Close Camera" onClick={ event => this.hideVideo() } />
                        }
                        {
                            !this.state.present_screen ?
                            <input type="button" value="Present" onClick={ event => this.shareScreen() } /> :
                            <input type="button" value="Stop Presenting" onClick={ event => this.stopScreen() } />
                        }
                        
                    </div>
                    <canvas id="canvas" style={{display: "none"}}></canvas>
                </center>
            </div>
        );
    }
}


export default Meeting;