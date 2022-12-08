import express from 'express';
import NodeCache from 'node-cache';
const cache = new NodeCache();
import { myQuery } from '../routes/imgRoute';

const verifyCache = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): unknown => {
  try {
    const { filename } = req.query as myQuery;
    const chosenWidth = Number(req.query.width);
    const chosenHeight = Number(req.query.height);
    const cacheKey = `${filename}-${chosenWidth}-${chosenHeight}`;
    if (cache.has(cacheKey)) {
      console.log(`cached image with name ${cacheKey} has been found`);
      return res
        .status(200)
        .setHeader('Content-Type', 'image/jpg')
        .send(cache.get(cacheKey));
    }
    console.log(
      `Could not find an image with name ${cacheKey} in cached images!`
    );
    return next();
  } catch (err) {
    console.log(err);
  }
};
export { verifyCache, cache };
