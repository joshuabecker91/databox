from django.urls import path, re_path
from . import views
from django.conf import settings 

urlpatterns = [
    # General Routes:
    path('', views.index),
    # User Routes:
    # path('login_reg/', views.login_reg),
    # path('login/', views.login),
    # path('register/', views.register),
    # path('dashboard/', views.dashboard),
    # path('logout/', views.logout),
]