import './profile.css';
import Sidebar from '../../components/sidebar/Sidebar';
import Feed from '../../components/feed/Feed';
import Topbar from '../../components/topbar/Topbar';
import Rightbar from '../../components/rightbar/Rightbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


export default function Profile() {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [user,setUser] = useState({});

  const username = useParams().username;

  useEffect(() => {

    const fetchUser = async () => {

      const res = await axios.get(`/users?username=${username}`);

      console.log(res.data);

      setUser(res.data);

    };

    fetchUser();

  }, [username]);

  console.log(user);

  return (
    <>
    <Topbar />
    <div className="profile">
        <Sidebar />
        <div className="profileRight">
            <div className="profileRightTop">
                <div className="profileCover">
                  <img src={user.coverPicture ? user.coverPicture : `${PF}/post/3.png`} alt="" className='profileCoverImg' />
                  <img src={user.profileImg ? user.profileImg : `${PF}/person/3.png`} alt="" className="profileUserImg" />
                </div>
                <div className="profileInfo">
                    <h4 className='profileInfoName'>{user.username}</h4>
                    <span className="profileInfoDesc">{user.desc}</span>
                </div>
            </div>
            <div className="profileRightBottom">
                <Feed username={username} />
                <Rightbar user={user} />
            </div>
        </div>
    </div>
    </>
  )
}
