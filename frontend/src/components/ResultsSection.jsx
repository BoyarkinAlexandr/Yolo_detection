import React, { useState } from 'react';
import { Card, Image, Text, Title } from '@mantine/core';

function ResultsSection({ result }) {
  const [imageError, setImageError] = useState(false);

  const getMediaPath = (filePath) => {
    const cleanPath = filePath.replace(/^\/?media\//, '');
    return `/media/${cleanPath}`;
    
  };


  const renderMediaContent = () => {
    if (!result || !result.media_type) return null;
  
    const mediaType = result.media_type.toLowerCase();
    const mediaUrl = getMediaPath(result.result_file);
  
    if (mediaType === 'image') {
      return imageError ? (
        <Text color="red">Не удалось загрузить изображение</Text>
      ) : (
        <>
          {console.log('URL изображения:', mediaUrl)}
          <Image
            src={mediaUrl}
            alt="Result"
            className="mt-4"
            onError={() => setImageError(true)}
          />
        </>
      );
    }
  
    if (mediaType === 'video') {
      return (
        <div className="mt-4">
          {console.log('URL видео:', mediaUrl)}
          <video
            controls
            width="100%"
            onError={(e) => {
              console.error('Video error:', e.target.error);
              console.error('Video URL:', mediaUrl);
            }}
          >
            <source src={mediaUrl} type="video/mp4" />
            Ваш браузер не поддерживает видео
          </video>
          <Text size="sm" color="dimmed">
            Если видео не отображается, попробуйте{' '}
            <a href={mediaUrl} download>
              скачать файл
            </a>
          </Text>
        </div>
      );
    }
  
    return <Text color="red">Неизвестный тип медиа: {result.media_type}</Text>;
  };
  

  return (
    <Card shadow="sm" padding="lg" radius="md" className="mb-8">
      <Title order={2}>Результат</Title>
      {result ? (
        <>
          <Text>Количество Посетители: {result.person_count}</Text>
          <Text>Время обработки: {result.processing_time.toFixed(2)}сек</Text>
          {renderMediaContent()}
        </>
      ) : (
        <Text>Нету результатов</Text>
      )}
    </Card>
  );
}


export default ResultsSection;
