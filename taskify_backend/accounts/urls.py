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
)

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("signin/", SigninView.as_view(), name="signin"),
    path("boards/", BoardView.as_view(), name="board_view"),
    path("cards/", CardView.as_view(), name="card_view"),  # POST and GET all cards
    path("cards/<int:pk>/", CardView.as_view(), name="card_detail"),  # PATCH and DELETE
    path("tasks/", TaskView.as_view(), name="task_view"),  # POST and GET
    path("tasks/<int:pk>/", TaskView.as_view(), name="task_detail"),  # DELETE
    path("tasks/<int:pk>/update/", update_task, name="update_task"),  # PATCH
    path("boards/<int:pk>/", BoardDetailView.as_view(), name="board_detail"),
    path("users/", UserListView.as_view(), name="users"),
]
