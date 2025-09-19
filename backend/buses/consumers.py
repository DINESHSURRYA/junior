from channels.generic.websocket import AsyncJsonWebsocketConsumer

class BusConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.bus_id = self.scope["url_route"]["kwargs"]["bus_id"]
        self.group = f"bus_{self.bus_id}"
        await self.channel_layer.group_add(self.group, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group, self.channel_name)

    async def loc_update(self, event):
        # event contains lat, lon, ts
        await self.send_json({"type": "loc", "lat": event["lat"], "lon": event["lon"], "ts": event["ts"]})

    # routing name type must match what we call from server: "loc.update"
    async def loc_update(self, event):
        await self.send_json(event)
