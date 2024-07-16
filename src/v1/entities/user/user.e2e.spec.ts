import { app } from "../../../app";
import * as request from "supertest";

describe("POST /api/v1/users", () => {
  it("Throws errors for required fields", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({ name: "Murphy" });
    expect(res.body.errors).toContain(`\"email\" is required`);
    expect(res.statusCode).toBe(400);
  });

  it("Throws errors for invalid email", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({
        name: "Murphy",
        email: "kyle.com",
        dob: new Date().toISOString(),
      });
    expect(res.body.errors).toContain(`\"email\" must be a valid email`);
    expect(res.statusCode).toBe(400);
  });

  it("Throws errors for invalid name", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({
        name: 123,
        email: "kyle@salmon.com",
        dob: new Date().toISOString(),
      });
    expect(res.body.errors).toContain(`\"name\" must be a string`);
    expect(res.statusCode).toBe(400);
  });

  it("Throws errors for invalid dob", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send({
        name: 'Murphy',
        email: "kyle@salmon.com",
        dob: "123",
      });
    expect(res.body.errors).toContain(`\"dob\" must be in ISO 8601 date format`);
    expect(res.statusCode).toBe(400);
  });
});
