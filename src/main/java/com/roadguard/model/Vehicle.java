package com.roadguard.model;

public class Vehicle {
    private String id;
    private String make;
    private String model;
    private String category; // HATCHBACK, SEDAN, COMPACT_SUV, FULL_SUV, OFFROAD_4X4, MOTORCYCLE, SCOOTER, COMMERCIAL_TRUCK
    private double groundClearanceMm; // e.g. 165
    private double wheelbaseMm; // e.g. 2600
    private double approachAngleDeg; // e.g. 16
    private double departureAngleDeg; // e.g. 18
    private double rimDiameterInches; // e.g. 16
    private double tireAspectRatio; // e.g. 60
    private String suspensionType; // SOFT, COMFORT_INDEPENDENT, STIFF_SPORT, RUGGED_OFFROAD, LEAF_SPRING, TELESCOPIC
    private double curbWeightKg;

    public Vehicle() {}

    public Vehicle(String id, String make, String model, String category, double groundClearanceMm,
                   double wheelbaseMm, double approachAngleDeg, double departureAngleDeg,
                   double rimDiameterInches, double tireAspectRatio, String suspensionType, double curbWeightKg) {
        this.id = id;
        this.make = make;
        this.model = model;
        this.category = category;
        this.groundClearanceMm = groundClearanceMm;
        this.wheelbaseMm = wheelbaseMm;
        this.approachAngleDeg = approachAngleDeg;
        this.departureAngleDeg = departureAngleDeg;
        this.rimDiameterInches = rimDiameterInches;
        this.tireAspectRatio = tireAspectRatio;
        this.suspensionType = suspensionType;
        this.curbWeightKg = curbWeightKg;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getGroundClearanceMm() { return groundClearanceMm; }
    public void setGroundClearanceMm(double groundClearanceMm) { this.groundClearanceMm = groundClearanceMm; }

    public double getWheelbaseMm() { return wheelbaseMm; }
    public void setWheelbaseMm(double wheelbaseMm) { this.wheelbaseMm = wheelbaseMm; }

    public double getApproachAngleDeg() { return approachAngleDeg; }
    public void setApproachAngleDeg(double approachAngleDeg) { this.approachAngleDeg = approachAngleDeg; }

    public double getDepartureAngleDeg() { return departureAngleDeg; }
    public void setDepartureAngleDeg(double departureAngleDeg) { this.departureAngleDeg = departureAngleDeg; }

    public double getRimDiameterInches() { return rimDiameterInches; }
    public void setRimDiameterInches(double rimDiameterInches) { this.rimDiameterInches = rimDiameterInches; }

    public double getTireAspectRatio() { return tireAspectRatio; }
    public void setTireAspectRatio(double tireAspectRatio) { this.tireAspectRatio = tireAspectRatio; }

    public String getSuspensionType() { return suspensionType; }
    public void setSuspensionType(String suspensionType) { this.suspensionType = suspensionType; }

    public double getCurbWeightKg() { return curbWeightKg; }
    public void setCurbWeightKg(double curbWeightKg) { this.curbWeightKg = curbWeightKg; }

    public String getFullName() {
        return make + " " + model;
    }

    public String toJson() {
        return String.format(
            "{\"id\":%s,\"make\":%s,\"model\":%s,\"fullName\":%s,\"category\":%s,\"groundClearanceMm\":%.1f," +
            "\"wheelbaseMm\":%.1f,\"approachAngleDeg\":%.1f,\"departureAngleDeg\":%.1f,\"rimDiameterInches\":%.1f," +
            "\"tireAspectRatio\":%.1f,\"suspensionType\":%s,\"curbWeightKg\":%.1f}",
            escape(id), escape(make), escape(model), escape(getFullName()), escape(category),
            groundClearanceMm, wheelbaseMm, approachAngleDeg, departureAngleDeg,
            rimDiameterInches, tireAspectRatio, escape(suspensionType), curbWeightKg
        );
    }

    private static String escape(String s) {
        if (s == null) return "null";
        return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r") + "\"";
    }
}
