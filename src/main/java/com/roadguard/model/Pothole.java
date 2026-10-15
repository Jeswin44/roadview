package com.roadguard.model;

import java.time.Instant;

public class Pothole {
    private String id;
    private String roadId;
    private String roadName;
    private double latitude;
    private double longitude;
    private double depthCm;
    private double diameterCm;
    private double surfaceAreaSqM;
    private int severityScore; // 0 to 100
    private String severityLevel; // LOW, MEDIUM, SEVERE, CRITICAL
    private String hazardType; // CRATER, EDGE_BREAK, ALLIGATOR_CRACK, TRENCH, WATER_MASKED
    private boolean isWaterLogged;
    private String detectedAt;
    private String imageUrl;
    private String status; // REPORTED, DISPATCHED, UNDER_REPAIR, REPAIRED
    private String dispatchId;
    private String threatToTwoWheelers;
    private String threatToCars;
    private double impactForceKn; // Estimated impact force in Kilonewtons at 40 km/h

    public Pothole() {
        this.detectedAt = Instant.now().toString();
        this.status = "REPORTED";
    }

    public Pothole(String id, String roadId, String roadName, double latitude, double longitude,
                   double depthCm, double diameterCm, int severityScore, String severityLevel,
                   String hazardType, boolean isWaterLogged, String imageUrl) {
        this.id = id;
        this.roadId = roadId;
        this.roadName = roadName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.depthCm = depthCm;
        this.diameterCm = diameterCm;
        this.surfaceAreaSqM = Math.PI * Math.pow((diameterCm / 200.0), 2);
        this.severityScore = severityScore;
        this.severityLevel = severityLevel;
        this.hazardType = hazardType;
        this.isWaterLogged = isWaterLogged;
        this.imageUrl = imageUrl;
        this.detectedAt = Instant.now().toString();
        this.status = severityScore >= 70 ? "DISPATCHED" : "REPORTED";

        // Threat estimations
        if (depthCm >= 8 || severityScore >= 75) {
            this.threatToTwoWheelers = "EXTREME DANGER (Immediate Fall / Severe Injury Risk)";
            this.threatToCars = "HIGH DANGER (Severe Rim Bend / Suspension & Oil Pan Damage)";
            this.impactForceKn = 14.5 + (depthCm * 0.8);
        } else if (depthCm >= 4 || severityScore >= 45) {
            this.threatToTwoWheelers = "MODERATE DANGER (Loss of Control / Handle Wobble)";
            this.threatToCars = "MODERATE (Tire Bulge / Alignment Drift / Bottoming Out)";
            this.impactForceKn = 7.0 + (depthCm * 0.5);
        } else {
            this.threatToTwoWheelers = "LOW (Rumble / Minor Vibration)";
            this.threatToCars = "LOW (Negligible Shock)";
            this.impactForceKn = 2.5 + (depthCm * 0.3);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRoadId() { return roadId; }
    public void setRoadId(String roadId) { this.roadId = roadId; }

    public String getRoadName() { return roadName; }
    public void setRoadName(String roadName) { this.roadName = roadName; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public double getDepthCm() { return depthCm; }
    public void setDepthCm(double depthCm) { this.depthCm = depthCm; }

    public double getDiameterCm() { return diameterCm; }
    public void setDiameterCm(double diameterCm) { this.diameterCm = diameterCm; }

    public double getSurfaceAreaSqM() { return surfaceAreaSqM; }
    public void setSurfaceAreaSqM(double surfaceAreaSqM) { this.surfaceAreaSqM = surfaceAreaSqM; }

    public int getSeverityScore() { return severityScore; }
    public void setSeverityScore(int severityScore) { this.severityScore = severityScore; }

    public String getSeverityLevel() { return severityLevel; }
    public void setSeverityLevel(String severityLevel) { this.severityLevel = severityLevel; }

    public String getHazardType() { return hazardType; }
    public void setHazardType(String hazardType) { this.hazardType = hazardType; }

    public boolean isWaterLogged() { return isWaterLogged; }
    public void setWaterLogged(boolean waterLogged) { isWaterLogged = waterLogged; }

    public String getDetectedAt() { return detectedAt; }
    public void setDetectedAt(String detectedAt) { this.detectedAt = detectedAt; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDispatchId() { return dispatchId; }
    public void setDispatchId(String dispatchId) { this.dispatchId = dispatchId; }

    public String getThreatToTwoWheelers() { return threatToTwoWheelers; }
    public void setThreatToTwoWheelers(String threatToTwoWheelers) { this.threatToTwoWheelers = threatToTwoWheelers; }

    public String getThreatToCars() { return threatToCars; }
    public void setThreatToCars(String threatToCars) { this.threatToCars = threatToCars; }

    public double getImpactForceKn() { return impactForceKn; }
    public void setImpactForceKn(double impactForceKn) { this.impactForceKn = impactForceKn; }

    public boolean isDangerous() {
        return severityScore >= 70 || depthCm >= 7.0 || isWaterLogged && depthCm >= 5.0;
    }

    public String toJson() {
        return String.format(
            "{\"id\":%s,\"roadId\":%s,\"roadName\":%s,\"latitude\":%.6f,\"longitude\":%.6f,\"depthCm\":%.1f," +
            "\"diameterCm\":%.1f,\"surfaceAreaSqM\":%.3f,\"severityScore\":%d,\"severityLevel\":%s," +
            "\"hazardType\":%s,\"isWaterLogged\":%b,\"detectedAt\":%s,\"imageUrl\":%s,\"status\":%s," +
            "\"dispatchId\":%s,\"threatToTwoWheelers\":%s,\"threatToCars\":%s,\"impactForceKn\":%.1f,\"isDangerous\":%b}",
            escape(id), escape(roadId), escape(roadName), latitude, longitude, depthCm,
            diameterCm, surfaceAreaSqM, severityScore, escape(severityLevel),
            escape(hazardType), isWaterLogged, escape(detectedAt), escape(imageUrl), escape(status),
            escape(dispatchId), escape(threatToTwoWheelers), escape(threatToCars), impactForceKn, isDangerous()
        );
    }

    private static String escape(String s) {
        if (s == null) return "null";
        return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r") + "\"";
    }
}
