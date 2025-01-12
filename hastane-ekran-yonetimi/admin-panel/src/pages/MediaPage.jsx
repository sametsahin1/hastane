import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MediaPage() {
  const [title, setTitle] = useState('');
  const [mediaType, setMediaType] = useState('image'); // "image" veya "video"
  const [file, setFile] = useState(null);
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = () => {
    axios.get('http://localhost:3000/media')
      .then((res) => {
        setMediaList(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleUpload = async () => {
    try {
      if (!file || !title) {
        alert('Lütfen başlık ve dosya seçin');
        return;
      }

      // Dosya boyutunu kontrol et
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('Dosya boyutu çok büyük. Maksimum 10MB olmalıdır.');
        return;
      }

      // İzin verilen dosya tiplerini kontrol et
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const allowedVideoTypes = ['video/mp4', 'video/webm'];
      
      if (mediaType === 'image' && !allowedImageTypes.includes(file.type)) {
        alert('Lütfen geçerli bir resim dosyası seçin (JPEG, PNG veya GIF)');
        return;
      }
      
      if (mediaType === 'video' && !allowedVideoTypes.includes(file.type)) {
        alert('Lütfen geçerli bir video dosyası seçin (MP4 veya WEBM)');
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('mediaType', mediaType);
      formData.append('file', file);

      console.log('Yüklemeye çalışılan dosya:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
      
      const response = await axios.post('http://localhost:3000/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Yükleme durumu:', percentCompleted);
        }
      });

      console.log('Sunucu yanıtı:', response.data);
      alert('Dosya başarıyla yüklendi');
      setTitle('');
      setFile(null);
      fetchMedia();
    } catch (err) {
      console.error('Detaylı hata:', err.response?.data || err);
      alert(
        'Dosya yüklenirken bir hata oluştu: ' + 
        (err.response?.data?.message || err.message || 'Bilinmeyen hata')
      );
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/media/${id}`)
      .then((res) => {
        alert('Medya silindi');
        fetchMedia();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Medya Yükle & Listele</h2>
      <div>
        <input
          type="text"
          placeholder="Başlık (title)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select onChange={(e) => setMediaType(e.target.value)} value={mediaType}>
          <option value="image">Resim</option>
          <option value="video">Video</option>
        </select>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept={mediaType === 'image' ? 'image/*' : 'video/*'}
        />
        <button onClick={handleUpload}>Yükle</button>
      </div>
      <hr />
      <h3>Yüklü Medyalar</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Başlık</th>
            <th>Tür</th>
            <th>Dosya Yolu</th>
            <th>Sil</th>
          </tr>
        </thead>
        <tbody>
          {mediaList.map((m) => (
            <tr key={m._id}>
              <td>{m.title}</td>
              <td>{m.mediaType}</td>
              <td>{m.filePath}</td>
              <td>
                <button onClick={() => handleDelete(m._id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MediaPage;
