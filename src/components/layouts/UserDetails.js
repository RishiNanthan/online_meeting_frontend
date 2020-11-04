import React from 'react';


function UserDetails(props){

    const save_details = props.save_details;

    return (
        <div className="user-details">
            <input type="text" placeholder="Name" />
            <input type="button" value="Save" onClick={
                event => {
                    save_details("Hola");
                }
            } />
        </div>
    );
}

export default UserDetails;