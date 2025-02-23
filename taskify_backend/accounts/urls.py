from django.urls import path
from .views import SignupView, UserListView

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("users/", UserListView.as_view(), name="users"),
]
