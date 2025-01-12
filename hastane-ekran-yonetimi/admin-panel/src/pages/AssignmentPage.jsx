import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AssignmentPage() {
  const [playlists, setPlaylists] = useState([]);
  const [screens, setScreens] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [selectedScreens, setSelectedScreens] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/playlists')
      .then(res => setPlaylists(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:3000/screens')
      .then(res => setScreens(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleScreenCheckbox = (screenId) => {
    if (selectedScreens.includes(screenId)) {
      // varsa çıkar
      setSelectedScreens(selectedScreens.filter(id => id !== screenId));
    } else {
      // yoksa ekle
      setSelectedScreens([...selectedScreens, screenId]);
    }
  };

  const assignPlaylist = () => {
    if (!selectedPlaylist || selectedScreens.length === 0) {
      alert('Playlist ve ekran seçin');
      return;
    }
    axios.post('http://localhost:3000/assignments', {
      playlistId: selectedPlaylist,
      screenIds: selectedScreens
    })
      .then(res => {
        alert('Atama yapıldı');
        setSelectedPlaylist('');
        setSelectedScreens([]);
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Döngüleri Ekranlara Atama</h2>
      <div>
        <label>Seçilecek Döngü: </label>
        <select
          value={selectedPlaylist}
          onChange={(e) => setSelectedPlaylist(e.target.value)}
        >
          <option value="">Seç...</option>
          {playlists.map(pl => (
            <option key={pl._id} value={pl._id}>{pl.name}</option>
          ))}
        </select>
      </div>
      <div>
        <h3>Ekranlar</h3>
        {screens.map(s => (
          <div key={s._id}>
            <input
              type="checkbox"
              checked={selectedScreens.includes(s._id)}
              onChange={() => handleScreenCheckbox(s._id)}
            />
            {s.screenName} ({s.location})
          </div>
        ))}
      </div>
      <button onClick={assignPlaylist}>Kaydet</button>
    </div>
  );
}

export default AssignmentPage;
