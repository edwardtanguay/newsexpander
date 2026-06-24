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
  const terms = fileContent
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      const semiIndex = line.indexOf(';');
      if (semiIndex === -1) {
        return { name: line, description: '' };
      }
      const name = line.substring(0, semiIndex).trim()
      const description = line.substring(semiIndex + 1).trim()
      let formattedDescription = description
      
      if (description.length > 0) {
        const lastChar = description[description.length - 1]
        if (!['.', '!', '?'].includes(lastChar)) {
          formattedDescription = description + '.'
        }
      }
      
      return {
        name,
        description: formattedDescription
      };
    });

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFilePath, JSON.stringify(terms, null, 2), 'utf-8');
  console.log(`Successfully parsed ${terms.length} terms to ${outputFilePath}`);
} catch (error) {
  console.error('Error parsing data:', error);
  process.exit(1);
}
