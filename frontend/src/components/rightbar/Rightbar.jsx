import { useContext, useEffect, useState } from "react";
import "./rightbar.css";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from '@material-ui/icons';


export default function Rightbar({ user }) {

  console.log(user);

  const { user:currentUser, dispatch } = useContext(AuthContext);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [friends,setFriends] = useState([]);

  const [followed,setFollowed] = useState(currentUser.followings.includes(user?._id));

  useEffect(() => {

    const getFriends = async () => {

      try {
        
        console.log(user._id);

        const friendList = await axios.get(`/users/friends/${user._id}`);

        console.log(friendList.data);

        setFriends(friendList.data);

        console.log(friends);

      } catch (err) {
        console.log(err);
      }

    };

    getFriends();

  }, [user]);

  useEffect(() => {

    setFollowed(currentUser.followings.includes(user?._id));

  }, [currentUser, user._id]);

  const handleClick = async () => {

    try {
      
      if(!followed) {

        await axios.put("/users/" + user._id + "/follow", { userId: currentUser._id });
        dispatch({type: "FOLLOW", payload: user._id});
        console.log(currentUser.followings);

      } else {

        await axios.put("/users/" + user._id + "/unfollow", { userId: currentUser._id });
        dispatch({type: "UNFOLLOW", payload: user._id});
        console.log(currentUser.followings);

      }

    } catch (err) {
      console.log(err);
    }

    setFollowed(!followed);

  };

  const HomeRightbar = () => (
    <>
      <div className="birthdayContainer">
        <img className="birthdayImg" src="/assets/gift.png" alt="" />
        <span className="birthdayText">
          <b>Pola Foster</b> and <b>3 other friends</b> has a birthday today
        </span>
      </div>
      <div className="rightbarAd">
        <img src="/assets/ad.png" alt="" className="rightbarAd" />
      </div>
      <h4 className="rightbarTitle">Online Friends</h4>
      <ul className="rightbarFriendList">
        <li className="rightbarFriend">
          <div className="rightbarProfileImgContainer">
            <img
              src="/assets/person/3.png"
              alt=""
              className="rightbarProfileImg"
            />
            <span className="rightbarOnline"></span>
          </div>
          <span className="rightbarUsername">PongPongE</span>
        </li>
      </ul>
    </>
  );

  const ProfileRightbar = () => (
    <>
    {user.username !== currentUser.username && (
      <button className="rightbarFollowButton" onClick={handleClick}>
        {followed ? "Unfollow" : "Follow"}
        {followed ? <Remove /> : <Add />}
      </button>
    )}
      <h4 className="rightbarTitle">User Information</h4>
      <div className="rightbarInfo">
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">City:</span>
          <span className="rightbarInfoValue">{user.city}</span>
        </div>
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">From:</span>
          <span className="rightbarInfoValue">{user.from}</span>
        </div>
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">Relationship:</span>
          <span className="rightbarInfoValue">
          {
          user.relationship === 1 ? "Single" 
          : user.relationship === 2 ? "Couple" 
          : ""
          }
          </span>
        </div>
      </div>
      <h4 className="rightbarTitle">User Friends</h4>
      <div className="rightbarFollowings">
        <div className="rightbarFollowing">
        { friends !== [] ?
          friends.map((friend => (
          <>
          <Link to={'/profile/'+friend.username} className='link'>
            <img 
              src={friend.profilePicture ? friend.profilePicture : `${PF}/person/2.png`} 
              alt="" 
              className="rightbarFollowingImg" 
            />
            <span className="rightbarFollowingName">{friend.username}</span>
          </Link>
          </>
          )))
          : 
          (
            <>
              <span className="rightbarInfoKey">Find and Add another users for friends!</span>
            </>
          )
        }
        </div>
      </div>
    </>
  )

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
