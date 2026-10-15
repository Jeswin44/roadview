package com.roadguard.model;

import java.time.Instant;

public class GpsCoordinate {
    private double latitude;
    private double longitude;
    private double altitude;
    private double speedKmh;
    private double heading;
    private String address;
    private String timestamp;

    public GpsCoordinate() {
        this.timestamp = Instant.now().toString();
    }

    public GpsCoordinate(double latitude, double longitude, String address) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.timestamp = Instant.now().toString();
    }

    public GpsCoordinate(double latitude, double longitude, double altitude, double speedKmh, double heading, String address) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
        this.speedKmh = speedKmh;
        this.heading = heading;
        this.address = address;
        this.timestamp = Instant.now().toString();
    }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public double getAltitude() { return altitude; }
    public void setAltitude(double altitude) { this.altitude = altitude; }

    public double getSpeedKmh() { return speedKmh; }
    public void setSpeedKmh(double speedKmh) { this.speedKmh = speedKmh; }

    public double getHeading() { return heading; }
    public void setHeading(double heading) { this.heading = heading; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String toJson() {
        return String.format(
            "{\"latitude\":%.6f,\"longitude\":%.6f,\"altitude\":%.1f,\"speedKmh\":%.1f,\"heading\":%.1f,\"address\":%s,\"timestamp\":%s}",
            latitude, longitude, altitude, speedKmh, heading,
            escapeJson(address), escapeJson(timestamp)
        );
    }

    private static String escapeJson(String s) {
        if (s == null) return "null";
        return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r") + "\"";
    }
}
