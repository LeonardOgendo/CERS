from django.urls import path
from .views import (
    ReportEmergencyView,
    EmergencyListView,
    EmergencyDetailView,
    LiveLocationView,
    FlaggedAreasView,
    EmergencyByResponderView,
    UpdateEmergencyStatusView,
    ActiveEmergenciesListView,
    ResolvedEmergenciesListView,
    AllEmergencies,
)

urlpatterns = [
    path('report/', ReportEmergencyView.as_view(), name='report-emergency'),
    path('list/', EmergencyListView.as_view(), name='emergency-list'),
    path('active/list/', ActiveEmergenciesListView.as_view(), name='active-emergencies-list'),
    path('resolved/list/', ResolvedEmergenciesListView.as_view(), name="resolved-emergencies-list" ),
    path('<int:id>/', EmergencyDetailView.as_view(), name='emergency-detail'),
    path('responder/emergencies/<int:responder_id>/', EmergencyByResponderView.as_view(), name='responder-emergency-detail'),
    path('update_status/<int:pk>/', UpdateEmergencyStatusView.as_view(), name='update-emergency-status'),
    path('all/list/', AllEmergencies.as_view(), name="all-emergencies"),
    path('location/update/', LiveLocationView.as_view(), name='update-location'),
    path('flagged-areas/', FlaggedAreasView.as_view(), name='flagged-areas'),
]