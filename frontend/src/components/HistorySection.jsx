import React, { useState, useEffect } from 'react';
import { Button, Table, Title, Group } from '@mantine/core';

function HistorySection() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch('/api/history/')
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, []);

  const downloadReport = (format) => {
    window.location.href = `/api/report/${format}/`;
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
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr key={item.id}>
              <td style={{ textAlign: 'left' }}>{new Date(item.timestamp).toLocaleString()}</td>
              <td style={{ textAlign: 'left' }}>{item.media_type}</td>
              <td style={{ textAlign: 'left' }}>{item.person_count}</td>
              <td style={{ textAlign: 'left' }}>{item.processing_time.toFixed(2)}сек</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Group className="mt-4">
        <Button onClick={() => downloadReport('pdf')}>Скачать PDF отчёт</Button>
        <Button onClick={() => downloadReport('excel')}>Скачать Excel отчёт</Button>
      </Group>
    </div>
  );
}

export default HistorySection;