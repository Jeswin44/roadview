/**
 * ROADGUARD AI - Simple, Understandable UI Controller
 * Universal Edition: Supports native Java 21 backend AND 100% standalone Vercel / Static deployment
 */

// ================= IN-MEMORY SIMULATION ENGINE FOR VERCEL & OFFLINE =================
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
    { id: 'r-5', name: 'MG Road (Brigade Road Junction to Trinity)', city: 'Bengaluru', district: 'Central Zone', safetyScore: 8.6, status: 'SAFE', potholeCount: 1, dangerousPotholesCount: 0, averageDepthCm: 3.2, surfaceType: 'SMOOTH_BITUMEN', managedBy: 'BBMP Central', communityWarning: 'Good condition overall. Passable by all vehicles.', centerLat: 12.97410, centerLng: 77.61020 },
    { id: 'r-6', name: 'Old Madras Road (K.R. Puram Junction)', city: 'Bengaluru', district: 'East Zone', safetyScore: 3.8, status: 'UNSAFE', potholeCount: 5, dangerousPotholesCount: 2, averageDepthCm: 10.5, surfaceType: 'ASPHALT', managedBy: 'BBMP East', communityWarning: 'Uneven asphalt patchwork near flyover pillars.', centerLat: 13.00341, centerLng: 77.69123 },
    { id: 'r-7', name: '100 Feet Road (Indiranagar 12th Main)', city: 'Bengaluru', district: 'East Zone', safetyScore: 6.2, status: 'MODERATE', potholeCount: 2, dangerousPotholesCount: 1, averageDepthCm: 6.4, surfaceType: 'ASPHALT', managedBy: 'BBMP East', communityWarning: 'Road patchwork near junction crossings.', centerLat: 12.97189, centerLng: 77.64115 },
    { id: 'r-8', name: 'Koramangala 80 Feet Road (Sony World Signal)', city: 'Bengaluru', district: 'South-East', safetyScore: 5.1, status: 'MODERATE', potholeCount: 3, dangerousPotholesCount: 1, averageDepthCm: 7.2, surfaceType: 'ASPHALT', managedBy: 'BBMP South', communityWarning: 'Water-filled dip near storm drain.', centerLat: 12.93451, centerLng: 77.62582 },
    { id: 'r-9', name: 'Industrial Bypass Road (Peenya Phase 2)', city: 'Bengaluru', district: 'North Zone', safetyScore: 2.8, status: 'HAZARDOUS', potholeCount: 7, dangerousPotholesCount: 4, averageDepthCm: 15.0, surfaceType: 'ASPHALT', managedBy: 'Karnataka PWD', communityWarning: 'Continuous trenching and broken storm water grating.', centerLat: 13.03120, centerLng: 77.51230 },
    { id: 'r-10', name: 'Hosur Road Expressway (Electronic City Phase 1)', city: 'Bengaluru', district: 'South Zone', safetyScore: 8.4, status: 'SAFE', potholeCount: 1, dangerousPotholesCount: 0, averageDepthCm: 2.8, surfaceType: 'SMOOTH_BITUMEN', managedBy: 'NHAI', communityWarning: 'High speed multi-lane expressway with minor rumble strips.', centerLat: 12.84521, centerLng: 77.66014 },
    { id: 'r-11', name: 'Airport Elevated Expressway (Hebbal to Yelahanka)', city: 'Bengaluru', district: 'North Zone', safetyScore: 9.4, status: 'SAFE', potholeCount: 0, dangerousPotholesCount: 0, averageDepthCm: 1.8, surfaceType: 'SMOOTH_BITUMEN', managedBy: 'NHAI', communityWarning: 'Excellent surface condition and smooth drainage.', centerLat: 13.08250, centerLng: 77.59880 },
    { id: 'r-12', name: 'NICE Ring Road (Kanakapura Interchange)', city: 'Bengaluru', district: 'South Zone', safetyScore: 8.9, status: 'SAFE', potholeCount: 1, dangerousPotholesCount: 0, averageDepthCm: 2.5, surfaceType: 'CONCRETE', managedBy: 'NICE Infra', communityWarning: 'High quality concrete surface with minimal road ripples.', centerLat: 12.84210, centerLng: 77.56210 }
];

const SEED_POTHOLES = [
    { id: 'p-101', roadId: 'r-1', roadName: 'Outer Ring Road (near Bellandur Flyover)', latitude: 12.93524, longitude: 77.68532, depthCm: 14.5, diameterCm: 85.0, severityScore: 84, severityLevel: 'SEVERE', hazardType: 'DEEP_CRATER', isWaterLogged: true, isDangerous: true, threatToCars: 'Catastrophic Sump & Rim Fracture', status: 'ACTIVE' },
    { id: 'p-102', roadId: 'r-2', roadName: 'Sarjapur Road (Kaikondrahalli Lake Turn)', latitude: 12.91245, longitude: 77.67412, depthCm: 18.0, diameterCm: 110.0, severityScore: 92, severityLevel: 'CRITICAL', hazardType: 'WATER_MASKED', isWaterLogged: true, isDangerous: true, threatToCars: 'Underbody Breach & Two-Wheeler Fall Hazard', status: 'ACTIVE' },
    { id: 'p-103', roadId: 'r-3', roadName: 'Whitefield Main Road (near Metro Pillar 142)', latitude: 12.96981, longitude: 77.74992, depthCm: 8.5, diameterCm: 45.0, severityScore: 58, severityLevel: 'MEDIUM', hazardType: 'EDGE_BREAK', isWaterLogged: false, isDangerous: false, threatToCars: 'Moderate Suspension Shock', status: 'ACTIVE' },
    { id: 'p-104', roadId: 'r-4', roadName: 'Bannerghatta Road (Gottigere Cross)', latitude: 12.89432, longitude: 77.59821, depthCm: 11.2, diameterCm: 65.0, severityScore: 74, severityLevel: 'SEVERE', hazardType: 'TRANSVERSE_TRENCH', isWaterLogged: false, isDangerous: true, threatToCars: 'Axle Misalignment & Rim Damage', status: 'ACTIVE' },
    { id: 'p-105', roadId: 'r-1', roadName: 'Old Airport Road (HAL Gate)', latitude: 12.95810, longitude: 77.64920, depthCm: 6.0, diameterCm: 35.0, severityScore: 42, severityLevel: 'MEDIUM', hazardType: 'ALLIGATOR_CRACK', isWaterLogged: false, isDangerous: false, threatToCars: 'Minor Vibration & Tread Wear', status: 'ACTIVE' },
    { id: 'p-106', roadId: 'r-5', roadName: 'MG Road (near Trinity Metro)', latitude: 12.97410, longitude: 77.61020, depthCm: 3.5, diameterCm: 25.0, severityScore: 22, severityLevel: 'LOW', hazardType: 'SURFACE_SPALL', isWaterLogged: false, isDangerous: false, threatToCars: 'Negligible Impact', status: 'REPAIRED' },
    { id: 'p-107', roadId: 'r-6', roadName: 'Old Madras Road (near K.R. Puram Flyover)', latitude: 13.00341, longitude: 77.69123, depthCm: 10.5, diameterCm: 70.0, severityScore: 76, severityLevel: 'SEVERE', hazardType: 'TRANSVERSE_TRENCH', isWaterLogged: false, isDangerous: true, threatToCars: 'Wheel Rim Dent & Alignment Loss', status: 'ACTIVE' },
    { id: 'p-108', roadId: 'r-7', roadName: '100 Feet Road (Indiranagar 12th Main)', latitude: 12.97189, longitude: 77.64115, depthCm: 6.4, diameterCm: 40.0, severityScore: 52, severityLevel: 'MEDIUM', hazardType: 'EDGE_BREAK', isWaterLogged: false, isDangerous: false, threatToCars: 'Moderate Bump Shock', status: 'ACTIVE' },
    { id: 'p-109', roadId: 'r-8', roadName: 'Koramangala 80 Feet Road (Sony World)', latitude: 12.93451, longitude: 77.62582, depthCm: 7.2, diameterCm: 50.0, severityScore: 64, severityLevel: 'MEDIUM', hazardType: 'ALLIGATOR_CRACK', isWaterLogged: true, isDangerous: false, threatToCars: 'Splash & Tread Wear', status: 'ACTIVE' },
    { id: 'p-110', roadId: 'r-9', roadName: 'Industrial Bypass (Peenya Phase 2)', latitude: 13.03120, longitude: 77.51230, depthCm: 15.0, diameterCm: 90.0, severityScore: 96, severityLevel: 'CRITICAL', hazardType: 'DEEP_CRATER', isWaterLogged: false, isDangerous: true, threatToCars: 'Severe Underbody Breach', status: 'ACTIVE' },
    { id: 'p-111', roadId: 'r-10', roadName: 'Hosur Road Expressway (Phase 1 Exit)', latitude: 12.84521, longitude: 77.66014, depthCm: 2.8, diameterCm: 20.0, severityScore: 26, severityLevel: 'LOW', hazardType: 'SURFACE_SPALL', isWaterLogged: false, isDangerous: false, threatToCars: 'Negligible Impact', status: 'ACTIVE' },
    { id: 'p-112', roadId: 'r-12', roadName: 'NICE Ring Road (Kanakapura Cross)', latitude: 12.84210, longitude: 77.56210, depthCm: 2.5, diameterCm: 18.0, severityScore: 24, severityLevel: 'LOW', hazardType: 'SURFACE_SPALL', isWaterLogged: false, isDangerous: false, threatToCars: 'Smooth Passability', status: 'ACTIVE' }
];

const SEED_DISPATCHES = [
    { dispatchId: 'disp-901', potholeId: 'p-101', officialRefNo: 'NHAI-KA-BLR-2026-9481', authorityName: 'National Highways Authority of India (NHAI)', roadName: 'Outer Ring Road (near Bellandur Flyover)', severityScore: 84, urgency: 'EMERGENCY_24H', status: 'DISPATCHED', targetResolutionDays: 1, reportedAt: '2026-10-15 09:30 IST', latitude: 12.93524, longitude: 77.68532 },
    { dispatchId: 'disp-902', potholeId: 'p-102', officialRefNo: 'BBMP-ENG-SZ-2026-1042', authorityName: 'BBMP South Zone Road Infrastructure Cell', roadName: 'Sarjapur Road (Kaikondrahalli Lake Turn)', severityScore: 92, urgency: 'EMERGENCY_24H', status: 'DISPATCHED', targetResolutionDays: 1, reportedAt: '2026-10-15 11:15 IST', latitude: 12.91245, longitude: 77.67412 },
    { dispatchId: 'disp-903', potholeId: 'p-104', officialRefNo: 'PWD-BLR-RURAL-2026-441', authorityName: 'Karnataka Public Works Department (PWD)', roadName: 'Bannerghatta Road (Gottigere Cross)', severityScore: 74, urgency: 'PRIORITY_48H', status: 'IN_REVIEW', targetResolutionDays: 2, reportedAt: '2026-10-15 14:00 IST', latitude: 12.89432, longitude: 77.59821 }
];

const SIM_CORRIDOR_WAYPOINTS = [
    { lat: 12.93524, lng: 77.68532, addr: "Outer Ring Road, Bellandur, Bengaluru", speed: 42, heading: 86 },
    { lat: 12.93480, lng: 77.68650, addr: "Outer Ring Road (EcoSpace Tech Park)", speed: 38, heading: 92 },
    { lat: 12.93390, lng: 77.68820, addr: "Outer Ring Road (near Devarabisanahalli Flyover)", speed: 34, heading: 98 },
    { lat: 12.93210, lng: 77.69110, addr: "Outer Ring Road (Khadki Corridor)", speed: 45, heading: 104 },
    { lat: 12.92840, lng: 77.69380, addr: "Sarjapur Outer Ring Road Junction", speed: 28, heading: 140 },
    { lat: 12.92120, lng: 77.68520, addr: "Sarjapur Road (Carmelaram Cross)", speed: 36, heading: 215 },
    { lat: 12.91245, lng: 77.67412, addr: "Sarjapur Road (Kaikondrahalli Lake)", speed: 24, heading: 240 }
];

let simWaypointIdx = 0;
const localDb = {
    vehicles: JSON.parse(JSON.stringify(SEED_VEHICLES)),
    roads: JSON.parse(JSON.stringify(SEED_ROADS)),
    potholes: JSON.parse(JSON.stringify(SEED_POTHOLES)),
    dispatches: JSON.parse(JSON.stringify(SEED_DISPATCHES)),
    currentGps: { latitude: 12.93524, longitude: 77.68532, speedKmh: 42, heading: 86, altitude: 915, address: "Outer Ring Road, Bellandur, Bengaluru" }
};

// ================= UNIVERSAL API BRIDGE (JAVA + VERCEL FALLBACK) =================
async function universalFetch(endpoint, options = {}) {
    try {
        const response = await fetch(endpoint, options);
        if (response.ok) {
            return await response.json();
        }
    } catch (e) {
        // Fall through to client simulation
    }
    return executeLocalApiFallback(endpoint, options);
}

function executeLocalApiFallback(endpoint, options = {}) {
    const url = endpoint.split('?')[0];

    if (url === '/api/vehicles') {
        return Promise.resolve(localDb.vehicles);
    }
    if (url === '/api/roads') {
        return Promise.resolve(localDb.roads);
    }
    if (url === '/api/roads/nearby') {
        const queryStr = endpoint.includes('?') ? endpoint.split('?')[1] : '';
        const params = new URLSearchParams(queryStr);
        const lat = parseFloat(params.get('lat')) || (localDb.currentGps ? localDb.currentGps.latitude : 12.93524);
        const lng = parseFloat(params.get('lng')) || (localDb.currentGps ? localDb.currentGps.longitude : 77.68532);
        const limit = parseInt(params.get('limit')) || 6;

        const list = localDb.roads.map(r => {
            const distMeters = calculateDistanceMeters(lat, lng, r.centerLat, r.centerLng);
            return Object.assign({}, r, { distanceMeters: distMeters, distanceKm: distMeters / 1000.0 });
        });
        list.sort((a, b) => a.distanceMeters - b.distanceMeters);
        return Promise.resolve(list.slice(0, limit));
    }
    if (url === '/api/potholes') {
        return Promise.resolve(localDb.potholes);
    }
    if (url === '/api/dispatches') {
        return Promise.resolve(localDb.dispatches);
    }
    if (url === '/api/stats') {
        return Promise.resolve({
            totalPotholes: localDb.potholes.length,
            dangerousPotholes: localDb.potholes.filter(p => p.isDangerous).length,
            activeDispatches: localDb.dispatches.filter(d => d.status !== 'REPAIRED').length,
            unsafeRoads: localDb.roads.filter(r => r.safetyScore < 6.0).length,
            currentGps: localDb.currentGps
        });
    }
    if (url === '/api/config') {
        return Promise.resolve({ googleMapsApiKey: "AIzaSyCqOwh79bsnGhCy7e0iuoaF5fEevxTg9BQ" });
    }

    if (url === '/api/vehicles/evaluate') {
        const body = options.body ? JSON.parse(options.body) : {};
        const vName = (body.vehicleName || 'Honda City').toLowerCase();
        let vehicle = localDb.vehicles.find(v => v.fullName.toLowerCase().includes(vName) || v.model.toLowerCase().includes(vName));
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

        let pothole = localDb.potholes.find(p => p.id === body.potholeId || p.roadId === body.potholeId);
        if (!pothole && state.nearbyRoadsList) {
            const nearby = state.nearbyRoadsList.find(r => r.id === body.potholeId);
            if (nearby) {
                pothole = {
                    id: nearby.id,
                    roadId: nearby.id,
                    roadName: nearby.name,
                    depthCm: nearby.averageDepthCm || 10.0,
                    diameterCm: 60.0,
                    severityScore: Math.round((10 - nearby.safetyScore) * 10),
                    severityLevel: nearby.safetyScore < 4 ? 'CRITICAL' : (nearby.safetyScore < 7 ? 'SEVERE' : 'LOW'),
                    hazardType: 'POTHOLE_CRATER'
                };
            }
        }
        if (!pothole) pothole = localDb.potholes[0];

        const speedKmh = parseInt(body.speedKmh) || 25;
        const gcMm = vehicle.groundClearanceMm;
        const potholeDepthMm = pothole.depthCm * 10.0;

        let stiffness = 1.15;
        if (vehicle.suspensionType === 'SOFT') stiffness = 1.45;
        else if (vehicle.suspensionType === 'COMFORT_INDEPENDENT') stiffness = 1.25;
        else if (vehicle.suspensionType === 'RUGGED_OFFROAD') stiffness = 0.85;
        else if (vehicle.suspensionType === 'TELESCOPIC') stiffness = 1.30;

        const speedFactor = 1.0 + (Math.max(0, speedKmh - 15) * 0.025);
        let dynamicSagMm = (potholeDepthMm * 0.35) * (vehicle.curbWeightKg / 1500.0) * stiffness * speedFactor;
        dynamicSagMm = Math.min(dynamicSagMm, 85.0);

        const effectiveClearanceMargin = gcMm - potholeDepthMm - (dynamicSagMm * 0.5);
        const isTwoWheeler = vehicle.category === 'MOTORCYCLE' || vehicle.category === 'SCOOTER';

        let canPass, verdict, verdictLevel, safeCrossings, shockWear, rimBendRisk, tireRisk, alignRate, repairCost;
        let insights = [];
        let recs = [];

        if (isTwoWheeler) {
            const rimRadiusMm = (vehicle.wheelRimInches * 25.4) / 2.0;
            const depthRatio = potholeDepthMm / rimRadiusMm;

            if (depthRatio >= 0.55 || potholeDepthMm >= 90) {
                canPass = false;
                verdict = "CATASTROPHIC - TWO-WHEELER ROLLOVER / HIGH INJURY HAZARD";
                verdictLevel = "CRITICAL";
                safeCrossings = 0;
                shockWear = 100.0;
                rimBendRisk = 95.0;
                tireRisk = "IMMEDIATE RIM CRACK / BLOWOUT";
                alignRate = "HANDLEBAR BENT";
                repairCost = 18000;
                insights.push(`Pothole depth (${pothole.depthCm} cm) exceeds 50% of the front wheel radius.`);
                recs.push("DO NOT ATTEMPT TO CROSS ON TWO-WHEELER.");
                recs.push("Divert route immediately or walk vehicle slowly along the shoulder edge.");
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
                insights.push("Front telescopic fork will bottom out into hydraulic bump stops.");
                recs.push("Reduce speed to under 10 km/h.");
                recs.push("Stand slightly on footpegs to absorb chassis shock through knees.");
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
                insights.push("Manageable road ripple for this wheel diameter.");
                recs.push("Maintain straight handlebar posture when crossing.");
            }
        } else {
            if (effectiveClearanceMargin < -10) {
                canPass = false;
                verdict = "IMPASSABLE - SEVERE UNDERBODY DAMAGE GUARANTEED";
                verdictLevel = "CRITICAL";
                safeCrossings = 0;
                shockWear = 45.0;
                rimBendRisk = 88.0;
                tireRisk = "SIDEWALL CUT / RIM FRACTURE";
                alignRate = "SUBFRAME DEVIATION";
                repairCost = 45000;
                insights.push(`Pothole depth (${Math.round(potholeDepthMm)} mm) with suspension sag exceeds ground clearance (${Math.round(gcMm)} mm).`);
                insights.push("Engine oil pan, exhaust catalytic converter, and bumper apron will bottom out violently.");
                recs.push("Do not enter this road segment in this vehicle.");
                recs.push("Find an alternate route or straddle crater if lane width permits.");
            } else if (effectiveClearanceMargin <= 25) {
                canPass = true;
                verdict = "PASSABLE WITH EXTREME CAUTION (HIGH UNDERBODY SCRAPE RISK)";
                verdictLevel = "DANGER";
                safeCrossings = Math.max(1, Math.floor(effectiveClearanceMargin * 0.6));
                shockWear = 12.0;
                rimBendRisk = 55.0;
                tireRisk = "HIGH (Sidewall Bulge Risk)";
                alignRate = "RAPID TOE/CAMBER DRIFT";
                repairCost = 19500;
                insights.push(`Extremely narrow clearance buffer (${effectiveClearanceMargin.toFixed(1)} mm).`);
                insights.push("Any speed over 15 km/h will trigger full suspension bump-stop hit and undercarriage scrape.");
                recs.push("Crawl at 5-10 km/h.");
                recs.push("Approach diagonally at a 30° angle to prevent both wheels dropping simultaneously.");
            } else if (effectiveClearanceMargin <= 60) {
                canPass = true;
                verdict = "PASSABLE WITH MODERATE CAUTION";
                verdictLevel = "WARNING";
                safeCrossings = Math.max(15, Math.floor(effectiveClearanceMargin * 3.5));
                shockWear = 2.2;
                rimBendRisk = 20.0;
                tireRisk = "MODERATE";
                alignRate = "GRADUAL DRIFT";
                repairCost = 7500;
                insights.push(`Safe static clearance with ${effectiveClearanceMargin.toFixed(1)} mm margin.`);
                recs.push("Maintain 20-30 km/h steady speed.");
            } else {
                canPass = true;
                verdict = "PASSABLE SAFELY WITHOUT CONCERN";
                verdictLevel = "SUCCESS";
                safeCrossings = Math.max(80, Math.floor(effectiveClearanceMargin * 5.0));
                shockWear = 0.4;
                rimBendRisk = 3.0;
                tireRisk = "MINIMAL";
                alignRate = "STABLE";
                repairCost = 1200;
                insights.push("Generous ground clearance buffer. Chassis stays well above pothole crest.");
                recs.push("Normal city driving speed is safe.");
            }
        }

        return Promise.resolve({
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
            effectiveClearanceMarginMm: effectiveClearanceMargin,
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

    if (url === '/api/potholes/detect') {
        const body = options.body ? JSON.parse(options.body) : {};
        const roadName = body.roadName || 'Inspected Corridor';
        const lat = parseFloat(body.latitude) || 12.93524;
        const lng = parseFloat(body.longitude) || 77.68532;

        const isDeep = roadName.toLowerCase().includes('deep') || (body.imageBase64 && body.imageBase64.length > 500);
        const depthCm = Math.round((isDeep ? (12.0 + Math.random() * 6.5) : (5.0 + Math.random() * 4.5)) * 10) / 10;
        const diameterCm = Math.round((45.0 + Math.random() * 40.0) * 10) / 10;
        const severityScore = Math.min(96, Math.max(25, Math.round((depthCm * 3.8) + (diameterCm * 0.35) + 12)));
        const isDangerous = severityScore >= 70;
        const newId = 'p-' + Date.now().toString().slice(-4);

        const newPothole = {
            id: newId,
            roadId: 'r-live',
            roadName: roadName,
            latitude: lat,
            longitude: lng,
            depthCm: depthCm,
            diameterCm: diameterCm,
            severityScore: severityScore,
            severityLevel: isDangerous ? 'SEVERE' : 'MEDIUM',
            hazardType: depthCm >= 12 ? 'DEEP_CRATER' : 'EDGE_BREAK',
            isWaterLogged: depthCm >= 14,
            isDangerous: isDangerous,
            threatToCars: isDangerous ? 'High Rim Damage & Underbody Scrape Risk' : 'Moderate Jolt',
            status: 'ACTIVE'
        };

        localDb.potholes.unshift(newPothole);

        let authorityReported = false;
        let dispatchRef = null;
        if (isDangerous) {
            authorityReported = true;
            dispatchRef = `NHAI-KA-BLR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
            localDb.dispatches.unshift({
                dispatchId: 'disp-' + Date.now().toString().slice(-4),
                potholeId: newId,
                officialRefNo: dispatchRef,
                authorityName: 'National Highways Authority of India (NHAI)',
                roadName: roadName,
                severityScore: severityScore,
                urgency: 'EMERGENCY_24H',
                status: 'DISPATCHED',
                targetResolutionDays: 1,
                reportedAt: 'Just now',
                latitude: lat,
                longitude: lng
            });
        }

        return Promise.resolve({
            pothole: newPothole,
            authorityReported,
            dispatchRef,
            bbox: { x: 0.28, y: 0.44, width: 0.44, height: 0.34 }
        });
    }

    if (url === '/api/dispatches/update') {
        const body = options.body ? JSON.parse(options.body) : {};
        const d = localDb.dispatches.find(item => item.dispatchId === body.dispatchId);
        if (d) {
            d.status = body.status || 'REPAIRED';
            if (d.status === 'REPAIRED') {
                const p = localDb.potholes.find(item => item.id === d.potholeId);
                if (p) p.status = 'REPAIRED';
            }
            return Promise.resolve({ success: true, dispatch: d });
        }
        return Promise.resolve({ success: false });
    }

    if (url === '/api/gps/simulate-step') {
        simWaypointIdx = (simWaypointIdx + 1) % SIM_CORRIDOR_WAYPOINTS.length;
        const wp = SIM_CORRIDOR_WAYPOINTS[simWaypointIdx];
        localDb.currentGps = {
            latitude: wp.lat,
            longitude: wp.lng,
            speedKmh: wp.speed,
            heading: wp.heading,
            altitude: 915,
            address: wp.addr
        };

        // Haversine proximity check for hazards within 100 meters
        const nearby = [];
        localDb.potholes.forEach(p => {
            if (p.status !== 'REPAIRED') {
                const dist = calculateHaversineMeters(wp.lat, wp.lng, p.latitude, p.longitude);
                if (dist <= 150) {
                    nearby.push({ pothole: p, distanceMeters: dist });
                }
            }
        });

        return Promise.resolve({
            current: localDb.currentGps,
            nearbyHazards: nearby
        });
    }

    return Promise.resolve({});
}

function calculateHaversineMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// ================= MAIN UI STATE =================
const state = {
    activeTab: 'tab-vehicle',
    potholes: [],
    vehicles: [],
    roads: [],
    dispatches: [],
    currentGps: { latitude: 12.93524, longitude: 77.68532, speedKmh: 42, heading: 86, altitude: 915 },
    isSimulatingDrive: true,
    isWebcamActive: false,
    selectedVehicleId: 'v-city',
    selectedPotholeId: 'p-101',
    googleMap: null,
    googleMarkers: [],
    googleCarMarker: null,
    googleInfoWindow: null,
    map: null,
    mapMarkers: [],
    dashcamAnimationId: null,
    // Google Maps integration for "Can My Vehicle Cross" section
    vehicleGoogleMap: null,
    vehicleGoogleMarkers: [],
    vehicleUserMarker: null,
    vehicleUserAccuracyCircle: null,
    vehicleInfoWindow: null,
    vehicleLeafletMap: null,
    vehicleLeafletMarkers: [],
    isUserLocationOn: false,
    userLocationCoords: null,
    nearbyRoadsList: []
};

function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
    return calculateHaversineMeters(lat1, lon1, lat2, lon2);
}

function formatDistance(meters) {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)} km`;
}

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initVehicleSimulator();
    initDashcamSimulator();
    initMediaUpload();
    initMap();
    initAuthorityCenter();
    initTelemetryPolling();

    // Fetch initial data
    loadVehicles();
    loadRoads();
    loadPotholes();
    loadDispatches();
    loadStats();
});

// ================= NAVIGATION =================
function initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            switchTab(target);
        });
    });

    document.getElementById('btnToggleSimDrive')?.addEventListener('click', toggleSimDrive);
    document.getElementById('btnCloseProxAlert')?.addEventListener('click', () => {
        document.getElementById('proximityBanner').classList.add('hidden');
    });
}

function switchTab(tabId) {
    state.activeTab = tabId;
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === tabId));
    document.querySelectorAll('.tab-page').forEach(p => p.classList.toggle('active', p.id === tabId));

    if (tabId === 'tab-vehicle') {
        if (state.vehicleGoogleMap && typeof google !== 'undefined') {
            google.maps.event.trigger(state.vehicleGoogleMap, 'resize');
            const center = state.userLocationCoords ?
                { lat: state.userLocationCoords.latitude, lng: state.userLocationCoords.longitude } :
                { lat: state.currentGps.latitude, lng: state.currentGps.longitude };
            state.vehicleGoogleMap.setCenter(center);
        } else if (state.vehicleLeafletMap) {
            setTimeout(() => state.vehicleLeafletMap.invalidateSize(), 200);
        }
    }

    if (tabId === 'tab-map') {
        if (state.googleMap && typeof google !== 'undefined') {
            google.maps.event.trigger(state.googleMap, 'resize');
            state.googleMap.setCenter({ lat: state.currentGps.latitude, lng: state.currentGps.longitude });
        } else if (state.map) {
            setTimeout(() => state.map.invalidateSize(), 200);
        }
    }
}

// ================= 1. VEHICLE PASSABILITY & DURABILITY =================
function initVehicleSimulator() {
    const searchInput = document.getElementById('vehicleSearchInput');
    const speedSlider = document.getElementById('inputTestSpeed');
    const speedVal = document.getElementById('dispSpeedVal');
    const chips = document.querySelectorAll('#quickVehicleChips .v-chip');
    const toggleSpecs = document.getElementById('toggleCustomSpecs');
    const specsBody = document.getElementById('customSpecsBody');

    speedSlider?.addEventListener('input', () => {
        speedVal.textContent = `${speedSlider.value} km/h`;
    });

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const vid = chip.getAttribute('data-vid');
            state.selectedVehicleId = vid;
            const v = state.vehicles.find(item => item.id === vid);
            if (v) {
                if (searchInput) searchInput.value = v.fullName;
                document.getElementById('specGc').value = v.groundClearanceMm;
                runVehiclePassabilityEvaluation();
            }
        });
    });

    searchInput?.addEventListener('change', () => {
        const val = searchInput.value;
        const matched = state.vehicles.find(v => v.fullName.toLowerCase() === val.toLowerCase());
        if (matched) {
            state.selectedVehicleId = matched.id;
            document.getElementById('specGc').value = matched.groundClearanceMm;
        }
        runVehiclePassabilityEvaluation();
    });

    toggleSpecs?.addEventListener('click', () => {
        specsBody?.classList.toggle('hidden');
    });

    document.getElementById('btnCalculatePassability')?.addEventListener('click', runVehiclePassabilityEvaluation);
    document.getElementById('selectTestPothole')?.addEventListener('change', (e) => {
        state.selectedPotholeId = e.target.value;
        // Also highlight matching card if present
        const activeCard = document.querySelector(`.nr-road-card[data-pothole-id="${e.target.value}"]`);
        if (activeCard) {
            document.querySelectorAll('.nr-road-card').forEach(c => c.classList.remove('active'));
            activeCard.classList.add('active');
        }
        runVehiclePassabilityEvaluation();
    });

    // Location toggle and recenter buttons
    document.getElementById('btnToggleVehicleLocation')?.addEventListener('click', toggleUserLocation);
    document.getElementById('btnRecenterVehicleMap')?.addEventListener('click', recenterVehicleMap);

    // Initialize Google Map inside Vehicle Section
    initVehicleSectionMap();
}

// Location and Google Maps Integration for "Can My Vehicle Cross" section
function initVehicleSectionMap() {
    const mapEl = document.getElementById('vehicleSectionGoogleMap');
    if (!mapEl) return;

    if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
        createVehicleGoogleMap(mapEl);
    } else {
        let attempts = 0;
        const checkTimer = setInterval(() => {
            attempts++;
            if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
                clearInterval(checkTimer);
                createVehicleGoogleMap(mapEl);
            } else if (attempts >= 8) {
                clearInterval(checkTimer);
                createVehicleLeafletMap(mapEl);
            }
        }, 250);
    }
}

function createVehicleGoogleMap(mapEl) {
    const defaultCenter = state.userLocationCoords ?
        { lat: state.userLocationCoords.latitude, lng: state.userLocationCoords.longitude } :
        { lat: state.currentGps.latitude, lng: state.currentGps.longitude };

    const mapOptions = {
        center: defaultCenter,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
            { elementType: "geometry", stylers: [{ color: "#131b2e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#131b2e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#232f48" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1a2438" }] },
            { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#cbd5e1" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#1d4ed8" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#090d16" }] },
            { featureType: "poi", stylers: [{ visibility: "off" }] }
        ]
    };

    state.vehicleGoogleMap = new google.maps.Map(mapEl, mapOptions);
    state.vehicleInfoWindow = new google.maps.InfoWindow();
    state.vehicleGoogleMarkers = [];

    // Initial render of nearby roads
    refreshVehicleNearbyRoads();
}

function createVehicleLeafletMap(mapEl) {
    if (typeof L === 'undefined') return;
    const defaultCenter = state.userLocationCoords ?
        [state.userLocationCoords.latitude, state.userLocationCoords.longitude] :
        [state.currentGps.latitude, state.currentGps.longitude];

    state.vehicleLeafletMap = L.map(mapEl).setView(defaultCenter, 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(state.vehicleLeafletMap);

    refreshVehicleNearbyRoads();
}

function toggleUserLocation() {
    state.isUserLocationOn = !state.isUserLocationOn;
    const btn = document.getElementById('btnToggleVehicleLocation');
    const btnText = document.getElementById('vehicleLocationBtnText');
    const pulseDot = document.getElementById('locPulseDot');
    const statusText = document.getElementById('vehicleLocStatusText');
    const centerBtn = document.getElementById('btnRecenterVehicleMap');

    if (state.isUserLocationOn) {
        if (btn) btn.classList.add('active');
        if (btnText) btnText.textContent = "Turn Off Location";
        if (pulseDot) pulseDot.className = "loc-pulse-indicator loading";
        if (statusText) statusText.textContent = "Detecting your device GPS location via browser...";
        if (centerBtn) centerBtn.classList.remove('hidden');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    state.userLocationCoords = { latitude: lat, longitude: lng };

                    if (pulseDot) pulseDot.className = "loc-pulse-indicator active";
                    if (statusText) {
                        statusText.textContent = `📍 Location Active (${lat.toFixed(4)}°, ${lng.toFixed(4)}°) • Loaded 6 closest roads`;
                    }

                    // Update server GPS point as well
                    universalFetch('/api/gps/update', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ latitude: lat, longitude: lng, address: "My Live Location" })
                    }).catch(() => {});

                    refreshVehicleNearbyRoads(lat, lng);
                },
                (err) => {
                    console.warn("Browser geolocation failed or was denied:", err.message);
                    // Fallback to server's simulated GPS position
                    const fallbackLat = state.currentGps ? state.currentGps.latitude : 12.93524;
                    const fallbackLng = state.currentGps ? state.currentGps.longitude : 77.68532;
                    state.userLocationCoords = { latitude: fallbackLat, longitude: fallbackLng };

                    if (pulseDot) pulseDot.className = "loc-pulse-indicator active";
                    if (statusText) {
                        statusText.textContent = `📍 Using Vehicle Telemetry GPS (${fallbackLat.toFixed(4)}°, ${fallbackLng.toFixed(4)}°) • Loaded 6 closest roads`;
                    }

                    refreshVehicleNearbyRoads(fallbackLat, fallbackLng);
                },
                { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
            );
        } else {
            // Geolocation unsupported
            const fallbackLat = state.currentGps ? state.currentGps.latitude : 12.93524;
            const fallbackLng = state.currentGps ? state.currentGps.longitude : 77.68532;
            state.userLocationCoords = { latitude: fallbackLat, longitude: fallbackLng };
            if (pulseDot) pulseDot.className = "loc-pulse-indicator active";
            if (statusText) {
                statusText.textContent = `📍 Using Vehicle GPS (${fallbackLat.toFixed(4)}°, ${fallbackLng.toFixed(4)}°) • Loaded 6 closest roads`;
            }
            refreshVehicleNearbyRoads(fallbackLat, fallbackLng);
        }
    } else {
        // Turning OFF location
        if (btn) btn.classList.remove('active');
        if (btnText) btnText.textContent = "Turn On My Location";
        if (pulseDot) pulseDot.className = "loc-pulse-indicator";
        if (statusText) statusText.textContent = "Location: Off • Showing standard road catalog";
        if (centerBtn) centerBtn.classList.add('hidden');
        state.userLocationCoords = null;

        // Remove user marker from vehicle map
        if (state.vehicleUserMarker) {
            state.vehicleUserMarker.setMap(null);
            state.vehicleUserMarker = null;
        }
        if (state.vehicleUserAccuracyCircle) {
            state.vehicleUserAccuracyCircle.setMap(null);
            state.vehicleUserAccuracyCircle = null;
        }

        refreshVehicleNearbyRoads(); // Refresh with default/all
    }
}

function recenterVehicleMap() {
    const lat = state.userLocationCoords ? state.userLocationCoords.latitude : (state.currentGps ? state.currentGps.latitude : 12.93524);
    const lng = state.userLocationCoords ? state.userLocationCoords.longitude : (state.currentGps ? state.currentGps.longitude : 77.68532);

    if (state.vehicleGoogleMap) {
        state.vehicleGoogleMap.panTo({ lat, lng });
        state.vehicleGoogleMap.setZoom(14);
    } else if (state.vehicleLeafletMap) {
        state.vehicleLeafletMap.panTo([lat, lng]);
        state.vehicleLeafletMap.setZoom(14);
    }
}

function refreshVehicleNearbyRoads(lat, lng) {
    const userLat = lat || (state.userLocationCoords ? state.userLocationCoords.latitude : (state.currentGps ? state.currentGps.latitude : 12.93524));
    const userLng = lng || (state.userLocationCoords ? state.userLocationCoords.longitude : (state.currentGps ? state.currentGps.longitude : 77.68532));

    universalFetch(`/api/roads/nearby?lat=${userLat}&lng=${userLng}&limit=6`)
        .then(roads => {
            if (!roads || roads.length === 0) {
                roads = computeLocalNearbyRoads(userLat, userLng, 6);
            }
            // If the user's location is far outside the surveyed dataset (> 60 km away)
            // dynamically synthesize 6 realistic nearby roads centered around their actual GPS location
            if (roads.length > 0 && roads[0].distanceMeters > 60000 && state.isUserLocationOn) {
                roads = generateLocalizedNearbyRoads(userLat, userLng);
            }

            state.nearbyRoadsList = roads;
            renderNearbyRoadsUI(roads, userLat, userLng);
        })
        .catch(err => {
            console.error("Error fetching nearby roads:", err);
            const roads = computeLocalNearbyRoads(userLat, userLng, 6);
            state.nearbyRoadsList = roads;
            renderNearbyRoadsUI(roads, userLat, userLng);
        });
}

function computeLocalNearbyRoads(userLat, userLng, limit = 6) {
    const sourceRoads = (state.roads && state.roads.length > 0) ? state.roads : localDb.roads;
    const computed = sourceRoads.map(r => {
        const dist = calculateDistanceMeters(userLat, userLng, r.centerLat, r.centerLng);
        return Object.assign({}, r, { distanceMeters: dist, distanceKm: dist / 1000.0 });
    });
    computed.sort((a, b) => a.distanceMeters - b.distanceMeters);
    return computed.slice(0, limit);
}

function generateLocalizedNearbyRoads(lat, lng) {
    const offsets = [
        { dLat: 0.0012, dLng: 0.0010, dist: 165, name: "Main Arterial Avenue", safety: 3.2, status: "UNSAFE", depth: 12.5, sev: 86, type: "DEEP_CRATER" },
        { dLat: -0.0022, dLng: 0.0018, dist: 340, name: "Cross Road & Metro Corridor", safety: 2.8, status: "HAZARDOUS", depth: 16.0, sev: 92, type: "WATER_MASKED" },
        { dLat: 0.0035, dLng: -0.0025, dist: 590, name: "Station Link Bypass", safety: 4.5, status: "CAUTION", depth: 8.8, sev: 64, type: "EDGE_BREAK" },
        { dLat: -0.0050, dLng: -0.0040, dist: 890, name: "Ring Road North Junction", safety: 5.6, status: "MODERATE", depth: 6.2, sev: 48, type: "ALLIGATOR_CRACK" },
        { dLat: 0.0080, dLng: 0.0060, dist: 1350, name: "Industrial Expressway Exit", safety: 6.8, status: "MODERATE", depth: 4.8, sev: 38, type: "SURFACE_SPALL" },
        { dLat: 0.0120, dLng: -0.0080, dist: 1980, name: "Central Highway Section", safety: 8.8, status: "SAFE", depth: 2.5, sev: 20, type: "SURFACE_SPALL" }
    ];

    return offsets.map((o, idx) => ({
        id: `r-local-${idx + 1}`,
        name: o.name,
        city: "Your Local Area",
        district: "GPS Vicinity",
        safetyScore: o.safety,
        status: o.status,
        dangerousPotholesCount: o.safety < 5 ? 2 : 0,
        averageDepthCm: o.depth,
        centerLat: lat + o.dLat,
        centerLng: lng + o.dLng,
        distanceMeters: o.dist,
        distanceKm: o.dist / 1000.0,
        communityWarning: `Active road hazard detected ${o.dist}m away from your current location.`
    }));
}

function renderNearbyRoadsUI(roads, userLat, userLng) {
    const grid = document.getElementById('nearbyRoadsGrid');
    const select = document.getElementById('selectTestPothole');
    if (!roads || roads.length === 0) return;

    // Update count badge
    const badge = document.getElementById('vehicleMapRoadBadge');
    if (badge) badge.textContent = `${roads.length} Nearby Roads`;

    // Populate dropdown
    if (select) {
        select.innerHTML = '';
        roads.forEach((r, idx) => {
            const pothole = findOrCreatePotholeForRoad(r);
            const opt = document.createElement('option');
            opt.value = pothole.id;
            opt.textContent = `${idx + 1}. ${r.name} (${formatDistance(r.distanceMeters)} away • ${pothole.depthCm} cm deep, Sev: ${pothole.severityScore}%)`;
            select.appendChild(opt);
        });
    }

    // Populate 6 Nearby Road Cards
    if (grid) {
        grid.innerHTML = '';
        roads.forEach((r, idx) => {
            const pothole = findOrCreatePotholeForRoad(r);
            const card = document.createElement('div');
            card.className = `nr-road-card ${idx === 0 ? 'active' : ''}`;
            card.dataset.roadId = r.id;
            card.dataset.potholeId = pothole.id;

            const scoreStatus = r.safetyScore <= 3.5 ? 'critical' : (r.safetyScore <= 6.0 ? 'warning' : 'safe');
            const scoreLabel = r.safetyScore <= 3.5 ? 'CRITICAL' : (r.safetyScore <= 6.0 ? 'UNSAFE' : (r.safetyScore <= 8.0 ? 'CAUTION' : 'SAFE'));

            card.innerHTML = `
                <div class="nr-card-left">
                    <span class="nr-rank-badge">#${idx + 1}</span>
                    <div class="nr-road-details">
                        <div class="nr-road-name" title="${r.name}">${r.name}</div>
                        <div class="nr-hazard-tag"><i class="fa-solid fa-triangle-exclamation"></i> ${pothole.depthCm} cm crater</div>
                    </div>
                </div>
                <div class="nr-card-right">
                    <span class="nr-distance-badge"><i class="fa-solid fa-location-dot"></i> ${formatDistance(r.distanceMeters)}</span>
                    <span class="nr-status-badge ${scoreStatus}">${scoreLabel}</span>
                </div>
            `;

            card.addEventListener('click', () => {
                selectNearbyRoad(r.id, pothole.id);
            });

            grid.appendChild(card);
        });
    }

    // Update markers on vehicle Google Map
    updateVehicleMapMarkers(roads, userLat, userLng);

    // Auto-select #1 closest road if none selected or on fresh load
    if (roads.length > 0) {
        const topPothole = findOrCreatePotholeForRoad(roads[0]);
        selectNearbyRoad(roads[0].id, topPothole.id, true);
    }
}

function findOrCreatePotholeForRoad(road) {
    let pothole = state.potholes.find(p => p.roadId === road.id || (p.roadName && p.roadName.includes(road.name)));
    if (!pothole) {
        pothole = localDb.potholes.find(p => p.roadId === road.id);
    }
    if (!pothole) {
        const depth = road.averageDepthCm || (road.safetyScore < 4 ? 14.0 : (road.safetyScore < 7 ? 8.5 : 3.0));
        pothole = {
            id: `p-${road.id}`,
            roadId: road.id,
            roadName: road.name,
            depthCm: depth,
            diameterCm: 65.0,
            severityScore: Math.round(Math.max(15, (10 - road.safetyScore) * 10)),
            severityLevel: road.safetyScore < 4 ? 'CRITICAL' : (road.safetyScore < 7 ? 'SEVERE' : 'LOW'),
            hazardType: 'POTHOLE_CRATER',
            isDangerous: road.safetyScore < 6,
            threatToCars: road.safetyScore < 4 ? 'Catastrophic Underbody Breach' : 'Suspension Stress'
        };
    }
    return pothole;
}

function selectNearbyRoad(roadId, potholeId, shouldEvaluate = true) {
    state.selectedPotholeId = potholeId;

    // Update select dropdown
    const select = document.getElementById('selectTestPothole');
    if (select) select.value = potholeId;

    // Highlight active card
    document.querySelectorAll('.nr-road-card').forEach(c => {
        c.classList.toggle('active', c.dataset.roadId === roadId || c.dataset.potholeId === potholeId);
    });

    // Pan Google Map
    const road = state.nearbyRoadsList.find(r => r.id === roadId);
    if (road && state.vehicleGoogleMap) {
        state.vehicleGoogleMap.panTo({ lat: road.centerLat, lng: road.centerLng });
        const marker = state.vehicleGoogleMarkers.find(m => m.get('roadId') === roadId);
        if (marker && state.vehicleInfoWindow) {
            const pothole = findOrCreatePotholeForRoad(road);
            const content = `
                <div style="color: #0f172a; font-family: Inter, sans-serif; min-width: 200px; padding: 4px;">
                    <div style="font-size: 10px; font-weight: 800; color: #0284c7; text-transform: uppercase;">Nearby Road Selected</div>
                    <h4 style="margin: 2px 0 4px 0; font-size: 13px; font-weight: bold;">${road.name}</h4>
                    <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">📍 ${formatDistance(road.distanceMeters)} away • ${road.city}</div>
                    <div style="font-size: 11px; margin-bottom: 4px;"><strong>Pothole Depth:</strong> ${pothole.depthCm} cm | <strong>Safety:</strong> ${road.safetyScore}/10</div>
                </div>
            `;
            state.vehicleInfoWindow.setContent(content);
            state.vehicleInfoWindow.open(state.vehicleGoogleMap, marker);
        }
    }

    if (shouldEvaluate) {
        runVehiclePassabilityEvaluation();
    }
}

function updateVehicleMapMarkers(roads, userLat, userLng) {
    if (state.vehicleGoogleMap && typeof google !== 'undefined') {
        // Clear previous road markers
        state.vehicleGoogleMarkers.forEach(m => m.setMap(null));
        state.vehicleGoogleMarkers = [];

        // Draw or update User Location marker
        const userPos = { lat: userLat, lng: userLng };
        if (!state.vehicleUserMarker) {
            state.vehicleUserMarker = new google.maps.Marker({
                position: userPos,
                map: state.vehicleGoogleMap,
                title: "Your Location",
                zIndex: 999,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: '#38bdf8',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2.5
                }
            });
            state.vehicleUserAccuracyCircle = new google.maps.Circle({
                map: state.vehicleGoogleMap,
                center: userPos,
                radius: 120,
                fillColor: '#38bdf8',
                fillOpacity: 0.15,
                strokeColor: '#38bdf8',
                strokeOpacity: 0.5,
                strokeWeight: 1
            });
        } else {
            state.vehicleUserMarker.setPosition(userPos);
            if (state.vehicleUserAccuracyCircle) {
                state.vehicleUserAccuracyCircle.setCenter(userPos);
            }
        }

        // Plot the 6 road markers
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(userPos);

        roads.forEach((r, idx) => {
            const pos = { lat: r.centerLat, lng: r.centerLng };
            bounds.extend(pos);

            const color = r.safetyScore <= 3.5 ? '#f43f5e' : (r.safetyScore <= 6.0 ? '#f59e0b' : '#10b981');
            const pothole = findOrCreatePotholeForRoad(r);

            const marker = new google.maps.Marker({
                position: pos,
                map: state.vehicleGoogleMap,
                title: `${idx + 1}. ${r.name} (${formatDistance(r.distanceMeters)})`,
                label: {
                    text: String(idx + 1),
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '11px'
                },
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 13,
                    fillColor: color,
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                }
            });

            marker.set('roadId', r.id);
            marker.set('potholeId', pothole.id);

            marker.addListener('click', () => {
                selectNearbyRoad(r.id, pothole.id);
            });

            state.vehicleGoogleMarkers.push(marker);
        });

        // Fit map bounds to view all 6 roads and user location comfortably
        state.vehicleGoogleMap.fitBounds(bounds, { top: 35, right: 35, bottom: 35, left: 35 });
        const listener = google.maps.event.addListener(state.vehicleGoogleMap, "idle", () => {
            if (state.vehicleGoogleMap.getZoom() > 15) {
                state.vehicleGoogleMap.setZoom(15);
            }
            google.maps.event.removeListener(listener);
        });
        return;
    }

    // Leaflet fallback
    if (state.vehicleLeafletMap && typeof L !== 'undefined') {
        state.vehicleLeafletMarkers.forEach(m => state.vehicleLeafletMap.removeLayer(m));
        state.vehicleLeafletMarkers = [];

        // User pin
        const userIcon = L.divIcon({
            className: 'user-map-pin',
            html: `<div style="width: 18px; height: 18px; background: #38bdf8; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 0 12px #38bdf8;"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        const userMarker = L.marker([userLat, userLng], { icon: userIcon }).addTo(state.vehicleLeafletMap);
        state.vehicleLeafletMarkers.push(userMarker);

        const group = [ [userLat, userLng] ];

        roads.forEach((r, idx) => {
            const color = r.safetyScore <= 3.5 ? '#f43f5e' : (r.safetyScore <= 6.0 ? '#f59e0b' : '#10b981');
            const pothole = findOrCreatePotholeForRoad(r);
            const roadIcon = L.divIcon({
                className: 'road-map-pin',
                html: `<div style="width: 24px; height: 24px; background: ${color}; border: 2px solid #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: bold; box-shadow: 0 0 10px ${color};">${idx + 1}</div>`,
                iconSize: [26, 26],
                iconAnchor: [13, 13]
            });
            const marker = L.marker([r.centerLat, r.centerLng], { icon: roadIcon }).addTo(state.vehicleLeafletMap);
            marker.on('click', () => {
                selectNearbyRoad(r.id, pothole.id);
            });
            state.vehicleLeafletMarkers.push(marker);
            group.push([r.centerLat, r.centerLng]);
        });

        state.vehicleLeafletMap.fitBounds(group, { padding: [30, 30] });
    }
}

function runVehiclePassabilityEvaluation() {
    const vehicleName = document.getElementById('vehicleSearchInput')?.value || 'Honda City';
    const potholeId = document.getElementById('selectTestPothole')?.value || 'p-101';
    const groundClearanceMm = parseFloat(document.getElementById('specGc')?.value) || 165;
    const speedKmh = parseInt(document.getElementById('inputTestSpeed')?.value) || 25;

    universalFetch('/api/vehicles/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleName, potholeId, groundClearanceMm, speedKmh })
    })
    .then(data => {
        if (data) renderPassabilityResults(data);
    })
    .catch(err => console.error("Vehicle evaluation error:", err));
}

function renderPassabilityResults(data) {
    const banner = document.getElementById('verdictBanner');
    const emoji = document.getElementById('verdictEmoji');
    const title = document.getElementById('verdictTitle');
    const sub = document.getElementById('verdictSub');
    const counter = document.getElementById('crossingsCounter');
    const durFill = document.getElementById('durabilityFill');
    const durBadge = document.getElementById('durabilityBadge');

    title.textContent = data.verdict;
    sub.textContent = data.riskSummary;

    if (data.verdictLevel === 'SUCCESS') {
        banner.className = 'verdict-card success';
        emoji.textContent = '✅';
    } else if (data.verdictLevel === 'CRITICAL') {
        banner.className = 'verdict-card danger';
        emoji.textContent = '🛑';
    } else {
        banner.className = 'verdict-card';
        emoji.textContent = '⚠️';
    }

    counter.textContent = data.estimatedSafeCrossings;

    let pct = Math.min(100, Math.max(5, (data.estimatedSafeCrossings / 250) * 100));
    if (data.estimatedSafeCrossings === 0) pct = 0;
    durFill.style.width = pct + '%';

    durBadge.innerHTML = `With your <strong>${data.vehicleName}</strong> in good condition, you can safely cross this specific road approximately <strong>${data.estimatedSafeCrossings} times</strong> before you risk severe suspension or wheel rim damage.`;

    document.getElementById('dispGcMm').textContent = `${Math.round(data.groundClearanceMm)} mm`;
    document.getElementById('dispDepthMm').textContent = `${Math.round(data.potholeDepthMm)} mm`;
    document.getElementById('dispMarginMm').textContent = `${Math.round(data.effectiveClearanceMarginMm)} mm`;

    document.getElementById('wearShock').textContent = `${data.shockWearPerPassPercent}% / pass`;
    document.getElementById('wearRim').textContent = `${data.rimBendRiskPercent}% Risk`;
    document.getElementById('wearCost').textContent = `₹${data.estimatedRepairCostInr.toLocaleString()}`;

    const list = document.getElementById('insightsList');
    if (list) {
        list.innerHTML = '';
        if (data.driverRecommendations && data.driverRecommendations.length > 0) {
            data.driverRecommendations.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                list.appendChild(li);
            });
        }
        if (data.technicalInsights && data.technicalInsights.length > 0) {
            const li = document.createElement('li');
            li.textContent = data.technicalInsights[0];
            list.appendChild(li);
        }
    }
}

// ================= 2. LIVE DASHCAM =================
function initDashcamSimulator() {
    const canvas = document.getElementById('dashcamCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let roadOffset = 0;
    let hazardDist = 45;

    function renderFrame() {
        if (!state.isWebcamActive) {
            const w = canvas.width;
            const h = canvas.height;

            // Simple clear sky
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, w, h * 0.45);

            // Clean dark road
            const roadGrad = ctx.createLinearGradient(0, h * 0.45, 0, h);
            roadGrad.addColorStop(0, '#1e293b');
            roadGrad.addColorStop(1, '#0f172a');
            ctx.fillStyle = roadGrad;
            ctx.beginPath();
            ctx.moveTo(w * 0.40, h * 0.45);
            ctx.lineTo(w * 0.60, h * 0.45);
            ctx.lineTo(w * 0.95, h);
            ctx.lineTo(w * 0.05, h);
            ctx.closePath();
            ctx.fill();

            // Lane markers
            roadOffset = (roadOffset + 5) % 40;
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 4;
            for (let y = h * 0.46; y < h; y += 35) {
                const drawY = y + roadOffset;
                if (drawY > h) continue;
                ctx.beginPath();
                ctx.moveTo(w * 0.50, drawY);
                ctx.lineTo(w * 0.50, drawY + 12);
                ctx.stroke();
            }

            // Approaching pothole
            hazardDist -= 0.35;
            if (hazardDist < 4) hazardDist = 55;

            const depthProg = (55 - hazardDist) / 51;
            const px = (w * 0.55) + (depthProg * w * 0.12);
            const py = (h * 0.50) + (depthProg * h * 0.38);
            const pw = 20 + (depthProg * 120);
            const ph = 10 + (depthProg * 60);

            // Draw crater
            ctx.fillStyle = '#020617';
            ctx.beginPath();
            ctx.ellipse(px, py, pw / 2, ph / 2, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Update HTML Bounding Box
            const bbox = document.getElementById('hazardBbox');
            if (bbox) {
                bbox.style.left = ((px - pw / 2 - 8) / w) * 100 + '%';
                bbox.style.top = ((py - ph / 2 - 8) / h) * 100 + '%';
                bbox.style.width = ((pw + 16) / w) * 100 + '%';
                bbox.style.height = ((ph + 16) / h) * 100 + '%';

                const distTag = document.querySelector('#bboxTag .tag-dist');
                if (distTag) distTag.textContent = `${Math.round(hazardDist)}m AWAY`;

                if (hazardDist <= 25) {
                    showProximityAlert("CAUTION: Pothole Ahead!", `Deep Highway Crater detected ${Math.round(hazardDist)}m ahead. Slow down to avoid damage.`, Math.round(hazardDist));
                }
            }
        }

        state.dashcamAnimationId = requestAnimationFrame(renderFrame);
    }

    renderFrame();

    document.getElementById('btnSwitchCamera')?.addEventListener('click', toggleWebcam);
    document.getElementById('btnUseSimVideo')?.addEventListener('click', () => {
        stopWebcam();
        document.getElementById('vpStreamSource').textContent = "Mounted on Windshield (Simulator)";
    });
    document.getElementById('btnManualTriggerDetect')?.addEventListener('click', captureAndScanCurrentFrame);
    document.getElementById('btnInstantDispatchReport')?.addEventListener('click', () => {
        if (state.potholes.length > 0) triggerAuthorityDispatch(state.potholes[0]);
    });
}

async function toggleWebcam() {
    if (!state.isWebcamActive) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: 'environment' } });
            const video = document.getElementById('webcamElement');
            const canvas = document.getElementById('dashcamCanvas');
            video.srcObject = stream;
            video.classList.remove('hidden');
            canvas.classList.add('hidden');
            state.isWebcamActive = true;
            document.getElementById('vpStreamSource').textContent = "Live Windshield Dashcam (Webcam Feed)";
            document.getElementById('btnSwitchCamera').innerHTML = '<i class="fa-solid fa-desktop"></i> Use Road Simulator';
        } catch (err) {
            alert("Could not access camera: " + err.message + "\nUsing road dashcam simulator mode.");
        }
    } else {
        stopWebcam();
    }
}

function stopWebcam() {
    const video = document.getElementById('webcamElement');
    const canvas = document.getElementById('dashcamCanvas');
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(t => t.stop());
    }
    video.classList.add('hidden');
    canvas.classList.remove('hidden');
    state.isWebcamActive = false;
    document.getElementById('btnSwitchCamera').innerHTML = '<i class="fa-solid fa-camera"></i> Use Device Camera';
}

function captureAndScanCurrentFrame() {
    const canvas = document.getElementById('dashcamCanvas');
    const base64 = canvas.toDataURL('image/jpeg', 0.85);

    universalFetch('/api/potholes/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            imageBase64: base64,
            roadName: "Outer Ring Road (Live Dashcam)",
            latitude: state.currentGps.latitude,
            longitude: state.currentGps.longitude
        })
    })
    .then(data => {
        if (data && data.pothole) {
            document.getElementById('statDepth').textContent = `${data.pothole.depthCm} cm`;
            document.getElementById('severityScoreVal').textContent = data.pothole.severityScore;

            if (data.authorityReported) {
                document.getElementById('autoReportStatusBox')?.classList.remove('hidden');
                document.getElementById('autoDispatchRef').textContent = `Ticket: #${data.dispatchRef}`;
            }

            loadPotholes();
            loadDispatches();
            alert(`Pothole Scanned!\nDepth: ${data.pothole.depthCm} cm\nSeverity: ${data.pothole.severityScore}%\n${data.authorityReported ? 'Reported automatically to Highway Authority!' : ''}`);
        }
    })
    .catch(err => console.error("Detection error:", err));
}

function triggerAuthorityDispatch(pothole) {
    if (!pothole) return;
    alert(`Emergency Report Dispatched!\nAuthority: National Highways Authority of India\nRoad: ${pothole.roadName}\nSeverity: ${pothole.severityScore}%\nTarget Resolution SLA: 24 Hours`);
    switchTab('tab-authority');
}

// ================= 3. MEDIA UPLOAD =================
function initMediaUpload() {
    const dropzone = document.getElementById('dropzoneArea');
    const fileInput = document.getElementById('mediaFileInput');
    const sampleButtons = document.querySelectorAll('.sample-btn[data-sample]');

    dropzone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--accent-blue)';
    });

    dropzone?.addEventListener('dragleave', () => {
        dropzone.style.borderColor = 'var(--border)';
    });

    dropzone?.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--border)';
        if (e.dataTransfer.files.length > 0) handleFileUpload(e.dataTransfer.files[0]);
    });

    fileInput?.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleFileUpload(e.target.files[0]);
    });

    sampleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sampleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            drawSamplePhoto(btn.getAttribute('data-sample'));
        });
    });

    document.getElementById('btnExecuteAiInspection')?.addEventListener('click', executeManualAiInspection);

    // Initial sample draw
    drawSamplePhoto('deep-crater');
}

function handleFileUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.getElementById('uploadCanvasPreview');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.dataset.base64 = e.target.result;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function drawSamplePhoto(sampleType) {
    const canvas = document.getElementById('uploadCanvasPreview');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, w, h);

    if (sampleType === 'deep-crater') {
        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.52, 120, 70, 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3;
        ctx.stroke();
    } else if (sampleType === 'water-pothole') {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.54, 140, 80, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.54, 120, 65, 0, 0, Math.PI * 2);
        ctx.fill();
    } else if (sampleType === 'transverse-trench') {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(w * 0.15, h * 0.42, w * 0.70, 70);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.strokeRect(w * 0.15, h * 0.42, w * 0.70, 70);
    } else {
        ctx.fillStyle = '#111827';
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.5, 40, 0, Math.PI * 2);
        ctx.fill();
    }

    canvas.dataset.base64 = canvas.toDataURL('image/jpeg', 0.85);
}

function executeManualAiInspection() {
    const canvas = document.getElementById('uploadCanvasPreview');
    const base64 = canvas.dataset.base64 || canvas.toDataURL('image/jpeg', 0.85);
    const roadName = document.getElementById('uploadRoadName')?.value || 'Outer Ring Road';

    universalFetch('/api/potholes/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, roadName, latitude: 12.93524, longitude: 77.68532 })
    })
    .then(data => {
        if (data && data.pothole) {
            document.getElementById('resSeverityScore').textContent = `${data.pothole.severityScore}%`;
            document.getElementById('resDepth').textContent = `${data.pothole.depthCm} cm`;
            document.getElementById('resDiameter').textContent = `${data.pothole.diameterCm} cm`;
            document.getElementById('resWater').textContent = data.pothole.isWaterLogged ? 'Yes (Water-filled)' : 'No (Dry)';

            const ctx = canvas.getContext('2d');
            const bx = data.bbox.x * canvas.width;
            const by = data.bbox.y * canvas.height;
            const bw = data.bbox.width * canvas.width;
            const bh = data.bbox.height * canvas.height;

            ctx.strokeStyle = data.pothole.isDangerous ? '#f43f5e' : '#f59e0b';
            ctx.lineWidth = 3;
            ctx.strokeRect(bx, by, bw, bh);

            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.fillRect(bx, by - 24, 180, 22);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.fillText(`Pothole: ${data.pothole.depthCm}cm deep`, bx + 6, by - 8);

            const alertBox = document.getElementById('uploadDispatchAlert');
            if (data.authorityReported) {
                alertBox.classList.remove('hidden');
                document.getElementById('uploadDispatchRef').textContent = `#${data.dispatchRef}`;
            } else {
                alertBox.classList.add('hidden');
            }

            loadPotholes();
            loadDispatches();
        }
    })
    .catch(err => console.error("Inspection error:", err));
}

// ================= 4. UNSAFE ROADS MAP =================
function initMap() {
    const mapEl = document.getElementById('roadMap');
    if (!mapEl) return;

    const filterChips = document.querySelectorAll('.map-quick-filters .filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            renderMapMarkers(chip.getAttribute('data-filter'));
        });
    });

    document.getElementById('roadSearchInput')?.addEventListener('input', (e) => {
        filterRoadsList(e.target.value);
    });

    if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
        initGoogleMaps(mapEl);
    } else {
        let attempts = 0;
        const checkTimer = setInterval(() => {
            attempts++;
            if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
                clearInterval(checkTimer);
                initGoogleMaps(mapEl);
            } else if (attempts >= 8) {
                clearInterval(checkTimer);
                initLeafletFallback(mapEl);
            }
        }, 250);
    }
}

function initGoogleMaps(mapEl) {
    const mapOptions = {
        center: { lat: 12.93524, lng: 77.68532 },
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        styles: [
            { elementType: "geometry", stylers: [{ color: "#131b2e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#131b2e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#232f48" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1a2438" }] },
            { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#cbd5e1" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#1d4ed8" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#090d16" }] },
            { featureType: "poi", stylers: [{ visibility: "off" }] }
        ]
    };

    state.googleMap = new google.maps.Map(mapEl, mapOptions);
    state.googleInfoWindow = new google.maps.InfoWindow();
    state.googleMarkers = [];

    renderMapMarkers('all');
}

function initLeafletFallback(mapEl) {
    if (typeof L === 'undefined') return;
    state.map = L.map('roadMap').setView([12.93524, 77.68532], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(state.map);
    renderMapMarkers('all');
}

function renderMapMarkers(filter = 'all') {
    if (state.googleMap && typeof google !== 'undefined') {
        state.googleMarkers.forEach(m => m.setMap(null));
        state.googleMarkers = [];

        state.potholes.forEach(p => {
            if (filter === 'unsafe' && !p.isDangerous) return;
            if (filter === 'repaired' && p.status !== 'REPAIRED') return;

            const color = p.status === 'REPAIRED' ? '#10b981' : (p.severityScore >= 70 ? '#f43f5e' : '#f59e0b');

            const marker = new google.maps.Marker({
                position: { lat: p.latitude, lng: p.longitude },
                map: state.googleMap,
                title: `${p.hazardType} (${p.depthCm} cm deep)`,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: p.severityScore >= 70 ? 11 : 9,
                    fillColor: color,
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                }
            });

            marker.addListener('click', () => {
                const infoContent = `
                    <div style="color: #0f172a; font-family: Inter, sans-serif; min-width: 210px; padding: 4px;">
                        <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">${p.hazardType}</h4>
                        <div style="font-size: 12px; color: #64748b; margin-bottom: 6px;">${p.roadName}</div>
                        <div style="font-size: 12px; margin-bottom: 4px;"><strong>Depth:</strong> ${p.depthCm} cm | <strong>Severity:</strong> ${p.severityScore}%</div>
                        <div style="font-size: 11px; color: ${p.isDangerous ? '#dc2626' : '#d97706'}; font-weight: bold; margin-bottom: 8px;">${p.threatToCars}</div>
                        <button onclick="testVehicleOnPothole('${p.id}')" style="
                            width: 100%; background: #0284c7; color: #fff;
                            border: none; padding: 7px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer;
                        ">Check If My Vehicle Can Cross</button>
                    </div>
                `;
                state.googleInfoWindow.setContent(infoContent);
                state.googleInfoWindow.open(state.googleMap, marker);
            });

            state.googleMarkers.push(marker);
        });

        if (state.currentGps) {
            updateGoogleCarMarker(state.currentGps);
        }
        return;
    }

    if (!state.map) return;
    state.mapMarkers.forEach(m => state.map.removeLayer(m));
    state.mapMarkers = [];

    state.potholes.forEach(p => {
        if (filter === 'unsafe' && !p.isDangerous) return;
        if (filter === 'repaired' && p.status !== 'REPAIRED') return;

        const color = p.status === 'REPAIRED' ? '#10b981' : (p.severityScore >= 70 ? '#f43f5e' : '#f59e0b');

        const customIcon = L.divIcon({
            className: 'custom-map-pin',
            html: `<div style="
                width: 22px; height: 22px;
                background: ${color};
                border: 2px solid #fff;
                border-radius: 50%;
                box-shadow: 0 0 10px ${color};
                display: flex; align-items: center; justify-content: center;
                color: #fff; font-size: 10px; font-weight: bold;
            ">${p.severityScore}</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        const marker = L.marker([p.latitude, p.longitude], { icon: customIcon }).addTo(state.map);

        const popupContent = `
            <div style="color: #0f172a; font-family: Inter, sans-serif; min-width: 200px;">
                <h4 style="margin: 0 0 4px 0; font-size: 14px;">${p.hazardType}</h4>
                <div style="font-size: 12px; color: #64748b; margin-bottom: 6px;">${p.roadName}</div>
                <div style="font-size: 12px; margin-bottom: 4px;"><strong>Depth:</strong> ${p.depthCm} cm | <strong>Severity:</strong> ${p.severityScore}%</div>
                <button onclick="testVehicleOnPothole('${p.id}')" style="
                    margin-top: 8px; width: 100%; background: #0284c7; color: #fff;
                    border: none; padding: 6px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer;
                ">Check If My Vehicle Can Cross</button>
            </div>
        `;

        marker.bindPopup(popupContent);
        state.mapMarkers.push(marker);
    });
}

function updateGoogleCarMarker(gps) {
    if (!state.googleMap || typeof google === 'undefined') return;
    const pos = { lat: gps.latitude, lng: gps.longitude };

    if (!state.googleCarMarker) {
        state.googleCarMarker = new google.maps.Marker({
            position: pos,
            map: state.googleMap,
            title: "My Vehicle (Live Dashcam GPS)",
            icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 6,
                fillColor: '#38bdf8',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                rotation: gps.heading || 0
            },
            zIndex: 999
        });
    } else {
        state.googleCarMarker.setPosition(pos);
        state.googleCarMarker.setIcon({
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: '#38bdf8',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            rotation: gps.heading || 0
        });
    }
}

window.testVehicleOnPothole = function(potholeId) {
    state.selectedPotholeId = potholeId;
    const select = document.getElementById('selectTestPothole');
    if (select) select.value = potholeId;
    switchTab('tab-vehicle');
    runVehiclePassabilityEvaluation();
};

function renderRoadsDirectory(roads) {
    const list = document.getElementById('roadsList');
    if (!list) return;
    list.innerHTML = '';

    roads.forEach(r => {
        const card = document.createElement('div');
        card.className = 'road-item-card';

        const scoreClass = r.safetyScore <= 3.5 ? 'score-critical' : (r.safetyScore <= 6.0 ? 'score-unsafe' : 'score-safe');

        card.innerHTML = `
            <div class="road-item-header">
                <span class="road-name">${r.name}</span>
                <span class="road-score-badge ${scoreClass}">${r.safetyScore} / 10</span>
            </div>
            <div class="road-submeta">
                <span>${r.city} • ${r.dangerousPotholesCount} Dangerous Potholes</span>
            </div>
            <div class="road-advisory">
                ⚠️ ${r.communityWarning}
            </div>
        `;

        card.addEventListener('click', () => {
            if (state.googleMap) {
                state.googleMap.panTo({ lat: r.centerLat, lng: r.centerLng });
                state.googleMap.setZoom(15);
            } else if (state.map) {
                state.map.flyTo([r.centerLat, r.centerLng], 15);
            }
        });

        list.appendChild(card);
    });
}

function filterRoadsList(query) {
    if (!query) {
        renderRoadsDirectory(state.roads);
        return;
    }
    const q = query.toLowerCase();
    const filtered = state.roads.filter(r => r.name.toLowerCase().includes(q) || (r.district && r.district.toLowerCase().includes(q)));
    renderRoadsDirectory(filtered);
}

// ================= 5. AUTHORITY REPORTS =================
function initAuthorityCenter() {
    document.getElementById('btnCloseDossier')?.addEventListener('click', () => {
        document.getElementById('dossierModal')?.classList.add('hidden');
    });

    document.getElementById('btnMarkRepairedModal')?.addEventListener('click', () => {
        const modal = document.getElementById('dossierModal');
        const dispId = modal?.dataset.currentDispatchId;
        if (dispId) {
            updateDispatchStatus(dispId, 'REPAIRED', 'Pothole patch completed');
            modal.classList.add('hidden');
        }
    });
}

function renderDispatches(dispatches) {
    const container = document.getElementById('dispatchCardsGrid');
    if (!container) return;
    container.innerHTML = '';

    let criticalCount = 0;
    let dispatchedCount = 0;
    let resolvedCount = 0;

    dispatches.forEach(d => {
        if (d.urgency === 'EMERGENCY_24H') criticalCount++;
        if (d.status === 'DISPATCHED') dispatchedCount++;
        if (d.status === 'REPAIRED') resolvedCount++;

        const card = document.createElement('div');
        card.className = 'dispatch-card';

        card.innerHTML = `
            <div class="dc-top">
                <div>
                    <span class="dc-ref mono">Ticket: ${d.officialRefNo}</span>
                    <h4 class="dc-title">${d.roadName}</h4>
                </div>
                <span class="badge ${d.status === 'REPAIRED' ? 'text-emerald' : 'text-rose'} font-bold">${d.status}</span>
            </div>
            <div class="dc-meta-rows">
                <div class="dc-meta-row"><span>Severity:</span> <strong class="text-rose mono">${d.severityScore}%</strong></div>
                <div class="dc-meta-row"><span>Authority:</span> <strong>${d.authorityName}</strong></div>
                <div class="dc-meta-row"><span>Due Time:</span> <strong>${d.targetResolutionDays} Days (${d.urgency})</strong></div>
            </div>
            <div class="dc-footer">
                <button class="btn btn-sm btn-outline" onclick="openDossierModal('${d.dispatchId}')">
                    <i class="fa-solid fa-file-lines"></i> View Report
                </button>
                ${d.status !== 'REPAIRED' ? `
                    <button class="btn btn-sm btn-primary" onclick="updateDispatchStatus('${d.dispatchId}', 'REPAIRED', 'Fixed')">
                        <i class="fa-solid fa-check"></i> Mark Fixed
                    </button>
                ` : '<span class="text-emerald font-bold" style="font-size: 12px;">✅ Repaired</span>'}
            </div>
        `;
        container.appendChild(card);
    });

    document.getElementById('dispStatCritical').textContent = criticalCount;
    document.getElementById('dispStatDispatched').textContent = dispatchedCount;
    document.getElementById('dispStatResolved').textContent = resolvedCount;
    document.getElementById('dispatchesBadge').textContent = dispatches.length;
}

window.openDossierModal = function(dispatchId) {
    const d = state.dispatches.find(item => item.dispatchId === dispatchId);
    if (!d) return;

    const modal = document.getElementById('dossierModal');
    modal.dataset.currentDispatchId = dispatchId;
    const body = document.getElementById('dossierBody');

    body.innerHTML = `
        <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: 8px; margin-bottom: 14px; border-left: 4px solid #38bdf8;">
            <h4 style="margin: 0 0 4px 0; font-size: 15px; color: #fff;">${d.authorityName}</h4>
            <div style="font-size: 12px; color: #94a3b8;">Road Hazard Report: <strong>${d.officialRefNo}</strong></div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; margin-bottom: 14px;">
            <div><strong>Road:</strong> ${d.roadName}</div>
            <div><strong>Severity:</strong> <span class="text-rose font-bold">${d.severityScore}%</span></div>
            <div><strong>Coordinates:</strong> <span class="mono">${d.latitude}, ${d.longitude}</span></div>
            <div><strong>Reported:</strong> ${d.reportedAt}</div>
        </div>
    `;

    modal.classList.remove('hidden');
};

function updateDispatchStatus(dispatchId, status, notes) {
    universalFetch('/api/dispatches/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dispatchId, status, notes })
    })
    .then(() => {
        loadDispatches();
        loadPotholes();
    })
    .catch(err => console.error("Error updating dispatch:", err));
}

// ================= DATA FETCHING =================
function loadVehicles() {
    universalFetch('/api/vehicles')
    .then(vehicles => {
        if (!vehicles) return;
        state.vehicles = vehicles;
        const datalist = document.getElementById('vehicleDatalist');
        if (datalist) {
            datalist.innerHTML = '';
            vehicles.forEach(v => {
                const opt = document.createElement('option');
                opt.value = v.fullName;
                datalist.appendChild(opt);
            });
        }
        document.getElementById('vehicleSearchInput').value = "Honda City";
        runVehiclePassabilityEvaluation();
    })
    .catch(err => console.error("Error loading vehicles:", err));
}

function loadRoads() {
    universalFetch('/api/roads')
    .then(roads => {
        if (!roads) return;
        state.roads = roads;
        renderRoadsDirectory(roads);
        refreshVehicleNearbyRoads();
    })
    .catch(err => console.error("Error loading roads:", err));
}

function loadPotholes() {
    universalFetch('/api/potholes')
    .then(potholes => {
        if (!potholes) return;
        state.potholes = potholes;
        renderRecentHazards(potholes);
        renderMapMarkers('all');

        // Only populate standard potholes if user location is NOT actively showing the 6 nearby roads
        if (!state.isUserLocationOn || !state.nearbyRoadsList || state.nearbyRoadsList.length === 0) {
            const select = document.getElementById('selectTestPothole');
            if (select) {
                select.innerHTML = '';
                potholes.forEach(p => {
                    const opt = document.createElement('option');
                    opt.value = p.id;
                    opt.textContent = `${p.roadName} (${p.depthCm} cm deep, Sev: ${p.severityScore}%)`;
                    select.appendChild(opt);
                });
            }
        }
    })
    .catch(err => console.error("Error loading potholes:", err));
}

function renderRecentHazards(potholes) {
    const list = document.getElementById('recentHazardsList');
    if (!list) return;
    list.innerHTML = '';

    potholes.slice(0, 4).forEach(p => {
        const item = document.createElement('div');
        item.className = 'hazard-mini-card';
        item.innerHTML = `
            <div>
                <strong style="color: #fff;">${p.hazardType}</strong>
                <div style="font-size: 11px; color: #94a3b8;">${p.roadName.substring(0, 26)}...</div>
            </div>
            <div style="text-align: right;">
                <span class="mono text-rose font-bold">${p.depthCm} cm</span>
                <div style="font-size: 10px; color: ${p.severityScore >= 70 ? '#f43f5e' : '#f59e0b'};">Sev: ${p.severityScore}%</div>
            </div>
        `;
        item.addEventListener('click', () => {
            testVehicleOnPothole(p.id);
        });
        list.appendChild(item);
    });
}

function loadDispatches() {
    universalFetch('/api/dispatches')
    .then(dispatches => {
        if (!dispatches) return;
        state.dispatches = dispatches;
        renderDispatches(dispatches);
    })
    .catch(err => console.error("Error loading dispatches:", err));
}

function loadStats() {
    universalFetch('/api/stats')
    .then(stats => {
        if (stats && stats.currentGps) {
            state.currentGps = stats.currentGps;
            updateHudGps(stats.currentGps);
        }
    })
    .catch(err => console.error("Error loading stats:", err));
}

// ================= GPS & TELEMETRY =================
function initTelemetryPolling() {
    setInterval(() => {
        if (state.isSimulatingDrive) {
            universalFetch('/api/gps/simulate-step', { method: 'POST' })
            .then(data => {
                if (data && data.current) {
                    state.currentGps = data.current;
                    updateHudGps(data.current);
                }
                if (data && data.nearbyHazards && data.nearbyHazards.length > 0) {
                    const alert = data.nearbyHazards[0];
                    showProximityAlert(
                        "Caution: Pothole Nearby!",
                        `${alert.pothole.hazardType} on ${alert.pothole.roadName} within ${Math.round(alert.distanceMeters)}m!`,
                        Math.round(alert.distanceMeters)
                    );
                }
            })
            .catch(err => console.error("GPS simulation step error:", err));
        }
    }, 4000);
}

function updateHudGps(gps) {
    document.getElementById('headerSpeed').textContent = `${Math.round(gps.speedKmh)} km/h`;
    document.getElementById('dashcamSpeed').textContent = Math.round(gps.speedKmh);
    if (gps.address) {
        document.getElementById('headerLocation').textContent = gps.address;
    }
    if (typeof updateGoogleCarMarker === 'function') {
        updateGoogleCarMarker(gps);
    }
}

function toggleSimDrive() {
    state.isSimulatingDrive = !state.isSimulatingDrive;
    const btn = document.getElementById('simBtnText');
    if (btn) btn.textContent = state.isSimulatingDrive ? "Pause Drive" : "Resume Drive";
}

function showProximityAlert(title, message, distance) {
    const banner = document.getElementById('proximityBanner');
    if (!banner) return;
    document.getElementById('proxTitle').textContent = title;
    document.getElementById('proxDesc').textContent = message;
    document.getElementById('proxDistance').textContent = `${distance}m`;
    banner.classList.remove('hidden');
}
