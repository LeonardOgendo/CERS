from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import Emergency, FlaggedArea
from .serializers import EmergencySerializer, FlaggedAreaSerializer
from apps.core.models import Responder


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ReportEmergencyView(generics.CreateAPIView):
    serializer_class = EmergencySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Save emergency with the reporting user
        emergency = serializer.save(user=self.request.user)

        # Try to find a matching available responder
        responder = Responder.objects.filter(
            emergency_category=emergency.emergency_type,
            responder_status='available'
        ).first()

        if responder:
            # Assign responder & update emergency status
            emergency.responder = responder
            emergency.save()

            # Update responder status
            responder.responder_status = 'engaged'
            responder.save()
        
        return emergency


class EmergencyListView(generics.ListAPIView):
    serializer_class = EmergencySerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['emergency_type', 'status', 'severity']

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Emergency.objects.all().order_by('-created_at')

        if self.request.user.is_authenticated:
            queryset = queryset.filter(user=self.request.user)

        return queryset


class EmergencyDetailView(generics.RetrieveAPIView):
    queryset = Emergency.objects.all()
    serializer_class = EmergencySerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Emergency.objects.filter(user=self.request.user)
        return Emergency.objects.none()


class LiveLocationView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')

        if not latitude or not longitude:
            return Response(
                {'error': 'Both latitude and longitude are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({
            'status': 'Location received',
            'coordinates': {
                'latitude': latitude,
                'longitude': longitude
            }
        })


class FlaggedAreasView(generics.ListAPIView):
    serializer_class = FlaggedAreaSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FlaggedArea.objects.filter(is_active=True).order_by('-threat_level', '-last_incident')

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return Response({
            'success': True,
            'count': len(response.data),
            'results': response.data
        })
