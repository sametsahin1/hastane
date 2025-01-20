import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [medias, setMedias] = useState([]);
  const [selectedMedias, setSelectedMedias] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlaylists();
    fetchMedias();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('/api/playlists');
      setPlaylists(response.data);
    } catch (error) {
      console.error('Playlist listesi alınırken hata:', error);
    }
  };

  const fetchMedias = async () => {
    try {
      const response = await axios.get('/api/media');
      setMedias(response.data);
    } catch (error) {
      console.error('Medya listesi alınırken hata:', error);
    }
  };

  const handleMediaSelect = (mediaId) => {
    setSelectedMedias(prev => {
      const exists = prev.find(item => item.media === mediaId);
      if (exists) {
        return prev.filter(item => item.media !== mediaId);
      } else {
        return [...prev, { media: mediaId, duration: 5 }];
      }
    });
  };

  const handleCreatePlaylist = async () => {
    if (!playlistName || selectedMedias.length === 0) {
      alert('Lütfen playlist adı girin ve en az bir medya seçin');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/api/playlists', {
        name: playlistName,
        mediaItems: selectedMedias
      });
      setPlaylistName('');
      setSelectedMedias([]);
      fetchPlaylists();
    } catch (error) {
      console.error('Playlist oluşturma hatası:', error);
      alert('Playlist oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlaylist = async (id) => {
    try {
      await axios.delete(`/api/playlists/${id}`);
      fetchPlaylists();
    } catch (error) {
      console.error('Playlist silme hatası:', error);
    }
  };

  const renderMediaItem = (mediaItem) => {
    if (!mediaItem?.media) {
      console.warn('Medya öğesi veya media property bulunamadı:', mediaItem);
      return null;
    }

    const { media } = mediaItem;

    return (
      <div key={mediaItem._id} className="media-item">
        {media.mediaType === 'Video' ? (
          <video
            src={`https://yazilimservisi.com${media.filePath}`}
            style={{ width: '200px', height: 'auto' }}
            controls
          />
        ) : media.mediaType === 'Resim' ? (
          <img
            src={`https://yazilimservisi.com${media.filePath}`}
            alt={media.name}
            style={{ width: '200px', height: 'auto' }}
          />
        ) : (
          <div>Desteklenmeyen medya tipi: {media.mediaType}</div>
        )}
        <div>{media.name}</div>
        <div>Süre: {mediaItem.duration} saniye</div>
      </div>
    );
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Playlist Yönetimi</h2>
      
      <div style={styles.createForm}>
        <input
          type="text"
          placeholder="Playlist Adı"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          style={styles.input}
        />
        <div style={styles.mediaGrid}>
          {medias.map((media) => (
            <div
              key={media._id}
              style={{
                ...styles.mediaItem,
                border: selectedMedias.find(item => item.media === media._id)
                  ? '2px solid #007bff'
                  : '1px solid #ddd'
              }}
              onClick={() => handleMediaSelect(media._id)}
            >
              {media.mediaType === 'Video' ? (
                <video
                  src={media.filePath}
                  style={styles.preview}
                  preload="metadata"
                />
              ) : (
                <img
                  src={media.filePath}
                  alt={media.name}
                  style={styles.preview}
                />
              )}
              <div style={styles.mediaInfo}>
                <span>{media.name}</span>
                <span>{media.mediaType}</span>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleCreatePlaylist}
          disabled={loading || !playlistName || selectedMedias.length === 0}
          style={styles.button}
        >
          {loading ? 'Oluşturuluyor...' : 'Playlist Oluştur'}
        </button>
      </div>

      <h3>Playlist Listesi</h3>
      <div style={styles.playlistGrid}>
        {playlists.map((playlist) => (
          <div key={playlist._id} style={styles.playlistItem}>
            <h4>{playlist.name}</h4>
            <div className="media-items-container">
              {playlist.mediaItems?.map(mediaItem => renderMediaItem(mediaItem))}
            </div>
            <button
              onClick={() => handleDeletePlaylist(playlist._id)}
              style={styles.deleteButton}
            >
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  createForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '30px'
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    maxWidth: '300px',
    marginBottom: '0px'
  },
  mediaGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  mediaItem: {
    width: 'calc(33.33% - 8px)',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  preview: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '4px'
  },
  mediaInfo: {
    marginTop: '8px',
    textAlign: 'center'
  },
  button: {
    padding: '10px',
    color: 'white',
    border: 'none',
    fontWeight: 'bold',
    borderRadius: '4px',
    cursor: 'pointer',
    maxWidth: '200px'
  },
  playlistGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px'
  },
  playlistItem: {
    width: 'calc(33.33% - 20px)',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  mediaPreview: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px'
  },
  previewItem: {
    width: 'calc(33.33% - 8px)',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  smallPreview: {
    width: '100%',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px'
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
