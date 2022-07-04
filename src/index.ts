import axios from 'axios';
import * as fs from 'fs';
import { Stream } from 'stream';

const url = '';
const filepath = `${__dirname}/pics`;

const makeDirIfNotExist = async () => {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
  }
};

const saveRandomImages = async (
  url: string,
  filepath: string,
  times: number
) => {
  for (let time = 0; time < times; time++) {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    const file = response.data as Stream;

    const fileName = `${filepath}/${new Date()}.jpeg`;

    new Promise((resolve, reject) => {
      file
        .pipe(fs.createWriteStream(fileName))
        .on('error', reject)
        .once('close', () => {
          resolve(filepath);
        });
    });
  }
};

const main = () => {
  saveRandomImages(url, filepath, 1);
  makeDirIfNotExist();
};

main();
