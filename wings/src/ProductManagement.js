import React, { useState, useEffect } from 'react';
import './App.css';

// Removed the incorrect import of ProductManagement
// import ProductManagement from './ProductManagement'; // This should be removed

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
  },
  formContainer: {
    flex: '1',
    maxWidth: '600px',
    marginRight: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#e9f5ff',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
  },
  formHeader: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#0056b3',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginBottom: '10px',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  imagePreview: {
    width: '100%',
    maxHeight: '200px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  manageButton: {
    padding: '8px',
    margin: '5px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    color: 'white',
  },
  addButton: {
    backgroundColor: '#28a745',
  },
  sellButton: {
    backgroundColor: '#ffc107',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
};

// ProductForm Component
const ProductForm = ({ onSubmit, errorMessage, successMessage }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, category, price, quantity, image });
    // Reset form fields
    setName('');
    setDescription('');
    setCategory('');
    setPrice('');
    setQuantity('');
    setImage(null);
    setPreview(null);
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.formHeader}>Product Management</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} required />
        </label>
        <label style={styles.label}>Description:
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} style={styles.input} required />
        </label>
        <label style={styles.label}>Category:
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input} required />
        </label>
        <label style={styles.label}>Price:
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={styles.input} required min="0" />
        </label>
        <label style={styles.label}>Quantity:
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} style={styles.input} required min="0" />
        </label>
        <label style={styles.label}>Product Image:
          <input type="file" onChange={handleImageChange} style={styles.input} required />
        </label>
        {preview && <img src={preview} alt="Preview" style={styles.imagePreview} />}
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Save Product
        </button>
      </form>
    </div>
  );
};

// ExistingProducts Component
const ExistingProducts = ({ products, onAddStock, onSell, onDelete }) => {
  return (
    <div style={{ flex: '1', marginLeft: '20px' }}>
      <h3>Manage Existing Products</h3>
      {products.map((product) => (
        <div key={product.product_id} style={{ marginBottom: '20px' }}>
          <h4>{product.name}</h4>
          <p>{product.description}</p>
          <p>Category: {product.category_name}</p>
          <p>Price: R{product.price}</p>
          <p>Stock: {product.quantity}</p>
          {product.image && <img src={product.image} alt="Product" style={styles.imagePreview} />}
          <button
            onClick={() => onAddStock(product.product_id)}
            style={{ ...styles.manageButton, ...styles.addButton }}
          >
            Add Stock
          </button>
          <button
            onClick={() => onSell(product.product_id)}
            style={{ ...styles.manageButton, ...styles.sellButton }}
          >
            Sell
          </button>
          <button
            onClick={() => onDelete(product.product_id)}
            style={{ ...styles.manageButton, ...styles.deleteButton }}
          >
            Delete Product
          </button>
        </div>
      ))}
    </div>
  );
};

// Main ProductManagement component
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products.');
      }
    };
    fetchProducts();
  }, []);

  const handleProductSubmit = async (productData) => {
    setError('');
    setSuccess('');

    const { name, description, category, price, quantity, image } = productData;

    if (!name || !description || !category || price === '' || quantity === '' || !image) {
      setError('Please fill in all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category_name', category);
    formData.append('price', parseFloat(price));
    formData.append('quantity', parseInt(quantity));
    formData.append('image', image);

    try {
      const existingProductIndex = products.findIndex(product => product.name === name);
      if (existingProductIndex >= 0) {
        const updatedProduct = {
          ...products[existingProductIndex],
          quantity: products[existingProductIndex].quantity + parseInt(quantity),
          description,
          category_name: category,
          price: parseFloat(price),
        };

        const response = await fetch(`http://localhost:5000/api/products/${products[existingProductIndex].product_id}`, {
          method: 'PUT',
          body: JSON.stringify(updatedProduct),
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          setProducts(prevProducts => 
            prevProducts.map((p, index) => index === existingProductIndex ? updatedProduct : p)
          );
          setSuccess('Product updated successfully.');
        } else {
          setError('Failed to update the product. Please try again.');
        }
      } else {
        const response = await fetch('http://localhost:5000/api/products', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const newProduct = await response.json();
          setProducts(prevProducts => [...prevProducts, newProduct]);
          setSuccess('Product added successfully.');
        } else {
          setError('Failed to add the product. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setProducts(prevProducts => prevProducts.filter(product => product.product_id !== id));
          setSuccess('Product deleted successfully.');
        } else {
          setError('Failed to delete the product. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete the product. Please try again.');
      }
    }
  };

  const handleAddStock = async (id) => {
    const quantityToAdd = parseInt(prompt('Enter quantity to add:'));
    if (!isNaN(quantityToAdd) && quantityToAdd > 0) {
      const product = products.find(p => p.product_id === id);
      const updatedQuantity = product.quantity + quantityToAdd;
      const updatedProduct = { ...product, quantity: updatedQuantity };

      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: updatedQuantity }),
        });

        if (response.ok) {
          setProducts(prevProducts => 
            prevProducts.map(p => (p.product_id === id ? updatedProduct : p))
          );
          setSuccess('Stock added successfully.');
        } else {
          setError('Failed to add stock. Please try again.');
        }
      } catch (error) {
        console.error('Error adding stock:', error);
        setError('An unexpected error occurred. Please try again.');
      }
    } else {
      alert('Please enter a valid positive quantity.');
    }
  };

  const handleSell = async (id) => {
    const quantityToSell = parseInt(prompt('Enter quantity to sell:'));
    if (!isNaN(quantityToSell) && quantityToSell > 0) {
      const product = products.find(p => p.product_id === id);
      if (product && product.quantity >= quantityToSell) {
        try {
          const updatedQuantity = product.quantity - quantityToSell;
          const updatedProduct = { ...product, quantity: updatedQuantity };

          const response = await fetch(`http://localhost:5000/api/products/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: updatedQuantity }),
          });

          if (response.ok) {
            setProducts(prevProducts => 
              prevProducts.map(p => (p.product_id === id ? updatedProduct : p))
            );
            setSuccess('Stock sold successfully.');
          } else {
            setError('Failed to sell stock. Please try again.');
          }
        } catch (error) {
          console.error('Error selling stock:', error);
          setError('An unexpected error occurred. Please try again.');
        }
      } else {
        alert('Insufficient stock to sell this amount.');
      }
    } else {
      alert('Please enter a valid positive quantity.');
    }
  };

  return (
    <div style={styles.container}>
      <ProductForm onSubmit={handleProductSubmit} errorMessage={error} successMessage={success} />
      <ExistingProducts products={products} onAddStock={handleAddStock} onSell={handleSell} onDelete={handleDelete} />
    </div>
  );
};

export default ProductManagement;