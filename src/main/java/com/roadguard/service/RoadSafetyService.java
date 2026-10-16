package com.roadguard.service;

import com.roadguard.model.RoadSegment;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class RoadSafetyService {
    private final Map<String, RoadSegment> roadCatalog = new ConcurrentHashMap<>();

    public RoadSafetyService() {
        initDefaultRoads();
    }

    private void initDefaultRoads() {
        // High danger roads
        addRoad(new RoadSegment(
            "road-101",
            "Outer Ring Road (Marathahalli - Bellandur Stretch)",
            "Bengaluru", "East Zone", 7.8,
            2.1, 19, 7, 11.2,
            12.935240, 77.685320,
            "EXTREME HAZARD: Multiple deep craters across center & right lanes. Severe suspension hazard for small cars and two-wheelers."
        ));

        addRoad(new RoadSegment(
            "road-102",
            "Bannerghatta National Highway Section 9",
            "Bengaluru", "South Zone", 12.4,
            3.4, 14, 5, 8.6,
            12.871230, 77.593210,
            "UNSAFE: Heavy truck ruts and unpaved shoulder sinkholes. Two-wheelers prone to skidding during rain."
        ));

        addRoad(new RoadSegment(
            "road-103",
            "Old Madras Road (K.R. Puram Junction)",
            "Bengaluru", "East Zone", 5.2,
            3.8, 12, 4, 7.9,
            13.003410, 77.691230,
            "UNSAFE: Uneven asphalt patchwork with sharp jagged edge potholes near flyover pillars."
        ));

        addRoad(new RoadSegment(
            "road-104",
            "Industrial Bypass Road (Peenya Phase 2)",
            "Bengaluru", "North Zone", 9.1,
            2.8, 23, 9, 12.5,
            13.031200, 77.512300,
            "CRITICAL DANGER: Continuous trenching and broken storm water grating. Impassable for low-clearance sedans."
        ));

        // Moderate caution roads
        addRoad(new RoadSegment(
            "road-105",
            "MG Road - Commercial Boulevard",
            "Bengaluru", "Central Zone", 4.3,
            5.8, 6, 2, 5.1,
            12.975420, 77.608310,
            "MODERATE CAUTION: Occasional manhole subsidence and surface cracking near pedestrian crossings."
        ));

        addRoad(new RoadSegment(
            "road-106",
            "Sarjapur Main Road (Carmelaram Section)",
            "Bengaluru", "South East", 8.0,
            4.9, 11, 3, 6.4,
            12.909800, 77.701200,
            "MODERATE CAUTION: Ongoing pipeline excavation with rough metal plates across carriage way."
        ));

        // Safe roads
        addRoad(new RoadSegment(
            "road-107",
            "Airport Elevated Expressway",
            "Bengaluru", "North Zone", 22.0,
            9.4, 1, 0, 1.8,
            13.198900, 77.706800,
            "SAFE: Smooth hot-mix asphalt surface with active drainage. Excellent passability for all vehicles."
        ));

        addRoad(new RoadSegment(
            "road-108",
            "Nice Ring Road (Hosur to Kanakapura Expressway)",
            "Bengaluru", "South Zone", 31.5,
            8.9, 2, 0, 2.2,
            12.842100, 77.562100,
            "SAFE: High quality concrete surface with minimal road ripples."
        ));
        // Additional urban corridors
        addRoad(new RoadSegment(
            "road-109",
            "Whitefield Main Road (Hope Farm Corridor)",
            "Bengaluru", "Mahadevapura", 6.8,
            4.2, 8, 3, 7.8,
            12.969810, 77.749920,
            "UNSAFE: Broken tarmac edges and metro construction diversions. Moderate rim bend hazard."
        ));

        addRoad(new RoadSegment(
            "road-110",
            "100 Feet Road (Indiranagar 12th Main to Domlur)",
            "Bengaluru", "East Zone", 3.2,
            6.2, 5, 1, 4.5,
            12.971890, 77.641150,
            "MODERATE CAUTION: Road patchwork near junction crossings. Manageable at moderate speeds."
        ));

        addRoad(new RoadSegment(
            "road-111",
            "Koramangala 80 Feet Road (Sony World Signal)",
            "Bengaluru", "South East", 4.1,
            5.1, 7, 2, 5.8,
            12.934510, 77.625820,
            "MODERATE CAUTION: Water-filled dip near storm drain. Two-wheelers should avoid curbside lane."
        ));

        addRoad(new RoadSegment(
            "road-112",
            "Hosur Road Expressway (Electronic City Phase 1)",
            "Bengaluru", "South Zone", 14.2,
            8.4, 2, 0, 2.8,
            12.845210, 77.660140,
            "SAFE: High-speed multi-lane surface in good condition with minor rumble strips."
        ));
    }

    private void addRoad(RoadSegment segment) {
        roadCatalog.put(segment.getId(), segment);
    }

    public List<RoadSegment> getAllRoads() {
        List<RoadSegment> list = new ArrayList<>(roadCatalog.values());
        // Sort by least safe first
        list.sort(Comparator.comparingDouble(RoadSegment::getSafetyScore));
        return list;
    }

    public List<RoadSegment> getUnsafeRoads() {
        List<RoadSegment> list = new ArrayList<>();
        for (RoadSegment r : roadCatalog.values()) {
            if (r.isUnsafe()) {
                list.add(r);
            }
        }
        list.sort(Comparator.comparingDouble(RoadSegment::getSafetyScore));
        return list;
    }

    public RoadSegment getRoadById(String id) {
        return roadCatalog.get(id);
    }

    public RoadSegment findRoadByName(String name) {
        if (name == null) return null;
        String q = name.toLowerCase();
        for (RoadSegment r : roadCatalog.values()) {
            if (r.getName().toLowerCase().contains(q)) return r;
        }
        return null;
    }

    public static class RoadDistance {
        private final RoadSegment road;
        private final double distanceKm;
        private final double distanceMeters;

        public RoadDistance(RoadSegment road, double distanceKm) {
            this.road = road;
            this.distanceKm = distanceKm;
            this.distanceMeters = distanceKm * 1000.0;
        }

        public RoadSegment getRoad() { return road; }
        public double getDistanceKm() { return distanceKm; }
        public double getDistanceMeters() { return distanceMeters; }

        public String toJson() {
            String roadJson = road.toJson();
            return roadJson.substring(0, roadJson.length() - 1) +
                   String.format(java.util.Locale.US, ",\"distanceKm\":%.2f,\"distanceMeters\":%.0f}", distanceKm, distanceMeters);
        }
    }

    public List<RoadDistance> getNearbyRoads(double lat, double lng, int limit) {
        List<RoadDistance> list = new ArrayList<>();
        for (RoadSegment r : roadCatalog.values()) {
            double dist = calculateDistanceKm(lat, lng, r.getCenterLat(), r.getCenterLng());
            list.add(new RoadDistance(r, dist));
        }
        list.sort(Comparator.comparingDouble(RoadDistance::getDistanceKm));
        if (limit > 0 && list.size() > limit) {
            return new ArrayList<>(list.subList(0, limit));
        }
        return list;
    }

    public static double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371.0; // km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
