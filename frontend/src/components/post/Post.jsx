import { useContext, useEffect, useState } from 'react';
import './post.css';
import { MoreVert } from '@material-ui/icons';
import axios from 'axios';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';


export default function Post({ post }) {

    console.log(post);

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const [user,setUser] = useState({});

    const [like,setLike] = useState(post.likes.length);
    const [heart,setHeart] = useState(post.hearts.length);

    const [isLiked, setIsLiked] = useState(false);
    const [isHearted, setIsHearted] = useState(false);

    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {

        setIsLiked(post.likes.includes(currentUser._id));
        setIsHearted(post.hearts.includes(currentUser._id));

    }, [currentUser._id, post.hearts, post.likes]);

    const handleClick = async (name) => {

        if(name === 'like') {

            try {
            
                await axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
                setLike(!isLiked ? like + 1 : like - 1);
                setIsLiked(!isLiked);
    
            } catch (err) {
                console.log(err);
            }

        } else if(name === 'heart') {

            try {
            
                await axios.put("/posts/" + post._id + "/heart", { userId: currentUser._id });
                setHeart(!isHearted ? heart + 1 : heart - 1);
                setIsHearted(!isHearted);
    
            } catch (err) {
                console.log(err);
            }

        } 

    };

    useEffect(() => {

        console.log(post.userId);

        const fetchUser = async () => {

            const res = await axios.get(`/users?userId=${post.userId}`);

            setUser(res.data);

        };

        fetchUser();

    }, [post.userId]);

    console.log(user);

  return (
    <div className="post">
        <div className="postWrapper">
            <div className="postTop">
                <div className="postTopLeft">
                    <Link to={`/profile/${user.username}`} className="link">
                      <img 
                        src={user.profilePicture ? user.profilePicture : `${PF}/person/3.png`} 
                        alt="" 
                        className='postProfileImg' 
                      />
                    </Link>
                    <span className="postUsername">{user.username}</span>
                    <span className="postDate">{format(post.createdAt)}</span>
                </div>
                <div className="postTopRight">
                    <MoreVert />
                </div>
            </div>
            <div className="postCenter">
                <span className="postText">
                    {post.desc}
                </span>
                <img src={post.img && PF+post.img} alt="" className='postImg' />
            </div>
            <div className="postBottom">
                <div className="postBottomLeft">
                    <img 
                      className='likeIcon' 
                      src={PF+'like.png'}
                      alt="" 
                      onClick={() => handleClick('like')}
                    />
                    <span className="postLikeCounter">{like !== 0 ? like : ""}</span>
                    <img 
                      className='likeIcon' 
                      src={`${PF}/heart.png`}
                      alt="" 
                      onClick={() => handleClick('heart')}
                    />
                    <span className="postHeartCounter">{heart !== 0 ? heart : ""}</span>
                    <span 
                      className="postTotalCounter" 
                    >
                        {heart + like !== 0 ? 
                        (<>{heart + like} people like it!</>) : null}
                    </span>
                </div>
                <div className="postBottomRight">
                    <span className="postCommentText">9 comments</span>
                </div>
            </div>
        </div>
    </div>
  )
}
