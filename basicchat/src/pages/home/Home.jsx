import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import './Home.css'

const Home = () => {
    return (
        <div>
            <Navbar />
            <h1 className='main_header'>BASIC CHAT</h1>
            <h2>created by <a href='https://github.com/chidubemOkafor' className='link'>@chidubem</a></h2>
        </div>
    )
}

export default Home
