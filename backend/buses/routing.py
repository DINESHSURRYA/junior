from django.urls import re_path
from .consumers import BusConsumer

ws_urlpatterns = [
    re_path(r"ws/bus/(?P<bus_id>\d+)/$", BusConsumer.as_asgi()),
]
