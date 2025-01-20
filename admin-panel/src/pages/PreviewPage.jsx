import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PreviewPage() {
  const { screenId } = useParams();
  const [screen, setScreen] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ekran ve playlist bilgilerini al
  useEffect(() => {
    const fetchScreenData = async () => {
      try {
        const response = await axios.get(`/api/screens/${screenId}`);
        setScreen(response.data);
        
        if (response.data.currentPlaylist) {
          const playlistResponse = await axios.get(`/api/playlists/${response.data.currentPlaylist}`);
          setCurrentPlaylist(playlistResponse.data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Ekran bilgileri alınırken hata:', error);
        setError('Ekran bilgileri yüklenemedi');
        setLoading(false);
      }
    };

    fetchScreenData();
  }, [screenId]);

  // Medya döngüsü
  useEffect(() => {
    if (currentPlaylist && currentPlaylist.mediaItems && currentPlaylist.mediaItems.length > 0) {
      const currentMedia = currentPlaylist.mediaItems[currentMediaIndex];
      
      const timer = setTimeout(() => {
        setCurrentMediaIndex((prevIndex) => 
          (prevIndex + 1) % currentPlaylist.mediaItems.length
        );
      }, (currentMedia.duration || 5) * 1000);

      return () => clearTimeout(timer);
    }
  }, [currentPlaylist, currentMediaIndex]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>Hata: {error}</div>;
  }

  if (!screen) {
    return <div>Ekran bulunamadı</div>;
  }

  if (!currentPlaylist || !currentPlaylist.mediaItems || currentPlaylist.mediaItems.length === 0) {
    return <div>Bu ekrana atanmış playlist bulunamadı veya playlist boş</div>;
  }

  const currentMedia = currentPlaylist.mediaItems[currentMediaIndex];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Ekran Önizleme: {screen.name}</h2>
        <p>Playlist: {currentPlaylist.name}</p>
      </div>
      
      <div style={styles.mediaContainer}>
        {currentMedia.mediaType === 'Video' ? (
          <video
            key={currentMedia._id}
            src={currentMedia.filePath}
            style={styles.media}
            autoPlay
            muted
            onEnded={() => {
              setCurrentMediaIndex((prevIndex) => 
                (prevIndex + 1) % currentPlaylist.mediaItems.length
              );
            }}
          />
        ) : (
          <img
            key={currentMedia._id}
            src={currentMedia.filePath}
            alt={currentMedia.name}
            style={styles.media}
          />
        )}
      </div>

      <div style={styles.info}>
        <p>Medya: {currentMedia.name}</p>
        <p>Süre: {currentMedia.duration || 5} saniye</p>
        <p>Tür: {currentMedia.mediaType}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#000',
    color: '#fff',
  },
  header: {
    padding: '20px',
    textAlign: 'center',
  },
  mediaContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px',
  },
  media: {
    maxWidth: '100%',
    maxHeight: 'calc(100vh - 200px)',
    objectFit: 'contain',
  },
  info: {
    padding: '20px',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

export default PreviewPage; 