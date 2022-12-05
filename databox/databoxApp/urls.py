from django.urls import path, re_path
from . import views
from django.conf import settings 
from django.views.generic import TemplateView

urlpatterns = [
    # General Routes:
    path('', TemplateView.as_view(template_name='index.html')),
    path('home/', TemplateView.as_view(template_name='index.html')),

    path('html/', views.index), # this is an html page for testing
    # User Routes:
    # path('login_reg/', views.login_reg),
    # path('login/', views.login),
    # path('register/', views.register),
    # path('dashboard/', views.dashboard),
    # path('logout/', views.logout),
]