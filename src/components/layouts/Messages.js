import React from 'react';


function Messages(props){
    const messages = props.messages;

    return (
        <div className="messages">
            {
                messages.map( (msg, i) => {
                    return (
                        <div className="message" key={i}>
                            <span className="user">{ msg.username }</span><br/>
                            <span className="msg"> &nbsp; { msg.message }</span>
                            <hr />
                        </div>
                    );
                })
            }
        </div>
    );
}


export default Messages;