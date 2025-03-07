# Lottery Scraping

A Node.js package for scraping lottery results.

## Installation

```bash
npm install @juliangorge/lottery-scraping
# or
yarn add @juliangorge/lottery-scraping
```

## Features

- Scrapes lottery results from specified sources
- Supports both CommonJS and ESM imports
- Browser compatible
- TypeScript support with type definitions included
- Minified builds for optimal performance

## Usage

### ESM Import

```javascript
import { scrapeResults } from "@juliangorge/lottery-scraping";

async function getLotteryResults() {
  const results = await scrapeResults();
  console.log(results);
}
```

### CommonJS Require

```javascript
const { scrapeResults } = require("@juliangorge/lottery-scraping");

async function getLotteryResults() {
  const results = await scrapeResults();
  console.log(results);
}
```

## API Reference

### `scrapeResults()`

Fetches and parses lottery results.

**Returns**: `Promise<Array>` - An array of lottery results

## Building

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build package
npm run build
```

## Testing

The package includes a comprehensive test suite. Run tests using:

```bash
npm test
```

## License

MIT © [Julian Gorge](https://github.com/juliangorge)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Repository

https://github.com/juliangorge/lottery-scraping
