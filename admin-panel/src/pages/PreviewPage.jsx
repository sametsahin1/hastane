import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PreviewPage() {
  const { screenId } = useParams();
  const [screen, setScreen] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScreen = async () => {
      try {
        const response = await axios.get(`/api/screens/${screenId}`);
        setScreen(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Ekran bilgileri alınırken hata:', error);
        setLoading(false);
      }
    };

    fetchScreen();
  }, [screenId]);

  useEffect(() => {
    if (screen?.currentPlaylist?.mediaItems?.length > 0) {
      const currentMedia = screen.currentPlaylist.mediaItems[currentMediaIndex];
      const timer = setTimeout(() => {
        setCurrentMediaIndex((prevIndex) => 
          (prevIndex + 1) % screen.currentPlaylist.mediaItems.length
        );
      }, (currentMedia.duration || 5) * 1000);

      return () => clearTimeout(timer);
    }
  }, [screen, currentMediaIndex]);

  if (loading) return <div>Yükleniyor...</div>;
  if (!screen) return <div>Ekran bulunamadı</div>;
  if (!screen.currentPlaylist?.mediaItems?.length) {
    return <div>Bu ekrana atanmış medya bulunamadı</div>;
  }

  const currentMedia = screen.currentPlaylist.mediaItems[currentMediaIndex];

  return (
    <div style={styles.container}>
      <div style={styles.mediaContainer}>
        {currentMedia.mediaType === 'Video' ? (
          <video
            src={currentMedia.filePath}
            style={styles.media}
            autoPlay
            muted
            onEnded={() => {
              setCurrentMediaIndex((prevIndex) => 
                (prevIndex + 1) % screen.currentPlaylist.mediaItems.length
              );
            }}
          />
        ) : (
          <img
            src={currentMedia.filePath}
            alt={currentMedia.name}
            style={styles.media}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#000',
  },
  mediaContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
};

export default PreviewPage; 