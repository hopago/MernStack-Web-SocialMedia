import { useEffect, useState } from 'react';
import './chatonline.css';
import axios from 'axios';


function ChatOnline({ onlineUsers, currentUser, setCurrentChat }) {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [friends,setFriends] = useState([]);
  const [onlineFriends,setOnlineFriends] = useState([]);

  // Get friends from current user 
  useEffect(() => {

    const getFriends = async () => {

      console.log(currentUser);

      const res = await axios.get('/users/friends/' + currentUser);

      setFriends(res.data);

    };

    getFriends();

  }, [currentUser]);

  useEffect(() => {

    setOnlineFriends(friends.filter(f => onlineUsers.includes(f._id)));

  }, [friends, onlineUsers]);

  const handleClick = async (onlineUser) => {

    try {
      
      const res = await axios.get(`/conversations/find/${currentUser}/${onlineUser._id}`);

      setCurrentChat(res.data);

    } catch (err) {
      console.log(err);
    }

  };

  return (
    <div className="chatOnline">
        { onlineFriends.map(o => (
        <div className="chatOnlineFriend" onClick={() => handleClick(o)} key={o._id}>
            <div className="chatOnlineImgContainer">
                <img 
                  src={o.profilePicture ? PF+o.profilePicture : PF+"person/2.png"}
                  alt=""
                  className='chatOnlineImg'
                />
                <div className="chatOnlineBadge">

                </div>
            </div>
            <div className="chatOnlineName">{o.username}</div>
        </div>
        ))}
    </div>
  )
}

export default ChatOnline
