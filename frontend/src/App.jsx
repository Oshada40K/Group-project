import React from 'react'
import { Routes,Route } from 'react-router-dom'

import Collection from './Pages/Collection'
import About from './Pages/About'
import Contact from './Pages/Contact'
import Product from './Pages/Product'
import Cart from './Pages/Cart'
import Login from './Pages/Login'
import PlaceOrder from './Pages/PlaceOrder'
import Order from './Pages/Order'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import { Footer } from './Components/Footer'
import Searchbar from './Components/Searchbar'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px[7vw] lg:px[9vw]'>

      <Navbar/>
      <Searchbar/>
      <Routes>

    <Route path='/' element={<Home />} />
    <Route path='/collection' element={<Collection/>}/>
    <Route path='/about' element={<About/>}/>
    <Route path='/contact' element={<Contact/>}/>
    <Route path='/product/:productId'  element={<Product/>}/>
    <Route path='/cart' element={<Cart/>} />
    <Route path='/login' element={<Login/>} />
    <Route path='/place-orders' element={<PlaceOrder/>} />
    <Route path='/orfers' element={<Order/>} />

      </Routes>
      <Footer/>

    </div>
  )
}

export default App