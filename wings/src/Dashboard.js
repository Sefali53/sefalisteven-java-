import React, { useEffect, useState } from 'react';

// Import images from the src/images directory
import Aimages from './images/A.jpg';
import Bimages from './images/B.jpg';
import Cimages from './images/C.jpg';
import Dimages from './images/D.jpg';
import Eimages from './images/E.jpg';
import Fimages from './images/F.jpg';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of images and their corresponding prices
  const images = [Aimages, Bimages, Cimages, Dimages, Eimages, Fimages];
  const prices = [100, 200, 150, 250, 300, 180, 220];

  // Function to change images
  const changeImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Rotate images every 3 seconds
  useEffect(() => {
    const interval = setInterval(changeImage, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Fetch products from the API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Products not found.');
        }
        throw new Error('Failed to fetch products. Network response was not ok.');
      }
      const data = await response.json();
      const formattedProducts = data.map(product => ({
        ...product,
        price: parseFloat(product.price) || 0,
      }));
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Styling for the component
  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
      textAlign: 'center',
      marginBottom: '10px',
      color: '#2c3e50',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
    },
    th: {
      border: '1px solid #ddd',
      padding: '12px 15px',
      backgroundColor: '#3498db',
      color: 'white',
      textAlign: 'left',
      fontWeight: 'bold',
    },
    td: {
      border: '1px solid #ddd',
      padding: '12px 15px',
      textAlign: 'left',
      backgroundColor: '#ecf0f1',
    },
    img: {
      width: '150px',  // Image size
      height: '150px',
      objectFit: 'cover',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    imgCWrapper: {
      width: '150px',
      height: '150px',
      backgroundColor: '#e74c3c', // Background color for Image C
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '5px', // Optional padding for aesthetics
    },
    error: {
      color: '#e74c3c',
      textAlign: 'center',
      margin: '20px 0',
    },
    loading: {
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#3498db',
    },
    noProducts: {
      textAlign: 'center',
      fontStyle: 'italic',
      color: '#7f8c8d',
    },
    carousel: {
      textAlign: 'center',
      marginTop: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Product Dashboard</h1>
      <h2 style={styles.title}>Current Products</h2>

      {loading && <p style={styles.loading}>Loading products...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {!loading && products.length === 0 && <p style={styles.noProducts}>No products available.</p>}

      {products.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.product_id}>
                <td style={styles.td}>
                  {product.image ? (
                    index === 2 ? (
                      <div style={styles.imgCWrapper}>
                        <img 
                          src={`http://localhost:5000${product.image}`} 
                          alt={product.name} 
                          style={styles.img} 
                        />
                      </div>
                    ) : (
                      <img 
                        src={`http://localhost:5000${product.image}`} 
                        alt={product.name} 
                        style={styles.img} 
                      />
                    )
                  ) : (
                    'No Image'
                  )}
                </td>
                <td style={styles.td}>{product.name}</td>
                <td style={styles.td}>{product.description}</td>
                <td style={styles.td}>{product.category_name}</td>
                <td style={styles.td}>
                  {new Intl.NumberFormat('en-ZA', {
                    style: 'currency',
                    currency: 'ZAR',
                  }).format(product.price)}
                </td>
                <td style={styles.td}>{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Image Carousel */}
      <section className="image-carousel" style={styles.carousel}>
        <h3>Featured Products</h3>
        <img src={images[currentImageIndex]} alt="Product" style={{ width: '150px', height: '150px', borderRadius: '8px' }} />
        <p style={{ fontWeight: 'bold', marginTop: '10px', fontSize: '1.5em', color: '#333' }}>
          Price: R{prices[currentImageIndex].toFixed(2)}
        </p>
      </section>
    </div>
  );
};

export default Dashboard;