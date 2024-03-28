import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import io from 'socket.io-client'
import { accountData } from '../../context/contexts'
import { useNavigate } from 'react-router-dom'

const socket = io.connect(process.env.REACT_DEPLOYMENT_TYPE == "production" ? "https://basicchatapp-server.onrender.com" : "http://localhost:7007")

const Signup = () => {
    const navigate = useNavigate()
    const { data, setData } = useContext(accountData)
    const [error, setError] = useState("")
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: ""
    })

    const url = process.env.REACT_DEPLOYMENT_TYPE == "production" ? "https://basicchatapp-server.onrender.com/api/v1" : "http://localhost:7007/api/v1"
    const handleSignup = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${url}/createAccount`, {
                username: userData.username,
                email: userData.email,
                password: userData.password,
                socket_id: socket.id
            })
            if (response.data.message === "user saved") {
                setData(response.data.data)
                setTimeout(() => {
                    navigate('/message')
                }, 4000)
            }
            console.log(response)
        } catch (error) {
            if (error.response.data.message === "email already exists") {
                setError("email error")
            }

            if (error.response.data.message === "user already exists") {
                setError("username error")
            }

            console.error(error)
        }
    }

    useEffect(() => {
        setError("")
    }, [userData.email, userData.username])

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }
    return (
        <div>
            <form className='form' onSubmit={handleSignup}>
                {Object.keys(data).length !== 0 && <div style={{ color: "green" }}>ACCOUNT CREATED</div>}
                {error === "email error" && <div style={{ color: "red" }}>EMAIL EXISTS</div>}
                {error === "username error" && <div style={{ color: "red" }}>USERNAME EXISTS</div>}
                <p>CREATE YOUR BASIC CHAT ACCOUNT!</p>
                <input className='input2' name="username" placeholder='your name should be here' value={userData.username} onChange={handleChange} />
                <input className='input2' name="email" type='email' placeholder='rick@gmail.com' value={userData.email} onChange={handleChange} />
                <input type='password' name="password" className='input2' placeholder='password != "password"' value={userData.password} onChange={handleChange} />
                <button type='submit'>Signup</button>
                <Link to={'/login'}>login</Link>
            </form>
        </div>
    )
}

export default Signup
