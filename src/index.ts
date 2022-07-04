import * as fs from 'fs';
import { Stream } from 'stream';
import axios from 'axios';
import { program } from 'commander';
import { v4 as uuidv4 } from 'uuid';

const makeDirIfNotExist = async (filepath: string) => {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
  }
};

const saveRandomImages = async (url: string, filepath: string) => {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  const file = response.data as Stream;

  const id = uuidv4();
  const fileName = `${filepath}/${id}.jpeg`;

  new Promise((resolve, reject) => {
    file
      .pipe(fs.createWriteStream(fileName))
      .on('error', reject)
      .once('close', () => {
        resolve(filepath);
      });
  });
};

const generateCommandOptions = () => {
  program
    .requiredOption('--url <string>', 'Url to get')
    .option(
      '--filepath <string>',
      'Filepath to save the pic',
      `${__dirname}/pics`
    )
    .option('--looptimes <number>', 'Pics to get', Number, 1);

  program.parse(process.argv);

  const options = program.opts();

  return options;
};

const validateUrlAndLoopTimes = (loopTimes: number, url: string) => {
  if (!Number.isInteger(loopTimes)) {
    throw new Error('loop times is not an integer');
  }

  if (!url) {
    throw new Error('no url');
  }
};

const main = () => {
  const options = generateCommandOptions();
  const { url, filepath, looptimes: loopTimes } = options;

  validateUrlAndLoopTimes(loopTimes, url);

  makeDirIfNotExist(filepath);

  let time = 0;
  const loop = setInterval(() => {
    saveRandomImages(url, filepath);
    time++;
    console.log(time);
    if (time === loopTimes) {
      clearInterval(loop);
    }
  }, 1000);
};

main();
