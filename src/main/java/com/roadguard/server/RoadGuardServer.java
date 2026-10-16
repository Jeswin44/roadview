package com.roadguard.server;

import com.roadguard.model.*;
import com.roadguard.service.*;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;

public class RoadGuardServer {
    private final int port;
    private final AuthorityReportingService authorityService;
    private final PotholeDetectionService potholeService;
    private final RoadSafetyService roadService;
    private final VehiclePassabilityService vehicleService;
    private final GpsTrackingService gpsService;
    private HttpServer server;

    public RoadGuardServer(int port) {
        this.port = port;
        this.authorityService = new AuthorityReportingService();
        this.potholeService = new PotholeDetectionService(this.authorityService);
        this.roadService = new RoadSafetyService();
        this.vehicleService = new VehiclePassabilityService();
        this.gpsService = new GpsTrackingService();
    }

    public void start() throws IOException {
        server = HttpServer.create(new InetSocketAddress(port), 0);
        server.setExecutor(Executors.newVirtualThreadPerTaskExecutor());

        // API Endpoints
        server.createContext("/api/config", new ConfigHandler());
        server.createContext("/api/stats", new StatsHandler());
        server.createContext("/api/potholes", new PotholesHandler());
        server.createContext("/api/potholes/detect", new PotholeDetectHandler());
        server.createContext("/api/roads", new RoadsHandler());
        server.createContext("/api/roads/nearby", new NearbyRoadsHandler());
        server.createContext("/api/roads/unsafe", new UnsafeRoadsHandler());
        server.createContext("/api/vehicles", new VehiclesHandler());
        server.createContext("/api/vehicles/evaluate", new VehicleEvaluateHandler());
        server.createContext("/api/dispatches", new DispatchesHandler());
        server.createContext("/api/dispatches/update", new DispatchUpdateHandler());
        server.createContext("/api/gps", new GpsHandler());
        server.createContext("/api/gps/update", new GpsUpdateHandler());
        server.createContext("/api/gps/simulate-step", new GpsSimulateStepHandler());

        // Static Files Handler
        server.createContext("/", new StaticFileHandler());

        server.start();
        System.out.println("===============================================================");
        System.out.println(" RoadGuard AI Server started successfully on port " + port);
        System.out.println(" Dashboard URL: http://localhost:" + port);
        System.out.println("===============================================================");
    }

    public void stop() {
        if (server != null) {
            server.stop(0);
        }
    }

    // --- Handlers ---

    private class ConfigHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtils.sendJsonResponse(exchange, 200, "{}");
                return;
            }
            String mapsKey = System.getenv("GOOGLE_MAPS_API_KEY");
            if (mapsKey == null || mapsKey.trim().isEmpty()) {
                mapsKey = "AIzaSyCqOwh79bsnGhCy7e0iuoaF5fEevxTg9BQ";
            }
            String json = String.format("{\"googleMapsApiKey\":\"%s\"}", mapsKey);
            HttpUtils.sendJsonResponse(exchange, 200, json);
        }
    }

    private class StatsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtils.sendJsonResponse(exchange, 200, "{}");
                return;
            }
            int totalPotholes = potholeService.getAllPotholes().size();
            int dangerousCount = potholeService.getDangerousPotholes().size();
            int dispatchesCount = authorityService.getAllDispatches().size();
            int unsafeRoadsCount = roadService.getUnsafeRoads().size();
            GpsCoordinate gps = gpsService.getCurrentPosition();

            String json = String.format(
                "{\"totalPotholes\":%d,\"dangerousPotholes\":%d,\"activeDispatches\":%d,\"unsafeRoads\":%d,\"currentGps\":%s}",
                totalPotholes, dangerousCount, dispatchesCount, unsafeRoadsCount, gps != null ? gps.toJson() : "null"
            );
            HttpUtils.sendJsonResponse(exchange, 200, json);
        }
    }

    private class PotholesHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtils.sendJsonResponse(exchange, 200, "{}");
                return;
            }

            Map<String, String> query = HttpUtils.parseQueryParams(exchange.getRequestURI().getQuery());
            List<Pothole> list;
            if ("true".equalsIgnoreCase(query.get("dangerousOnly"))) {
                list = potholeService.getDangerousPotholes();
            } else if (query.containsKey("roadId")) {
                list = potholeService.getPotholesByRoad(query.get("roadId"));
            } else {
                list = potholeService.getAllPotholes();
            }

            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < list.size(); i++) {
                sb.append(list.get(i).toJson());
                if (i < list.size() - 1) sb.append(",");
            }
            sb.append("]");
            HttpUtils.sendJsonResponse(exchange, 200, sb.toString());
        }
    }

    private class PotholeDetectHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtils.sendJsonResponse(exchange, 200, "{}");
                return;
            }
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtils.sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            String body = HttpUtils.readRequestBody(exchange);
            String base64Image = HttpUtils.extractJsonString(body, "imageBase64");
            String roadName = HttpUtils.extractJsonString(body, "roadName");
            Double lat = HttpUtils.extractJsonDouble(body, "latitude", 12.935240);
            Double lng = HttpUtils.extractJsonDouble(body, "longitude", 77.685320);

            byte[] imageBytes = null;
            if (base64Image != null && !base64Image.isEmpty()) {
                if (base64Image.contains(",")) {
                    base64Image = base64Image.substring(base64Image.indexOf(",") + 1);
                }
                try {
                    imageBytes = Base64.getDecoder().decode(base64Image);
                } catch (Exception e) {
                    System.err.println("Could not decode base64: " + e.getMessage());
                }
            }

            if (roadName == null || roadName.isEmpty()) {
                GpsCoordinate pos = gpsService.getCurrentPosition();
                roadName = (pos != null && pos.getAddress() != null) ? pos.getAddress() : "Live Inspected Corridor";
            }

            PotholeDetectionService.DetectionResult result = potholeService.analyzeImage(imageBytes, roadName, lat, lng);
            HttpUtils.sendJsonResponse(exchange, 200, result.toJson());
        }
    }

    private class RoadsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtils.sendJsonResponse(exchange, 200, "{}");
                return;
            }
            List<RoadSegment> roads = roadService.getAllRoads();
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < roads.size(); i++) {
                sb.append(roads.get(i).toJson());
                if (i < roads.size() - 1) sb.append(",");
            }
            sb.append("]");
            HttpUtils.sendJsonResponse(exchange, 200, sb.toString());
        }
    }

    private class NearbyRoadsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtils.sendJsonResponse(exchange, 200, "{}");
                return;
            }
            Map<String, String> query = HttpUtils.parseQueryParams(exchange.getRequestURI().getQuery());
            double lat = 12.935240;
            double lng = 77.685320;
            int limit = 6;

            if (query.containsKey("lat")) {
                try { lat = Double.parseDouble(query.get("lat")); } catch (Exception ignored) {}
            } else {
                GpsCoordinate pos = gpsService.getCurrentPosition();
                if (pos != null) {
                    lat = pos.getLatitude();
                    lng = pos.getLongitude();
                }
            }
            if (query.containsKey("lng")) {
                try { lng = Double.parseDouble(query.get("lng")); } catch (Exception ignored) {}
            }
            if (query.containsKey("limit")) {
                try { limit = Integer.parseInt(query.get("limit")); } catch (Exception ignored) {}
            }

            List<RoadSafetyService.RoadDistance> list = roadService.getNearbyRoads(lat, lng, limit);
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < list.size(); i++) {
                sb.append(list.get(i).toJson());
                if (i < list.size() - 1) sb.append(",");
            }
            sb.append("]");
            HttpUtils.sendJsonResponse(exchange, 200, sb.toString());
        }
    }

    private class UnsafeRoadsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtils.sendJsonResponse(exchange, 200, "{}");
                return;
            }
            List<RoadSegment> roads = roadService.getUnsafeRoads();
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < roads.size(); i++) {
                sb.append(roads.get(i).toJson());
                if (i < roads.size() - 1) sb.append(",");
            }
            sb.append("]");
            HttpUtils.sendJsonResponse(exchange, 200, sb.toString());
        }
    }

    private class VehiclesHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtils.sendJsonResponse(exchange, 200, "{}");
                return;
            }
            List<Vehicle> list = vehicleService.getAllVehicles();
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < list.size(); i++) {
                sb.append(list.get(i).toJson());
                if (i < list.size() - 1) sb.append(",");
            }
            sb.append("]");
            HttpUtils.sendJsonResponse(exchange, 200, sb.toString());
        }
    }

    private class VehicleEvaluateHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtils.sendJsonResponse(exchange, 200, "{}");
                return;
            }
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtils.sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
                return;
            }

            String body = HttpUtils.readRequestBody(exchange);
            String vehicleName = HttpUtils.extractJsonString(body, "vehicleName");
            String potholeId = HttpUtils.extractJsonString(body, "potholeId");
            Double customGc = HttpUtils.extractJsonDouble(body, "groundClearanceMm", null);
            Integer speedKmh = HttpUtils.extractJsonInt(body, "speedKmh", 25);

            Vehicle vehicle = vehicleService.findVehicle(vehicleName);
            if (vehicle == null) {
                // Construct vehicle from input params
                double gc = customGc != null ? customGc : 165.0;
                vehicle = new Vehicle("v-custom", "Custom", vehicleName != null ? vehicleName : "Vehicle",
                        "SEDAN", gc, 2600, 16, 20, 16, 60, "COMFORT_INDEPENDENT", 1200);
            } else if (customGc != null) {
                vehicle.setGroundClearanceMm(customGc);
            }

            Pothole pothole = null;
            if (potholeId != null && !potholeId.isEmpty()) {
                pothole = potholeService.getPotholeById(potholeId);
                if (pothole == null) {
                    List<Pothole> roadPotholes = potholeService.getPotholesByRoad(potholeId);
                    if (!roadPotholes.isEmpty()) {
                        pothole = roadPotholes.get(0);
                    }
                }
            }
            if (pothole == null) {
                // If no specific pothole is chosen, pick the most severe pothole currently on the road
                List<Pothole> dangerous = potholeService.getDangerousPotholes();
                pothole = !dangerous.isEmpty() ? dangerous.get(0) : potholeService.getAllPotholes().get(0);
            }

            PassabilityResult result = vehicleService.evaluate(vehicle, pothole, speedKmh);
            HttpUtils.sendJsonResponse(exchange, 200, result.toJson());
        }
    }

    private class DispatchesHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtils.sendJsonResponse(exchange, 200, "{}");
                return;
            }
            List<DispatchReport> list = authorityService.getAllDispatches();
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < list.size(); i++) {
                sb.append(list.get(i).toJson());
                if (i < list.size() - 1) sb.append(",");
            }
            sb.append("]");
            HttpUtils.sendJsonResponse(exchange, 200, sb.toString());
        }
    }

    private class DispatchUpdateHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtils.sendJsonResponse(exchange, 200, "{}");
                return;
            }
            String body = HttpUtils.readRequestBody(exchange);
            String dispatchId = HttpUtils.extractJsonString(body, "dispatchId");
            String newStatus = HttpUtils.extractJsonString(body, "status");
            String notes = HttpUtils.extractJsonString(body, "notes");

            boolean updated = authorityService.updateStatus(dispatchId, newStatus, notes);
            if (updated) {
                DispatchReport r = authorityService.getDispatchById(dispatchId);
                // Also update corresponding pothole status if repaired
                if ("REPAIRED".equalsIgnoreCase(newStatus) && r != null) {
                    Pothole p = potholeService.getPotholeById(r.getPotholeId());
                    if (p != null) p.setStatus("REPAIRED");
                }
                HttpUtils.sendJsonResponse(exchange, 200, "{\"success\":true,\"dispatch\":" + (r != null ? r.toJson() : "null") + "}");
            } else {
                HttpUtils.sendJsonResponse(exchange, 404, "{\"error\":\"Dispatch ID not found\"}");
            }
        }
    }

    private class GpsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtils.sendJsonResponse(exchange, 200, "{}");
                return;
            }

            GpsCoordinate current = gpsService.getCurrentPosition();
            List<GpsCoordinate> history = gpsService.getRouteHistory();
            List<GpsTrackingService.PotholeProximityAlert> alerts = gpsService.checkNearbyHazards(potholeService.getAllPotholes(), 100.0);

            StringBuilder histJson = new StringBuilder("[");
            for (int i = 0; i < history.size(); i++) {
                histJson.append(history.get(i).toJson());
                if (i < history.size() - 1) histJson.append(",");
            }
            histJson.append("]");

            StringBuilder alertsJson = new StringBuilder("[");
            for (int i = 0; i < alerts.size(); i++) {
                alertsJson.append(alerts.get(i).toJson());
                if (i < alerts.size() - 1) alertsJson.append(",");
            }
            alertsJson.append("]");

            String json = String.format(
                "{\"current\":%s,\"history\":%s,\"nearbyHazards\":%s,\"isTracking\":%b}",
                current != null ? current.toJson() : "null",
                histJson.toString(),
                alertsJson.toString(),
                gpsService.isTrackingActive()
            );
            HttpUtils.sendJsonResponse(exchange, 200, json);
        }
    }

    private class GpsUpdateHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtils.sendJsonResponse(exchange, 200, "{}");
                return;
            }
            String body = HttpUtils.readRequestBody(exchange);
            Double lat = HttpUtils.extractJsonDouble(body, "latitude", 12.935240);
            Double lng = HttpUtils.extractJsonDouble(body, "longitude", 77.685320);
            Double speed = HttpUtils.extractJsonDouble(body, "speedKmh", 40.0);
            Double heading = HttpUtils.extractJsonDouble(body, "heading", 0.0);
            Double alt = HttpUtils.extractJsonDouble(body, "altitude", 915.0);
            String address = HttpUtils.extractJsonString(body, "address");

            GpsCoordinate point = gpsService.updatePosition(lat, lng, speed, heading, alt, address);
            HttpUtils.sendJsonResponse(exchange, 200, "{\"success\":true,\"point\":" + point.toJson() + "}");
        }
    }

    private class GpsSimulateStepHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                HttpUtils.sendJsonResponse(exchange, 200, "{}");
                return;
            }
            GpsCoordinate point = gpsService.stepSimulation();
            List<GpsTrackingService.PotholeProximityAlert> alerts = gpsService.checkNearbyHazards(potholeService.getAllPotholes(), 100.0);

            StringBuilder alertsJson = new StringBuilder("[");
            for (int i = 0; i < alerts.size(); i++) {
                alertsJson.append(alerts.get(i).toJson());
                if (i < alerts.size() - 1) alertsJson.append(",");
            }
            alertsJson.append("]");

            HttpUtils.sendJsonResponse(exchange, 200, "{\"current\":" + point.toJson() + ",\"nearbyHazards\":" + alertsJson.toString() + "}");
        }
    }

    private class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path == null || path.equals("/") || path.isEmpty()) {
                path = "/index.html";
            }

            // Look in src/main/resources/static first, then fallback to current directory
            File file = new File("src/main/resources/static" + path);
            if (!file.exists()) {
                file = new File("static" + path);
            }
            if (!file.exists()) {
                file = new File("." + path);
            }

            if (!file.exists() || file.isDirectory()) {
                HttpUtils.sendJsonResponse(exchange, 404, "{\"error\":\"File not found: " + path + "\"}");
                return;
            }

            String contentType = determineContentType(file.getName());
            byte[] fileBytes = Files.readAllBytes(file.toPath());
            HttpUtils.sendFileResponse(exchange, 200, fileBytes, contentType);
        }

        private String determineContentType(String filename) {
            String lower = filename.toLowerCase();
            if (lower.endsWith(".html")) return "text/html; charset=UTF-8";
            if (lower.endsWith(".css")) return "text/css; charset=UTF-8";
            if (lower.endsWith(".js")) return "application/javascript; charset=UTF-8";
            if (lower.endsWith(".json")) return "application/json; charset=UTF-8";
            if (lower.endsWith(".png")) return "image/png";
            if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
            if (lower.endsWith(".svg")) return "image/svg+xml";
            if (lower.endsWith(".mp4")) return "video/mp4";
            if (lower.endsWith(".webm")) return "video/webm";
            return "application/octet-stream";
        }
    }
}
