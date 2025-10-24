// CategoryProductListPage.jsx
import React from 'react';
import { useSearchParams } from 'react-router-dom'; // To read query params
// import { Navbar, ThemeProvider } from '@material-tailwind/react'; // Import ThemeProvider
import Navbar from '../../components/user/NavBar/NavBar'
import CategoryProductList from '../../components/user/Products/CategoryProductList'; // Adjust path as needed
import Footer from '../../components/user/Footer/Footer'; // Adjust path as needed (assuming it exists)

function CategoryProductListPage() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')) : null;
  const categoryName = searchParams.get('categoryName') || null;
  const category = categoryId ? { id: categoryId, name: categoryName } : null;

  return (
      <div>
        <Navbar/>
        <CategoryProductList category={category} />
        <Footer/>
      </div>
  );
}

export default CategoryProductListPage;