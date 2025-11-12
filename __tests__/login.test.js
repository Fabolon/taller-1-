import supertest from "supertest";
import mongoose from "mongoose";
import { userModel } from "../src/models/users.model.js";
import bcrypt from "bcryptjs";
import app from "../app.js";

describe("prueba de login", () => {
  // Caso de prueba

  const testUser = {
    fullName: "pepe cadena",
    email: "pepecadena@gmail.com",
    password: "12345",
  };

  // Antes de cada caso de prueba
  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  // Despues de todas las pruebas
  afterAll(async () => {
    await mongoose.connection.close();
  });

  //1. Caso exitoso de inicio de sesion
  it("debe iniciar sesión con un usuario existente", async () => {
    const codedPassword = await bcrypt.hash(testUser.password, 10);
    await userModel.create({ ...testUser, password: codedPassword });

    // Enviar la contraseña correcta para que el login funcione
    const response = await supertest(app).post("/iniciarSesion").send({
      passwordLogin: testUser.password,
      emailLogin: testUser.email,
    });

    expect(response.statusCode).toBe(200);
  });

  // 2. Caso de error: por usuario no registrado
  it("No debería iniciarse sesión correctamente, correo inválido", async () => {
    const codedPassword = await bcrypt.hash(testUser.password, 10); // encriptar la contraseña
    await userModel.create({ ...testUser, password: codedPassword }); // nos guardamos el usuario de pruebas
    // await new userModel({objeto}).save()

    const response = await supertest(app).post("/iniciarSesion").send({
      emailLogin: "carlitos@gmail.com",
      passwordLogin: "123",
    });

    expect(response.statusCode).toBe(404);
  });

  //3. Caso de error: por usuario con contraseña incorrecta
  it('no debe iniciarse sesion correctamente, correo invalida', async () => {

        const codedPassword = await bcrypt.hash(testUser.password, 10);
        await userModel.create({ ...testUser, password: codedPassword });

        const response = await supertest(app).post('/iniciarSesion').send({
            passwordLogin: '12345',
            emailLogin: 'fresa@gmail.com'
        });

        expect(response.statusCode).toBe(404);
    });

    it('no debe iniciarse sesion correctamente, contraseña invalida', async () => {

        const codedPassword = await bcrypt.hash(testUser.password, 10);
        await userModel.create({ ...testUser, password: codedPassword });

        const response = await supertest(app).post('/iniciarSesion').send({
            passwordLogin: '12345789',
            emailLogin: 'pepecadena@gmail.com'
        });

        expect(response.statusCode).toBe(401);
    });


});
