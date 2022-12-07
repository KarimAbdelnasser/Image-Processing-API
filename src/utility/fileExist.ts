import { promises as fs } from 'fs';

const fileExist = (path: string) => {
  return fs
    .access(path, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
};
export default fileExist;
