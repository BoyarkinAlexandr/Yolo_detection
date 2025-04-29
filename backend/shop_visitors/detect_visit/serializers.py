from rest_framework import serializers
from .models import DetectionHistory

class DetectionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DetectionHistory
        fields = '__all__'