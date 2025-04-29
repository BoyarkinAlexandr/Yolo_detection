from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import DetectionHistory
from .serializers import DetectionHistorySerializer
from .yolo_processor import YOLOProcessor
from django.conf import settings
import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from openpyxl import Workbook
from django.http import FileResponse
import io

class UploadMediaView(APIView):
    def post(self, request):
        file = request.FILES['file']
        media_type = 'image' if file.content_type.startswith('image') else 'video'
        output_filename = f"result_{file.name}"
        output_path = os.path.join(settings.MEDIA_ROOT, 'results', output_filename)
        
        # Save uploaded file
        detection = DetectionHistory.objects.create(
            media_type=media_type,
            media_file=file,
            person_count=0,
            processing_time=0
        )
        
        # Process with YOLO
        processor = YOLOProcessor()
        if media_type == 'image':
            person_count, processing_time = processor.process_image(
                detection.media_file.path, output_path
            )
        else:
            person_count, processing_time = processor.process_video(
                detection.media_file.path, output_path
            )
        
        # Update detection record
        detection.person_count = person_count
        detection.processing_time = processing_time
        detection.result_file = os.path.join('results', output_filename)
        detection.save()
        
        serializer = DetectionHistorySerializer(detection)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class HistoryView(APIView):
    def get(self, request):
        detections = DetectionHistory.objects.all().order_by('-timestamp')
        serializer = DetectionHistorySerializer(detections, many=True)
        return Response(serializer.data)

class ReportView(APIView):
    def get(self, request, format_type):
        detections = DetectionHistory.objects.all().order_by('-timestamp')
        
        if format_type == 'pdf':
            buffer = io.BytesIO()
            p = canvas.Canvas(buffer, pagesize=letter)
            p.drawString(100, 750, "Visitor Counting Report")
            y = 700
            for detection in detections:
                p.drawString(100, y, f"{detection.timestamp}: {detection.person_count} persons, {detection.media_type}")
                y -= 20
            p.showPage()
            p.save()
            buffer.seek(0)
            return FileResponse(buffer, as_attachment=True, filename='report.pdf')
        
        elif format_type == 'excel':
            wb = Workbook()
            ws = wb.active
            ws.title = "Visitor Counting Report"
            ws.append(["Timestamp", "Media Type", "Person Count", "Processing Time"])
            for detection in detections:
                ws.append([
                    detection.timestamp,
                    detection.media_type,
                    detection.person_count,
                    detection.processing_time
                ])
            buffer = io.BytesIO()
            wb.save(buffer)
            buffer.seek(0)
            return FileResponse(buffer, as_attachment=True, filename='report.xlsx')
        
        return Response({"error": "Invalid format"}, status=status.HTTP_400_BAD_REQUEST)