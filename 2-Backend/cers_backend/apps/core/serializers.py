from rest_framework import serializers
from .models import Responder
from apps.emergencies.models import Emergency


class EmergencySummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Emergency
        fields = ['id', 'emergency_type', 'description', 'status', 'severity', 'created_at']


class ResponderSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    emergencies = serializers.SerializerMethodField()

    class Meta:
        model = Responder
        fields = ['id', 'full_name', 'responder_status', 'emergency_category', 'created_at', 'emergencies']

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    # Filters out resolved emergencies
    def get_emergencies(self, obj):
        unresolved_emergencies = obj.emergencies.exclude(status__iexact='resolved')
        return EmergencySummarySerializer(unresolved_emergencies, many=True).data

