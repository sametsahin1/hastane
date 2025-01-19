import React, { useState } from 'react';
import axios from 'axios';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    axios.post('/api/auth/register', { username, password })
      .then((res) => {
        alert('Kayıt Başarılı');
        localStorage.setItem('token', res.data.token);
        window.location.href = '/media';
      })
      .catch((err) => {
        alert('Kayıt hatalı: ' + err.response.data.message);
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Kayıt Sayfası</h2>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Kullanıcı Adı: </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Şifre: </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
      </div>
      <button onClick={handleRegister} style={styles.button}>Kayıt Ol</button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  },
  inputGroup: {
    marginBottom: '15px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '16px',
    color: '#555',
  },
  input: {
    maxWidth: '100%',
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
};

export default RegisterPage; 