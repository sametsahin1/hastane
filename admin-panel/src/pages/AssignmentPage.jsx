import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notification from '../components/Notification';
import { useNavigate } from 'react-router-dom';

function AssignmentPage() {
  const [screens, setScreens] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchScreens();
    fetchPlaylists();
  }, []);

  const fetchScreens = async () => {
    try {
      const response = await axios.get('/api/screens');
      setScreens(response.data);
    } catch (error) {
      console.error('Ekran listesi alınırken hata:', error);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('/api/playlists');
      setPlaylists(response.data);
    } catch (error) {
      console.error('Playlist listesi alınırken hata:', error);
    }
  };

  const handleScreenSelect = (screenId) => {
    setSelectedScreens(prevSelected =>
      prevSelected.includes(screenId)
        ? prevSelected.filter(id => id !== screenId)
        : [...prevSelected, screenId]
    );
  };

  const assignPlaylistToSelectedScreens = async () => {
    if (!selectedPlaylist) {
      alert('Lütfen bir playlist seçin');
      return;
    }

    try {
      await Promise.all(selectedScreens.map(screenId =>
        axios.put(`/api/screens/${screenId}`, {
          currentPlaylist: selectedPlaylist
        })
      ));
      setNotification('Playlist başarıyla atandı');
      fetchScreens();
    } catch (error) {
      console.error('Playlist atama hatası:', error);
    }
  };

  const assignPlaylistToAllScreens = async () => {
    if (!selectedPlaylist) {
      alert('Lütfen bir playlist seçin');
      return;
    }

    try {
      await Promise.all(screens.map(screen =>
        axios.put(`/api/screens/${screen._id}`, {
          currentPlaylist: selectedPlaylist
        })
      ));
      setNotification('Playlist tüm ekranlara başarıyla atandı');
      fetchScreens();
    } catch (error) {
      console.error('Playlist atama hatası:', error);
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Ekran-Playlist Atama</h2>
      <div style={styles.selector}>
        <h3>Playlist Seç</h3>
        <select
          onChange={(e) => setSelectedPlaylist(e.target.value)}
          value={selectedPlaylist}
          style={styles.select}
        >
          <option value="">Playlist seçin...</option>
          {playlists.map(playlist => (
            <option key={playlist._id} value={playlist._id}>
              {playlist.name}
            </option>
          ))}
        </select>
      </div>

      <h3>Ekranlar</h3>
      <div style={styles.screenList}>
        {screens.map(screen => (
          <div style={styles.screenItem} key={screen._id}>
            <input
              type="checkbox"
              checked={selectedScreens.includes(screen._id)}
              onChange={() => handleScreenSelect(screen._id)}
            />
            <label style={styles.label}>{screen.name}</label>
          </div>
        ))}
      </div>

      <button onClick={assignPlaylistToSelectedScreens} style={styles.button}>
        Seçilen Ekranlara Ata
      </button>
      <button onClick={assignPlaylistToAllScreens} style={styles.button}>
        Tüm Ekranlara Ata
      </button>

      <Notification message={notification} onClose={() => setNotification('')} />
    </div>
  );
}

const styles = {
  selector: {
    marginBottom: '20px'
  },
  select: {
    padding: '8px',
    fontSize: '16px',
    minWidth: '200px'
  },
  screenList: {
    display: 'flex',
    marginBottom: '20px',
    maxHeight: '300px',
    overflowY: 'auto',
    border: '1px solid rgb(204, 204, 204)',
    padding: '10px',
    borderRadius: '5px',
    alignItems: 'center',
    gap: '40px'
  },
  screenItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px'
  },
  checkbox: {
    marginRight: '10px'
  },
  label: {
    fontSize: '16px',
    margin: '0px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px'
  }
};

export default AssignmentPage;
