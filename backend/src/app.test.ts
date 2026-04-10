import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "./app";

describe("Server Integrity", () => {
  it("should return a 200 status from the health check route", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
  });
});

describe("API Integrity", () => {
  it("should return 200 from the health check route", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});

describe("User Authentication & Profile", () => {
  it("should create a new user and return a 201 status", async () => {
    const newUser = {
      username: "Akira_99",
      email: "akira@neotokyo.io",
      password: "securePassword123",
    };

    const response = await request(app)
      .post("/api/users/register")
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.username).toBe("Akira_99");
    // Ensure we don't accidentally send the password back!
    expect(response.body.password).toBeUndefined();
  });
});
