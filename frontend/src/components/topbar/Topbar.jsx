import './topbar.css';
import { 
  Search, Person, Chat, Notifications
} from "@material-ui/icons";
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';


function Topbar() {

  const { user } = useContext(AuthContext);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="topbar">
        <div className="topLeft">
          <Link to="/" className="link">
            <span className="logo">HopagoSocial</span>
          </Link>
        </div>
        <div className="topCenter">
          <div className="searchbar">
            <Search className='searchIcon' />
            <input placeholder='Search for friend, feed, post!' className="searchInput" />
          </div>
        </div>
        <div className="topRight">
          <div className="topbarLinks">
            <Link to='/' className='link'>
              <span className="topbarLink">Home</span>
            </Link>
            <span className="topbarLink">Timeline</span>
          </div>
          <div className="topbarIcons">
            <div className="topbarIconItem">
              <Person />
              <span className="topbarIconBadge">1</span>
            </div>
            <Link to="/messenger" className='link'>
            <div className="topbarIconItem">
              <Chat />
              <span className="topbarIconBadge">2</span>
            </div>
            </Link>
            <div className="topbarIconItem">
              <Notifications />
              <span className="topbarIconBadge">3</span>
            </div>
            <Link to={`/profile/${user?.username}`}>
              <img 
                src={user?.profilePicture ? PF+user?.profilePicture : `${PF}/person/3.png`} 
                alt="" 
                className="topbarImg" 
              />
            </Link>
            { user ? <span className="topbarLinkLogout">Logout</span> : null}
          </div>
        </div>
    </div>
  )
}

export default Topbar
