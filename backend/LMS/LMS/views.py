from rest_framework import generics, permissions
from .serializers import UserSerializer
from labs.models import User

class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    Allows anyone to create a new user account.
    """
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer