from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .serializers import LocationSerializer
from .models import Location

# ------------------------------
# Homepage view
# ------------------------------
def home(request):
    """
    Simple API homepage
    """
    return JsonResponse({"message": "Welcome to the GPS ETA API"})


# ------------------------------
# Location API
# ------------------------------
class LocationCreate(APIView):
    """
    API endpoint to create a new bus location.
    Sends real-time updates via Channels.
    """

    def post(self, request):
        serializer = LocationSerializer(data=request.data)
        if serializer.is_valid():
            # Save location
            loc = serializer.save()

            # Send update via channel layer
            channel_layer = get_channel_layer()
            if channel_layer:
                try:
                    async_to_sync(channel_layer.group_send)(
                        f"bus_{loc.bus.id}",  # group name
                        {
                            "type": "loc_update",  # must match consumer method
                            "lat": loc.lat,
                            "lon": loc.lon,
                            "ts": loc.ts.isoformat(),
                        }
                    )
                except Exception as e:
                    # Log errors (you can use logging instead of print)
                    print(f"Channel send failed: {e}")

            return Response({"ok": True}, status=status.HTTP_201_CREATED)

        # Return validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
