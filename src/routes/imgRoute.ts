import express from 'express';
const router = express.Router();
import { promises as fs } from 'fs';
import path from 'path';
import { verifyCache, cache } from '../middleware/verifyCache';
import resize from '../utility/resize';
import fileExist from '../utility/fileExist';

interface myQuery {
  filename?: string;
}

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
    }
    const exist = await fileExist(
      path.join(__dirname, '..', '..', 'dist', 'images', `${filename}.jpg`)
    );

    if (!exist) {
      return res
        .status(400)
        .send(`Could not find an image with the given filename!`);
    } else if (
      !chosenWidth ||
      !chosenHeight ||
      isNaN(chosenWidth) ||
      isNaN(chosenHeight) ||
      chosenWidth <= 0 ||
      chosenHeight <= 0
    ) {
      console.log(`No width or height is given, send original image!`);
      return res
        .status(200)
        .setHeader('Content-Type', 'image/jpg')
        .sendFile(
          path.join(__dirname, '..', '..', 'dist', 'images', `${filename}.jpg`)
        );
    }
    const cacheKey = `${filename}${chosenWidth}${chosenHeight}`;
    const imgPath = path.join(
      __dirname,
      '..',
      '..',
      'dist',
      'images',
      `${filename}.jpg`
    );
    const newImgPath = path.join(
      __dirname,
      '..',
      '..',
      'dist',
      'thumb',
      `${filename}${chosenWidth}${chosenHeight}_thumb.jpg`
    );
    await resize(imgPath, chosenWidth, chosenHeight, newImgPath);
    const data = await fs.readFile(newImgPath);
    cache.set(cacheKey, data);
    res.status(201).setHeader('Content-Type', 'image/jpg').sendFile(newImgPath);
  }
);
export { router, myQuery };
