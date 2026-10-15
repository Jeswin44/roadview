/**
 * ROADGUARD AI - Simple, Understandable UI Controller
 */

const state = {
    activeTab: 'tab-vehicle', // Open directly to the Vehicle Passability Checker!
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
};

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initVehicleSimulator();
    initDashcamSimulator();
    initMediaUpload();
    initMap();
    initAuthorityCenter();
    initTelemetryPolling();

    // Fetch initial data from Java server
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

    if (tabId === 'tab-map') {
        if (state.googleMap && typeof google !== 'undefined') {
            google.maps.event.trigger(state.googleMap, 'resize');
            state.googleMap.setCenter({ lat: state.currentGps.latitude, lng: state.currentGps.longitude });
        } else if (state.map) {
            setTimeout(() => state.map.invalidateSize(), 200);
        }
    }
}

// ================= 1. VEHICLE PASSABILITY & DURABILITY (CLEAN & SIMPLE) =================
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
        runVehiclePassabilityEvaluation();
    });
}

function runVehiclePassabilityEvaluation() {
    const vehicleName = document.getElementById('vehicleSearchInput')?.value || 'Honda City';
    const potholeId = document.getElementById('selectTestPothole')?.value || 'p-101';
    const groundClearanceMm = parseFloat(document.getElementById('specGc')?.value) || 165;
    const speedKmh = parseInt(document.getElementById('inputTestSpeed')?.value) || 25;

    fetch('/api/vehicles/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleName, potholeId, groundClearanceMm, speedKmh })
    })
    .then(r => r.json())
    .then(data => {
        renderPassabilityResults(data);
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

    // Friendly emoji and styling
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

    // Exact count of safe crossings
    counter.textContent = data.estimatedSafeCrossings;

    // Progress bar fill (0 to 100%)
    let pct = Math.min(100, Math.max(5, (data.estimatedSafeCrossings / 250) * 100));
    if (data.estimatedSafeCrossings === 0) pct = 0;
    durFill.style.width = pct + '%';

    durBadge.innerHTML = `With your <strong>${data.vehicleName}</strong> in good condition, you can safely cross this specific road approximately <strong>${data.estimatedSafeCrossings} times</strong> before you risk severe suspension or wheel rim damage.`;

    // Height comparison values
    document.getElementById('dispGcMm').textContent = `${Math.round(data.groundClearanceMm)} mm`;
    document.getElementById('dispDepthMm').textContent = `${Math.round(data.potholeDepthMm)} mm`;
    document.getElementById('dispMarginMm').textContent = `${Math.round(data.effectiveClearanceMarginMm)} mm`;

    // Impact values
    document.getElementById('wearShock').textContent = `${data.shockWearPerPassPercent}% / pass`;
    document.getElementById('wearRim').textContent = `${data.rimBendRiskPercent}% Risk`;
    document.getElementById('wearCost').textContent = `₹${data.estimatedRepairCostInr.toLocaleString()}`;

    // Plain English driver advice
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

// ================= 2. LIVE DASHCAM (CLEAN & SIMPLE) =================
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
    const video = document.getElementById('webcamElement');
    const canvas = document.getElementById('dashcamCanvas');

    if (state.isWebcamActive) {
        stopWebcam();
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' }
        });
        video.srcObject = stream;
        video.classList.remove('hidden');
        canvas.classList.add('hidden');
        state.isWebcamActive = true;
        document.getElementById('vpStreamSource').textContent = "Live Camera Connected";
        document.getElementById('btnSwitchCamera').innerHTML = '<i class="fa-solid fa-stop"></i> Stop Camera';
    } catch (err) {
        alert("Camera access unavailable. Using the road simulator instead.");
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

    fetch('/api/potholes/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            imageBase64: base64,
            roadName: "Outer Ring Road (Live Dashcam)",
            latitude: state.currentGps.latitude,
            longitude: state.currentGps.longitude
        })
    })
    .then(r => r.json())
    .then(data => {
        if (data.pothole) {
            document.getElementById('statDepth').textContent = `${data.pothole.depthCm} cm`;
            document.getElementById('severityScoreVal').textContent = data.pothole.severityScore;

            if (data.authorityReported) {
                document.getElementById('autoReportStatusBox')?.classList.remove('hidden');
                document.getElementById('autoDispatchRef').textContent = `Ticket: #${data.dispatchRef}`;
            }

            loadPotholes();
            loadDispatches();
            alert(`Pothole Scanned!\nDepth: ${data.pothole.depthCm} cm\nSeverity: ${data.pothole.severityScore}%\n${data.authorityReported ? 'Reported automatically to Municipal Highway Authority!' : ''}`);
        }
    })
    .catch(err => console.error("Detection error:", err));
}

// ================= 3. MEDIA UPLOAD (SIMPLE & EASY) =================
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

    fetch('/api/potholes/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, roadName, latitude: 12.93524, longitude: 77.68532 })
    })
    .then(r => r.json())
    .then(data => {
        if (data.pothole) {
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

// ================= 4. UNSAFE ROADS MAP (GOOGLE MAPS INTEGRATION) =================
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

    // Check if Google Maps API loaded with the demo key
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
    // 1. Google Maps Rendering
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

    // 2. Leaflet Fallback Rendering
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
    const filtered = state.roads.filter(r => r.name.toLowerCase().includes(q) || r.district.toLowerCase().includes(q));
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
    fetch('/api/dispatches/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dispatchId, status, notes })
    })
    .then(r => r.json())
    .then(() => {
        loadDispatches();
        loadPotholes();
    })
    .catch(err => console.error("Error updating dispatch:", err));
}

// ================= DATA FETCHING =================
function loadVehicles() {
    fetch('/api/vehicles')
    .then(r => r.json())
    .then(vehicles => {
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
    fetch('/api/roads')
    .then(r => r.json())
    .then(roads => {
        state.roads = roads;
        renderRoadsDirectory(roads);
    })
    .catch(err => console.error("Error loading roads:", err));
}

function loadPotholes() {
    fetch('/api/potholes')
    .then(r => r.json())
    .then(potholes => {
        state.potholes = potholes;
        renderRecentHazards(potholes);
        renderMapMarkers('all');

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
    fetch('/api/dispatches')
    .then(r => r.json())
    .then(dispatches => {
        state.dispatches = dispatches;
        renderDispatches(dispatches);
    })
    .catch(err => console.error("Error loading dispatches:", err));
}

function loadStats() {
    fetch('/api/stats')
    .then(r => r.json())
    .then(stats => {
        if (stats.currentGps) {
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
            fetch('/api/gps/simulate-step', { method: 'POST' })
            .then(r => r.json())
            .then(data => {
                if (data.current) {
                    state.currentGps = data.current;
                    updateHudGps(data.current);
                }
                if (data.nearbyHazards && data.nearbyHazards.length > 0) {
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
