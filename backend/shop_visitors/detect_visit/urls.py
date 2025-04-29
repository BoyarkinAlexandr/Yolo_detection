from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.UploadMediaView.as_view(), name='upload'),
    path('history/', views.HistoryView.as_view(), name='history'),
    path('report/<str:format_type>/', views.ReportView.as_view(), name='report'),
]