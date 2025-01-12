import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MediaPage() {
  const [file, setFile] = useState(null);
  const [mediaName, setMediaName] = useState('');
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedias();
  }, []);

  const fetchMedias = async () => {
    try {
      const response = await axios.get('http://localhost:3000/media');
      setMedias(response.data);
    } catch (error) {
      console.error('Medya listesi alınırken hata:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu medyayı silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:3000/media/${id}`);
        alert('Medya başarıyla silindi');
        fetchMedias();
      } catch (error) {
        console.error('Silme hatası:', error);
        alert('Silme işlemi sırasında bir hata oluştu');
      }
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
    formData.append('mediaType', file.type.startsWith('image/') ? 'image' : 'video');

    try {
      setLoading(true);
      await axios.post('http://localhost:3000/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Medya başarıyla yüklendi');
      setFile(null);
      setMediaName('');
      fetchMedias();
    } catch (error) {
      console.error('Yükleme hatası:', error);
      alert('Yükleme sırasında bir hata oluştu');
    } finally {
      setLoading(false);
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
          style={styles.input}
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          style={styles.input}
        />
        <button 
          onClick={handleUpload}
          disabled={loading || !file || !mediaName}
          style={styles.button}
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
                {media.mediaType === 'image' ? (
                  <img 
                    src={`http://localhost:3000${media.filePath}`}
                    alt={media.name}
                    style={styles.preview}
                  />
                ) : (
                  <video 
                    src={`http://localhost:3000${media.filePath}`}
                    style={styles.preview}
                  />
                )}
              </td>
              <td>{media.name}</td>
              <td>{media.mediaType === 'image' ? 'Resim' : 'Video'}</td>
              <td>{new Date(media.createdAt).toLocaleString()}</td>
              <td>
                <button 
                  onClick={() => handleDelete(media._id)}
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
  uploadForm: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    alignItems: 'center'
  },
  input: {
    padding: '8px',
    fontSize: '16px'
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
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
