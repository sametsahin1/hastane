import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PreviewPage() {
  const { screenId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScreenConfig();
  }, [screenId]);

  const fetchScreenConfig = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/screens/${screenId}/config`);
      if (response.data.playlist) {
        setPlaylist(response.data.playlist);
      } else {
        setError('Bu ekrana atanmış playlist bulunamadı');
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Ekran bilgileri yüklenirken hata oluştu');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (playlist && playlist.mediaItems.length > 0) {
      const currentMedia = playlist.mediaItems[currentMediaIndex];
      const timer = setInterval(() => {
        setCurrentMediaIndex((prevIndex) => 
          (prevIndex + 1) % playlist.mediaItems.length
        );
      }, currentMedia.duration * 1000);

      return () => clearInterval(timer);
    }
  }, [playlist, currentMediaIndex]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;
  if (!playlist) return <div>Bu ekrana henüz playlist atanmamış</div>;

  const currentMedia = playlist.mediaItems[currentMediaIndex];

  return (
    <div style={styles.container}>
      <h2>Ekran Önizleme: {playlist.name}</h2>
      <div style={styles.mediaContainer}>
        {currentMedia ? (
          currentMedia.mediaType === 'image' ? (
            <img 
              src={`http://localhost:3000${currentMedia.filePath}`}
              alt="Media content"
              style={styles.media}
            />
          ) : currentMedia.mediaType === 'video' ? (
            <video 
              src={`http://localhost:3000${currentMedia.filePath}`}
              autoPlay
              muted
              style={styles.media}
            />
          ) : null
        ) : (
          <div>Medya yüklenemedi</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  mediaContainer: {
    width: '80vw',
    height: '80vh',
    backgroundColor: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  media: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  }
};

export default PreviewPage; 