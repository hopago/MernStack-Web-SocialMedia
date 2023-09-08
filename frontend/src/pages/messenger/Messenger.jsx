import { useContext, useEffect, useRef, useState } from 'react';
import ChatOnline from '../../components/chatonline/ChatOnline';
import Conversation from '../../components/conversation/Conversation';
import Message from '../../components/message/Message';
import Topbar from '../../components/topbar/Topbar';
import './messenger.css';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';


export default function Messenger() {

  const { user } = useContext(AuthContext);

  const [conversations,setConversations] = useState([]);
  const [currentChat,setCurrentChat] = useState(null);
  const [messages,setMessages] = useState([]);
  const [newMessage,setNewMessage] = useState("");
  const [arrivalMessage,setArrivalMessage] = useState(null);
  const [onlineUsers,setOnlineUsers] = useState([]);
  
  const socket = useRef(io("ws://localhost:5000"));

  const scrollRef = useRef();

  // Connect Socket.io-client
  useEffect(() => {

    socket.current = io("ws://localhost:5000");

    socket.current.on("getMessage", data => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });

  }, []);

  // Set Arrival Message instantly
  useEffect(() => {

    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && 
    setMessages(prev => [...prev, arrivalMessage]);

  }, [arrivalMessage, currentChat]);

  // Send current user._id to backend, Get Online User Id from backend
  useEffect(() => {

    socket.current.emit("reqUser", user._id);

    socket.current.on("getUserId", 
    users => setOnlineUsers(
      user.followings.filter(followingUser => 
        users.some(onlineUser => onlineUser.userId === followingUser._id)
      )
    ));

      console.log(onlineUsers);

  }, [user]);

  // Get Conversations
  useEffect(() => {

    const getConversations = async () => {
      
      const res = await axios.get("/conversations/" + user?._id);

      setConversations(res.data);

    };

    getConversations();

  }, [user._id]);

  // Get messages
  useEffect(() => {

    const getMessages = async () => {

      try {
        
        const res = await axios.get("/messages/" + currentChat?._id);

        setMessages(res.data);

      } catch (err) {
        console.log(err);
      }

    };

    getMessages();

  }, [currentChat]);

  // Submit Message
  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(m => m._id !== user._id);

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      
      const res = await axios.post("/messages", message);

      setMessages([...messages, res.data]);

      setNewMessage("");

    } catch (err) {
      console.log(err);
    }

  };

  // Scroll down to latest message
  useEffect(() => {

    scrollRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages]);

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
            <div className="chatMenuWrapper">
              <input 
                type="text" 
                placeholder='Search for friends!' 
                className="chatMenuInput" 
              />
            {conversations.map(c => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} key={c._id} currentUser={user} />
              </div>
            ))}
            </div>
        </div>
        <div className="chatBox">
            <div className="chatBoxWrapper">
              {
                currentChat ? 
              (
              <>
              <div className="chatBoxTop">
                {messages.map(m => (
                  <div ref={scrollRef}>
                    <Message message={m} own={m.sender === user._id} />
                  </div>
                ))}
              </div>
              <div className="chatBoxBottom">
                <textarea 
                  className='chatMessageInput' 
                  onChange={e => setNewMessage(e.target.value)}
                >
                </textarea>
                <button className="chatSubmitButton" onClick={handleSubmit}>Submit</button>
              </div>
              </>
              )
              :
              (
                <>
                  <span className='noConversationText'>Open a conversation to start a chat!</span>
                </>
              )
              }
            </div>
        </div>
        <div className="chatOnline">
            <div className="chatOnlineWrapper">
              <span className="chatOnlineTitle">Online Friends</span>
              <ChatOnline 
                onlineUsers={onlineUsers} 
                currentUser={user._id} 
                setCurrentChat={setCurrentChat} 
              />
            </div>
        </div>
      </div>
    </>
  )
}
