import express from "express";
import { promises as fs } from "fs";
import sharp from "sharp";
import NodeCache from "node-cache";

const cache = new NodeCache();
const PORT = 8080;
const app = express();

interface myQuery {
    filename?: string;
}

//middleware
const verifyCache = (
    req: express.Request,
    res: express.Response,
    next: Function
) => {
    try {
        const { filename } = req.query as myQuery;
        const chosenWidth: number = Number(req.query.width);
        const chosenHeight: number = Number(req.query.height);
        const name: string = `${filename}${chosenWidth}${chosenHeight}`;
        if (cache.has(name)) {
            console.log(`cached image with name ${name} has been found`);
            return res
                .status(200)
                .setHeader("Content-Type", "image/jpg")
                .send(cache.get(name));
        }
        console.log(
            `Could not find an image with name ${name} in cached images!`
        );
        return next();
    } catch (err) {
        console.log(err);
    }
};

//image route
app.get("/img", verifyCache, async (req, res) => {
    const { filename } = req.query as myQuery;
    const chosenWidth: number = Number(req.query.width);
    const chosenHeight: number = Number(req.query.height);
    if (!filename) {
        return res
            .status(400)
            .send(
                `Could not find an image with the given file name ${filename}!`
            );
    } else if (!chosenWidth || !chosenHeight) {
        console.log(`No width or height is given, send original image!`);
        return res
            .status(200)
            .setHeader("Content-Type", "image/jpg")
            .sendFile(__dirname + `/images/${filename}.jpg`);
    }
    let myName: string = `${filename}${chosenWidth}${chosenHeight}`;
    let imgPath = __dirname + `/images/${filename}.jpg`;
    let newImgPath = `${__dirname}/thumb/${filename}${chosenWidth}${chosenHeight}_thumb.jpg`;
    await sharp(imgPath)
        .resize({
            width: chosenWidth,
            height: chosenHeight,
        })
        .toFile(newImgPath);
    const data = await fs.readFile(newImgPath);
    cache.set(myName, data);
    res.status(201).setHeader("Content-Type", "image/jpg").sendFile(newImgPath);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});

export default app;