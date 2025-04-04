from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from django.core.exceptions import ValidationError
from apps.emergencies.models import Emergency

class Responder(models.Model):
    STATUS_CHOICES = [
        ('Available', 'Available'),
        ('Engaged', 'Engaged'),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='responder_profile'
    )
    responder_status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='Available'
    )
    assigned_emergency = models.ForeignKey(
        Emergency,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_responders'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.user.role != 'responder':
            raise ValidationError("Only users with role='responder' can be assigned as Responders.")

    def save(self, *args, **kwargs):
        #  Override save to enforce role check before saving to the database.
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.responder_status}"


# Signal to create Responder profile automatically when a responder user is created
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_responder_profile(sender, instance, created, **kwargs):
    if created and instance.role == 'responder':
        Responder.objects.create(user=instance)




