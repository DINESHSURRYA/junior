from celery import shared_task
from .models import Bus, Stop
from .utils import get_eta_osrm  # wrapper

@shared_task
def compute_eta_for_bus(bus_id):
    b = Bus.objects.get(pk=bus_id)
    latest = b.locs.order_by("-ts").first()
    if not latest:
        return
    # assume we compute ETA to its next stop:
    next_stop = Stop.objects.filter(route__in=b.route_set.all()).order_by("seq").first()
    eta_s = get_eta_osrm((latest.point.y, latest.point.x), (next_stop.loc.y, next_stop.loc.x))
    # store result somewhere, e.g., cache or DB
    from django.core.cache import cache
    cache.set(f"eta_bus_{bus_id}_{next_stop.id}", eta_s, 60*5)
