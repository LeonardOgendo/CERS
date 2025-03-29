from django.db import models
from django.conf import settings

class Emergency(models.Model):
    EMERGENCY_TYPES = [
        ('health', 'Health Emergency'),
        ('security', 'Security Emergency'),
        ('fire', 'Fire Emergency'),
    ]

    SEVERITY_LEVELS = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('low', 'Low'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    emergency_type = models.CharField(
        max_length=20,
        choices=EMERGENCY_TYPES,
        default='health'
    )
    description = models.TextField()
    severity = models.CharField(
        max_length=20,
        choices=SEVERITY_LEVELS,
        default='high'
    )
    latitude = models.FloatField()
    longitude = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        default='reported',
        choices=[
            ('reported', 'Reported'),
            ('in_progress', 'In Progress'),
            ('resolved', 'Resolved'),
        ]
    )

    def __str__(self):
        return f"{self.get_emergency_type_display()} - {self.get_severity_display()}"