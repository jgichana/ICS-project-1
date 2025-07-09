import React from 'react';
import '../App.css';
import {Link} from 'react-router-dom';

const Hero=() =>{
    return(
            <div className='homepage'>
        <div className='hero container'>
            
        <div className='hero-text'>
            <h1> Buy or Sell Your Second Hand Furniture</h1>
            <p>Welcome to Strathmore’s Furniture Marketplace,
             for students to easily declutter and acquire used furniture.<br/>
            </p>
            <Link to ="/products">
            <button className='btn'>Shop Now </button>
            </Link>
        </div>
        </div>
    </div>
    )

}

export default Hero;