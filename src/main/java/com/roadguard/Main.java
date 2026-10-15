package com.roadguard;

import com.roadguard.server.RoadGuardServer;

public class Main {
    public static void main(String[] args) {
        int port = 8080;
        if (args.length > 0) {
            try {
                port = Integer.parseInt(args[0]);
            } catch (NumberFormatException ignored) {}
        } else if (System.getenv("PORT") != null) {
            try {
                port = Integer.parseInt(System.getenv("PORT"));
            } catch (NumberFormatException ignored) {}
        }

        System.out.println("=============================================================");
        System.out.println("  ROADGUARD AI - Road Hazard & Vehicle Passability System     ");
        System.out.println("  Java 21 Edition | Edge Telematics & Computer Vision Engine ");
        System.out.println("=============================================================");

        int[] preferredPorts = { port, 8090, 8888, 9090, 9000 };
        boolean started = false;

        for (int p : preferredPorts) {
            try {
                RoadGuardServer server = new RoadGuardServer(p);
                server.start();
                started = true;

                // Add shutdown hook
                Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                    System.out.println("\nShutting down RoadGuard AI Server gracefully...");
                    server.stop();
                }));
                break;
            } catch (java.net.BindException be) {
                System.out.println("Port " + p + " is currently in use, trying next available port...");
            } catch (Exception e) {
                System.err.println("Failed to start RoadGuard AI Server on port " + p + ": " + e.getMessage());
                break;
            }
        }

        if (!started) {
            System.err.println("Could not bind to any preferred port. Please check your system ports.");
        }
    }
}
