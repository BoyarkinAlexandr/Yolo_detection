import React, { useState } from 'react';
import axios from 'axios';

export default function Uploader() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios.post('http://localhost:8000/detect/', formData);
    setResult(response.data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Анализировать</button>
      </form>
      {result && (
        <div>
          <p>Найдено людей: {result.count}</p>
          <img 
            src={URL.createObjectURL(file)} 
            alt="Результат" 
            style={{ border: '2px solid red' }}
          />
        </div>
      )}
    </div>
  );
}