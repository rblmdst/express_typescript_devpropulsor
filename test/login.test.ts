import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";

import mongoose from "mongoose";
import { Express } from "express";
import supertest from "supertest";
import { UserModel } from "../src/users/user.model";
import { createTestApp } from "./utils";
const request = supertest;

describe("Login : /auth/login", () => {
  let app: Express;
  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
    await mongoose.connection.close();
  });

  it("Should not allow not existing user to connect", async () => {
    const unknownUser = {
      email: "unknown@gmail.com",
      password: "A23#56#8u9",
    };
    const response = await request(app).post("/auth/login").send(unknownUser);

    const { status, body } = response;
    assert.equal(status, 401);
    assert.equal(body.error, "Invalid credentials");
  });

  it("Should not allow existing user to connect with invalid credentials", async () => {
    // Register new user
    const userData = {
      email: "anonymous@gmail.com",
      password: "A23#56#8u9",
      firstName: "Anonymous",
      lastName: "A.",
    };
    let response = await request(app).post("/auth/register").send(userData);
    assert.equal(response.status, 201);

    // Login with the new user account
    response = await request(app).post("/auth/login").send({
      email: userData.email,
      password: "userData.password",
    });

    const { status, body } = response;
    assert.equal(status, 401);
    assert.equal(body.error, "Invalid credentials");
  });

  it("Should allow existing user to connect with valid credentials", async () => {
    // Register new user
    const userData = {
      email: "anonymous@gmail.com",
      password: "A23#56#8u9",
      firstName: "Anonymous",
      lastName: "A.",
    };
    let response = await request(app).post("/auth/register").send(userData);
    assert.equal(response.status, 201);

    // Login with the new user account
    response = await request(app).post("/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    const { status, body } = response;
    assert.equal(status, 200);
    assert.notEqual(body.token, undefined);
    assert.notEqual(body.token.trim(), "");
  });
});
