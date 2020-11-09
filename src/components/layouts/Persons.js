import React from 'react';


function Persons(props){

    const users = props.persons;
    const you = props.you;
    const pin_person = props.pin_person;


    return (
        <div className="persons">
            <div className="person" key={ "000" + you.name } onClick={ event => {
                pin_person(null);
            }}>
                <div className="user-details">
                    <i className="fa fa-user"></i> &nbsp;
                    <span>{ you.name }</span>
                </div>
                <div className="icons">
                    {
                        you.video || you.present ? 
                        <i className="fa fa-camera"></i>
                        :
                        <i className="fa fa-stop-circle"></i>
                    }
                    {
                        you.audio ?
                        <i className="fa fa-microphone"></i>
                        :
                        <i className="fa fa-microphone-slash"></i>
                    }
                </div>
            </div>
            <hr />
            {
                users.map( (user, i) => {
                    return (
                        <div className="person" key={ i + user.name } onClick={ event => pin_person(i) }>
                            <div className="user-details">
                                <i className="fa fa-user"></i> &nbsp;
                                <span>{ user.name }</span>
                            </div>
                            <div className="icons">
                                {
                                    user.video || user.present ? 
                                    <i className="fa fa-camera"></i>
                                    :
                                    <i className="fa fa-stop-circle"></i>
                                }
                                {
                                    user.audio ?
                                    <i className="fa fa-microphone"></i>
                                    :
                                    <i className="fa fa-microphone-slash"></i>
                                }
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
}


export default Persons;