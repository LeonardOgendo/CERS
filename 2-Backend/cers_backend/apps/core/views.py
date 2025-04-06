from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Responder
from .serializers import ResponderSerializer

class ResponderListAPIView(APIView):
    def get(self, request):
        responders = Responder.objects.all()
        serializer = ResponderSerializer(responders, many=True)
        return Response(serializer.data)

class ResponderDetailAPIView(APIView):
    def get(self, request, pk):
        responder = get_object_or_404(Responder, pk=pk)
        serializer = ResponderSerializer(responder)
        return Response(serializer.data)

    def patch(self, request, pk):
        