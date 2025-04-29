import React, { useState } from 'react';
import Uploader from './components/Uploader';
import WebcamDetector from './components/WebcamDetector';
import './App.css';

function App() {
  // Состояния для хранения результатов
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'camera' | 'history'
  const [history, setHistory] = useState([]);

  // Загрузка истории из Django API
  const loadHistory = async () => {
    const response = await getHistory();
    setHistory(response.data);
  };

  return (
    <div className="app">
      <h1>Подсчёт посетителей в магазине</h1>
      
      {/* Навигация по вкладкам */}
      <div className="tabs">
        <button 
          onClick={() => setActiveTab('upload')} 
          className={activeTab === 'upload' ? 'active' : ''}
        >
          Загрузить фото
        </button>
        <button 
          onClick={() => setActiveTab('camera')} 
          className={activeTab === 'camera' ? 'active' : ''}
        >
          Камера
        </button>
        <button 
          onClick={() => { 
            setActiveTab('history'); 
            loadHistory(); 
          }} 
          className={activeTab === 'history' ? 'active' : ''}
        >
          История
        </button>
      </div>

      {/* Контент вкладок */}
      <div className="tab-content">
        {activeTab === 'upload' && (
          <div>
            <Uploader onDetection={(data) => setResults([...results, data])} />
            {results.length > 0 && (
              <div className="last-result">
                <h3>Последний результат: {results[results.length - 1].count} человек</h3>
              </div>
            )}
          </div>
        )}

        {activeTab === 'camera' && <WebcamDetector />}

        {activeTab === 'history' && (
          <div>
            <StatsChart data={history} />
            <HistoryTable data={history} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;