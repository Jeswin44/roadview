package com.roadguard.service;

import com.roadguard.model.GpsCoordinate;
import com.roadguard.model.Pothole;

import java.util.*;
import java.util.concurrent.ConcurrentLinkedDeque;

public class GpsTrackingService {
    private GpsCoordinate currentPosition;
    private final Deque<GpsCoordinate> routeHistory = new ConcurrentLinkedDeque<>();
    private static final int MAX_HISTORY = 200;
    private boolean isTrackingActive = true;

    // Simulation route waypoints (e.g. realistic vehicle track along Outer Ring Road & MG Road)
    private final List<GpsCoordinate> simulationRoute = new ArrayList<>();
    private int simulationIndex = 0;

    public GpsTrackingService() {
        // Initial location: Bengaluru Tech Corridor
        this.currentPosition = new GpsCoordinate(12.935240, 77.685320, 915.0, 42.0, 85.0, "Outer Ring Road, Bellandur, Bengaluru");
        routeHistory.add(this.currentPosition);
        initSimulationRoute();
    }

    private void initSimulationRoute() {
        simulationRoute.add(new GpsCoordinate(12.934800, 77.683000, 912.0, 48.0, 90.0, "Outer Ring Road - Sector 1"));
        simulationRoute.add(new GpsCoordinate(12.935100, 77.684200, 913.0, 44.0, 88.0, "Outer Ring Road - Approaching EcoSpace"));
        simulationRoute.add(new GpsCoordinate(12.935240, 77.685320, 915.0, 28.0, 86.0, "Outer Ring Road - Near Flyover Crater Zone"));
        simulationRoute.add(new GpsCoordinate(12.935600, 77.686900, 914.0, 32.0, 84.0, "Outer Ring Road - Flyover Exit Ramp"));
        simulationRoute.add(new GpsCoordinate(12.936200, 77.688800, 916.0, 52.0, 82.0, "Outer Ring Road - Devarabisanahalli"));
        simulationRoute.add(new GpsCoordinate(12.937100, 77.691200, 918.0, 45.0, 79.0, "Outer Ring Road - Marathahalli Approach"));
        simulationRoute.add(new GpsCoordinate(12.942000, 77.696500, 920.0, 38.0, 65.0, "Old Airport Road Junction"));
    }

    public synchronized GpsCoordinate updatePosition(double lat, double lng, double speedKmh, double heading, double alt, String address) {
        GpsCoordinate point = new GpsCoordinate(lat, lng, alt, speedKmh, heading, address != null ? address : "Live Vehicle Telemetry");
        this.currentPosition = point;
        if (routeHistory.size() >= MAX_HISTORY) {
            routeHistory.pollFirst();
        }
        routeHistory.add(point);
        return point;
    }

    public synchronized GpsCoordinate stepSimulation() {
        if (simulationRoute.isEmpty()) return currentPosition;
        simulationIndex = (simulationIndex + 1) % simulationRoute.size();
        GpsCoordinate next = simulationRoute.get(simulationIndex);
        return updatePosition(next.getLatitude(), next.getLongitude(), next.getSpeedKmh(), next.getHeading(), next.getAltitude(), next.getAddress());
    }

    public GpsCoordinate getCurrentPosition() {
        return currentPosition;
    }

    public List<GpsCoordinate> getRouteHistory() {
        return new ArrayList<>(routeHistory);
    }

    public boolean isTrackingActive() {
        return isTrackingActive;
    }

    public void setTrackingActive(boolean trackingActive) {
        isTrackingActive = trackingActive;
    }

    // Proximity alert: distance to pothole in meters
    public double calculateDistanceMeters(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Radius of earth in meters
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public List<PotholeProximityAlert> checkNearbyHazards(List<Pothole> potholes, double radiusMeters) {
        List<PotholeProximityAlert> alerts = new ArrayList<>();
        if (currentPosition == null || potholes == null) return alerts;

        for (Pothole p : potholes) {
            double dist = calculateDistanceMeters(currentPosition.getLatitude(), currentPosition.getLongitude(), p.getLatitude(), p.getLongitude());
            if (dist <= radiusMeters) {
                alerts.add(new PotholeProximityAlert(p, dist));
            }
        }
        alerts.sort(Comparator.comparingDouble(PotholeProximityAlert::getDistanceMeters));
        return alerts;
    }

    public static class PotholeProximityAlert {
        private final Pothole pothole;
        private final double distanceMeters;

        public PotholeProximityAlert(Pothole pothole, double distanceMeters) {
            this.pothole = pothole;
            this.distanceMeters = distanceMeters;
        }

        public Pothole getPothole() { return pothole; }
        public double getDistanceMeters() { return distanceMeters; }

        public String toJson() {
            return String.format("{\"distanceMeters\":%.1f,\"pothole\":%s}", distanceMeters, pothole.toJson());
        }
    }
}
