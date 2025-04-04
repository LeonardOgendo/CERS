from rest_framework import serializers
from .models import Emergency, FlaggedArea
from apps.users.models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'identifier', 'first_name', 'last_name', 'email']

class EmergencySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Emergency
        fields = ['id', 'user', 'emergency_type', 'description', 'severity',
                  'latitude', 'longitude', 'created_at', 'status']
        read_only_fields = ['id', 'created_at', 'status', 'user']


class FlaggedAreaSerializer(serializers.ModelSerializer):
    threat_level_display = serializers.CharField(source='get_threat_level_display', read_only=True)

    class Meta:
        model = FlaggedArea
        fields = [
            'id', 'latitude', 'longitude', 'threat_level',
            'threat_level_display', 'incident_count', 'last_incident',
            'created_at', 'updated_at', 'is_active'
        ]
        read_only_fields = fields