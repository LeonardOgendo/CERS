from django.urls import path
from .views import (
    RegisterUserView,
    LoginUserView,
    LogoutView,
    ProfileView,
    LocationUpdateView,
    PasswordChangeView,
    AllUsersListView,
)

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='user-register'),
    path('login/', LoginUserView.as_view(), name='user-login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='user-profile'),
    path('profile/location/', LocationUpdateView.as_view(), name='update-location'),
    path('profile/change-password/', PasswordChangeView.as_view(), name='change-password'),
    path('all-users/', AllUsersListView.as_view(), name='all-users'),
]