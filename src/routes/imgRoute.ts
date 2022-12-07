import express from 'express';
const router = express.Router();
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { verifyCache, cache, myQuery } from '../middleware/verifyCache';
router.get(
  '/img',
  verifyCache,
  async (req: express.Request, res: express.Response) => {
    const { filename } = req.query as myQuery;
    const chosenWidth = Number(req.query.width);
    const chosenHeight = Number(req.query.height);
    if (!filename) {
      return res
        .status(400)
        .send(
          `You have to select one of the existed images by put image's name in the query parameters !`
        );
    } else if (!chosenWidth || !chosenHeight) {
      console.log(`No width or height is given, send original image!`);
      return res
        .status(200)
        .setHeader('Content-Type', 'image/jpg')
        .sendFile(path.resolve(`./dist/images/${filename}.jpg`));
    }
    const cacheKey = `${filename}${chosenWidth}${chosenHeight}`;
    const imgPath = path.resolve(`./dist/images/${filename}.jpg`);
    const newImgPath = path.resolve(
      `./dist/thumb/${filename}${chosenWidth}${chosenHeight}_thumb.jpg`
    );
    await sharp(imgPath)
      .resize({
        width: chosenWidth,
        height: chosenHeight,
      })
      .toFile(newImgPath);
    const data = await fs.readFile(newImgPath);
    cache.set(cacheKey, data);
    res.status(201).setHeader('Content-Type', 'image/jpg').sendFile(newImgPath);
  }
);
export { router };
