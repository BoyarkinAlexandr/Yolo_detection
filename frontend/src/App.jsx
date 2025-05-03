import React, { useState } from 'react';
import { Container, Title } from '@mantine/core';
import UploadSection from './components/UploadSection';
import ResultsSection from './components/ResultsSection';
import HistorySection from './components/HistorySection';

function App() {
  const [result, setResult] = useState(null);

  const handleUpload = (data) => {
    setResult(data);
  };

  return (
    <Container size="lg" className="py-8">
      <Title order={1} className="text-center mb-8">Посетители в магазине</Title>
      <UploadSection onUpload={handleUpload} />
      <ResultsSection result={result} />
      <HistorySection />
    </Container>
  );
}

export default App;