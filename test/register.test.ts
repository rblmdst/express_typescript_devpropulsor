import assert from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";

import mongoose from "mongoose";
import { Express } from "express";
import supertest from "supertest";
import { UserModel } from "../src/users/user.model";
import { createTestApp } from "./utils";
const request = supertest;

describe("Register : /auth/register", () => {
  let app: Express;
  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
    await mongoose.connection.close();
  });

  it("Should retrun errors when the required fields are not defined", async () => {
    const response = await request(app).post("/auth/register");

    const { status, body } = response;
    const emailError = body.find((err: any) => err.field == "email");
    const passwordError = body.find((err: any) => err.field == "password");
    const firstNameError = body.find((err: any) => err.field == "firstName");
    const lastNameError = body.find((err: any) => err.field == "lastName");

    assert.equal(status, 400);
    assert.equal(body.length, 4);
    assert.equal(emailError.error, "The user email is required");
    assert.equal(passwordError.error, "The user password is required");
    assert.equal(lastNameError.error, "The user lastName is required");
    assert.equal(firstNameError.error, "The user firstName is required");
  });

  it("Should retrun errors when the email and the password are not valid", async () => {
    const userData = {
      email: "anonymousgmail.com",
      password: "A68u9",
      firstName: "Anonymous",
      lastName: "A.",
    };
    const response = await request(app).post("/auth/register").send(userData);

    const { status, body } = response;

    const emailError = body.find((err: any) => err.field == "email");
    const passwordError = body.find((err: any) => err.field == "password");

    assert.equal(status, 400);
    assert.equal(body.length, 2);

    assert.equal(emailError.error, "Invalid email address");
    assert.equal(
      passwordError.error,
      "The password must contains lowercase uppercase digit and special character and it is 8 characters minimum"
    );
  });

  it("Should allow the user to register when the inputs are valid", async () => {
    const userData = {
      email: "anonymous@gmail.com",
      password: "A23#56#8u9",
      firstName: "Anonymous",
      lastName: "A.",
    };
    const response = await request(app).post("/auth/register").send(userData);

    const { status, body } = response;
    const { email, lastName, firstName, password } = body;
    assert.equal(status, 201);
    assert.equal(email, userData.email);
    assert.equal(lastName, userData.lastName);
    assert.equal(firstName, userData.firstName);
    assert.equal(password, undefined);
  });
});
