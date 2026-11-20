import{Link} from 'react-router-dom';
export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Alzikrayat </h1>
      <p>Share your beautiful memories with the world.</p>
      <Link to="/Gallery">
        <button style={{ padding: '10px 20px', fontSize: '16px' }}>Explore Gallery</button>
      </Link>
    </div>
  );
}