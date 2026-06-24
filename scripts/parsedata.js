import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const termsFilePath = path.join(rootDir, 'terms.txt');
const outputDir = path.join(rootDir, 'src', 'data');
const outputFilePath = path.join(outputDir, 'terms.json');

try {
  if (!fs.existsSync(termsFilePath)) {
    console.error(`Error: terms.txt not found at ${termsFilePath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(termsFilePath, 'utf-8');
  const rawLines = fileContent.split(/\r?\n/);
  const linesToParse = [];
  for (const line of rawLines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('TODO') || trimmed.startsWith('`TODO') || trimmed.startsWith('``TODO')) {
      break;
    }
    linesToParse.push(trimmed);
  }

  const terms = linesToParse
    .filter(line => line.length > 0)
    .map(line => {
      const fields = line.split(';').map(field => field.trim()).filter(field => field.length > 0);
      if (fields.length === 0) {
        return null;
      }
      
      const name = fields[0];
      const showAll = fields.some(field => field.startsWith('$'));
      
      let description = '';
      if (fields.length > 1 && !fields[1].startsWith('$')) {
        description = fields[1];
      }
      
      let formattedDescription = description;
      if (description.length > 0) {
        const lastChar = description[description.length - 1];
        if (!['.', '!', '?'].includes(lastChar)) {
          formattedDescription = description + '.';
        }
      }
      
      return {
        name,
        description: formattedDescription,
        showAll
      };
    })
    .filter(Boolean);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFilePath, JSON.stringify(terms, null, 2), 'utf-8');
  console.log(`Successfully parsed ${terms.length} terms to ${outputFilePath}`);
} catch (error) {
  console.error('Error parsing data:', error);
  process.exit(1);
}
