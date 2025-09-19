from rest_framework import serializers
from .models import Location, Bus

class LocationSerializer(serializers.ModelSerializer):
    lat = serializers.FloatField(write_only=True)
    lon = serializers.FloatField(write_only=True)

    class Meta:
        model = Location
        fields = ("bus", "lat", "lon", "speed", "ts", "raw")

    def create(self, validated_data):
        # Pop lat/lon from validated_data
        lat = validated_data.pop("lat")
        lon = validated_data.pop("lon")
        
        # Create Location object using plain floats
        loc = Location.objects.create(lat=lat, lon=lon, **validated_data)
        return loc
