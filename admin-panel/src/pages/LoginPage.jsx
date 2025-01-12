import React, { useState } from 'react';
import axios from 'axios';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    axios.post('http://localhost:3000/auth/login', { username, password })
      .then((res) => {
        alert('Giriş Başarılı');
        // Token'ı localStorage'a koyalım
        localStorage.setItem('token', res.data.token);
        window.location.href = '/media'; // media sayfasına yönlendirebiliriz
      })
      .catch((err) => {
        alert('Giriş hatalı: ' + err.response.data.message);
      });
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Login Sayfası</h2>
      <div>
        <label>Kullanıcı Adı: </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginRight: '10px' }}
        />
      </div>
      <div>
        <label>Şifre: </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginRight: '10px' }}
        />
      </div>
      <button onClick={handleLogin}>Giriş</button>
    </div>
  );
}

export default LoginPage;
