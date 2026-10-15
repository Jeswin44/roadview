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
}
