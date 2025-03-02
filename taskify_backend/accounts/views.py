from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from .models import User, Board, Card, Task
from .serializers import UserSerializer, BoardSerializer, CardSerializer, TaskSerializer
from rest_framework.decorators import api_view
from rest_framework import status


class SignupView(APIView):
    def post(self, request):
        data = request.data.copy()  # Copy request data to modify it

        # Hash the password before saving
        if "password" in data:
            data["password"] = make_password(data["password"])

        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User Created Successfully!!!"}, status=201)
        return Response(serializer.errors, status=400)


class SigninView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        try:
            user = User.objects.get(username=username)
            if check_password(password, user.password):
                return Response(
                    {
                        "message": "Sign in successful!",
                        "username": user.username,
                        "role": user.role,  # Include role in response
                    },
                    status=200,
                )
            else:
                return Response({"error": "Invalid password!"}, status=401)
        except User.DoesNotExist:
            return Response({"error": "Username not found!"}, status=404)


class BoardView(APIView):
    def get(self, request):
        username = request.query_params.get("username")
        if username:
            boards = Board.objects.filter(user__username=username)
            serializer = BoardSerializer(boards, many=True)
            return Response(serializer.data)
        return Response({"error": "Username required"}, status=400)

    def post(self, request):
        board_name = request.data.get(
            "board_title"
        )  # Changed from "name" to match frontend
        username = request.data.get("username")

        if Board.objects.filter(
            board_title=board_name, user__username=username
        ).exists():
            return Response(
                {"error": "A board with this name already exists for this user!"},
                status=400,
            )

        serializer = BoardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Board created!", "board": serializer.data}, status=201
            )
        return Response(serializer.errors, status=400)


class BoardDetailView(APIView):
    def get(self, request, pk):
        username = request.query_params.get("username")
        if username:
            try:
                board = Board.objects.get(id=pk, user__username=username)
                serializer = BoardSerializer(board)
                return Response(serializer.data)
            except Board.DoesNotExist:
                return Response({"error": "Board not found"}, status=404)
        return Response({"error": "Username required"}, status=400)

    def patch(self, request, pk):
        username = request.data.get("username")
        if username:
            try:
                board = Board.objects.get(id=pk, user__username=username)
                serializer = BoardSerializer(board, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response({"error": serializer.errors}, status=400)
            except Board.DoesNotExist:
                return Response({"error": "Board not found"}, status=404)
        return Response({"error": "Username required"}, status=400)

    def delete(self, request, pk):
        username = request.query_params.get("username")
        if username:
            try:
                board = Board.objects.get(id=pk, user__username=username)
                board.delete()
                return Response(status=204)
            except Board.DoesNotExist:
                return Response({"error": "Board not found"}, status=404)
        return Response({"error": "Username required"}, status=400)


class CardView(APIView):
    def get(self, request):
        username = request.query_params.get("username")
        board_id = request.query_params.get("board_id")
        if username and board_id:
            cards = Card.objects.filter(
                board__user__username=username, board_id=board_id
            ).order_by(
                "order"
            )  # Sort by order
            serializer = CardSerializer(cards, many=True)
            return Response(serializer.data)
        return Response({"error": "Username and Board ID required"}, status=400)

    def post(self, request):
        serializer = CardSerializer(data=request.data)
        if serializer.is_valid():
            card = serializer.save()
            return Response(CardSerializer(card).data, status=201)
        return Response({"error": serializer.errors}, status=400)

    def patch(self, request, pk=None):
        try:
            card = Card.objects.get(
                id=pk, board__user__username=request.data.get("username")
            )
            serializer = CardSerializer(card, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response({"error": serializer.errors}, status=400)
        except Card.DoesNotExist:
            return Response({"error": "Card not found"}, status=404)

    def delete(self, request, pk=None):
        try:
            card = Card.objects.get(
                id=pk, board__user__username=request.query_params.get("username")
            )
            card.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Card.DoesNotExist:
            return Response({"error": "Card not found"}, status=404)


class TaskView(APIView):
    def get(self, request, pk=None):  # Add pk parameter
        if pk:  # Fetch single task by ID
            try:
                task = Task.objects.get(id=pk)
                serializer = TaskSerializer(task)
                return Response(serializer.data)
            except Task.DoesNotExist:
                return Response({"error": "Task not found"}, status=404)
        card_id = request.query_params.get("card_id")  # Existing behavior
        if card_id:
            tasks = Task.objects.filter(card_id=card_id)
            serializer = TaskSerializer(tasks, many=True)
            return Response(serializer.data)
        return Response({"error": "Card ID or Task ID required"}, status=400)

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            task = serializer.save()
            return Response(TaskSerializer(task).data, status=201)
        return Response({"error": serializer.errors}, status=400)

    def delete(self, request, pk=None):
        try:
            task = Task.objects.get(id=pk)
            task.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Task.DoesNotExist:
            return Response(
                {"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND
            )


@api_view(["PATCH"])
def update_task(request, pk):
    try:
        task = Task.objects.get(id=pk)
    except Task.DoesNotExist:
        return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = TaskSerializer(task, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()  # Ensure save persists
        updated_task = Task.objects.get(id=pk)  # Fetch fresh instance
        return Response(TaskSerializer(updated_task).data)
    return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class UserListView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
