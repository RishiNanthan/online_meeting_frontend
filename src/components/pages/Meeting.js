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
            console.log(data);

        }, (500));
    }

    create_users_div(){
        let users_div = [];
        const user_img_style = { width: "85%", height: "150px", background: "black", margin: "auto" };
        const user_style = { padding: "1%", background: "gray", width: "17%", color: "white", display: "inline-block", margin: "1%" };

        for(let i=0; i<4; i++){
            if(i < this.state.users.length){
                users_div.push(
                    <div style={ user_style } key={ i + " " + this.state.users[i].name }>
                        { 
                            this.state.users[i].image != null ?
                            <img src={ this.state.users[i].image } alt={ this.state.users[i].name } style={ user_img_style } />:
                            <div style={ user_img_style }></div>
                        }
                        <p>{ this.state.users[i].name }</p>
                    </div>
                );
            }
            else{
                break;
            }
        }
        if(users_div.length < 4){
            users_div.push(
                <div style={ user_style } key={ "404" }>
                    <p>
                        Share your meeting id, so that other people can join..
                    </p>
                </div>
            )
        }

        return users_div;
    }

    render(){
        return (
            <div className="meeting">
                <h1>Meeting</h1>
                <center>
                    <div style={{background: "black", minHeight: "500px", width: "90%"}}>
                        <center>
                            <h3 style={{ color: "lightgray"}}>{ this.state.client_name }</h3>
                            {
                                this.state.present_screen || this.state.video_capture ?
                                    <video id="screen" 
                                    style={{background: "black", minHeight: "300px", minWidth: "60%", maxWidth: "90%"}} autoPlay={true}>    
                                    </video>
                                    :
                                    this.presenting_user != null &&
                                        <img src={ this.presenting_user.image } id="imagescreen" alt="User Presenting" />
                            }
                        </center>
                    </div>
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
                <hr />
                <div style={{width: "90%", margin:"auto"}}>
                    {
                        this.create_users_div()
                    }
                </div>
            </div>
        );
    }
}


export default Meeting;