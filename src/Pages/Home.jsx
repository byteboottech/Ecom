import NavBar from "../components/user/NavBar/NavBar";
import Product from '../components/user/Products/ProductsList';
import Footer from "../components/user/Footer/Footer";
import OffersSection from "../components/user/OfferSection";
function Home() {
  return (
    <div>
      <NavBar />
      <OffersSection/>
      <Product/>
      <Footer/>
    </div>
  );
}

export default Home;
