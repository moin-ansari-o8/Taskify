# urls.py
from django.urls import path
from .views import (
    SignupView,
    UserListView,
    SigninView,
    BoardView,
    CardView,
    TaskView,
    update_task,
    BoardDetailView,
    NotificationView,
    UserDetailView,  # Add this
)

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("signin/", SigninView.as_view(), name="signin"),
    path("boards/", BoardView.as_view(), name="board_view"),
    path("cards/", CardView.as_view(), name="card_view"),
    path("cards/<int:pk>/", CardView.as_view(), name="card_detail"),
    path("tasks/", TaskView.as_view(), name="task_view"),
    path("tasks/<int:pk>/", TaskView.as_view(), name="task_detail"),
    path("tasks/<int:pk>/update/", update_task, name="update_task"),
    path("boards/<int:pk>/", BoardDetailView.as_view(), name="board_detail"),
    path("users/", UserListView.as_view(), name="users"),
    path("notifications/", NotificationView.as_view(), name="notification_list"),
    path(
        "notifications/<int:pk>/",
        NotificationView.as_view(),
        name="notification_detail",
    ),
    path(
        "users/<str:username>/", UserDetailView.as_view(), name="user_detail"
    ),  # Add this
]
