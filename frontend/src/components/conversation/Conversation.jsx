import { useEffect, useState } from 'react';
import './conversation.css';
import axios from 'axios';


function Conversation({ conversation, currentUser }) {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [user,setUser] = useState(null);

  useEffect(() => {

    const friendId = conversation.members.find(m => m._id !== currentUser._id);

    const getUser = async () => {

      try {
        
        const res = await axios.get("/users?userId=" + friendId);

        setUser(res.data);

      } catch (err) {
        console.log(err);
      }

    };

    getUser();

  }, [conversation, currentUser]);

  return (
    <div className="conversation">
      <img 
        src={user?.profilePicture ? user.profilePicture : PF+"person/3.png"}
        alt="" 
        className="conversationImg" 
      />
      <span className="conversationsName">{user?.username}</span>
    </div>
  )
}

export default Conversation
