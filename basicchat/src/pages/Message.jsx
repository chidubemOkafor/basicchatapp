import './Message.css';
import { useState, useEffect, useContext } from 'react';
import io from "socket.io-client"
const socket = io.connect("https://basicchatapp-4bi5.onrender.com:7007")
import { accountData } from '../context/contexts';
import axios from 'axios'
import { FaSearch } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { PiSpinnerGap } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import { useTimeHook } from '../context/useTimeHook';
import { CiMenuKebab } from "react-icons/ci";

function Message() {
    const [yourFriends, setYourFriends] = useState([])
    const [loading, setLoading] = useState(false)
    const { data } = useContext(accountData)
    const [search, setSearch] = useState("")
    const [showFriends, setShowFriends] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [showRoom, setShowRoom] = useState(false)
    const navigate = useNavigate()
    const [lonely, setlonely] = useState(false)
    const [recipientId, setRecipientId] = useState(null)
    const [message, setMessage] = useState("")
    const [displaySenderMEssage, setDisplaySenderMessage] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [messageArray, setMessageArray] = useState([])
    const [typingMessage, setTypingMessage] = useState("")
    const [displayTab, setDisplayTab] = useState(true)

    //==============================================================
    const [userChat, setUSerChat] = useState({
        username: ""
    })
    //==============================================================
    const baseUrl = process.env.REACT_APP_API_URL;
    console.log("this is the baseUrl", baseUrl)
    const url = baseUrl
    const userId = data._id

    const handleGetUser = async () => {
        try {
            if (search === "") {

            }
            setLoading(true)
            const response = await axios.get(`${url}/getUsers/${userId}?searchName=${search}`)
            console.log(response)
            if (response.data.message === "user found") {
                setSearchResults(response.data.data)
            }

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (data._id === undefined) {
            navigate('/login')
        }
    })

    const handleAddFriends = async (friendId) => {
        //userId, friendId
        try {
            const response = await axios.post(`${url}/addFriends/${userId}/${friendId}`)
            console.log(response)
            setlonely(true)
        } catch (error) {
            console.error(error)
        }
    }

    const sendMessage = () => {
        console.log(message)
        setMessageArray(prevMessages => [...prevMessages, { message, isSender: true, timestamp: new Date() }])
        setDisplaySenderMessage(message)
        socket.emit("store_message", { message, recipient_Id: userId, userId: recipientId })
        socket.emit("send_message", { message, recipient_Id: recipientId, userId })
        console.log("this is the recipient's socket ID", recipientId)
        setMessage("")
    }

    console.log("reciepientId:", userId)
    console.log("userId:", recipientId)
    useEffect(() => {
        socket.on("receive_message", (data) => {
            console.log("message has been recieved")
            console.log("message", data)
            setMessageArray(prevMessages => [...prevMessages,
            {
                socket_id: data.socket_id,
                message: data.message.message,
                isSender: false,
                timestamp: new Date()
            }]);
        })
    }, [socket])

    useEffect(() => {
        const getFriends = async () => {
            try {
                const response = await axios.get(`${url}/getFriends/${userId}`)
                if (response.data.message === "success") {
                    console.log(response)
                    setYourFriends(response.data.data)
                }
            } catch (error) {
                if (error.response.data.message === "lonely") {
                    setYourFriends([])
                }
                console.error(error)
            }
        }
        getFriends()
    }, [lonely])

    useEffect(() => {
        const authenticateIo = async () => {
            console.log("hello")
            try {
                socket.emit("authenticate", { userId })
            } catch (error) {
                console.error(error)
            }
        }
        authenticateIo()
    }, [])

    const fetchMessages = async (prop) => {
        try {
            const response = await axios.get(`${url}/getMessage/${prop}/${userId}`)
            console.log("messages365", response.data.data)
            setMessageArray(response.data.data)
        }
        catch (error) {
            console.error(error)
        }
    }



    //"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
    const setChat = (prop) => {
        setUSerChat({ username: prop.username })
        fetchMessages(prop._id)
        setRecipientId(prop._id)
    }

    useEffect(() => {
        socket.on("user_typing", (data) => {
            setTypingMessage(data.message)
        })
    }, [])

    console.log("messageArray:", messageArray)

    return (
        <div className='main_message'>
            {displayTab && <div className='tab_container'>
                <div className={`tab ${showFriends && "on_tab"}`} onClick={
                    () => {
                        setShowFriends(!showFriends);
                    }
                }>friends</div>
                {showFriends && <div className='tab_space'>
                    {yourFriends.length === 0 ? (
                        <p className='center_text'>no friends!</p>
                    ) : (
                        <div className='main_friends_div'>
                            {yourFriends.map((result, index) => (
                                <div className={`user_div ${userChat.username === result.username && 'user_div_action'} ${result.socket_id === "" && "red_background"}`} key={index} onClick={() => setChat(result)}>
                                    <p className={`user_text`}>{result.username}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>}
                <div className={`tab ${showSearch && "on_tab"}`} onClick={() => setShowSearch(!showSearch)}>search</div>
                {showSearch && <div className='tab_space_search'>
                    <input value={search} onChange={(e) => setSearch(e.target.value)} className='search_input' placeholder='search..' />
                    <FaSearch className='search_icon' onClick={handleGetUser} />
                    <div className='content_div'>
                        {loading ? (
                            <PiSpinnerGap className='spinner' />
                        ) : (
                            searchResults.length !== 0 ? (
                                searchResults.map((result, index) => (
                                    <div key={index} className='user_div'>
                                        <p className='user_text'>{result.username}</p>
                                        <IoMdAdd className='add_icon' onClick={() => handleAddFriends(result._id)} />
                                    </div>
                                ))
                            ) : (
                                <p className='center_text'>no user found!</p>
                            )
                        )}

                    </div>
                </div>
                }
                <div className={`tab ${showRoom && "on_tab"}`} onClick={() => setShowRoom(!showRoom)}>Room</div>
                {showRoom && <div className='tab_space2'><p className='center_text'>you are homeless!</p></div>}
            </div>}
            <div className='main_display_div'>
                <div className='username'>{data.username}</div>
                <div className='info'> {userChat.username}
                    <CiMenuKebab className='menu' onClick={() => setDisplayTab(!displayTab)} />
                </div>
                <div className='display'>

                    {messageArray.map(
                        (text, index) =>
                        (
                            <div key={index} className={text.isSender ? 'messageContainer2' : 'messageContainer1'}>
                                <div key={index} className={text.isSender ? `message_bubble` : 'message_bubble2'}>{text.message}</div>
                                <span className='time'>{useTimeHook(text.timestamp)}</span>
                            </div>
                        ))
                    }

                    <div className='user_typing'>{typingMessage}</div>

                </div>
                <div className='input_and_button_div'>
                    <input className='input' placeholder='write something' value={message}
                        onChange={
                            (e) => {
                                setMessage(e.target.value)
                                socket.emit('typing', { username: data.username, recipientId })
                            }
                        }
                        onBlur={() => {
                            socket.emit('stopTyping', { recipientId });
                        }}
                    />
                    <button className='button' onClick={sendMessage}>send</button>
                </div>
            </div>
        </div >
    );
}

export default Message;
