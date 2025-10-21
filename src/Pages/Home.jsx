import NavBar from "../components/user/NavBar/NavBar";
import Product from '../components/user/Products/ProductsList';
import Footer from "../components/user/Footer/Footer";
function Home() {
  return (
    <div>
      <NavBar />
      <Product/>
      <Footer/>
    </div>
  );
}

export default Home;
