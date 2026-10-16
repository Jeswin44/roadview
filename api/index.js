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
    { id: 'v-bullet', make: 'Royal Enfield', model: 'Classic 350', fullName: 'Royal Enfield 350', category: 'MOTORCYCLE', groundClearanceMm: 170, wheelbaseMm: 1390, wheelRimInches: 19, approachAngleDeg: 26, departureAngleDeg: 28, tireProfilePercent: 90, suspensionType: 'TELESCOPIC', curbWeightKg: 195 },
    { id: 'v-fortuner', make: 'Toyota', model: 'Fortuner', fullName: 'Toyota Fortuner', category: 'SUV', groundClearanceMm: 225, wheelbaseMm: 2745, wheelRimInches: 18, approachAngleDeg: 29, departureAngleDeg: 25, tireProfilePercent: 60, suspensionType: 'RUGGED_OFFROAD', curbWeightKg: 2180 },
    { id: 'v-polo', make: 'Volkswagen', model: 'Polo GT', fullName: 'Volkswagen Polo', category: 'HATCHBACK', groundClearanceMm: 168, wheelbaseMm: 2470, wheelRimInches: 16, approachAngleDeg: 14, departureAngleDeg: 16, tireProfilePercent: 55, suspensionType: 'COMFORT_INDEPENDENT', curbWeightKg: 1105 },
    { id: 'v-nexon', make: 'Tata', model: 'Nexon', fullName: 'Tata Nexon', category: 'SUV', groundClearanceMm: 209, wheelbaseMm: 2498, wheelRimInches: 16, approachAngleDeg: 20, departureAngleDeg: 24, tireProfilePercent: 60, suspensionType: 'COMFORT_INDEPENDENT', curbWeightKg: 1230 }
];

const SEED_ROADS = [
    { id: 'road-101', name: 'Outer Ring Road (Marathahalli - Bellandur Stretch)', city: 'Bengaluru', district: 'East Zone', lengthKm: 7.8, safetyScore: 2.1, potholeCount: 19, dangerousPotholesCount: 7, averageDepthCm: 11.2, centerLat: 12.935240, centerLng: 77.685320, communityWarning: 'EXTREME HAZARD: Multiple deep craters across center & right lanes. Severe suspension hazard for small cars and two-wheelers.' },
    { id: 'road-102', name: 'Bannerghatta National Highway Section 9', city: 'Bengaluru', district: 'South Zone', lengthKm: 12.4, safetyScore: 3.4, potholeCount: 14, dangerousPotholesCount: 5, averageDepthCm: 8.6, centerLat: 12.871230, centerLng: 77.593210, communityWarning: 'UNSAFE: Heavy truck ruts and unpaved shoulder sinkholes. Two-wheelers prone to skidding during rain.' },
    { id: 'road-103', name: 'Old Madras Road (K.R. Puram Junction)', city: 'Bengaluru', district: 'East Zone', lengthKm: 5.2, safetyScore: 3.8, potholeCount: 12, dangerousPotholesCount: 4, averageDepthCm: 7.9, centerLat: 13.003410, centerLng: 77.691230, communityWarning: 'UNSAFE: Uneven asphalt patchwork with sharp jagged edge potholes near flyover pillars.' },
    { id: 'road-104', name: 'Industrial Bypass Road (Peenya Phase 2)', city: 'Bengaluru', district: 'North Zone', lengthKm: 9.1, safetyScore: 2.8, potholeCount: 23, dangerousPotholesCount: 9, averageDepthCm: 12.5, centerLat: 13.031200, centerLng: 77.512300, communityWarning: 'CRITICAL DANGER: Continuous trenching and broken storm water grating. Impassable for low-clearance sedans.' },
    { id: 'road-105', name: 'MG Road - Commercial Boulevard', city: 'Bengaluru', district: 'Central Zone', lengthKm: 4.3, safetyScore: 5.8, potholeCount: 6, dangerousPotholesCount: 2, averageDepthCm: 5.1, centerLat: 12.975420, centerLng: 77.608310, communityWarning: 'MODERATE CAUTION: Occasional manhole subsidence and surface cracking near pedestrian crossings.' },
    { id: 'road-106', name: 'Sarjapur Main Road (Carmelaram Section)', city: 'Bengaluru', district: 'South East', lengthKm: 8.0, safetyScore: 4.9, potholeCount: 11, dangerousPotholesCount: 3, averageDepthCm: 6.4, centerLat: 12.909800, centerLng: 77.701200, communityWarning: 'MODERATE CAUTION: Ongoing pipeline excavation with rough metal plates across carriage way.' },
    { id: 'road-107', name: 'Airport Elevated Expressway', city: 'Bengaluru', district: 'North Zone', lengthKm: 22.0, safetyScore: 9.4, potholeCount: 1, dangerousPotholesCount: 0, averageDepthCm: 1.8, centerLat: 13.198900, centerLng: 77.706800, communityWarning: 'SAFE: Smooth hot-mix asphalt surface with active drainage. Excellent passability for all vehicles.' },
    { id: 'road-108', name: 'Nice Ring Road (Hosur to Kanakapura Expressway)', city: 'Bengaluru', district: 'South Zone', lengthKm: 31.5, safetyScore: 8.9, potholeCount: 2, dangerousPotholesCount: 0, averageDepthCm: 2.2, centerLat: 12.842100, centerLng: 77.562100, communityWarning: 'SAFE: High quality concrete surface with minimal road ripples.' },
    { id: 'road-109', name: 'Whitefield Main Road (Hope Farm Corridor)', city: 'Bengaluru', district: 'Mahadevapura', lengthKm: 6.8, safetyScore: 4.2, potholeCount: 8, dangerousPotholesCount: 3, averageDepthCm: 7.8, centerLat: 12.969810, centerLng: 77.749920, communityWarning: 'UNSAFE: Broken tarmac edges and metro construction diversions. Moderate rim bend hazard.' },
    { id: 'road-110', name: '100 Feet Road (Indiranagar 12th Main to Domlur)', city: 'Bengaluru', district: 'East Zone', lengthKm: 3.2, safetyScore: 6.2, potholeCount: 5, dangerousPotholesCount: 1, averageDepthCm: 4.5, centerLat: 12.971890, centerLng: 77.641150, communityWarning: 'MODERATE CAUTION: Road patchwork near junction crossings. Manageable at moderate speeds.' },
    { id: 'road-111', name: 'Koramangala 80 Feet Road (Sony World Signal)', city: 'Bengaluru', district: 'South East', lengthKm: 4.1, safetyScore: 5.1, potholeCount: 7, dangerousPotholesCount: 2, averageDepthCm: 5.8, centerLat: 12.934510, centerLng: 77.625820, communityWarning: 'MODERATE CAUTION: Water-filled dip near storm drain. Two-wheelers should avoid curbside lane.' },
    { id: 'road-112', name: 'Hosur Road Expressway (Electronic City Phase 1)', city: 'Bengaluru', district: 'South Zone', lengthKm: 14.2, safetyScore: 8.4, potholeCount: 2, dangerousPotholesCount: 0, averageDepthCm: 2.8, centerLat: 12.845210, centerLng: 77.660140, communityWarning: 'SAFE: High-speed multi-lane surface in good condition with minor rumble strips.' }
];

let potholes = [
    { id: 'p-101', roadId: 'road-101', roadName: 'Outer Ring Road (Marathahalli - Bellandur Stretch)', latitude: 12.935240, longitude: 77.685320, depthCm: 11.5, diameterCm: 62.0, severityScore: 94, severityLevel: 'CRITICAL', hazardType: 'DEEP_CRATER', isWaterLogged: false, isDangerous: true, threatToCars: 'Catastrophic Sump & Rim Fracture', status: 'ACTIVE' },
    { id: 'p-102', roadId: 'road-101', roadName: 'Outer Ring Road (Marathahalli - Bellandur Stretch)', latitude: 12.936100, longitude: 77.687200, depthCm: 8.2, diameterCm: 48.0, severityScore: 82, severityLevel: 'SEVERE', hazardType: 'WATER_MASKED', isWaterLogged: true, isDangerous: true, threatToCars: 'Underbody Breach & Aquaplaning Risk', status: 'ACTIVE' },
    { id: 'p-103', roadId: 'road-104', roadName: 'Industrial Bypass Road (Peenya Phase 2)', latitude: 13.031200, longitude: 77.512300, depthCm: 13.0, diameterCm: 75.0, severityScore: 96, severityLevel: 'CRITICAL', hazardType: 'TRANSVERSE_TRENCH', isWaterLogged: false, isDangerous: true, threatToCars: 'Suspension Fracture & Ground Out', status: 'ACTIVE' },
    { id: 'p-104', roadId: 'road-102', roadName: 'Bannerghatta National Highway Section 9', latitude: 12.871230, longitude: 77.593210, depthCm: 9.0, diameterCm: 50.0, severityScore: 86, severityLevel: 'SEVERE', hazardType: 'DEEP_CRATER', isWaterLogged: true, isDangerous: true, threatToCars: 'Two-Wheeler Fall & Axle Misalignment', status: 'ACTIVE' },
    { id: 'p-105', roadId: 'road-105', roadName: 'MG Road - Commercial Boulevard', latitude: 12.975420, longitude: 77.608310, depthCm: 4.8, diameterCm: 32.0, severityScore: 56, severityLevel: 'MEDIUM', hazardType: 'EDGE_BREAK', isWaterLogged: false, isDangerous: false, threatToCars: 'Moderate Suspension Shock', status: 'ACTIVE' },
    { id: 'p-106', roadId: 'road-106', roadName: 'Sarjapur Main Road (Carmelaram Section)', latitude: 12.909800, longitude: 77.701200, depthCm: 5.5, diameterCm: 38.0, severityScore: 62, severityLevel: 'MEDIUM', hazardType: 'ALLIGATOR_CRACK', isWaterLogged: false, isDangerous: false, threatToCars: 'Minor Vibration & Tread Wear', status: 'ACTIVE' },
    { id: 'p-107', roadId: 'road-107', roadName: 'Airport Elevated Expressway', latitude: 13.198900, longitude: 77.706800, depthCm: 2.1, diameterCm: 18.0, severityScore: 24, severityLevel: 'LOW', hazardType: 'SURFACE_SPALL', isWaterLogged: false, isDangerous: false, threatToCars: 'Negligible Impact', status: 'REPAIRED' },
    { id: 'p-108', roadId: 'road-108', roadName: 'Nice Ring Road (Kanakapura Expressway)', latitude: 12.842100, longitude: 77.562100, depthCm: 2.5, diameterCm: 20.0, severityScore: 28, severityLevel: 'LOW', hazardType: 'SURFACE_SPALL', isWaterLogged: false, isDangerous: false, threatToCars: 'Negligible Impact', status: 'REPAIRED' },
    { id: 'p-109', roadId: 'road-109', roadName: 'Whitefield Main Road (Hope Farm Corridor)', latitude: 12.969810, longitude: 77.749920, depthCm: 7.8, diameterCm: 45.0, severityScore: 72, severityLevel: 'SEVERE', hazardType: 'EDGE_BREAK', isWaterLogged: false, isDangerous: true, threatToCars: 'Rim Bend Hazard & Steering Pull', status: 'ACTIVE' },
    { id: 'p-110', roadId: 'road-110', roadName: '100 Feet Road (Indiranagar 12th Main to Domlur)', latitude: 12.971890, longitude: 77.641150, depthCm: 4.5, diameterCm: 30.0, severityScore: 52, severityLevel: 'MEDIUM', hazardType: 'SURFACE_SPALL', isWaterLogged: false, isDangerous: false, threatToCars: 'Tire Thud & Minor Jolt', status: 'ACTIVE' },
    { id: 'p-111', roadId: 'road-111', roadName: 'Koramangala 80 Feet Road (Sony World Signal)', latitude: 12.934510, longitude: 77.625820, depthCm: 5.8, diameterCm: 42.0, severityScore: 64, severityLevel: 'MEDIUM', hazardType: 'ALLIGATOR_CRACK', isWaterLogged: true, isDangerous: false, threatToCars: 'Splash Hydroplaning Risk', status: 'ACTIVE' },
    { id: 'p-112', roadId: 'road-112', roadName: 'Hosur Road Expressway (Electronic City Phase 1)', latitude: 12.845210, longitude: 77.660140, depthCm: 2.8, diameterCm: 22.0, severityScore: 30, severityLevel: 'LOW', hazardType: 'SURFACE_SPALL', isWaterLogged: false, isDangerous: false, threatToCars: 'Minor Vibration', status: 'REPAIRED' }
];

let dispatches = [
    { dispatchId: 'disp-901', potholeId: 'p-101', officialRefNo: 'NHAI-KA-BLR-2026-9481', authorityName: 'National Highways Authority of India (NHAI)', roadName: 'Outer Ring Road (Marathahalli - Bellandur Stretch)', severityScore: 94, urgency: 'EMERGENCY_24H', status: 'DISPATCHED', targetResolutionDays: 1, reportedAt: '2026-10-15 09:30 IST', latitude: 12.935240, longitude: 77.685320 },
    { dispatchId: 'disp-902', potholeId: 'p-103', officialRefNo: 'BBMP-ENG-NZ-2026-1042', authorityName: 'BBMP North Zone Infrastructure Division', roadName: 'Industrial Bypass Road (Peenya Phase 2)', severityScore: 96, urgency: 'EMERGENCY_24H', status: 'DISPATCHED', targetResolutionDays: 1, reportedAt: '2026-10-15 11:15 IST', latitude: 13.031200, longitude: 77.512300 },
    { dispatchId: 'disp-903', potholeId: 'p-104', officialRefNo: 'PWD-BLR-RURAL-2026-441', authorityName: 'Karnataka Public Works Department (PWD)', roadName: 'Bannerghatta National Highway Section 9', severityScore: 86, urgency: 'PRIORITY_48H', status: 'IN_REVIEW', targetResolutionDays: 2, reportedAt: '2026-10-15 14:00 IST', latitude: 12.871230, longitude: 77.593210 }
];

let gps = { latitude: 12.93524, longitude: 77.68532, speedKmh: 42, heading: 86, altitude: 915, address: "Outer Ring Road, Bellandur, Bengaluru" };

function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371.0;
    const dLat = (lat2 - lat1) * Math.PI / 180.0;
    const dLon = (lon2 - lon1) * Math.PI / 180.0;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180.0) * Math.cos(lat2 * Math.PI / 180.0) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

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
    if (path === '/api/roads/nearby') {
        const urlObj = new URL(req.url, 'http://localhost');
        const lat = parseFloat(urlObj.searchParams.get('lat')) || 12.93524;
        const lng = parseFloat(urlObj.searchParams.get('lng')) || 77.68532;
        const limit = parseInt(urlObj.searchParams.get('limit')) || 6;

        const roadsWithDistance = SEED_ROADS.map(road => {
            const distKm = calculateHaversineDistanceKm(lat, lng, road.centerLat, road.centerLng);
            return {
                ...road,
                distanceMeters: Math.round(distKm * 1000),
                distanceKm: Math.round(distKm * 100) / 100
            };
        });

        roadsWithDistance.sort((a, b) => a.distanceMeters - b.distanceMeters);
        return res.status(200).json(roadsWithDistance.slice(0, limit));
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

        let pothole = potholes.find(p => p.id === body.potholeId);
        if (!pothole && body.roadId) {
            pothole = potholes.find(p => p.roadId === body.roadId);
        }
        if (!pothole && body.roadId) {
            const road = SEED_ROADS.find(r => r.id === body.roadId);
            if (road) {
                pothole = {
                    id: 'p-dyn-' + road.id,
                    roadId: road.id,
                    roadName: road.name,
                    depthCm: Math.max(3.0, (10.0 - road.safetyScore) * 1.6),
                    severityScore: Math.round(Math.max(15, (10.0 - road.safetyScore) * 10))
                };
            }
        }
        if (!pothole) pothole = potholes[0];

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
            roadId: 'road-101',
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
