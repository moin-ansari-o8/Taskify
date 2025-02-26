# serializers.py
from rest_framework import serializers
from .models import User, Board, Card, Task


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "password", "email", "role"]


class BoardSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Board
        fields = ["id", "board_title", "user", "username"]
        read_only_fields = ["id", "user"]

    def create(self, validated_data):
        username = validated_data.pop("username", None)
        if username:
            user = User.objects.get(username=username)
            validated_data["user"] = user
        return super().create(validated_data)


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "id",
            "task_title",
            "desc",
            "card",
            "due_date",
            "created_at",
            "priority",
            "checked",
            "order",  # Added order
        ]
        read_only_fields = ["id", "created_at"]


class CardSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Card
        fields = [
            "id",
            "card_title",
            "board",
            "category",
            "created_date_time",
            "updated_date_time",
            "tasks",
            "order",  # Added order
        ]
        read_only_fields = ["id", "created_date_time", "updated_date_time"]

    def create(self, validated_data):
        return Card.objects.create(**validated_data)
