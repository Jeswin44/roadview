package com.roadguard.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class DispatchReport {
    private String dispatchId;
    private String potholeId;
    private String roadName;
    private double latitude;
    private double longitude;
    private int severityScore;
    private String severityLevel;
    private String reportedAt;
    private String authorityName;
    private String jurisdiction;
    private String officialRefNo;
    private String status; // DISPATCHED, ACKNOWLEDGED, WORK_ORDER_ISSUED, UNDER_REPAIR, REPAIRED
    private String urgency; // EMERGENCY_24H, HIGH_48H, STANDARD
    private String assignedOfficer;
    private int targetResolutionDays;
    private String evidenceSnapshotUrl;
    private List<String> dispatchEvents;

    public DispatchReport() {
        this.reportedAt = Instant.now().toString();
        this.dispatchEvents = new ArrayList<>();
    }

    public DispatchReport(String dispatchId, String potholeId, String roadName, double latitude, double longitude,
                          int severityScore, String severityLevel, String authorityName, String urgency, String snapshotUrl) {
        this.dispatchId = dispatchId;
        this.potholeId = potholeId;
        this.roadName = roadName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.severityScore = severityScore;
        this.severityLevel = severityLevel;
        this.authorityName = authorityName;
        this.urgency = urgency;
        this.evidenceSnapshotUrl = snapshotUrl;
        this.reportedAt = Instant.now().toString();
        this.status = "DISPATCHED";
        this.officialRefNo = "RPT-" + System.currentTimeMillis() % 1000000;
        this.jurisdiction = "Public Road & Highway Infrastructure Command";
        this.assignedOfficer = "Chief Road Safety Engineer (Div-3)";
        this.targetResolutionDays = severityScore >= 85 ? 1 : (severityScore >= 70 ? 2 : 5);
        this.dispatchEvents = new ArrayList<>();
        this.dispatchEvents.add("[" + reportedAt + "] Automated AI hazard trigger detected severity >= 70%");
        this.dispatchEvents.add("[" + reportedAt + "] Dispatch dossier generated and sent to " + authorityName);
        this.dispatchEvents.add("[" + reportedAt + "] SMS alert & High-Priority ticket broadcast to rapid maintenance unit");
    }

    public String getDispatchId() { return dispatchId; }
    public void setDispatchId(String dispatchId) { this.dispatchId = dispatchId; }

    public String getPotholeId() { return potholeId; }
    public void setPotholeId(String potholeId) { this.potholeId = potholeId; }

    public String getRoadName() { return roadName; }
    public void setRoadName(String roadName) { this.roadName = roadName; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public int getSeverityScore() { return severityScore; }
    public void setSeverityScore(int severityScore) { this.severityScore = severityScore; }

    public String getSeverityLevel() { return severityLevel; }
    public void setSeverityLevel(String severityLevel) { this.severityLevel = severityLevel; }

    public String getReportedAt() { return reportedAt; }
    public void setReportedAt(String reportedAt) { this.reportedAt = reportedAt; }

    public String getAuthorityName() { return authorityName; }
    public void setAuthorityName(String authorityName) { this.authorityName = authorityName; }

    public String getJurisdiction() { return jurisdiction; }
    public void setJurisdiction(String jurisdiction) { this.jurisdiction = jurisdiction; }

    public String getOfficialRefNo() { return officialRefNo; }
    public void setOfficialRefNo(String officialRefNo) { this.officialRefNo = officialRefNo; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getUrgency() { return urgency; }
    public void setUrgency(String urgency) { this.urgency = urgency; }

    public String getAssignedOfficer() { return assignedOfficer; }
    public void setAssignedOfficer(String assignedOfficer) { this.assignedOfficer = assignedOfficer; }

    public int getTargetResolutionDays() { return targetResolutionDays; }
    public void setTargetResolutionDays(int targetResolutionDays) { this.targetResolutionDays = targetResolutionDays; }

    public String getEvidenceSnapshotUrl() { return evidenceSnapshotUrl; }
    public void setEvidenceSnapshotUrl(String evidenceSnapshotUrl) { this.evidenceSnapshotUrl = evidenceSnapshotUrl; }

    public List<String> getDispatchEvents() { return dispatchEvents; }
    public void setDispatchEvents(List<String> dispatchEvents) { this.dispatchEvents = dispatchEvents; }

    public void addEvent(String event) {
        if (this.dispatchEvents == null) this.dispatchEvents = new ArrayList<>();
        this.dispatchEvents.add(event);
    }

    public String toJson() {
        StringBuilder eventsJson = new StringBuilder("[");
        if (dispatchEvents != null) {
            for (int i = 0; i < dispatchEvents.size(); i++) {
                eventsJson.append(escape(dispatchEvents.get(i)));
                if (i < dispatchEvents.size() - 1) eventsJson.append(",");
            }
        }
        eventsJson.append("]");

        return String.format(
            "{\"dispatchId\":%s,\"potholeId\":%s,\"roadName\":%s,\"latitude\":%.6f,\"longitude\":%.6f," +
            "\"severityScore\":%d,\"severityLevel\":%s,\"reportedAt\":%s,\"authorityName\":%s,\"jurisdiction\":%s," +
            "\"officialRefNo\":%s,\"status\":%s,\"urgency\":%s,\"assignedOfficer\":%s,\"targetResolutionDays\":%d," +
            "\"evidenceSnapshotUrl\":%s,\"dispatchEvents\":%s}",
            escape(dispatchId), escape(potholeId), escape(roadName), latitude, longitude,
            severityScore, escape(severityLevel), escape(reportedAt), escape(authorityName), escape(jurisdiction),
            escape(officialRefNo), escape(status), escape(urgency), escape(assignedOfficer), targetResolutionDays,
            escape(evidenceSnapshotUrl), eventsJson.toString()
        );
    }

    private static String escape(String s) {
        if (s == null) return "null";
        return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r") + "\"";
    }
}
