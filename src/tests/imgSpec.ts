import app from "../server";
import supertest from "supertest";
const request = supertest(app);

describe("Test endpoint responses", () => {
    it("Should return a status code 200", async () => {
        const response = await request.get("/img").query({
            filename: "icelandwaterfall",
        });
        expect(response.status).toBe(200);
    });
    it("Should return a status code 201", async () => {
        const response = await request.get("/img").query({
            filename: "icelandwaterfall",
            width: 200,
            height: 200,
        });
        expect(response.status).toBe(201);
    });
    it("Should return a status code 400", async () => {
        const response = await request.get("/img");
        expect(response.status).toBe(400);
    });
    it("Should return true", async () => {
        await request
            .get("/img")
            .query({
                filename: "icelandwaterfall",
                width: 300,
                height: 300,
            })
            .expect("Content-Type", /image/);
    });
});
