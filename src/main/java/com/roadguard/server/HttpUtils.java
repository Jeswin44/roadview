package com.roadguard.server;

import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class HttpUtils {

    public static void sendJsonResponse(HttpExchange exchange, int statusCode, String jsonResponse) throws IOException {
        byte[] bytes = jsonResponse.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    public static void sendFileResponse(HttpExchange exchange, int statusCode, byte[] content, String contentType) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", contentType);
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.sendResponseHeaders(statusCode, content.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(content);
        }
    }

    public static String readRequestBody(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody();
             ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[8192];
            int read;
            while ((read = is.read(buffer)) != -1) {
                bos.write(buffer, 0, read);
            }
            return bos.toString(StandardCharsets.UTF_8);
        }
    }

    public static byte[] readRequestBodyBytes(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody();
             ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[8192];
            int read;
            while ((read = is.read(buffer)) != -1) {
                bos.write(buffer, 0, read);
            }
            return bos.toByteArray();
        }
    }

    public static Map<String, String> parseQueryParams(String query) {
        Map<String, String> params = new HashMap<>();
        if (query == null || query.isEmpty()) return params;

        String[] pairs = query.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            if (idx > 0 && idx < pair.length() - 1) {
                String key = java.net.URLDecoder.decode(pair.substring(0, idx), StandardCharsets.UTF_8);
                String val = java.net.URLDecoder.decode(pair.substring(idx + 1), StandardCharsets.UTF_8);
                params.put(key, val);
            } else if (idx > 0) {
                String key = java.net.URLDecoder.decode(pair.substring(0, idx), StandardCharsets.UTF_8);
                params.put(key, "");
            }
        }
        return params;
    }

    /**
     * Robust JSON string/primitive property extractor (Zero external dependencies)
     */
    public static String extractJsonString(String json, String key) {
        if (json == null) return null;

        // Try standard key format: "key" or \"key\"
        String[] possibleKeys = { "\"" + key + "\"", "\\\"" + key + "\\\"" };
        int idx = -1;
        String matchedKey = null;

        for (String pk : possibleKeys) {
            idx = json.indexOf(pk);
            if (idx != -1) {
                matchedKey = pk;
                break;
            }
        }
        if (idx == -1) return null;

        int colon = json.indexOf(":", idx + matchedKey.length());
        if (colon == -1) return null;

        int cur = colon + 1;
        while (cur < json.length() && (Character.isWhitespace(json.charAt(cur)) || json.charAt(cur) == '\\')) cur++;

        if (cur >= json.length()) return null;

        if (json.charAt(cur) == '\"') {
            int startQuote = cur;
            int endQuote = json.indexOf("\"", startQuote + 1);
            while (endQuote != -1 && json.charAt(endQuote - 1) == '\\') {
                endQuote = json.indexOf("\"", endQuote + 1);
            }
            if (endQuote == -1) return null;
            return json.substring(startQuote + 1, endQuote).replace("\\\"", "\"").replace("\\\\", "\\");
        } else {
            // Unquoted string or token
            int end = cur;
            while (end < json.length() && json.charAt(end) != ',' && json.charAt(end) != '}' && json.charAt(end) != ']') {
                end++;
            }
            return json.substring(cur, end).trim();
        }
    }

    public static Double extractJsonDouble(String json, String key, Double defaultValue) {
        if (json == null) return defaultValue;
        String[] possibleKeys = { "\"" + key + "\"", "\\\"" + key + "\\\"" };
        int idx = -1;
        String matchedKey = null;

        for (String pk : possibleKeys) {
            idx = json.indexOf(pk);
            if (idx != -1) {
                matchedKey = pk;
                break;
            }
        }
        if (idx == -1) return defaultValue;

        int colon = json.indexOf(":", idx + matchedKey.length());
        if (colon == -1) return defaultValue;

        int cur = colon + 1;
        while (cur < json.length() && (Character.isWhitespace(json.charAt(cur)) || json.charAt(cur) == '\\' || json.charAt(cur) == '\"')) cur++;

        int end = cur;
        while (end < json.length() && (Character.isDigit(json.charAt(end)) || json.charAt(end) == '.' || json.charAt(end) == '-')) {
            end++;
        }

        try {
            return Double.parseDouble(json.substring(cur, end));
        } catch (Exception e) {
            return defaultValue;
        }
    }

    public static Integer extractJsonInt(String json, String key, Integer defaultValue) {
        Double d = extractJsonDouble(json, key, defaultValue != null ? defaultValue.doubleValue() : null);
        return d != null ? d.intValue() : defaultValue;
    }

    public static Boolean extractJsonBoolean(String json, String key, Boolean defaultValue) {
        if (json == null) return defaultValue;
        String search = "\"" + key + "\"";
        int idx = json.indexOf(search);
        if (idx == -1) return defaultValue;

        int colon = json.indexOf(":", idx + search.length());
        if (colon == -1) return defaultValue;

        String sub = json.substring(colon + 1).trim();
        if (sub.startsWith("true")) return true;
        if (sub.startsWith("false")) return false;
        return defaultValue;
    }
}
