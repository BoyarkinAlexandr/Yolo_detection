import Webcam from 'react-webcam';
import { useCallback } from 'react';

export default function WebcamDetector() {
  const webcamRef = React.useRef(null);
  const [count, setCount] = useState(0);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    // Отправка на сервер аналогично Uploader
  }, [webcamRef]);

  return (
    <div>
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={capture}>Захватить кадр</button>
      <p>Людей в кадре: {count}</p>
    </div>
  );
}