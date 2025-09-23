from django.shortcuts import render, redirect
from django.contrib.auth import logout
from rest_framework import generics, permissions
from .serializers import UserSerializer
from labs.models import User

def home(request):
    return render(request, 'index.html')

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

def logout_view(request):
    logout(request)
    return redirect('/login')