# RoadGuard AI 🛡️🚗
### Intelligent Road Hazard Detection, Dashcam Vision, Authority Reporting & Vehicle Passability System

**RoadGuard AI** is a comprehensive, Java 21-powered automotive telematics and civic infrastructure platform. It monitors road surface quality from an on-vehicle dashcam, analyzes road hazard severity using computer vision, automatically reports critical craters to municipal and highway authorities, empowers citizens to explore unsafe roads, and features an automotive physics AI engine that calculates whether a given vehicle make/model can cross a road hazard and exactly how many times it can cross before component failure.

---

## 🌟 Key Features

### 1. 📹 On-Vehicle Dashcam Tracking & HUD
- **Real-Time Dashcam Integration**: Supports both physical device camera streams (webcam/dashcam attached to the vehicle) and high-resolution simulated road drive testing.
- **Automotive Heads-Up Display (HUD)**:
  - Real-time speedometer (km/h), GPS coordinates, heading compass, and altitude.
  - Dynamic AI laser reticle and bounding box tracking oncoming road craters.
  - Continuous distance countdown (e.g. `DISTANCE: 22m`) and acoustic/visual proximity hazard alert when closing in on dangerous craters.

### 2. 📤 Media Upload & Computer Vision Inspector (Image & Video)
- **User Uploads**: Allows drivers and citizens to upload photos or driving videos.
- **Computer Vision & Depth Estimation**:
  - Shadow gradient & dark pixel clustering for crater depth estimation (cm).
  - Contour analysis for surface diameter (cm) and surface area ($m^2$).
  - Water-logging detector: Identifies murky water puddles that mask deep, dangerous sinkholes.
  - Multi-tier classification: `DEEP_CRATER`, `TRANSVERSE_TRENCH`, `EDGE_BREAK`, `ALLIGATOR_CRACK`, `WATER_MASKED`.

### 3. 🚨 Automated Authority Reporting & Dispatch
- **Autonomous Emergency Escalation**: When a pothole's severity reaches **&ge; 70%** (or depth &ge; 7.0 cm), an automated incident dispatch report is instantly generated.
- **Official Dispatch Dossier**:
  - Assigned Authority (e.g., *National Highways Authority of India (NHAI)*, *Municipal Corporation Road Works Command*, *State PWD*).
  - Unique Official Ticket Reference (`REF: RPT-XXXXXX`).
  - High-precision GPS Geolocation, timestamp, and evidence snapshot.
  - Ticket lifecycle workflow: `DISPATCHED` &rarr; `ACKNOWLEDGED` &rarr; `UNDER_REPAIR` &rarr; `REPAIRED`.
  - Printable / Exportable Official Road Hazard Dispatch Report.

### 4. 🗺️ Public Safe / Unsafe Roads Explorer (Google Maps Powered)
- **Google Maps Integration**:
  - Powered by the Google Maps JavaScript API with customized dark/aubergine cartography and satellite imagery toggle.
  - Interactive custom pothole hazard pins (Red = Critical &ge; 70%, Amber = Moderate 40-69%, Green = Repaired).
  - InfoWindows featuring detailed hazard metrics and an instant **"Check If My Vehicle Can Cross"** evaluation trigger.
  - Real-time moving vehicle GPS marker tracking your live drive on Google Maps!
  - Automatic fallback to OpenStreetMap (Leaflet) if offline.
- **Public Road Condition Directory**:
  - Citizens can browse roads by city or zone.
  - Safety Score from `0.0` (Impassable/Severe Danger) to `10.0` (Pristine Expressway).
  - Specific vulnerability warnings for two-wheelers, small hatchbacks, and sedans.

### 5. 🏎️ Vehicle Passability & Crossing Durability AI
- **Vehicle Catalog & Custom Inputs**:
  - Preloaded with popular vehicles: Hatchbacks (*Maruti Swift, VW Polo*), Sedans (*Honda City, BMW 3 Series*), SUVs (*Mahindra Thar, Tata Nexon, Creta, Fortuner*), Two-Wheelers (*Honda Activa 6G, Royal Enfield Classic 350*), and Commercial Mini-Trucks (*Tata Ace*).
  - Customizable parameters: Ground clearance (mm), wheelbase (mm), suspension type, wheel rim diameter, and vehicle weight.
- **Passability Verdict**:
  - Compares ground clearance vs crater depth vs dynamic suspension sag at speed.
  - Verdicts: `SAFE TO PASS`, `PASSABLE WITH CAUTION`, `HIGH UNDERBODY SCRAPE RISK`, or `CATASTROPHIC - TWO-WHEELER ROLLOVER / ENGINE SUMP RUPTURE`.
- **Durability Lifespan Estimator ("How many times can it cross in good condition?")**:
  - Computes shock absorber fatigue rate (% wear per pass).
  - Alloy wheel rim bending probability (%).
  - Wheel alignment drift rate (Toe/Camber deviation).
  - Outputs the exact number of safe passes remaining before component failure (e.g., `0 Crossings`, `9 Passes`, `650+ Passes`).
  - Itemized estimated cumulative repair bill (INR / USD).

### 6. 🛰️ Real-Time GPS Tracking & Telemetry
- Browser HTML5 Geolocation API integration + Simulated Vehicle Drive Mode.
- Live telemetry: Speed (km/h), Altitude (m), Heading (°), and Coordinate trail.
- Proximity geo-fencing: Warns the driver within 100 meters of any known severe road hazard.

---

## 🛠️ Technology Architecture

- **Backend**: **Java 21** (Pure standard library using `jdk.httpserver`, zero runtime dependency bloat).
- **Build System**: Apache Maven (`pom.xml`) & batch scripts (`run.bat`, `build.bat`).
- **Frontend**: Modern Responsive HTML5, Vanilla CSS3 (Automotive Glassmorphic Dark UI), JavaScript (ES6+), Leaflet.js (OpenStreetMap), FontAwesome 6.
- **API**: RESTful endpoints for Potholes, Roads, Vehicles, Dispatches, and GPS telemetry.

---

## 🚀 How to Run

### Option 1: Quick Launch (Windows)
Double-click `run.bat` or run:
```bat
run.bat
```

### Option 2: Command Line (Java 21)
```powershell
# Compile Java files
& "C:\Users\Jeswin\.tools\jdk-21\bin\javac.exe" -d target/classes $(Get-ChildItem -Path src/main/java -Filter *.java -Recurse | Select-Object -ExpandProperty FullName)

# Start server
& "C:\Users\Jeswin\.tools\jdk-21\bin\java.exe" -cp target/classes com.roadguard.Main 8090
```

### Option 3: Maven
```bash
mvn clean compile
mvn exec:java -Dexec.mainClass="com.roadguard.Main"
```

Then open your browser at:
👉 **`http://localhost:8090`**

---

## 📂 Project Structure

```
java_project/
├── pom.xml                                      # Maven project configuration
├── run.bat                                      # Easy launch script
├── build.bat                                    # Source compilation script
├── README.md                                    # Comprehensive system documentation
└── src/
    └── main/
        ├── java/com/roadguard/
        │   ├── Main.java                        # Server startup with auto port failover
        │   ├── model/
        │   │   ├── Pothole.java                 # Pothole hazard entity with severity metrics
        │   │   ├── Vehicle.java                 # Vehicle chassis and suspension parameters
        │   │   ├── PassabilityResult.java       # AI passability & durability calculation model
        │   │   ├── DispatchReport.java          # Authority dispatch report and ticket lifecycle
        │   │   ├── RoadSegment.java             # Public road segment and safety score model
        │   │   └── GpsCoordinate.java           # GPS telemetry point model
        │   ├── service/
        │   │   ├── PotholeDetectionService.java # Computer vision & AI severity detection
        │   │   ├── VehiclePassabilityService.java# Vehicle dynamics & safe crossing count estimator
        │   │   ├── AuthorityReportingService.java# Automated civic authority dispatch engine
        │   │   ├── RoadSafetyService.java       # Unsafe roads directory and score calculator
        │   │   └── GpsTrackingService.java      # Real-time GPS stream & proximity alerts
        │   └── server/
        │       ├── RoadGuardServer.java         # HTTP server and REST API route handlers
        │       └── HttpUtils.java               # Zero-dependency HTTP & JSON parsing utilities
        └── resources/
            └── static/
                ├── index.html                   # Automotive HUD & responsive dashboard
                ├── styles.css                   # Glassmorphic dark styling & telemetry gauges
                └── app.js                       # Frontend state, canvas rendering & API connectors
```
