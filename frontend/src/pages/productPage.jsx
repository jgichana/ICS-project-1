// src/components/ProductListPage.js
import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import bedImage from '../assets/Beds.jpg';
import sofaImage from '../assets/sofas.jpg';
import deskImage from '../assets/Desktable.jpg';
import dinnerTableImage from '../assets/Dinnertable.jpg';
import lampShadeImage from '../assets/Lampshade.jpg';
import tvImage from '../assets/Tv.jpg';
import { useCart } from './CartContext';


function ProductListPage({isLoggedIn}) {
  const [products, setProducts] = useState([]);
  const[searchTerm, setSearchTerm]=useState('');
  const {addToCart}=useCart();
  

  const sampleProducts=[
{
    id:1,
    name:"Bed",
    description: "A comfortable bed for a good night's sleep.",
    category:'Beds',
    price:7000,
    image_url:bedImage,
    seller:{
      name:'Diana Lembo',
      phone:'0748869905',
      email:'rehema.lembo@strathmore.edu',
    },
  },
    {
    id:2,
    name:"Sofa",
    description: "A stylish sofa for your living room",
     category:"Sofa",
    price:20000,
    image_url:sofaImage,
    seller:{
      name:'Chantal Bahige',
      phone:'0746184144',
      email:'chantal.abamwinja@strathmore.edu',
    },
  },
    {
    id:3,
    name:"Desktable",
      category:'Table',
    description: "A functional desk for your workspace.",
    price:7000,
    image_url:deskImage,
    seller:{
      name:'Zandy Kanani',
      phone:'0743183613',
      email:'narcisse.kanani@strathmore.edu',
    }
  },
    {
    id:4,
    name:"Dinnertable",
    description: "A spacious dining table for family meals",
     category:'Table',
    price:25000,
    image_url:dinnerTableImage,
    seller:{
      name:'Joan Gichana',
      phone:'0114978709',
      email:'joan.gichana@strathmore.edu',
    }
  },
    {
    id:5,
    name:"Lampshade",
    description: "A beautiful lampshade to brighten your room ",
     category:'Lampshade',
    price:5000,
    image_url:lampShadeImage,
    seller:{
      name:'Bernice Borauzima',
      phone:'0115621170',
      email:'bernice.borauzima@strathmore.edu',
    },
  },
    {
    id:6,
    name:"Tv",
    description: "A high-definition Tv for your entertainment.",
     category:'Tv',
    price:35000,
    image_url:tvImage,
    seller:{
      name:'Annelisse Zozo',
      phone:'0719298410',
      email:'akonkwa.zozo@strathmore.edu',
    },

  },
]

const filteredProducts=products.filter(product=>
  product.category.toLowerCase().includes(searchTerm.toLowerCase())
);

useEffect(()=>{
  setProducts(sampleProducts);
},[]);
 
  return (
    <div className="buyer-container">
      <h2>Available Products</h2>
      <input type='text'
      placeholder='Search by category...'
      value={searchTerm}
      onChange={(e)=> setSearchTerm(e.target.value)}
      className='search-bar' />
      <div className="product-list">
        {filteredProducts.length>0 ? (
        filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <img
              src={product.image_url}
              alt={product.name}
            />
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <p><strong>category:{product.category}</strong></p>
            <p><strong>KES{product.price}</strong></p>
            {isLoggedIn?(
              <div>
                <button className='btn' onClick={()=> addToCart(product)}>Add to Cart</button>
                <p>Seller:{product.seller.name}</p>
                <p>Contact:{product.seller.phone}</p>
                <p>Email:{product.seller.email}</p>
              </div>
            ):(
              <Link to="/login" className='btn'>Login to Purchase</Link>
            ) 
            }
          </div>
        ))
      ):(
        <p>No products found</p>
      )}
      </div>
    </div>
  );
}

export default ProductListPage;
