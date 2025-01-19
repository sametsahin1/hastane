import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ScreensPage() {
  const [screenName, setScreenName] = useState('');
  const [location, setLocation] = useState('');
  const [screens, setScreens] = useState([]);

  useEffect(() => {
    fetchScreens();
  }, []);

  const fetchScreens = async () => {
    try {
      const response = await axios.get('/api/screens');
      setScreens(response.data);
    } catch (error) {
      console.error('Ekran listesi alınırken hata:', error);
    }
  };

  const addScreen = async () => {
    try {
      await axios.post('/api/screens', {
        name: screenName,
        location: location,
        status: 'active'
      });
      setScreenName('');
      setLocation('');
      fetchScreens();
    } catch (error) {
      console.error('Ekran ekleme hatası:', error);
    }
  };

  const handleDeleteScreen = async (screenId) => {
    try {
      await axios.delete(`/api/screens/${screenId}`);
      fetchScreens(); // Silme işleminden sonra listeyi güncelle
    } catch (error) {
      console.error('Ekran silme hatası:', error);
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Ekran Ekleme/Listeme</h2>
      <div className='input-screen-container'>
        <input
          className='input-screen-name'
          placeholder="Ekran Adı"
          value={screenName}
          onChange={(e) => setScreenName(e.target.value)}
        />
        <input
          className='input-screen-name'
          placeholder="Lokasyon"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button className='input-screen-button' onClick={addScreen}>Ekle</button>
      </div>
      <h3>Tüm Ekranlar</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Ad</th>
            <th>Lokasyon</th>
            <th>Mevcut Playlist</th>
            <th>İşlemler</th>
            <th>Önizleme</th>
          </tr>
        </thead>
        <tbody>
          {screens.map(screen => (
            <tr key={screen._id}>
              <td>{screen.name}</td>
              <td>{screen.location}</td>
              <td>{screen.currentPlaylist ? screen.currentPlaylist.name : 'Atanmamış'}</td>
              <td>
                <button className='input-screen-buttonared'
                  onClick={() => handleDeleteScreen(screen._id)}
                  style={styles.deleteButton}
                >
                  Sil
                </button>
              </td>
              <td>
                <Link className='input-screen-buttona' to={`/preview/${screen._id}`}>Önizle</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default ScreensPage;
