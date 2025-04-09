from django.urls import path
from .views import ResponderListAPIView, ResponderDetailAPIView

urlpatterns = [
    path('responders/view/', ResponderListAPIView.as_view(), name='responders-list'),
    path('responder/detailview/<int:pk>/', ResponderDetailAPIView.as_view(), name='responder-detailview'),
]
