import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className='navbar'>
            <div className='login_link'><Link to={'/login'}>LOGIN</Link></div>
            <div className='signin_link'><Link to={'/signup'}>SIGNUP</Link></div>
        </div>
    )
}

export default Navbar
