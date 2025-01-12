import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PlaylistsPage() {
  const [playlistName, setPlaylistName] = useState('');
  const [selectedMedias, setSelectedMedias] = useState([]);
  const [availableMedias, setAvailableMedias] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedias();
    fetchPlaylists();
  }, []);

  const fetchMedias = async () => {
    try {
      const response = await axios.get('http://localhost:3000/media');
      setAvailableMedias(response.data);
    } catch (error) {
      console.error('Medya listesi alınırken hata:', error);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('http://localhost:3000/playlists');
      setPlaylists(response.data);
    } catch (error) {
      console.error('Playlist listesi alınırken hata:', error);
    }
  };

  const handleMediaSelect = (mediaId) => {
    const media = availableMedias.find(m => m._id === mediaId);
    if (media) {
      setSelectedMedias([...selectedMedias, {
        mediaId: media._id,
        duration: 5, // varsayılan süre
        name: media.name,
        mediaType: media.mediaType
      }]);
    }
  };

  const handleDurationChange = (index, duration) => {
    const newSelectedMedias = [...selectedMedias];
    newSelectedMedias[index].duration = Number(duration);
    setSelectedMedias(newSelectedMedias);
  };

  const handleRemoveMedia = (index) => {
    setSelectedMedias(selectedMedias.filter((_, i) => i !== index));
  };

  const handleCreatePlaylist = async () => {
    if (!playlistName || selectedMedias.length === 0) {
      alert('Lütfen playlist adı girin ve en az bir medya seçin');
      return;
    }

    try {
      setLoading(true);
      const mediaData = selectedMedias.map(media => ({
        mediaId: media.mediaId,
        duration: media.duration
      }));

      await axios.post('http://localhost:3000/playlists', {
        name: playlistName,
        medias: mediaData
      });
      alert('Playlist başarıyla oluşturuldu');
      setPlaylistName('');
      setSelectedMedias([]);
      fetchPlaylists();
    } catch (error) {
      console.error('Playlist oluşturma hatası:', error);
      alert('Playlist oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (window.confirm('Bu döngüyü silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:3000/playlists/${playlistId}`);
        alert('Döngü başarıyla silindi');
        fetchPlaylists();
      } catch (error) {
        console.error('Döngü silme hatası:', error);
        alert('Döngü silinirken bir hata oluştu');
      }
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Döngü Oluşturma</h2>
      <div style={styles.form}>
        <input
          type="text"
          placeholder="Döngü Adı"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          style={styles.input}
        />

        <div style={styles.mediaSelector}>
          <h3>Medya Seç</h3>
          <select 
            onChange={(e) => handleMediaSelect(e.target.value)}
            value=""
            style={styles.select}
          >
            <option value="">Medya seçin...</option>
            {availableMedias.map(media => (
              <option key={media._id} value={media._id}>
                {media.name} ({media.mediaType === 'image' ? 'Resim' : 'Video'})
              </option>
            ))}
          </select>
        </div>

        <div style={styles.selectedMedias}>
          <h3>Seçilen Medyalar</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Medya Adı</th>
                <th>Tür</th>
                <th>Süre (saniye)</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {selectedMedias.map((media, index) => (
                <tr key={index}>
                  <td>{media.name}</td>
                  <td>{media.mediaType === 'image' ? 'Resim' : 'Video'}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={media.duration}
                      onChange={(e) => handleDurationChange(index, e.target.value)}
                      style={styles.durationInput}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => handleRemoveMedia(index)}
                      style={styles.removeButton}
                    >
                      Kaldır
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={handleCreatePlaylist}
          disabled={loading || !playlistName || selectedMedias.length === 0}
          style={styles.createButton}
        >
          {loading ? 'Oluşturuluyor...' : 'Döngü Oluştur'}
        </button>
      </div>

      <h3>Mevcut Döngüler</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Döngü Adı</th>
            <th>Medya Sayısı</th>
            <th>Oluşturulma Tarihi</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {playlists.map(playlist => (
            <tr key={playlist._id}>
              <td>{playlist.name}</td>
              <td>{playlist.medias ? playlist.medias.length : 0}</td>
              <td>{new Date(playlist.createdAt).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => handleDeletePlaylist(playlist._id)}
                  style={styles.deleteButton}
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '30px'
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    maxWidth: '300px'
  },
  mediaSelector: {
    marginBottom: '20px'
  },
  select: {
    padding: '8px',
    fontSize: '16px',
    minWidth: '300px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px'
  },
  durationInput: {
    width: '60px',
    padding: '4px'
  },
  removeButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  createButton: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    maxWidth: '200px'
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

export default PlaylistsPage;
