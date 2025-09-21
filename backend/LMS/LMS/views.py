from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    return render(request, 'index.html', {'title': 'Home'})

def login_page(request):
    return render(request, 'login.html')

def register_page(request):
    return render(request, 'register.html')