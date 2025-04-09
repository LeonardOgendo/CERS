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
            ('acknowledged', 'Acknowledged'),
            ('en_route', 'En Route'),
            ('on_site', 'On_Site'),
            ('resolved', 'Resolved')
        ]
    )

    responder = models.ForeignKey(
        'core.Responder',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='emergencies'
    )
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.emergency_type == 'security':
            self.flag_security_area()

    def flag_security_area(self):
        area, created = FlaggedArea.objects.get_or_create(
            latitude=self.latitude,
            longitude=self.longitude,
            defaults={
                'threat_level': 'high' if self.severity == 'critical' else 'medium',
                'incident_count': 1,
                'last_incident': self.created_at
            }
        )

        if not created:
            area.incident_count += 1
            area.last_incident = self.created_at
            if area.incident_count >= 5:
                area.threat_level = 'high'
            elif area.incident_count >= 3:
                area.threat_level = 'medium'
            area.save()

    def __str__(self):
        return f"{self.get_emergency_type_display()} - {self.get_severity_display()}"


class FlaggedArea(models.Model):
    THREAT_LEVELS = [
        ('high', 'High Threat'),
        ('medium', 'Medium Threat'),
        ('low', 'Low Threat'),
    ]

    latitude = models.FloatField()
    longitude = models.FloatField()
    threat_level = models.CharField(max_length=20, choices=THREAT_LEVELS, default='medium')
    incident_count = models.PositiveIntegerField(default=0)
    last_incident = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-threat_level', '-last_incident']

    def __str__(self):
        return f"Flagged Area ({self.latitude}, {self.longitude}) - {self.get_threat_level_display()}"