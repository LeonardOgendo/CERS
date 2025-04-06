from rest_framework import serializers
from .models import Responder

class ResponderSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Responder
        fields = ['id', 'full_name', 'responder_status', 'emergency_category', 'created_at']

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"