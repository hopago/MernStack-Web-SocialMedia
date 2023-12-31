import Topbar from '../../components/topbar/Topbar';
import './home.css';
import Sidebar from '../../components/sidebar/Sidebar';
import Feed from '../../components/feed/Feed';
import Rightbar from '../../components/rightbar/Rightbar';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';


export default function Home() {

  const { user } = useContext(AuthContext);

  return (
    <div className="home">
        <Topbar />
        <div className="homeContainer">
          <Sidebar />
          <Feed />
          <Rightbar user={user} />
      </div>
    </div>
  )
}
