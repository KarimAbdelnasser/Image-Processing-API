import { promises as fs } from 'fs';

const fileExist = async (path: string) => {
  try {
    return await fs.stat(path);
  } catch (err) {
    console.log(`${path} is not exist!`);
    return false;
  }
};
export default fileExist;
