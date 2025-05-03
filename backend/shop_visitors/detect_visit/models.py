from django.db import models

class DetectionHistory(models.Model):
    media_type = models.CharField(max_length=10)
    media_file = models.FileField(upload_to='uploads/')
    result_file = models.FileField(upload_to='results/', null=True, blank=True)
    person_count = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    processing_time = models.FloatField()

    def __str__(self):
        return f"{self.media_type} - {self.timestamp}"