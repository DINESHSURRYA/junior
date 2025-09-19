from django.urls import path
from buses.views import LocationCreate, home

urlpatterns = [
    path("", home, name="home"),                # root URL
    path("api/loc/", LocationCreate.as_view(), name="loc_create"),
]
