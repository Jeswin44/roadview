package com.roadguard.model;

import java.util.List;

public class PassabilityResult {
    private String vehicleName;
    private String vehicleCategory;
    private String potholeId;
    private String roadName;
    private boolean canPass;
    private String verdict; // SAFE TO PASS, PASSABLE WITH CAUTION, HIGH SCRAPE RISK, IMPASSABLE - UNDERBODY HAZARD
    private String verdictLevel; // SUCCESS, WARNING, DANGER, CRITICAL
    private double groundClearanceMm;
    private double potholeDepthMm;
    private double dynamicCompressionMm;
    private double effectiveClearanceMarginMm;
    private int estimatedSafeCrossings; // Exactly how many times it can cross before severe damage
    private String crossingsCategory;
    private String riskSummary;
    private double shockWearPerPassPercent;
    private double rimBendRiskPercent;
    private String tireDamageRisk;
    private String alignmentDriftRate;
    private double estimatedRepairCostInr;
    private int recommendedMaxSpeedKmh;
    private List<String> technicalInsights;
    private List<String> driverRecommendations;

    public PassabilityResult() {}

    public String getVehicleName() { return vehicleName; }
    public void setVehicleName(String vehicleName) { this.vehicleName = vehicleName; }

    public String getVehicleCategory() { return vehicleCategory; }
    public void setVehicleCategory(String vehicleCategory) { this.vehicleCategory = vehicleCategory; }

    public String getPotholeId() { return potholeId; }
    public void setPotholeId(String potholeId) { this.potholeId = potholeId; }

    public String getRoadName() { return roadName; }
    public void setRoadName(String roadName) { this.roadName = roadName; }

    public boolean isCanPass() { return canPass; }
    public void setCanPass(boolean canPass) { this.canPass = canPass; }

    public String getVerdict() { return verdict; }
    public void setVerdict(String verdict) { this.verdict = verdict; }

    public String getVerdictLevel() { return verdictLevel; }
    public void setVerdictLevel(String verdictLevel) { this.verdictLevel = verdictLevel; }

    public double getGroundClearanceMm() { return groundClearanceMm; }
    public void setGroundClearanceMm(double groundClearanceMm) { this.groundClearanceMm = groundClearanceMm; }

    public double getPotholeDepthMm() { return potholeDepthMm; }
    public void setPotholeDepthMm(double potholeDepthMm) { this.potholeDepthMm = potholeDepthMm; }

    public double getDynamicCompressionMm() { return dynamicCompressionMm; }
    public void setDynamicCompressionMm(double dynamicCompressionMm) { this.dynamicCompressionMm = dynamicCompressionMm; }

    public double getEffectiveClearanceMarginMm() { return effectiveClearanceMarginMm; }
    public void setEffectiveClearanceMarginMm(double effectiveClearanceMarginMm) { this.effectiveClearanceMarginMm = effectiveClearanceMarginMm; }

    public int getEstimatedSafeCrossings() { return estimatedSafeCrossings; }
    public void setEstimatedSafeCrossings(int estimatedSafeCrossings) { this.estimatedSafeCrossings = estimatedSafeCrossings; }

    public String getCrossingsCategory() { return crossingsCategory; }
    public void setCrossingsCategory(String crossingsCategory) { this.crossingsCategory = crossingsCategory; }

    public String getRiskSummary() { return riskSummary; }
    public void setRiskSummary(String riskSummary) { this.riskSummary = riskSummary; }

    public double getShockWearPerPassPercent() { return shockWearPerPassPercent; }
    public void setShockWearPerPassPercent(double shockWearPerPassPercent) { this.shockWearPerPassPercent = shockWearPerPassPercent; }

    public double getRimBendRiskPercent() { return rimBendRiskPercent; }
    public void setRimBendRiskPercent(double rimBendRiskPercent) { this.rimBendRiskPercent = rimBendRiskPercent; }

    public String getTireDamageRisk() { return tireDamageRisk; }
    public void setTireDamageRisk(String tireDamageRisk) { this.tireDamageRisk = tireDamageRisk; }

    public String getAlignmentDriftRate() { return alignmentDriftRate; }
    public void setAlignmentDriftRate(String alignmentDriftRate) { this.alignmentDriftRate = alignmentDriftRate; }

    public double getEstimatedRepairCostInr() { return estimatedRepairCostInr; }
    public void setEstimatedRepairCostInr(double estimatedRepairCostInr) { this.estimatedRepairCostInr = estimatedRepairCostInr; }

    public int getRecommendedMaxSpeedKmh() { return recommendedMaxSpeedKmh; }
    public void setRecommendedMaxSpeedKmh(int recommendedMaxSpeedKmh) { this.recommendedMaxSpeedKmh = recommendedMaxSpeedKmh; }

    public List<String> getTechnicalInsights() { return technicalInsights; }
    public void setTechnicalInsights(List<String> technicalInsights) { this.technicalInsights = technicalInsights; }

    public List<String> getDriverRecommendations() { return driverRecommendations; }
    public void setDriverRecommendations(List<String> driverRecommendations) { this.driverRecommendations = driverRecommendations; }

    public String toJson() {
        StringBuilder insightsJson = new StringBuilder("[");
        if (technicalInsights != null) {
            for (int i = 0; i < technicalInsights.size(); i++) {
                insightsJson.append(escape(technicalInsights.get(i)));
                if (i < technicalInsights.size() - 1) insightsJson.append(",");
            }
        }
        insightsJson.append("]");

        StringBuilder recsJson = new StringBuilder("[");
        if (driverRecommendations != null) {
            for (int i = 0; i < driverRecommendations.size(); i++) {
                recsJson.append(escape(driverRecommendations.get(i)));
                if (i < driverRecommendations.size() - 1) recsJson.append(",");
            }
        }
        recsJson.append("]");

        return String.format(
            "{\"vehicleName\":%s,\"vehicleCategory\":%s,\"potholeId\":%s,\"roadName\":%s,\"canPass\":%b," +
            "\"verdict\":%s,\"verdictLevel\":%s,\"groundClearanceMm\":%.1f,\"potholeDepthMm\":%.1f," +
            "\"dynamicCompressionMm\":%.1f,\"effectiveClearanceMarginMm\":%.1f,\"estimatedSafeCrossings\":%d," +
            "\"crossingsCategory\":%s,\"riskSummary\":%s,\"shockWearPerPassPercent\":%.2f,\"rimBendRiskPercent\":%.1f," +
            "\"tireDamageRisk\":%s,\"alignmentDriftRate\":%s,\"estimatedRepairCostInr\":%.0f,\"recommendedMaxSpeedKmh\":%d," +
            "\"technicalInsights\":%s,\"driverRecommendations\":%s}",
            escape(vehicleName), escape(vehicleCategory), escape(potholeId), escape(roadName), canPass,
            escape(verdict), escape(verdictLevel), groundClearanceMm, potholeDepthMm,
            dynamicCompressionMm, effectiveClearanceMarginMm, estimatedSafeCrossings,
            escape(crossingsCategory), escape(riskSummary), shockWearPerPassPercent, rimBendRiskPercent,
            escape(tireDamageRisk), escape(alignmentDriftRate), estimatedRepairCostInr, recommendedMaxSpeedKmh,
            insightsJson.toString(), recsJson.toString()
        );
    }

    private static String escape(String s) {
        if (s == null) return "null";
        return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r") + "\"";
    }
}
