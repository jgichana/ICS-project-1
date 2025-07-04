import React from 'react';
import '../App.css';
import {Link} from 'react-router-dom';

const Hero=() =>{
    return(
            <div className='homepage'>
        <div className='hero container'>
            
        <div className='hero-text'>
            <h1> Find Quality Furniture at Student-Friendly Prices</h1>
            <p>Welcome to Strathmore’s Furniture Marketplace,
            for students to easily buy and sell furniture.<br/>
            Whether you’re furnishing your hostel room or looking to declutter,<br/>
            find affordable, quality pieces right here on campus.</p>
            <Link to ="/products">
            <button className='btn'>Shop Now </button>
            </Link>
        </div>
        </div>
    </div>
    )

}

export default Hero;