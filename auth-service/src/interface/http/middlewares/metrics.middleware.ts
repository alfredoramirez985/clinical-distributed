import Elysia from "elysia";
import { collectDefaultMetrics, Counter, Histogram, register } from "prom-client";

// Collect default Node.js runtime metrics (CPU, memory, GC, event loop lag, etc.)
collectDefaultMetrics({ prefix: "auth_service_" });

// ─── Custom HTTP Metrics ──────────────────────────────────────────────────────
export const httpRequestsTotal = new Counter({
    name: "auth_service_http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "path", "status"],
});

export const httpRequestDurationSeconds = new Histogram({
    name: "auth_service_http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "path", "status"],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
});

// ─── Custom Business Metrics ──────────────────────────────────────────────────
export const userRegistrationsTotal = new Counter({
    name: "auth_service_user_registrations_total",
    help: "Total number of successful user registrations",
});

export const failedLoginsTotal = new Counter({
    name: "auth_service_failed_logins_total",
    help: "Total number of failed login attempts",
});

// ─── Elysia Plugin ────────────────────────────────────────────────────────────
export const metricsMiddleware = new Elysia({ name: "metrics" })
    // Expose the /metrics endpoint for Prometheus scraping
    .get("/metrics", async () => {
        return new Response(await register.metrics(), {
            headers: { "Content-Type": register.contentType },
        });
    })
    // Track duration and status for every request
    .onRequest(({ request, store }) => {
        (store as any)._reqStart = Date.now();
    })
    .onAfterResponse(({ request, set, store }) => {
        const durationMs = Date.now() - ((store as any)._reqStart ?? Date.now());
        const durationSec = durationMs / 1000;
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;
        const status = String(set.status ?? 200);

        httpRequestsTotal.inc({ method, path, status });
        httpRequestDurationSeconds.observe({ method, path, status }, durationSec);
    });
