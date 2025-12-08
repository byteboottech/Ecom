import MobileBottomNavbar from '../NavBar/MobileBottomNavbar';
import Navbar from '../NavBar/NavBar'; // Adjusted for consistency—verify your structure
import Wishlist from './Wishlist';
import Footer from '../Footer/Footer'; // Adjusted similarly

const WishlistPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        <Wishlist />
        <Footer />
      </main>
      <MobileBottomNavbar />
    </div>
  );
};

export default WishlistPage;