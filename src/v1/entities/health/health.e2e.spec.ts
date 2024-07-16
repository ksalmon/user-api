import { app } from "../../../app";
import * as request from "supertest";

describe("GET /api/v1/health", () => {
  it("should return service status", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.body.status).toBe("Service is available");
    expect(res.statusCode).toBe(200);
  });
});
