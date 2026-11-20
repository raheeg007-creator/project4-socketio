//
import { useState, useEffect } from 'react';
import axios from 'axios';
// استيراد Link من react-router-dom للتنقل بين الصفحات
import { Link } from 'react-router-dom';
// تعريف مكون معرض الصور
export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [isGridView, setIsGridView] = useState(true); 

  useEffect(() => {
    axios.get('/api/photos').then(res => setPhotos(res.data)).catch(console.error);
  }, []);

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* الهيدر وزرار التبديل */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Photo Gallery</h1>
        <button 
          onClick={() => setIsGridView(!isGridView)}
          style={{ 
            padding: '10px 20px', 
            background: '#333', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Switch to {isGridView ? 'List' : 'Grid'} View
        </button>
      </div>

      {/* حاوية الصور */}
      <div style={{ 
        display: isGridView ? 'grid' : 'flex', 
        gridTemplateColumns: isGridView ? 'repeat(auto-fill, minmax(280px, 1fr))' : 'none', 
        flexDirection: 'column',
        gap: '25px' 
      }}>
        {photos.map(photo => (
          <div 
            key={photo._id} 
            style={{ 
              border: '1px solid #e0e0e0', 
              padding: '15px', 
              borderRadius: '10px', 
              background: '#fff', 
              display: 'flex', 
              flexDirection: isGridView ? 'column' : 'row', 
              gap: '20px', 
              alignItems: isGridView ? 'stretch' : 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}
          >
            <Link to={`/photos/${photo._id}`} style={{ width: isGridView ? '100%' : '250px', flexShrink: 0 }}>
              <img 
                src={`/uploads/${photo.fileName}`} 
                alt={photo.title} 
                style={{ 
                  width: '100%', 
                  height: isGridView ? '220px' : '160px', 
                  objectFit: 'cover', 
                  borderRadius: '8px' 
                }} 
              />
            </Link>
            
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Link to={`/photos/${photo._id}`} style={{ textDecoration: 'none', color: '#222' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>{photo.title}</h3>
              </Link>
              <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Uploaded by: {photo.userId?.firstName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}