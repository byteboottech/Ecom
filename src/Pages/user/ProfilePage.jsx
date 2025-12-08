import React from 'react'
import ModernNavbar from '../../components/user/NavBar/NavBar'
import Profile from '../../components/user/Profile/Profile'
import Footer from '../../components/user/Footer/Footer'
import MobileBottomNavbar from '../../components/user/NavBar/MobileBottomNavbar'

function ProfilePage() {
  return (
<>
    <ModernNavbar/>
    <Profile/>
    <Footer/>
    <MobileBottomNavbar/>
</>
  )
}

export default ProfilePage
