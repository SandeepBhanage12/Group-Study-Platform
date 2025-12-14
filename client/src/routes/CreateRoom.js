import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import '../styles/CreateRoom.css'
import { useName } from "../context/NameContext";
import axios from 'axios'

const CreateRoom = () => {
    const [roomName, setRoomName] = useState("");
    const history = useHistory();
    const [existingRooms, setExistingRooms] = useState([{}]);
    const {nameInContext, setNameInContext} = useName();
    
    function create() {
        if (roomName.trim()) {
            history.push(`/room/${roomName}`);
        } else {
            alert("Please enter a room name!");
        }
    }

    useEffect(() => {
        console.log("Name in context updated: ", nameInContext);
      }, [nameInContext]);
      

    useEffect(()=>{
        console.log("name: ", nameInContext);
        
            // setNameInContext(myEmail);
            const baseUrl = process.env.REACT_APP_BASE_URL || 'http://10.136.84.119';
            const apiUrl = process.env.NODE_ENV === 'production'
             ? '/get-rooms'
             : `${baseUrl}:8181/get-rooms`;

            axios.post(apiUrl).then(({data}) => {                
                console.log("hejd");
                console.log(data);
                setExistingRooms(data);
            });

    }, [])

    useEffect(()=>{
        console.log("rooms: ", existingRooms);
    }, [existingRooms])


    const getOngoingRooms = (room,people)=>{
        return (
            <div style={{padding:'1rem', display:'flex', justifyContent:'space-between', width:'fit-content', gap:'2rem'}}>
                <div style={{color:'white'}}>
                    <h3>Room: {room}</h3>
                    <p>no. of people: {people}</p>
                </div>
                <button className="action-button" onClick={() => history.push(`/room/${room}`)}>Join Room</button>
            </div>
        )
    }

    return (
        <div className="main-div" style={{display:'flex', gap:'5rem', justifyContent:'center', maxHeight:'100vh'}}>
            <div className="create-room-container">
            <h1 className="project-title">Group Study Platform</h1>
            <p className="description">
                Welcome to the Group Study Platform! Collaborate and learn with peers by creating or joining study rooms. 
                Share knowledge, solve problems, and make learning interactive and engaging.
            </p>

            <div className="form-container">
                <input
                    className="room-input"
                    type="text"
                    placeholder="Enter Room Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
                <div className="button-group">
                    <button className="action-button" onClick={create}>Create Room</button>
                    <button className="action-button" onClick={create}>Join Room</button>
                    <button className="action-button" onClick={()=>window.location.href='/'}>Log Out</button>
                </div>
            </div>

            <div className="features-container">
                <h2 className="features-title">Key Features</h2>
                <ul className="features-list">
                    <li>🛠️ Easy room creation and joining</li>
                    <li>📹 Real-time video collaboration</li>
                    <li>💬 Interactive messaging system</li>
                    <li>📚 Subject-specific study rooms</li>
                </ul>
            </div>

            <footer className="footer">
                <p>
                    Built for effective group studies <br />
                    <strong>Happy Learning!</strong>
                </p>
            </footer>
            </div>
            <div style={{padding:'4.2rem 0 0 0', display:'flex', flexDirection:'column', gap:'2rem', maxHeight:'90vh'}}>
                <h2 style={{ color: 'white', textAlign: 'center' }}>On Going Rooms <span>&darr;</span>  {/* ↓ */}
                </h2>
                <div style={{display:'flex', flexDirection:'column', gap:'2rem', overflow:'auto',border:'2px solid white', borderTop:'none', borderRadius:'1rem'}} className="scroll-container">
                {
                    existingRooms && Object.entries(existingRooms).map(([key]) => (
                        existingRooms[key].length > 0 &&
                        getOngoingRooms(key, existingRooms[key].length)
                    ))
                }
                </div>
            </div>
        </div>
    );
};

export default CreateRoom;
