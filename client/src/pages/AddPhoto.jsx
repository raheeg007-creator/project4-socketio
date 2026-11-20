
import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AddPhoto() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    try {
      // بنبعت الـ user._id عشان الباك إند يعرف مين اللي بيرفع
      await axios.post('/api/photos', formData, {
        headers: { 'x-user-id': user._id }
      });
      alert('Photo uploaded successfully!');
      navigate('/gallery'); // نروح للمعرض بعد الرفع
    } catch (err) {
      alert('Error uploading photo');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Upload New Photo</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Photo Title" onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
        <button type="submit" style={{ padding: '10px', background: 'green', color: 'white' }}>Upload</button>
      </form>
    </div>
  );
}