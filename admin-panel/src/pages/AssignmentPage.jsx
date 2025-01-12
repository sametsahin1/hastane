import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AssignmentPage() {
  const [screens, setScreens] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState('');

  useEffect(() => {
    fetchScreens();
    fetchPlaylists();
  }, []);

  const fetchScreens = async () => {
    try {
      const response = await axios.get('http://localhost:3000/screens');
      setScreens(response.data);
    } catch (error) {
      console.error('Ekranlar yüklenirken hata:', error);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('http://localhost:3000/playlists');
      setPlaylists(response.data);
    } catch (error) {
      console.error('Playlistler yüklenirken hata:', error);
    }
  };

  const handleAssignment = async () => {
    if (!selectedScreen || !selectedPlaylist) {
      alert('Lütfen ekran ve playlist seçin');
      return;
    }

    try {
      await axios.post('http://localhost:3000/assignments', {
        screenId: selectedScreen,
        playlistId: selectedPlaylist
      });
      
      alert('Atama başarıyla yapıldı');
      fetchScreens(); // Ekranları yenile
    } catch (error) {
      console.error('Atama yapılırken hata:', error);
      alert('Atama yapılırken bir hata oluştu');
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Ekran-Playlist Atama</h2>
      <div style={styles.form}>
        <div style={styles.formGroup}>
          <label>Ekran Seçin:</label>
          <select 
            value={selectedScreen}
            onChange={(e) => setSelectedScreen(e.target.value)}
            style={styles.select}
          >
            <option value="">Seçin...</option>
            {screens.map(screen => (
              <option key={screen._id} value={screen._id}>
                {screen.name} {screen.currentPlaylist ? `(Mevcut: ${screen.currentPlaylist.name})` : '(Atanmamış)'}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label>Playlist Seçin:</label>
          <select 
            value={selectedPlaylist}
            onChange={(e) => setSelectedPlaylist(e.target.value)}
            style={styles.select}
          >
            <option value="">Seçin...</option>
            {playlists.map(playlist => (
              <option key={playlist._id} value={playlist._id}>
                {playlist.name}
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={handleAssignment}
          style={styles.button}
        >
          Ata
        </button>
      </div>
    </div>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '500px',
    margin: '20px 0'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  select: {
    padding: '8px',
    fontSize: '16px'
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default AssignmentPage;
