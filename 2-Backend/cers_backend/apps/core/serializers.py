from rest_framework import serializers
from .models import Responder
from apps.emergencies.models import Emergency


class EmergencySummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Emergency
        fields = ['id', 'emergency_type', 'description', 'status', 'severity', 'created_at']


class ResponderSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    emergencies = EmergencySummarySerializer(many=True, read_only=True)

    class Meta:
        model = Responder
        fields = ['id', 'full_name', 'responder_status', 'emergency_category', 'created_at', 'emergencies']

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"


