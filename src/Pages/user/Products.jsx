    import React from 'react'
import NavBar from '../../components/user/NavBar/NavBar'
// import ProductBanner from '../../components/user/ProductsBanner/ProductBanner'
// import Recomends from '../../components/user/Recomendation/Recomends'
// import ProductsList from '../../components/user/Products/ProductsList'
// import ProductFooter from '../../components/user/Footer/ProductFooter'
import ProductsGrid from '../../components/user/Products/ProductsGrid'
import Footer from '../../components/user/Footer/Footer'
import MobileBottomNavbar from '../../components/user/NavBar/MobileBottomNavbar'
    
    function  Products() {
      return (
        <div>
            <NavBar/>
            {/* <ProductBanner/>
            <ProductsList/> */}
            <ProductsGrid/>
            <Footer/>
            <MobileBottomNavbar/> 
        </div>
      )
    }
    
    export default Products
    