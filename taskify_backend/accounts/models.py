# models.py
from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class User(models.Model):
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=128)
    email = models.EmailField(max_length=100, unique=True)
    role = models.CharField(max_length=10, default="user")

    def save(self, *args, **kwargs):
        if not self.password.startswith("pbkdf2_sha256$"):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.username


class Board(models.Model):
    board_title = models.CharField(max_length=100, default="Untitled Board")
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True, default=None
    )

    def __str__(self):
        return self.board_title

    class Meta:
        unique_together = ("user", "board_title")


class Card(models.Model):
    CATEGORY_CHOICES = (
        ("todo", "ToDo"),
        ("schedule", "Schedule"),
        ("project", "Project"),
    )
    card_title = models.CharField(max_length=50, default="New Card")
    board = models.ForeignKey(Board, on_delete=models.CASCADE, default=1)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default="todo")
    created_date_time = models.DateTimeField(auto_now_add=True)
    updated_date_time = models.DateTimeField(auto_now=True)
    order = models.IntegerField(default=0)  # New field

    def __str__(self):
        return f"{self.card_title} ({self.category})"


class Task(models.Model):
    PRIORITY_CHOICES = (("high", "High"), ("medium", "Medium"), ("low", "Low"))
    task_title = models.CharField(max_length=200, default="New Task")
    desc = models.TextField(blank=True, default="")
    card = models.ForeignKey(
        "Card", on_delete=models.CASCADE, default=1, related_name="tasks"
    )
    due_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    priority = models.CharField(
        max_length=6, choices=PRIORITY_CHOICES, default="medium"
    )
    checked = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    showNotification = models.BooleanField(default=False)  # New field

    # def save(self, *args, **kwargs):
    #     # Check if this is an update and showNotification is in the request data
    #     if self.pk is not None and "request" in kwargs:
    #         request_data = kwargs["request"].data
    #         if "showNotification" in request_data:
    #             # Respect the PATCH value, don’t override
    #             super().save(*args, **kwargs)
    #             return
    #     # Default logic for new tasks or non-PATCH updates
    #     if self.due_date and not self.showNotification:
    #         from django.utils import timezone

    #         if timezone.now() >= self.due_date:
    #             self.showNotification = True
    #     super().save(*args, **kwargs)
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # No custom logic

    def __str__(self):
        return f"{self.task_title} ({self.priority})"
