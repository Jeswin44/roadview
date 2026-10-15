/**
 * Vercel Serverless Function API Route Handler
 * Serves /api/* endpoints on Vercel
 */

const SEED_VEHICLES = [
    { id: 'v-city', make: 'Honda', model: 'City', fullName: 'Honda City', category: 'SEDAN', groundClearanceMm: 165, wheelbaseMm: 2600, wheelRimInches: 16, approachAngleDeg: 14, departureAngleDeg: 16, tireProfilePercent: 55, suspensionType: 'COMFORT_INDEPENDENT', curbWeightKg: 1153 },
    { id: 'v-swift', make: 'Maruti Suzuki', model: 'Swift', fullName: 'Maruti Swift', category: 'HATCHBACK', groundClearanceMm: 163, wheelbaseMm: 2450, wheelRimInches: 15, approachAngleDeg: 15, departureAngleDeg: 18, tireProfilePercent: 65, suspensionType: 'SOFT', curbWeightKg: 875 },
    { id: 'v-creta', make: 'Hyundai', model: 'Creta', fullName: 'Hyundai Creta', category: 'SUV', groundClearanceMm: 190, wheelbaseMm: 2610, wheelRimInches: 17, approachAngleDeg: 19, departureAngleDeg: 23, tireProfilePercent: 60, suspensionType: 'COMFORT_INDEPENDENT', curbWeightKg: 1310 },
    { id: 'v-thar', make: 'Mahindra', model: 'Thar 4x4', fullName: 'Mahindra Thar', category: 'SUV', groundClearanceMm: 226, wheelbaseMm: 2450, wheelRimInches: 18, approachAngleDeg: 41, departureAngleDeg: 36, tireProfilePercent: 65, suspensionType: 'RUGGED_OFFROAD', curbWeightKg: 1750 },
    { id: 'v-activa', make: 'Honda', model: 'Activa 6G', fullName: 'Honda Activa', category: 'SCOOTER', groundClearanceMm: 162, wheelbaseMm: 1260, wheelRimInches: 12, approachAngleDeg: 22, departureAngleDeg: 25, tireProfilePercent: 90, suspensionType: 'TELESCOPIC', curbWeightKg: 107 },
    { id: 'v-bullet', make: 'Royal Enfield', model: 'Classic 350', fullName: 'Royal Enfield 350', category: 'MOTORCYCLE', groundClearanceMm: 170, wheelbaseMm: 1390, wheelRimInches: 19, approachAngleDeg: 26, departureAngleDeg: 28, tireProfilePercent: 90, suspensionType: 'TELESCOPIC', curbWeightKg: 195 }
];

const SEED_ROADS = [
    { id: 'r-1', name: 'Outer Ring Road (Marathahalli to Bellandur)', city: 'Bengaluru', district: 'East Zone', safetyScore: 3.8, status: 'UNSAFE', potholeCount: 4, dangerousPotholesCount: 3, averageDepthCm: 12.4, surfaceType: 'ASPHALT', managedBy: 'NHAI / BBMP', communityWarning: 'Deep craters along left lane; sedans risk underbody breach.', centerLat: 12.93524, centerLng: 77.68532 },
    { id: 'r-2', name: 'Sarjapur Road (Kaikondrahalli Junction)', city: 'Bengaluru', district: 'South-East', safetyScore: 2.9, status: 'HAZARDOUS', potholeCount: 6, dangerousPotholesCount: 4, averageDepthCm: 16.2, surfaceType: 'ASPHALT', managedBy: 'BBMP Major Roads', communityWarning: 'Severe water-filled trenches across intersection. Two-wheelers prone to falls.', centerLat: 12.91245, centerLng: 77.67412 },
    { id: 'r-3', name: 'Whitefield Main Road (Hope Farm Corridor)', city: 'Bengaluru', district: 'Mahadevapura', safetyScore: 4.2, status: 'CAUTION', potholeCount: 3, dangerousPotholesCount: 1, averageDepthCm: 9.1, surfaceType: 'ASPHALT', managedBy: 'BBMP Mahadevapura', communityWarning: 'Broken tarmac edges near metro construction zone. High rim bend risk.', centerLat: 12.96981, centerLng: 77.74992 },
    { id: 'r-4', name: 'Bannerghatta National Park Road', city: 'Bengaluru', district: 'South Zone', safetyScore: 5.1, status: 'MODERATE', potholeCount: 3, dangerousPotholesCount: 2, averageDepthCm: 8.7, surfaceType: 'ASPHALT', managedBy: 'Karnataka PWD', communityWarning: 'Sunken culvert transitions; slow down at blind curves.', centerLat: 12.89432, centerLng: 77.59821 },
    { id: 'r-5', name: 'MG Road (Brigade Road Junction to Trinity)', city: 'Bengaluru', district: 'Central Zone', safetyScore: 8.6, status: 'SAFE', potholeCount: 1, dangerousPotholesCount: 0, averageDepthCm: 3.2, surfaceType: 'SMOOTH_BITUMEN', managedBy: 'BBMP Central', communityWarning: 'Good condition overall. Passable by all vehicles.', centerLat: 12.97410, centerLng: 77.61020 }
];

let potholes = [
    { id: 'p-101', roadId: 'r-1', roadName: 'Outer Ring Road (near Bellandur Flyover)', latitude: 12.93524, longitude: 77.68532, depthCm: 14.5, diameterCm: 85.0, severityScore: 84, severityLevel: 'SEVERE', hazardType: 'DEEP_CRATER', isWaterLogged: true, isDangerous: true, threatToCars: 'Catastrophic Sump & Rim Fracture', status: 'ACTIVE' },
    { id: 'p-102', roadId: 'r-2', roadName: 'Sarjapur Road (Kaikondrahalli Lake Turn)', latitude: 12.91245, longitude: 77.67412, depthCm: 18.0, diameterCm: 110.0, severityScore: 92, severityLevel: 'CRITICAL', hazardType: 'WATER_MASKED', isWaterLogged: true, isDangerous: true, threatToCars: 'Underbody Breach & Two-Wheeler Fall Hazard', status: 'ACTIVE' },
    { id: 'p-103', roadId: 'r-3', roadName: 'Whitefield Main Road (near Metro Pillar 142)', latitude: 12.96981, longitude: 77.74992, depthCm: 8.5, diameterCm: 45.0, severityScore: 58, severityLevel: 'MEDIUM', hazardType: 'EDGE_BREAK', isWaterLogged: false, isDangerous: false, threatToCars: 'Moderate Suspension Shock', status: 'ACTIVE' },
    { id: 'p-104', roadId: 'r-4', roadName: 'Bannerghatta Road (Gottigere Cross)', latitude: 12.89432, longitude: 77.59821, depthCm: 11.2, diameterCm: 65.0, severityScore: 74, severityLevel: 'SEVERE', hazardType: 'TRANSVERSE_TRENCH', isWaterLogged: false, isDangerous: true, threatToCars: 'Axle Misalignment & Rim Damage', status: 'ACTIVE' },
    { id: 'p-105', roadId: 'r-1', roadName: 'Old Airport Road (HAL Gate)', latitude: 12.95810, longitude: 77.64920, depthCm: 6.0, diameterCm: 35.0, severityScore: 42, severityLevel: 'MEDIUM', hazardType: 'ALLIGATOR_CRACK', isWaterLogged: false, isDangerous: false, threatToCars: 'Minor Vibration & Tread Wear', status: 'ACTIVE' },
    { id: 'p-106', roadId: 'r-5', roadName: 'MG Road (near Trinity Metro)', latitude: 12.97410, longitude: 77.61020, depthCm: 3.5, diameterCm: 25.0, severityScore: 22, severityLevel: 'LOW', hazardType: 'SURFACE_SPALL', isWaterLogged: false, isDangerous: false, threatToCars: 'Negligible Impact', status: 'REPAIRED' }
];

let dispatches = [
    { dispatchId: 'disp-901', potholeId: 'p-101', officialRefNo: 'NHAI-KA-BLR-2026-9481', authorityName: 'National Highways Authority of India (NHAI)', roadName: 'Outer Ring Road (near Bellandur Flyover)', severityScore: 84, urgency: 'EMERGENCY_24H', status: 'DISPATCHED', targetResolutionDays: 1, reportedAt: '2026-10-15 09:30 IST', latitude: 12.93524, longitude: 77.68532 },
    { dispatchId: 'disp-902', potholeId: 'p-102', officialRefNo: 'BBMP-ENG-SZ-2026-1042', authorityName: 'BBMP South Zone Road Infrastructure Cell', roadName: 'Sarjapur Road (Kaikondrahalli Lake Turn)', severityScore: 92, urgency: 'EMERGENCY_24H', status: 'DISPATCHED', targetResolutionDays: 1, reportedAt: '2026-10-15 11:15 IST', latitude: 12.91245, longitude: 77.67412 },
    { dispatchId: 'disp-903', potholeId: 'p-104', officialRefNo: 'PWD-BLR-RURAL-2026-441', authorityName: 'Karnataka Public Works Department (PWD)', roadName: 'Bannerghatta Road (Gottigere Cross)', severityScore: 74, urgency: 'PRIORITY_48H', status: 'IN_REVIEW', targetResolutionDays: 2, reportedAt: '2026-10-15 14:00 IST', latitude: 12.89432, longitude: 77.59821 }
];

let gps = { latitude: 12.93524, longitude: 77.68532, speedKmh: 42, heading: 86, altitude: 915, address: "Outer Ring Road, Bellandur, Bengaluru" };

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const path = req.url.split('?')[0];

    if (path === '/api/vehicles') {
        return res.status(200).json(SEED_VEHICLES);
    }
    if (path === '/api/roads') {
        return res.status(200).json(SEED_ROADS);
    }
    if (path === '/api/potholes') {
        return res.status(200).json(potholes);
    }
    if (path === '/api/dispatches') {
        return res.status(200).json(dispatches);
    }
    if (path === '/api/config') {
        return res.status(200).json({ googleMapsApiKey: "AIzaSyCqOwh79bsnGhCy7e0iuoaF5fEevxTg9BQ" });
    }
    if (path === '/api/stats') {
        return res.status(200).json({
            totalPotholes: potholes.length,
            dangerousPotholes: potholes.filter(p => p.isDangerous).length,
            activeDispatches: dispatches.filter(d => d.status !== 'REPAIRED').length,
            unsafeRoads: SEED_ROADS.filter(r => r.safetyScore < 6.0).length,
            currentGps: gps
        });
    }

    if (path === '/api/vehicles/evaluate') {
        const body = req.body || {};
        const vName = (body.vehicleName || 'Honda City').toLowerCase();
        let vehicle = SEED_VEHICLES.find(v => v.fullName.toLowerCase().includes(vName) || v.model.toLowerCase().includes(vName));
        if (!vehicle) {
            vehicle = {
                id: 'v-custom',
                fullName: body.vehicleName || 'Custom Vehicle',
                category: 'SEDAN',
                groundClearanceMm: parseFloat(body.groundClearanceMm) || 165,
                curbWeightKg: 1200,
                wheelRimInches: 16,
                suspensionType: 'COMFORT_INDEPENDENT'
            };
        }
        if (body.groundClearanceMm) {
            vehicle = Object.assign({}, vehicle, { groundClearanceMm: parseFloat(body.groundClearanceMm) });
        }

        let pothole = potholes.find(p => p.id === body.potholeId) || potholes[0];
        const speedKmh = parseInt(body.speedKmh) || 25;
        const gcMm = vehicle.groundClearanceMm;
        const potholeDepthMm = pothole.depthCm * 10.0;

        let stiffness = 1.15;
        if (vehicle.suspensionType === 'SOFT') stiffness = 1.45;
        else if (vehicle.suspensionType === 'COMFORT_INDEPENDENT') stiffness = 1.25;
        else if (vehicle.suspensionType === 'RUGGED_OFFROAD') stiffness = 0.85;
        else if (vehicle.suspensionType === 'TELESCOPIC') stiffness = 1.30;

        const speedFactor = 1.0 + (Math.max(0, speedKmh - 15) * 0.025);
        let dynamicSagMm = Math.min(85.0, (potholeDepthMm * 0.35) * (vehicle.curbWeightKg / 1500.0) * stiffness * speedFactor);
        const effectiveMargin = gcMm - potholeDepthMm - (dynamicSagMm * 0.5);
        const isTwoWheeler = vehicle.category === 'MOTORCYCLE' || vehicle.category === 'SCOOTER';

        let canPass, verdict, verdictLevel, safeCrossings, shockWear, rimBendRisk, tireRisk, alignRate, repairCost;
        let insights = [];
        let recs = [];

        if (isTwoWheeler) {
            if (potholeDepthMm >= 90) {
                canPass = false;
                verdict = "CATASTROPHIC - TWO-WHEELER ROLLOVER HAZARD";
                verdictLevel = "CRITICAL";
                safeCrossings = 0;
                shockWear = 100.0;
                rimBendRisk = 95.0;
                tireRisk = "IMMEDIATE BLOWOUT";
                alignRate = "HANDLEBAR BENT";
                repairCost = 18000;
                insights.push(`Pothole depth (${pothole.depthCm} cm) exceeds 50% wheel radius.`);
                recs.push("DO NOT CROSS ON TWO-WHEELER. Divert route.");
            } else if (potholeDepthMm >= 50) {
                canPass = true;
                verdict = "PASSABLE ONLY AT CRAWL SPEED (< 10 KM/H)";
                verdictLevel = "WARNING";
                safeCrossings = Math.max(3, Math.floor(40 - (potholeDepthMm * 0.35)));
                shockWear = 3.5;
                rimBendRisk = 45.0;
                tireRisk = "PINCH FLAT HAZARD";
                alignRate = "T-STEM DRIFT";
                repairCost = 4500;
                insights.push("Front telescopic fork will bottom out.");
                recs.push("Reduce speed to under 10 km/h.");
            } else {
                canPass = true;
                verdict = "PASSABLE - MINOR JOLT";
                verdictLevel = "SUCCESS";
                safeCrossings = 350;
                shockWear = 0.25;
                rimBendRisk = 5.0;
                tireRisk = "LOW";
                alignRate = "NORMAL";
                repairCost = 800;
                insights.push("Manageable road ripple.");
                recs.push("Maintain straight handlebar.");
            }
        } else {
            if (effectiveMargin < -10) {
                canPass = false;
                verdict = "IMPASSABLE - SEVERE UNDERBODY DAMAGE GUARANTEED";
                verdictLevel = "CRITICAL";
                safeCrossings = 0;
                shockWear = 45.0;
                rimBendRisk = 88.0;
                tireRisk = "SIDEWALL CUT / RIM FRACTURE";
                alignRate = "SUBFRAME DEVIATION";
                repairCost = 45000;
                insights.push(`Pothole depth (${Math.round(potholeDepthMm)} mm) with sag exceeds ground clearance (${Math.round(gcMm)} mm).`);
                recs.push("Do not enter this road segment in this vehicle.");
            } else if (effectiveMargin <= 25) {
                canPass = true;
                verdict = "PASSABLE WITH EXTREME CAUTION (HIGH UNDERBODY SCRAPE RISK)";
                verdictLevel = "DANGER";
                safeCrossings = Math.max(1, Math.floor(effectiveMargin * 0.6));
                shockWear = 12.0;
                rimBendRisk = 55.0;
                tireRisk = "HIGH (Sidewall Bulge Risk)";
                alignRate = "RAPID TOE/CAMBER DRIFT";
                repairCost = 19500;
                insights.push(`Extremely narrow clearance buffer (${effectiveMargin.toFixed(1)} mm).`);
                recs.push("Crawl at 5-10 km/h. Approach at an angle.");
            } else if (effectiveMargin <= 60) {
                canPass = true;
                verdict = "PASSABLE WITH MODERATE CAUTION";
                verdictLevel = "WARNING";
                safeCrossings = Math.max(15, Math.floor(effectiveMargin * 3.5));
                shockWear = 2.2;
                rimBendRisk = 20.0;
                tireRisk = "MODERATE";
                alignRate = "GRADUAL DRIFT";
                repairCost = 7500;
                insights.push(`Safe static clearance with ${effectiveMargin.toFixed(1)} mm buffer.`);
                recs.push("Maintain 20-30 km/h speed.");
            } else {
                canPass = true;
                verdict = "PASSABLE SAFELY WITHOUT CONCERN";
                verdictLevel = "SUCCESS";
                safeCrossings = Math.max(80, Math.floor(effectiveMargin * 5.0));
                shockWear = 0.4;
                rimBendRisk = 3.0;
                tireRisk = "MINIMAL";
                alignRate = "STABLE";
                repairCost = 1200;
                insights.push("Generous ground clearance buffer.");
                recs.push("Normal city driving speed is safe.");
            }
        }

        return res.status(200).json({
            vehicleName: vehicle.fullName,
            vehicleCategory: vehicle.category,
            potholeId: pothole.id,
            roadName: pothole.roadName,
            canPass,
            verdict,
            verdictLevel,
            estimatedSafeCrossings: safeCrossings,
            groundClearanceMm: gcMm,
            potholeDepthMm,
            dynamicCompressionMm: dynamicSagMm,
            effectiveClearanceMarginMm: effectiveMargin,
            shockWearPerPassPercent: shockWear,
            rimBendRiskPercent: rimBendRisk,
            tireDamageRisk: tireRisk,
            wheelAlignmentDeclineRate: alignRate,
            estimatedRepairCostInr: repairCost,
            riskSummary: insights[0] || "Passability evaluation complete.",
            technicalInsights: insights,
            driverRecommendations: recs
        });
    }

    if (path === '/api/potholes/detect') {
        const body = req.body || {};
        const roadName = body.roadName || 'Inspected Corridor';
        const depthCm = Math.round((12.5 + Math.random() * 5) * 10) / 10;
        const diameterCm = Math.round((55.0 + Math.random() * 30) * 10) / 10;
        const severityScore = Math.min(95, Math.round((depthCm * 3.8) + (diameterCm * 0.35) + 12));
        const isDangerous = severityScore >= 70;
        const newId = 'p-' + Date.now().toString().slice(-4);

        const newPothole = {
            id: newId,
            roadId: 'r-live',
            roadName,
            latitude: body.latitude || 12.93524,
            longitude: body.longitude || 77.68532,
            depthCm,
            diameterCm,
            severityScore,
            severityLevel: isDangerous ? 'SEVERE' : 'MEDIUM',
            hazardType: depthCm >= 12 ? 'DEEP_CRATER' : 'EDGE_BREAK',
            isWaterLogged: depthCm >= 14,
            isDangerous,
            threatToCars: isDangerous ? 'High Rim Damage Risk' : 'Moderate Jolt',
            status: 'ACTIVE'
        };

        potholes.unshift(newPothole);

        let authorityReported = false;
        let dispatchRef = null;
        if (isDangerous) {
            authorityReported = true;
            dispatchRef = `NHAI-KA-BLR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
            dispatches.unshift({
                dispatchId: 'disp-' + Date.now().toString().slice(-4),
                potholeId: newId,
                officialRefNo: dispatchRef,
                authorityName: 'National Highways Authority of India (NHAI)',
                roadName,
                severityScore,
                urgency: 'EMERGENCY_24H',
                status: 'DISPATCHED',
                targetResolutionDays: 1,
                reportedAt: 'Just now',
                latitude: body.latitude || 12.93524,
                longitude: body.longitude || 77.68532
            });
        }

        return res.status(200).json({
            pothole: newPothole,
            authorityReported,
            dispatchRef,
            bbox: { x: 0.28, y: 0.44, width: 0.44, height: 0.34 }
        });
    }

    if (path === '/api/dispatches/update') {
        const body = req.body || {};
        const d = dispatches.find(item => item.dispatchId === body.dispatchId);
        if (d) {
            d.status = body.status || 'REPAIRED';
            if (d.status === 'REPAIRED') {
                const p = potholes.find(item => item.id === d.potholeId);
                if (p) p.status = 'REPAIRED';
            }
            return res.status(200).json({ success: true, dispatch: d });
        }
        return res.status(404).json({ success: false });
    }

    return res.status(404).json({ error: "Endpoint not found" });
}
