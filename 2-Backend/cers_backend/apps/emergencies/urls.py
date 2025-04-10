from django.urls import path
from .views import (
    ReportEmergencyView,
    EmergencyListView,
    EmergencyDetailView,
    LiveLocationView,
    FlaggedAreasView,
    EmergencyByResponderView,
    UpdateEmergencyStatusView
)

urlpatterns = [
    path('report/', ReportEmergencyView.as_view(), name='report-emergency'),
    path('list/', EmergencyListView.as_view(), name='emergency-list'),
    path('<int:id>/', EmergencyDetailView.as_view(), name='emergency-detail'),
    path('responder/emergencies/<int:responder_id>/', EmergencyByResponderView.as_view(), name='responder-emergency-detail'),
    path('update_status/<int:pk>/', UpdateEmergencyStatusView.as_view(), name='update-emergency-status'),
    path('location/update/', LiveLocationView.as_view(), name='update-location'),
    path('flagged-areas/', FlaggedAreasView.as_view(), name='flagged-areas'),
]