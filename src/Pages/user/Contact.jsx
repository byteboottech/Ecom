import React from 'react'
import ContactCard from "../user/ContactCard"
import Navbar from "../../components/user/NavBar/NavBar"
import Footer from "../../components/user/Footer/Footer"
import MobileBottomNavbar from '../../components/user/NavBar/MobileBottomNavbar'
function ContactPage() {
  return (
    <div>
      <Navbar/>
     <ContactCard/>
     <Footer/>
     <MobileBottomNavbar/>
    </div>
  )
}

export default ContactPage