from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("superuser/", admin.site.urls),
    path('api/admin/', include("apps.core.urls")),
    path("api/users/", include("apps.users.urls")),
    path('api/emergencies/', include('apps.emergencies.urls')),
    path("api/incidents/", include("apps.incidents.urls")),
]

# For Development only
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)