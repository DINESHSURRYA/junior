from django.db import models

class Bus(models.Model):
    name = models.CharField(max_length=64)

class Location(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name="locs")
    lat = models.FloatField()
    lon = models.FloatField()
    speed = models.FloatField(null=True, blank=True)
    ts = models.DateTimeField(auto_now_add=True)
    raw = models.JSONField(null=True, blank=True)
