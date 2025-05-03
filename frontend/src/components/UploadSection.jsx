import React, { useState } from 'react';
import { Button, FileInput, Stack,} from '@mantine/core';

function UploadSection({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      onUpload(data);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack className="mb-8" spacing="md">
      <FileInput
        label="Загрузите фото или видео"
        placeholder="Выберите файл"
        accept="image/*,video/*"
        onChange={setFile}
      />
      <Button onClick={handleUpload} loading={loading}>
        Запустить
      </Button>
    </Stack>
  );
}

export default UploadSection;