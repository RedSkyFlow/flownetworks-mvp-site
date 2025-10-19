const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwind = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');

const inputPath = path.resolve(__dirname, '..', 'public', 'css', 'input.css');
const outputPath = path.resolve(__dirname, '..', 'public', 'css', 'styles.css');

async function build() {
  try {
    const css = fs.readFileSync(inputPath, 'utf8');
  const result = await postcss([tailwind(), autoprefixer]).process(css, {
      from: inputPath,
      to: outputPath,
      map: { inline: false }
    });

    fs.writeFileSync(outputPath, result.css, 'utf8');
    if (result.map) fs.writeFileSync(outputPath + '.map', result.map.toString(), 'utf8');
    console.log('Tailwind CSS built to', outputPath);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

build();
