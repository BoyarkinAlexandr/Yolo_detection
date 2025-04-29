from ultralytics import YOLO
import cv2
import os
import time
from django.conf import settings

class YOLOProcessor:
    def __init__(self):
        self.model = YOLO('yolov8n.pt')  # Load pretrained YOLOv8 nano model

    def process_image(self, image_path, output_path):
        start_time = time.time()
        img = cv2.imread(image_path)
        results = self.model(img, classes=[0])  # Class 0 is 'person'
        person_count = len(results[0].boxes)
        
        # Draw bounding boxes
        annotated_img = results[0].plot()
        cv2.imwrite(output_path, annotated_img)
        
        processing_time = time.time() - start_time
        return person_count, processing_time

    def process_video(self, video_path, output_path):
        start_time = time.time()
        cap = cv2.VideoCapture(video_path)
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, 20.0, (int(cap.get(3)), int(cap.get(4))))
        person_count = 0
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            results = self.model(frame, classes=[0])
            person_count = max(person_count, len(results[0].boxes))
            annotated_frame = results[0].plot()
            out.write(annotated_frame)
        
        cap.release()
        out.release()
        processing_time = time.time() - start_time
        return person_count, processing_time