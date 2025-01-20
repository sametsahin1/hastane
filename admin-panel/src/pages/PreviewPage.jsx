import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PreviewPage() {
  const [medias, setMedias] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedias();
  }, []);

  const fetchMedias = async () => {
    try {
      const response = await axios.get('/api/media');
      setMedias(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Medya listesi alınırken hata:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (medias.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === medias.length - 1 ? 0 : prevIndex + 1
        );
      }, medias[currentIndex]?.duration * 1000 || 5000);

      return () => clearInterval(interval);
    }
  }, [currentIndex, medias]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (medias.length === 0) {
    return <div>Gösterilecek medya bulunamadı.</div>;
  }

  const currentMedia = medias[currentIndex];

  return (
    <div style={styles.container}>
      {currentMedia.mediaType === 'Video' ? (
        <video
          src={currentMedia.filePath}
          style={styles.media}
          autoPlay
          muted
          onEnded={() => {
            setCurrentIndex((prevIndex) => 
              prevIndex === medias.length - 1 ? 0 : prevIndex + 1
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
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  media: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
};

export default PreviewPage; 