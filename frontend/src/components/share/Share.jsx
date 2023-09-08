import { useContext, useRef, useState } from 'react';
import './share.css';
import { PermMedia, Label,Room, EmojiEmotions, Cancel } from '@material-ui/icons';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useHistory } from 'react-router-dom';


export default function Share() {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const { user } = useContext(AuthContext);

  const desc = useRef();

  const [file,setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };

    if(file) {
      const data = new FormData();
      const fileName = file.name;
      data.append("file", file);
      data.append("name", fileName);
      newPost.img = fileName;

      try {

        await axios.post("/upload", data);

      } catch (err) {
        console.log(err)
      }

    }

    try {
      
      await axios.post("/posts", newPost);

      window.location.reload();

    } catch (err) {
      console.log(err);
    }

  };

  return (
    <div className="share">
        <div className="shareWrapper">
            <div className="shareTop">
                <img 
                  src={user.profilePicture ? PF+user.profilePicture : `${PF}/person/3.png`} 
                  alt="" 
                  className="shareProfileImg" 
                />
                <div className="shareInputWrapper">
                  <input 
                    placeholder={`  How do you feel? ${user.username}`} 
                    className="shareInput" 
                    ref={desc} 
                  />
                </div>
            </div>
            <hr className="shareHr" />
            { file && (
              <div className="shareImgContainer">
                <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
                <Cancel className='shareCancelImg' onClick={() => setFile(null)} />
              </div>
            )}
            <form className="shareBottom" onSubmit={handleSubmit}>
                <div className="shareOptions">
                    <label htmlFor='file' className="shareOption">
                      <PermMedia htmlColor="#40E0D0" className='shareIcon' />
                      <div className="shareOptionText">Photo | Video</div>
                      <input 
                        style={{ display: "none" }}
                        type="file" 
                        id='file' 
                        accept='.png, .jpeg, .jpg' 
                        onChange={e => setFile(e.target.files[0])} 
                      />
                    </label>
                    <div className="shareOption">
                        <Label htmlColor="#CCCCFF" className="shareIcon"/>
                        <span className="shareOptionText">Tag</span>
                    </div>
                    <div className="shareOption">
                        <Room htmlColor="#9FE2BF" className="shareIcon"/>
                        <span className="shareOptionText">Location</span>
                    </div>
                    <div className="shareOption">
                        <EmojiEmotions htmlColor="#FFBF00" className="shareIcon"/>
                        <span className="shareOptionText">Feelings</span>
                    </div>
                </div>
                <button className="shareBtn" type='submit'>Share</button>
            </form>
        </div>
    </div>
  )
}
