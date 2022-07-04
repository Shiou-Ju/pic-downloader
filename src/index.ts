import * as fs from 'fs';
import { Stream } from 'stream';
import axios from 'axios';
import { program } from 'commander';

const makeDirIfNotExist = async (filepath: string) => {
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
  program
    .requiredOption('--url <string>', '')
    .option('--filepath <string>', '', `${__dirname}/pics`);

  program.parse(process.argv);

  const options = program.opts();
  const { url, filepath } = options;

  if (!url) {
    throw new Error('no url');
  }

  makeDirIfNotExist(filepath);
  saveRandomImages(url, filepath, 1);
};

main();
