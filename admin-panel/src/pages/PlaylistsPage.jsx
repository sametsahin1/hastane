import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PlaylistPage() {
  const [playlistName, setPlaylistName] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [mediaList, setMediaList] = useState([]);

  // Seçilen playlist id
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  // Eklenecek mediaId, duration
  const [selectedMedia, setSelectedMedia] = useState('');
  const [duration, setDuration] = useState(10);

  useEffect(() => {
    fetchPlaylists();
    fetchMedia();
  }, []);

  const fetchPlaylists = () => {
    axios.get('http://localhost:3000/playlists')
      .then(res => setPlaylists(res.data))
      .catch(err => console.error(err));
  };

  const fetchMedia = () => {
    axios.get('http://localhost:3000/media')
      .then(res => setMediaList(res.data))
      .catch(err => console.error(err));
  };

  const createPlaylist = () => {
    if (!playlistName) return;
    axios.post('http://localhost:3000/playlists', { name: playlistName })
      .then(res => {
        alert('Döngü oluşturuldu');
        setPlaylistName('');
        fetchPlaylists();
      })
      .catch(err => console.error(err));
  };

  const addMediaToPlaylist = () => {
    if (!selectedPlaylist || !selectedMedia) return;

    axios.post(`http://localhost:3000/playlists/${selectedPlaylist}/addMedia`, {
      mediaId: selectedMedia,
      duration
    })
      .then(res => {
        alert('Medya eklendi');
        fetchPlaylists(); // playlist güncellensin
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Döngü Oluşturma</h2>
      <div>
        <input
          type="text"
          placeholder="Döngü Adı"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
        />
        <button onClick={createPlaylist}>Döngü Oluştur</button>
      </div>
      <hr />
      <h3>Mevcut Döngüler</h3>
      <ul className="playlist-container">
        {playlists.map(pl => (
          <li key={pl._id}>
            <strong>{pl.name}</strong>
            <ul>
              {pl.medias.map((m, idx) => (
                <li key={idx}>
                  {m.mediaId?.title} - {m.duration} sn
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <hr />
      <h3>Döngüye Medya Ekle</h3>
      <div>
        <label>Seçilen Döngü: </label>
        <select onChange={(e) => setSelectedPlaylist(e.target.value)}>
          <option value="">Seç...</option>
          {playlists.map(pl => (
            <option key={pl._id} value={pl._id}>{pl.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Seçilecek Medya: </label>
        <select onChange={(e) => setSelectedMedia(e.target.value)}>
          <option value="">Seç...</option>
          {mediaList.map(m => (
            <option key={m._id} value={m._id}>{m.title}</option>
          ))}
        </select>
        <label style={{ marginLeft: 10 }}>Süre (sn): </label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={{ width: '60px' }}
        />
        <button onClick={addMediaToPlaylist}>Ekle</button>
      </div>
    </div>
  );
}

export default PlaylistPage;
