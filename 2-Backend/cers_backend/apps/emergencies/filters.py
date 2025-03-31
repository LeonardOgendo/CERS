# apps/emergencies/filters.py
import django_filters
from .models import Emergency, FlaggedArea

class EmergencyFilter(django_filters.FilterSet):
    min_date = django_filters.DateFilter(field_name='created_at', lookup_expr='gte', label='From Date')
    max_date = django_filters.DateFilter(field_name='created_at', lookup_expr='lte', label='To Date')
    min_severity = django_filters.ChoiceFilter(
        field_name='severity',
        lookup_expr='gte',
        choices=Emergency.SEVERITY_LEVELS,
        label='Minimum Severity'
    )

    class Meta:
        model = Emergency
        fields = {
            'emergency_type': ['exact'],
            'status': ['exact'],
            'latitude': ['exact', 'range'],
            'longitude': ['exact', 'range'],
        }

class FlaggedAreaFilter(django_filters.FilterSet):
    min_incidents = django_filters.NumberFilter(
        field_name='incident_count',
        lookup_expr='gte',
        label='Minimum Incidents'
    )
    min_threat = django_filters.ChoiceFilter(
        field_name='threat_level',
        lookup_expr='gte',
        choices=FlaggedArea.THREAT_LEVELS,
        label='Minimum Threat Level'
    )

    class Meta:
        model = FlaggedArea
        fields = {
            'is_active': ['exact'],
            'latitude': ['exact', 'range'],
            'longitude': ['exact', 'range'],
        }