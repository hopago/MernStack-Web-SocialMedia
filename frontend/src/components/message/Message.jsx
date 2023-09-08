import './message.css';
import { format } from 'timeago.js';


function Message({own, message}) {
  return (
    <div className={ own ? "message own" : "message" }>
        <div className="messageTop">
            <img 
              className='messageImg'
              src="https://images.pexels.com/photos/18194138/pexels-photo-18194138.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="" 
            />
            <p className='messageText'>{message.text !== "" && message.text}</p>
        </div>
        <div className="messageBottom">
            {format(message.createdAt)}
        </div>
    </div>
  )
}

export default Message
