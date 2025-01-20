import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MediaPage() {
  const [file, setFile] = useState(null);
  const [mediaName, setMediaName] = useState('');
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    fetchMedias();
  }, []);

  const fetchMedias = async () => {
    try {
      const response = await axios.get('/api/media');
      setMedias(response.data);
    } catch (error) {
      console.error('Medya listesi alınırken hata:', error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file);
      setFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/media/${id}`);
      fetchMedias();
    } catch (error) {
      console.error('Silme hatası:', error);
    }
  };

  const handleUpload = async () => {
    if (!file || !mediaName) {
      alert('Lütfen bir dosya seçin ve medya adı girin');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', mediaName);

    try {
      setLoading(true);
      const response = await axios.post('/api/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload response:', response.data);
      setFile(null);
      setMediaName('');
      fetchMedias();
    } catch (error) {
      console.error('Upload error details:', error.response?.data || error);
      alert('Yükleme hatası: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const MediaItem = ({ media }) => {
    if (media.mediaType === 'Video') {
      return (
        <video 
          src={media.filePath} 
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
          controls
          preload="metadata"
        >
          <source src={media.filePath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <img 
          src={media.filePath} 
          alt={media.name}
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
        />
      );
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Medya Yönetimi</h2>
      <div style={styles.uploadForm}>
        <input
          type="text"
          placeholder="Medya Adı"
          value={mediaName}
          onChange={(e) => setMediaName(e.target.value)}
          className='mediainput'
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          style={styles.input}
          ref={fileInputRef}
        />
        <button 
          onClick={handleButtonClick}
          style={styles.button}
        >
          Dosya Seç
        </button>
        <button 
          onClick={handleUpload}
          disabled={loading || !file || !mediaName}
          style={styles.uploadButton}
        >
          {loading ? 'Yükleniyor...' : 'Yükle'}
        </button>
      </div>

      <h3>Medya Listesi</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Önizleme</th>
            <th>Ad</th>
            <th>Tür</th>
            <th>Oluşturulma Tarihi</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {medias.map((media) => (
            <tr key={media._id}>
              <td style={styles.previewCell}>
                <MediaItem media={media} />
              </td>
              <td>{media.name}</td>
              <td>{media.mediaType === 'image' ? 'Resim' : 'Video'}</td>
              <td>{new Date(media.createdAt).toLocaleString()}</td>
              <td>
                <button 
                  onClick={() => handleDelete(media._id)}
                  className='deletebutton'
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
  uploadForm: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    alignItems: 'center'
  },
  input: {
    display: 'none',
  },
  button: {
    padding: '10px 20px',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  uploadButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  },
  previewCell: {
    width: '100px',
    height: '100px',
    padding: '5px'
  },
  preview: {
    width: '100px',
    height: '100px',
    objectFit: 'cover'
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

export default MediaPage;
