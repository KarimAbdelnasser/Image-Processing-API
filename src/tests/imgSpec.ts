import app from '../server';
import supertest from 'supertest';
const request = supertest(app);
import resize from '../utility/resize';
import path from 'path';

describe('Test endpoint responses', () => {
  it('Should return a status code 200, response with the original image if the width or the height are missing', async () => {
    const response = await request.get('/img').query({
      filename: 'icelandwaterfall',
    });
    expect(response.status).toBe(200);
  });
  it("Should return a status code 200, response with the original image if the width or the height isn't a valid number", async () => {
    const response = await request.get('/img').query({
      filename: 'icelandwaterfall',
      width: 0,
      height: 200,
    });
    expect(response.status).toBe(200);
  });
  it('Should return a status code 201', async () => {
    const response = await request.get('/img').query({
      filename: 'icelandwaterfall',
      width: 200,
      height: 200,
    });
    expect(response.status).toBe(201);
  });
  it('Should return a status code 400, response with a bad request error for missing the filename', async () => {
    const response = await request.get('/img');
    expect(response.status).toBe(400);
  });
  it('Should return true', async () => {
    await request
      .get('/img')
      .query({
        filename: 'icelandwaterfall',
        width: 300,
        height: 300,
      })
      .expect('Content-Type', /image/);
  });
  it('Should return a status code 400, response with a bad request error because of the invalid filename', async () => {
    const response = await request.get('/img?filename=fjords');
    expect(response.status).toBe(400);
  });
});

describe('test the resizing function', () => {
  it('should resize the selected image successfully and be truthy', async () => {
    const resizing = await resize(
      path.resolve(`./dist/images/fjord.jpg`),
      100,
      100,
      path.resolve(`./dist/thumb/fjord100100_thumb.jpg`)
    );
    expect(resizing).toBeTruthy;
  });
  it('the resize function should not work and return false because of the invalid filename', async () => {
    const resizing = await resize(
      path.resolve(`./dist/images/fjords.jpg`),
      100,
      100,
      path.resolve(`./dist/thumb/fjord100100_thumb.jpg`)
    );
    expect(resizing).toBeFalsy;
  });
});
