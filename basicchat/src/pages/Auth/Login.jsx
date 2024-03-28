import React, { useState, useContext, useEffect } from 'react'
import './Auth.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import { accountData } from '../../context/contexts'

const Login = () => {
    const navigate = useNavigate()
    const { data, setData } = useContext(accountData)
    const [error, setError] = useState("")
    const [userData, setUserData] = useState({
        username: "",
        password: ""
    })

    const url = process.env.REACT_DEPLOYMENT_TYPE === "production" ? "https://basicchatapp-server.onrender.com/api/v1" : "http://localhost:7007/api/v1"

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${url}/login`, { username: userData.username, password: userData.password })
            if (response.data.message === "login success") {
                setData(response.data.data)
                setTimeout(() => {
                    navigate('/message')
                }, 4000)
            }
        } catch (error) {
            if (error.response.data.message === "incorrect pasword") {
                setError("incorrect pasword")
            }

            if (error.response.data.message === "account not found") {
                setError("account not found")
            }

            console.error(error)
        }
    }

    useEffect(() => {
        setError("")
    }, [userData.password, userData.username])

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }
    return (
        <div>
            <form className='form' onSubmit={handleLogin}>
                {Object.keys(data).length !== 0 && <div style={{ color: "green" }}>LOGIN SUCCESSFUL</div>}
                {error === "incorrect pasword" && <div style={{ color: "red" }}>INCORRECT PASSWORD</div>}
                {error === "account not found" && <div style={{ color: "red" }}>ACCOUNT DOES NOT EXISTS</div>}
                <p>LOGIN TO YOUR ACCOUNT!</p>
                <input className='input2' placeholder='your name should be here' name="username" value={userData.username} onChange={handleChange} />
                <input type='password' className='input2' placeholder='password != "password"' name="password" value={userData.password} onChange={handleChange} />
                <button type='submit'>Login</button>
                <Link to={'/signup'}>signup</Link>
            </form>
        </div>
    )
}

export default Login
