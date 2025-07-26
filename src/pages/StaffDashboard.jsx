import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';

export default function StaffDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name),
          suppliers(name)
        `)
        .order('name');
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      setError('Failed to load products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 32 }}>Loading...</div>;
  if (error) return <div style={{ padding: 32, color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: 32 }}>
      <h1>Staff Dashboard</h1>
      <p>Welcome! You can view inventory items below.</p>
      
      <div style={{ marginTop: 24 }}>
        <h2>Inventory Items</h2>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  padding: 16,
                  backgroundColor: product.quantity <= product.threshold ? '#fff3cd' : '#fff'
                }}
              >
                <h3 style={{ margin: '0 0 8px 0', color: '#153A6B' }}>{product.name}</h3>
                <p style={{ margin: '4px 0', fontSize: 14, color: '#666' }}>SKU: {product.sku}</p>
                <p style={{ margin: '4px 0', fontSize: 14, color: '#666' }}>
                  Category: {product.categories?.name || 'N/A'}
                </p>
                <p style={{ margin: '4px 0', fontSize: 14, color: '#666' }}>
                  Supplier: {product.suppliers?.name || 'N/A'}
                </p>
                <div style={{ 
                  marginTop: 12, 
                  padding: '8px 12px', 
                  backgroundColor: product.quantity <= product.threshold ? '#f8d7da' : '#d1ecf1',
                  borderRadius: 4,
                  color: product.quantity <= product.threshold ? '#721c24' : '#0c5460'
                }}>
                  <strong>Quantity: {product.quantity}</strong>
                  {product.quantity <= product.threshold && (
                    <span style={{ marginLeft: 8, fontSize: 12 }}>⚠️ Low Stock</span>
                  )}
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: 14, color: '#666' }}>
                  Unit Price: ${product.unit_price}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 