import React, { useState, useEffect } from 'react';
import { Button, Table, Title, Group, ActionIcon, Image, Modal } from '@mantine/core';
import { IconTrash, IconEye } from '@tabler/icons-react';

function HistorySection() {
  const [history, setHistory] = useState([]);
  const [opened, setOpened] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState({ url: '', type: '' });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    fetch('/api/history/')
      .then((res) => res.json())
      .then((data) => setHistory(data));
  };

  const downloadReport = (format) => {
    window.location.href = `/api/report/${format}/`;
  };

  const deleteHistoryItem = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      fetch(`/api/history/${id}/`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            fetchHistory();
          }
        });
    }
  };

  const openMediaModal = (mediaUrl, mediaType) => {
    setSelectedMedia({ url: mediaUrl, type: mediaType });
    setOpened(true);
  };

  return (
    <div>
      <Title order={2}>История запросов</Title>
      <Table className="mt-4" striped highlightOnHover>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Время</th>
            <th style={{ textAlign: 'left' }}>Тип файла</th>
            <th style={{ textAlign: 'left' }}>Количество Посетители</th>
            <th style={{ textAlign: 'left' }}>Время обработки</th>
            <th style={{ textAlign: 'left' }}>Результат</th>
            <th style={{ textAlign: 'left' }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr key={item.id}>
              <td style={{ textAlign: 'left' }}>{new Date(item.timestamp).toLocaleString()}</td>
              <td style={{ textAlign: 'left' }}>{item.media_type}</td>
              <td style={{ textAlign: 'left' }}>{item.person_count}</td>
              <td style={{ textAlign: 'left' }}>{item.processing_time.toFixed(2)}сек</td>
              <td style={{ textAlign: 'left' }}>
                {item.result_file && (
                  <ActionIcon onClick={() => openMediaModal(item.result_file, item.media_type)}>
                    <IconEye size="1rem" />
                  </ActionIcon>
                )}
              </td>
              <td style={{ textAlign: 'left' }}>
                <ActionIcon color="red" onClick={() => deleteHistoryItem(item.id)}>
                  <IconTrash size="1rem" />
                </ActionIcon>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Результат обработки"
        size="xl"
      >
        {selectedMedia.type === 'image' && (
          <Image src={`${selectedMedia.url}`} alt="Результат обработки" />
        )}
        {selectedMedia.type === 'video' && (
          <video controls style={{ width: '100%' }}>
            <source src={`${selectedMedia.url}`} type="video/mp4" />
            Ваш браузер не поддерживает видео тег.
          </video>
        )}
      </Modal>

      <Group className="mt-4">
        <Button onClick={() => downloadReport('pdf')}>Скачать PDF отчёт</Button>
        <Button onClick={() => downloadReport('excel')}>Скачать Excel отчёт</Button>
      </Group>
    </div>
  );
}

export default HistorySection;