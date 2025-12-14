import React, { useEffect, useState } from "react";
import Details from "../../components/user/ProductDetail/Details";
import Inside from "../../components/user/ProductDetail/Inside";
import Rating from "../../components/user/ProductDetail/Rating";
import ProductCard from "../../components/user/ProductDetail/ProductCard";
import BestPairedWith from "../../components/user/BestPairedWith/BestPairedWith";
import { useParams } from "react-router-dom";
import { getSingleProduct } from "../../Services/Products";
import  Loader from "../../Loader/Loader"
import Footer from "../../components/user/Footer/Footer"
import MobileBottomNavbar from "../../components/user/NavBar/MobileBottomNavbar";

function DetailedView() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Fetching product ID:", id);
        // Assuming getSingleProduct and other services/components are correctly defined externally
        let productData = await getSingleProduct(id);
        console.log("Product data:",productData)
        
        if (!productData) {
          console.error("No product data found for ID:", id);
        }
        setProduct(productData); 

      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]); 

  if (loading) {
    return <Loader/>
  }

  if (!product) {
      return (
        <div className="flex items-center justify-center h-screen text-xl text-gray-600">
            Product details could not be loaded.
        </div>
      );
  }

  // Compute current URL inside render, after loading
  // const currentPageLink = window.location.href;

  return (
    <div className="relative">
      {/* Main Scrollable Content */}
      <Details product={product} /> 
      <BestPairedWith product={product} />
      <Inside product={product}/>
      <Rating product={product}/>
      <ProductCard product={product}/>
      <Footer/>   
      <MobileBottomNavbar/> 
    </div>
  );
}

export default DetailedView;