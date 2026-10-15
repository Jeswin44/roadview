package com.roadguard.model;

import java.time.Instant;

public class RoadSegment {
    private String id;
    private String name;
    private String city;
    private String district;
    private double lengthKm;
    private double safetyScore; // 0.0 to 10.0
    private String safetyLevel; // CRITICAL_DANGER, UNSAFE, MODERATE_CAUTION, SAFE
    private int totalPotholesCount;
    private int dangerousPotholesCount;
    private double avgPotholeDepthCm;
    private double centerLat;
    private double centerLng;
    private String lastSurveyed;
    private String communityWarning;

    public RoadSegment() {
        this.lastSurveyed = Instant.now().toString();
    }

    public RoadSegment(String id, String name, String city, String district, double lengthKm,
                       double safetyScore, int totalPotholesCount, int dangerousPotholesCount,
                       double avgPotholeDepthCm, double centerLat, double centerLng, String communityWarning) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.district = district;
        this.lengthKm = lengthKm;
        this.safetyScore = safetyScore;
        this.totalPotholesCount = totalPotholesCount;
        this.dangerousPotholesCount = dangerousPotholesCount;
        this.avgPotholeDepthCm = avgPotholeDepthCm;
        this.centerLat = centerLat;
        this.centerLng = centerLng;
        this.communityWarning = communityWarning;
        this.lastSurveyed = Instant.now().toString();

        if (safetyScore <= 3.5 || dangerousPotholesCount >= 4) {
            this.safetyLevel = "CRITICAL_DANGER";
        } else if (safetyScore <= 6.0 || dangerousPotholesCount >= 2) {
            this.safetyLevel = "UNSAFE";
        } else if (safetyScore <= 8.0) {
            this.safetyLevel = "MODERATE_CAUTION";
        } else {
            this.safetyLevel = "SAFE";
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public double getLengthKm() { return lengthKm; }
    public void setLengthKm(double lengthKm) { this.lengthKm = lengthKm; }

    public double getSafetyScore() { return safetyScore; }
    public void setSafetyScore(double safetyScore) { this.safetyScore = safetyScore; }

    public String getSafetyLevel() { return safetyLevel; }
    public void setSafetyLevel(String safetyLevel) { this.safetyLevel = safetyLevel; }

    public int getTotalPotholesCount() { return totalPotholesCount; }
    public void setTotalPotholesCount(int totalPotholesCount) { this.totalPotholesCount = totalPotholesCount; }

    public int getDangerousPotholesCount() { return dangerousPotholesCount; }
    public void setDangerousPotholesCount(int dangerousPotholesCount) { this.dangerousPotholesCount = dangerousPotholesCount; }

    public double getAvgPotholeDepthCm() { return avgPotholeDepthCm; }
    public void setAvgPotholeDepthCm(double avgPotholeDepthCm) { this.avgPotholeDepthCm = avgPotholeDepthCm; }

    public double getCenterLat() { return centerLat; }
    public void setCenterLat(double centerLat) { this.centerLat = centerLat; }

    public double getCenterLng() { return centerLng; }
    public void setCenterLng(double centerLng) { this.centerLng = centerLng; }

    public String getLastSurveyed() { return lastSurveyed; }
    public void setLastSurveyed(String lastSurveyed) { this.lastSurveyed = lastSurveyed; }

    public String getCommunityWarning() { return communityWarning; }
    public void setCommunityWarning(String communityWarning) { this.communityWarning = communityWarning; }

    public boolean isUnsafe() {
        return "CRITICAL_DANGER".equals(safetyLevel) || "UNSAFE".equals(safetyLevel);
    }

    public String toJson() {
        return String.format(
            "{\"id\":%s,\"name\":%s,\"city\":%s,\"district\":%s,\"lengthKm\":%.1f,\"safetyScore\":%.1f," +
            "\"safetyLevel\":%s,\"totalPotholesCount\":%d,\"dangerousPotholesCount\":%d,\"avgPotholeDepthCm\":%.1f," +
            "\"centerLat\":%.6f,\"centerLng\":%.6f,\"lastSurveyed\":%s,\"communityWarning\":%s,\"isUnsafe\":%b}",
            escape(id), escape(name), escape(city), escape(district), lengthKm, safetyScore,
            escape(safetyLevel), totalPotholesCount, dangerousPotholesCount, avgPotholeDepthCm,
            centerLat, centerLng, escape(lastSurveyed), escape(communityWarning), isUnsafe()
        );
    }

    private static String escape(String s) {
        if (s == null) return "null";
        return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r") + "\"";
    }
}
