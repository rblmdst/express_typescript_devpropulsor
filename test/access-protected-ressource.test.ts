import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";

import mongoose from "mongoose";
import { Express } from "express";
import supertest from "supertest";
import { UserModel } from "../src/users/user.model";
import { createTestApp } from "./utils";
const request = supertest;

describe("Access Protected Ressources", () => {
  let app: Express;
  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
    await mongoose.connection.close();
  });

  it("Should forbide access without Authentication token", async () => {
    const response = await request(app).get("/employees");
    const { status, body } = response;
    assert.equal(status, 401);
    assert.equal(
      body.error,
      "Invalid Authorization header. Expected format is : 'Authorization: Bearer <token>'"
    );
  });

  it("Should forbide access with invalid Authentication token", async () => {
    const invalidToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFub255bW91c0BnbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJBbm9ueW1vdXMiLCJsYXN0TmFtZSI6IkEuIiwiX2lkIjoiNjZiN2M0ZDI2MTM0NDI4NTdmNzA2NzdhIiwiaWF0IjoxNzI0NjExMjM0LCJleHAiOjE3MjQ2MTE0NzR9.kD9dkmifY4AusowVXL-SqOaO9klYTf78tJIu_tPJae0";
    const response = await request(app)
      .get("/employees")
      .set("Authorization", `Bearer ${invalidToken}`);

    const { status, body } = response;
    assert.equal(status, 401);
    assert.equal(body.error, "Invalid Token");
  });

  it("Should allow authenitcated user to access ressources", async () => {
    // Register new user
    const userData = {
      email: "anonytjototmous@gmail.com",
      password: "A23#56#8u9",
      firstName: "Anonymous",
      lastName: "A.",
    };
    let response = await request(app).post("/auth/register").send(userData);

    // Login with the new user account
    response = await request(app).post("/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    const token = response.body.token;

    // Try to access ressource
    response = await request(app)
      .get("/employees")
      .set("Authorization", `Bearer ${token}`);

    const { status, body } = response;
    assert.equal(status, 200);
    assert.deepEqual(body, []);
  });
});
