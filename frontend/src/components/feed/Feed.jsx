import { useContext, useEffect, useState } from 'react';
import Post from '../post/Post';
import Share from '../share/Share';
import './feed.css';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';


function Feed({ username }) {

  const [posts,setPosts] = useState([]);

  const { user } = useContext(AuthContext);

  console.log(user);

  useEffect(() => {

    const fetchPost = async () => {

      const res = username 
      ?  await axios.get("/posts/profile/" + username)
      :  await axios.get("/posts/timeline/" + user._id);

      setPosts(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

    };

    fetchPost();

  }, [username, user._id]);

  return (
    <div className="feed">
        <div className="feedWrapper">
          { (!username || username === user.username) && <Share /> }
          {posts.map(post => (
            <Post key={post._id} post={post} />
          ))}
        </div>
    </div>
  )
}

export default Feed
