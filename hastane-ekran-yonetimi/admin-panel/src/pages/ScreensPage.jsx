import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ScreenPage() {
  const [screenName, setScreenName] = useState('');
  const [location, setLocation] = useState('');
  const [screens, setScreens] = useState([]);

  useEffect(() => {
    fetchScreens();
  }, []);

  const fetchScreens = () => {
    axios.get('http://localhost:3000/screens')
      .then(res => setScreens(res.data))
      .catch(err => console.error(err));
  };

  const addScreen = () => {
    axios.post('http://localhost:3000/screens', { screenName, location })
      .then(res => {
        alert('Ekran eklendi');
        setScreenName('');
        setLocation('');
        fetchScreens();
      })
      .catch(err => console.error(err));
  };

  const toggleActive = (id, currentActive) => {
    axios.put(`http://localhost:3000/screens/${id}`, {
      isActive: !currentActive
    })
      .then(res => {
        alert('Ekran güncellendi');
        fetchScreens();
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Ekran Ekleme/Listeme</h2>
      <div>
        <input
          placeholder="Ekran Adı"
          value={screenName}
          onChange={(e) => setScreenName(e.target.value)}
        />
        <input
          placeholder="Lokasyon"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={addScreen}>Ekle</button>
      </div>
      <hr />
      <h3>Tüm Ekranlar</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Ad</th>
            <th>Lokasyon</th>
            <th>Aktif Mi</th>
            <th>Değiştir</th>
          </tr>
        </thead>
        <tbody>
          {screens.map(s => (
            <tr key={s._id}>
              <td>{s.screenName}</td>
              <td>{s.location}</td>
              <td>{s.isActive ? 'Evet' : 'Hayır'}</td>
              <td>
                <button onClick={() => toggleActive(s._id, s.isActive)}>
                  Aktif/Pasif Değiştir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScreenPage;
