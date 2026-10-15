package com.roadguard.service;

import com.roadguard.model.PassabilityResult;
import com.roadguard.model.Pothole;
import com.roadguard.model.Vehicle;

import java.util.*;

public class VehiclePassabilityService {
    private final Map<String, Vehicle> vehicleCatalog = new LinkedHashMap<>();

    public VehiclePassabilityService() {
        initDefaultCatalog();
    }

    private void initDefaultCatalog() {
        // Popular 2-Wheelers
        addVehicle(new Vehicle("v-activa", "Honda", "Activa 6G", "SCOOTER",
                162, 1260, 22, 25, 12, 90, "TELESCOPIC", 107));
        addVehicle(new Vehicle("v-re-classic", "Royal Enfield", "Classic 350", "MOTORCYCLE",
                170, 1390, 26, 28, 19, 80, "TELESCOPIC", 195));
        addVehicle(new Vehicle("v-ktm-duke", "KTM", "Duke 390", "MOTORCYCLE",
                151, 1357, 24, 26, 17, 70, "STIFF_SPORT", 163));

        // Popular Hatchbacks
        addVehicle(new Vehicle("v-swift", "Maruti Suzuki", "Swift", "HATCHBACK",
                163, 2450, 17, 24, 15, 65, "COMFORT_INDEPENDENT", 920));
        addVehicle(new Vehicle("v-i20", "Hyundai", "i20", "HATCHBACK",
                170, 2580, 16, 23, 16, 55, "COMFORT_INDEPENDENT", 1010));
        addVehicle(new Vehicle("v-polo", "Volkswagen", "Polo GT", "HATCHBACK",
                168, 2470, 16, 22, 16, 60, "STIFF_SPORT", 1070));

        // Popular Sedans
        addVehicle(new Vehicle("v-city", "Honda", "City", "SEDAN",
                165, 2600, 14, 18, 16, 55, "SOFT", 1150));
        addVehicle(new Vehicle("v-verna", "Hyundai", "Verna", "SEDAN",
                165, 2670, 15, 19, 16, 55, "COMFORT_INDEPENDENT", 1180));
        addVehicle(new Vehicle("v-slavia", "Skoda", "Slavia", "SEDAN",
                179, 2651, 16, 20, 16, 60, "COMFORT_INDEPENDENT", 1210));
        addVehicle(new Vehicle("v-bmw-3", "BMW", "3 Series Gran Limousine", "SEDAN",
                140, 2961, 13, 16, 18, 45, "STIFF_SPORT", 1570));

        // Popular Compact & Mid SUVs
        addVehicle(new Vehicle("v-nexon", "Tata", "Nexon", "COMPACT_SUV",
                208, 2498, 20, 29, 16, 60, "COMFORT_INDEPENDENT", 1250));
        addVehicle(new Vehicle("v-creta", "Hyundai", "Creta", "COMPACT_SUV",
                190, 2610, 19, 26, 17, 60, "COMFORT_INDEPENDENT", 1320));
        addVehicle(new Vehicle("v-seltos", "Kia", "Seltos", "COMPACT_SUV",
                190, 2610, 19, 26, 17, 60, "COMFORT_INDEPENDENT", 1330));

        // Full Size & Off-Road SUVs
        addVehicle(new Vehicle("v-thar", "Mahindra", "Thar 4x4", "OFFROAD_4X4",
                226, 2450, 41.8, 36.8, 18, 65, "RUGGED_OFFROAD", 1750));
        addVehicle(new Vehicle("v-fortuner", "Toyota", "Fortuner 4x4", "FULL_SUV",
                225, 2745, 29, 25, 18, 60, "RUGGED_OFFROAD", 2180));
        addVehicle(new Vehicle("v-scorpio", "Mahindra", "Scorpio-N", "FULL_SUV",
                187, 2750, 27, 23, 18, 60, "RUGGED_OFFROAD", 2000));

        // Commercial & Light Truck
        addVehicle(new Vehicle("v-tata-ace", "Tata", "Ace Gold (Chota Hathi)", "COMMERCIAL_TRUCK",
                160, 2100, 22, 28, 12, 80, "LEAF_SPRING", 900));
        addVehicle(new Vehicle("v-truck-ecomet", "Ashok Leyland", "Ecomet 1615", "COMMERCIAL_TRUCK",
                230, 4200, 25, 22, 20, 90, "LEAF_SPRING", 5800));
    }

    private void addVehicle(Vehicle v) {
        vehicleCatalog.put(v.getId(), v);
    }

    public List<Vehicle> getAllVehicles() {
        return new ArrayList<>(vehicleCatalog.values());
    }

    public Vehicle findVehicle(String query) {
        if (query == null || query.trim().isEmpty()) return null;
        String q = query.trim().toLowerCase();

        // Exact ID match
        if (vehicleCatalog.containsKey(q)) return vehicleCatalog.get(q);

        // Search by make or model
        for (Vehicle v : vehicleCatalog.values()) {
            if (v.getFullName().toLowerCase().contains(q) ||
                v.getModel().toLowerCase().contains(q) ||
                v.getMake().toLowerCase().contains(q)) {
                return v;
            }
        }
        return null;
    }

    public PassabilityResult evaluate(Vehicle vehicle, Pothole pothole, int vehicleSpeedKmh) {
        if (vehicle == null) {
            vehicle = vehicleCatalog.get("v-swift"); // Fallback standard
        }
        if (pothole == null) {
            pothole = new Pothole("temp", "r-1", "Standard Test Road", 0, 0, 8.0, 45.0, 75, "SEVERE", "CRATER", false, "");
        }

        double gcMm = vehicle.getGroundClearanceMm();
        double potholeDepthMm = pothole.getDepthCm() * 10.0; // cm to mm
        double potholeDiameterMm = pothole.getDiameterCm() * 10.0;

        // Dynamic suspension compression under impact & vehicle weight
        double stiffnessFactor = switch (vehicle.getSuspensionType()) {
            case "SOFT" -> 1.45;
            case "COMFORT_INDEPENDENT" -> 1.25;
            case "STIFF_SPORT" -> 0.95;
            case "RUGGED_OFFROAD" -> 0.85;
            case "LEAF_SPRING" -> 0.75;
            case "TELESCOPIC" -> 1.30;
            default -> 1.15;
        };

        // Speed factor: hitting at 40 km/h compresses suspension significantly more than crawling at 10 km/h
        double speedCompressionFactor = 1.0 + (Math.max(0, vehicleSpeedKmh - 15) * 0.025);
        double dynamicSagMm = (potholeDepthMm * 0.35) * (vehicle.getCurbWeightKg() / 1500.0) * stiffnessFactor * speedCompressionFactor;
        dynamicSagMm = Math.min(dynamicSagMm, 85.0); // Capped by physical bump-stop

        // Effective clearance margin when wheels dip into the pothole
        double effectiveClearanceMargin = gcMm - potholeDepthMm - (dynamicSagMm * 0.5);

        PassabilityResult result = new PassabilityResult();
        result.setVehicleName(vehicle.getFullName());
        result.setVehicleCategory(vehicle.getCategory());
        result.setPotholeId(pothole.getId());
        result.setRoadName(pothole.getRoadName());
        result.setGroundClearanceMm(gcMm);
        result.setPotholeDepthMm(potholeDepthMm);
        result.setDynamicCompressionMm(dynamicSagMm);
        result.setEffectiveClearanceMarginMm(effectiveClearanceMargin);

        List<String> insights = new ArrayList<>();
        List<String> recs = new ArrayList<>();

        // Motorcycle/Scooter special physics
        boolean isTwoWheeler = "MOTORCYCLE".equals(vehicle.getCategory()) || "SCOOTER".equals(vehicle.getCategory());

        // Safe crossings calculation:
        // Fatigue stress on suspension bushes, ball joints, damper fluid, tire bead & wheel rim
        int safeCrossings;
        double shockWearPerPass;
        double rimBendRisk;
        String tireRisk;
        String alignRate;
        double repairCost;

        if (isTwoWheeler) {
            double rimRadiusMm = (vehicle.getRimDiameterInches() * 25.4) / 2.0;
            double depthToWheelRatio = potholeDepthMm / rimRadiusMm;

            if (depthToWheelRatio >= 0.55 || potholeDepthMm >= 90) {
                result.setCanPass(false);
                result.setVerdict("CATASTROPHIC - TWO-WHEELER ROLLOVER / HIGH INJURY HAZARD");
                result.setVerdictLevel("CRITICAL");
                safeCrossings = 0;
                result.setCrossingsCategory("0 CROSSINGS (Immediate Fall / Fork Collapse)");
                shockWearPerPass = 100.0;
                rimBendRisk = 95.0;
                tireRisk = "IMMEDIATE RIM CRACK / BLOWOUT";
                alignRate = "HANDLEBAR BENT";
                repairCost = 18000;
                insights.add("Pothole depth (" + pothole.getDepthCm() + " cm) exceeds 50% of the front wheel radius.");
                insights.add("High probability of front tire wedging into the crater lip, throwing the rider over handlebars.");
                recs.add("DO NOT ATTEMPT TO CROSS ON TWO-WHEELER.");
                recs.add("Divert route immediately or walk the vehicle along the shoulder edge.");
            } else if (potholeDepthMm >= 50) {
                result.setCanPass(true);
                result.setVerdict("PASSABLE ONLY AT CRAWL SPEED (< 10 KM/H)");
                result.setVerdictLevel("WARNING");
                safeCrossings = Math.max(3, (int) (40 - (potholeDepthMm * 0.35)));
                result.setCrossingsCategory(safeCrossings + " Crossings before fork seal blowout");
                shockWearPerPass = 3.5;
                rimBendRisk = 45.0;
                tireRisk = "PINCH FLAT HAZARD";
                alignRate = "T-STEM DRIFT";
                repairCost = 4500;
                insights.add("Front telescopic fork will bottom out into its hydraulic hydraulic stops.");
                recs.add("Reduce speed to under 10 km/h.");
                recs.add("Stand slightly on footpegs to absorb chassis shock through knees.");
            } else {
                result.setCanPass(true);
                result.setVerdict("PASSABLE - MINOR JOLT");
                result.setVerdictLevel("SUCCESS");
                safeCrossings = 350;
                result.setCrossingsCategory("350+ Crossings in Good Condition");
                shockWearPerPass = 0.25;
                rimBendRisk = 5.0;
                tireRisk = "LOW";
                alignRate = "NORMAL";
                repairCost = 800;
                insights.add("Manageable road ripple for this wheel diameter.");
                recs.add("Maintain straight handlebar posture when crossing.");
            }
        } else {
            // 4-Wheelers
            if (effectiveClearanceMargin < -10) {
                // Guaranteed scrape
                result.setCanPass(false);
                result.setVerdict("IMPASSABLE - SEVERE UNDERBODY DAMAGE GUARANTEED");
                result.setVerdictLevel("CRITICAL");
                safeCrossings = 0;
                result.setCrossingsCategory("0 CROSSINGS (Immediate Sump/Bumper Breach)");
                shockWearPerPass = 45.0;
                rimBendRisk = 88.0;
                tireRisk = "SIDEWALL CUT / RIM FRACTURE";
                alignRate = "SUBFRAME DEVIATION";
                repairCost = 45000;
                insights.add("Pothole depth (" + (int)potholeDepthMm + " mm) with suspension sag exceeds ground clearance (" + (int)gcMm + " mm).");
                insights.add("Engine oil pan, exhaust catalytic converter, and lower bumper apron will bottom out violently.");
                recs.add("Do not enter this road segment in this vehicle.");
                recs.add("Find an alternate route or straddle the crater if lane width permits.");
            } else if (effectiveClearanceMargin <= 25) {
                // High risk scrape
                result.setCanPass(true);
                result.setVerdict("PASSABLE WITH EXTREME CAUTION (HIGH UNDERBODY SCRAPE RISK)");
                result.setVerdictLevel("DANGER");
                safeCrossings = Math.max(1, (int)(effectiveClearanceMargin * 0.6));
                result.setCrossingsCategory(safeCrossings + " Crossings before severe suspension failure");
                shockWearPerPass = 12.0;
                rimBendRisk = 55.0;
                tireRisk = "HIGH (Sidewall Bulge Risk)";
                alignRate = "RAPID TOE/CAMBER DRIFT";
                repairCost = 19500;
                insights.add("Extremely narrow clearance buffer (" + String.format("%.1f", effectiveClearanceMargin) + " mm).");
                insights.add("Any speed over 15 km/h will trigger full suspension bump-stop hit and undercarriage scrape.");
                recs.add("Crawl at 5-10 km/h.");
                recs.add("Approach diagonally at a 30° angle to prevent both wheels dropping simultaneously.");
            } else if (effectiveClearanceMargin <= 60) {
                // Moderate caution
                result.setCanPass(true);
                result.setVerdict("PASSABLE WITH MODERATE CAUTION");
                result.setVerdictLevel("WARNING");
                safeCrossings = Math.max(15, (int)(effectiveClearanceMargin * 3.5));
                result.setCrossingsCategory(safeCrossings + " Crossings with regular maintenance");
                shockWearPerPass = 2.2;
                rimBendRisk = 20.0;
                tireRisk = "MODERATE";
                alignRate = "GRADUAL DRIFT";
                repairCost = 7500;
                insights.add("Clearance margin of " + String.format("%.1f", effectiveClearanceMargin) + " mm is adequate if driven gently.");
                recs.add("Keep speed below 25 km/h.");
                recs.add("Inspect wheel alignment after repeated crossings.");
            } else {
                // Safe
                result.setCanPass(true);
                result.setVerdict("SAFE TO PASS - EXCELLENT CLEARANCE");
                result.setVerdictLevel("SUCCESS");
                safeCrossings = 650;
                result.setCrossingsCategory("600+ Crossings (Minimal Wear)");
                shockWearPerPass = 0.15;
                rimBendRisk = 2.0;
                tireRisk = "MINIMAL";
                alignRate = "NEGLIGIBLE";
                repairCost = 1200;
                insights.add("Robust ground clearance buffer (" + String.format("%.1f", effectiveClearanceMargin) + " mm).");
                recs.add("Standard driving speed permissible, maintain general awareness.");
            }
        }

        result.setEstimatedSafeCrossings(safeCrossings);
        result.setShockWearPerPassPercent(shockWearPerPass);
        result.setRimBendRiskPercent(rimBendRisk);
        result.setTireDamageRisk(tireRisk);
        result.setAlignmentDriftRate(alignRate);
        result.setEstimatedRepairCostInr(repairCost);
        result.setRecommendedMaxSpeedKmh(safeCrossings == 0 ? 0 : (effectiveClearanceMargin < 30 ? 12 : (effectiveClearanceMargin < 70 ? 25 : 45)));

        String riskSummary = String.format(
            "%s has %s ground clearance vs a %d mm deep pothole on %s. " +
            "Passability Status: %s. An estimated %d safe crossings are possible in good condition before component degradation.",
            vehicle.getFullName(), (int)gcMm + "mm", (int)potholeDepthMm, pothole.getRoadName(),
            result.getVerdict(), safeCrossings
        );
        result.setRiskSummary(riskSummary);
        result.setTechnicalInsights(insights);
        result.setDriverRecommendations(recs);

        return result;
    }
}
