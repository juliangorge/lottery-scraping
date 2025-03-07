import { LotteryResults, ResultBlock } from "./interface";
import * as cheerio from "cheerio";

const timeRegex = /\(([^)]+)\)/;

/**
 * Scrapes lottery results for a given lottery.
 *
 * @param {string} lottery - The name of the lottery to scrape results for.
 * The following values are expected:
 *   - "ciudad"
 *   - "buenos-aires"
 *   - "entre-rios"
 *   - "montevideo"
 *   - "santa-fe"
 *   - "cordoba"
 *
 * @returns {Promise<ResultBlock[]>} - A promise that resolves to an array of scraped lottery results.
 */
const scrapeResults = async (lottery: string): Promise<ResultBlock[]> => {
  try {
    const response = await fetch("https://www.loteriasmundiales.com.ar/Quinielas/" + lottery);

    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);

      const resultsArray: ResultBlock[] = [];

      const resultBlocks = $(".w3-theme");

      resultBlocks.each((index, block) => {
        const resultObject: ResultBlock = { title: "" };
        const h3 = $(block).find("h3");

        if (h3.length > 0) {
          const title = h3.text().trim();
          resultObject.title = title;

          let currentElement = h3[0].nextSibling;
          let drawInfo = "";

          while (currentElement && !drawInfo.trim()) {
            if (currentElement && currentElement.nodeType === 3) {
              drawInfo = currentElement.nodeValue?.trim() || "";
            }
            currentElement = currentElement?.nextSibling || null;
          }

          if (drawInfo) {
            resultObject.drawInfo = drawInfo;

            const timeMatch = drawInfo.match(timeRegex);
            if (timeMatch) {
              resultObject.time = timeMatch[1];
            }
          }
        } else {
          resultObject.error = "No title found in this block";
          return;
        }

        const table = $(block).find(".w3-table-all");
        const results: LotteryResults = {};

        if (table.length > 0) {
          const rows = table.find("tr");

          rows.each((i, row) => {
            const cells = $(row).find("td");

            if (cells.length === 4) {
              const posA = cells.eq(0).text().trim();
              const resultA = cells.eq(1).text().trim();
              const posB = cells.eq(2).text().trim();
              const resultB = cells.eq(3).text().trim();

              if (/^\d+$/.test(posA)) {
                results[parseInt(posA)] = resultA;
              }
              if (/^\d+$/.test(posB)) {
                results[parseInt(posB)] = resultB;
              }
            }
          });

          resultObject.results = results;
        }

        resultsArray.push(resultObject);
      });

      return resultsArray;
    } else {
      throw new Error(`Error during the request: ${response.status}`);
    }
  } catch (error) {
    console.error("Error during the scraping:", error);
    throw error;
  }
};

export { scrapeResults };
