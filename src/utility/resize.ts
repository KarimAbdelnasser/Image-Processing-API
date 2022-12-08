import sharp from 'sharp';
const resize = async (
  existPath: string,
  width: number,
  height: number,
  thumbPath: string
): Promise<void> => {
  await sharp(existPath)
    .resize({
      width,
      height,
    })
    .toFile(thumbPath)
    .then(() => true)
    .catch(() => false);
};
export default resize;
