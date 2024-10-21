import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default JSON.parse(fs.readFileSync(path.join(dirname, '../.env'), { encoding: 'utf-8' }));

/**
 * __dirname. Just pass import.meta.url.
 * Fuck this.
 */
export function __dirname(url) {
  const filename = fileURLToPath(url);
  return path.dirname(filename);
}

