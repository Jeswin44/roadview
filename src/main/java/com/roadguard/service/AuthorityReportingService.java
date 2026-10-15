package com.roadguard.service;

import com.roadguard.model.DispatchReport;
import com.roadguard.model.Pothole;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class AuthorityReportingService {
    private final Map<String, DispatchReport> dispatches = new ConcurrentHashMap<>();
    private final AtomicInteger sequenceCounter = new AtomicInteger(1080);

    public AuthorityReportingService() {
        initDefaultDispatches();
    }

    private void initDefaultDispatches() {
        createDispatch(
            "p-101",
            "MG Road - Commercial Corridor",
            12.975420, 77.608310,
            92, "CRITICAL DANGER",
            "National Highways Authority & Municipal Works Command",
            "EMERGENCY_24H",
            "assets/sample_crater_deep.jpg"
        );
        createDispatch(
            "p-104",
            "Outer Ring Road - Flyover Exit 4",
            12.935240, 77.685320,
            88, "CRITICAL DANGER",
            "Highways Safety Division (Ward 14)",
            "EMERGENCY_24H",
            "assets/sample_pothole_water.jpg"
        );
        createDispatch(
            "p-106",
            "Bannerghatta National Highway Section 9",
            12.871230, 77.593210,
            76, "SEVERE",
            "State Public Works Department (PWD)",
            "HIGH_48H",
            "assets/sample_asphalt_trench.jpg"
        );
    }

    public DispatchReport createAutomaticDispatchForPothole(Pothole pothole) {
        if (pothole == null) return null;

        String authority;
        if (pothole.getRoadName() != null && pothole.getRoadName().toLowerCase().contains("highway")) {
            authority = "National Highways Authority of India (NHAI) - Express Corridor Division";
        } else if (pothole.getRoadName() != null && pothole.getRoadName().toLowerCase().contains("ring road")) {
            authority = "Metropolitan Development Authority - Arterial Road Unit";
        } else {
            authority = "Municipal Corporation Road Maintenance & Infrastructure Command";
        }

        String urgency = pothole.getSeverityScore() >= 85 ? "EMERGENCY_24H" : "HIGH_48H";

        DispatchReport report = createDispatch(
            pothole.getId(),
            pothole.getRoadName(),
            pothole.getLatitude(),
            pothole.getLongitude(),
            pothole.getSeverityScore(),
            pothole.getSeverityLevel(),
            authority,
            urgency,
            pothole.getImageUrl()
        );

        pothole.setDispatchId(report.getDispatchId());
        pothole.setStatus("DISPATCHED");
        return report;
    }

    public DispatchReport createDispatch(String potholeId, String roadName, double lat, double lng,
                                         int severityScore, String severityLevel, String authorityName,
                                         String urgency, String snapshotUrl) {
        String dispatchId = "DISP-" + sequenceCounter.incrementAndGet();
        DispatchReport report = new DispatchReport(
            dispatchId, potholeId, roadName, lat, lng,
            severityScore, severityLevel, authorityName, urgency, snapshotUrl
        );

        dispatches.put(dispatchId, report);
        return report;
    }

    public List<DispatchReport> getAllDispatches() {
        List<DispatchReport> list = new ArrayList<>(dispatches.values());
        list.sort((a, b) -> b.getReportedAt().compareTo(a.getReportedAt()));
        return list;
    }

    public DispatchReport getDispatchById(String id) {
        return dispatches.get(id);
    }

    public boolean updateStatus(String dispatchId, String newStatus, String notes) {
        DispatchReport report = dispatches.get(dispatchId);
        if (report != null) {
            report.setStatus(newStatus);
            report.addEvent("[" + java.time.Instant.now().toString() + "] Status updated to: " + newStatus + (notes != null ? " (" + notes + ")" : ""));
            return true;
        }
        return false;
    }
}
