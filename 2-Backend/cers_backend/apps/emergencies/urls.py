from django.urls import path
from .views import (
    ReportEmergencyView,
    EmergencyListView,
    EmergencyDetailView,
    LiveLocationView
)

urlpatterns = [
    path('report/', ReportEmergencyView.as_view(), name='report-emergency'),
    path('list/', EmergencyListView.as_view(), name='emergency-list'),
    path('<int:id>/', EmergencyDetailView.as_view(), name='emergency-detail'),
    path('location/update/', LiveLocationView.as_view(), name='update-location'),
]