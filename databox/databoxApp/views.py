from django.shortcuts import render, redirect

# Create your views here.

def index(request):
    # context = {
    #     'user' : 'John',
    # }
    return render(request, 'index.html')
