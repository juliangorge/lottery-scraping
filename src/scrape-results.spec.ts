import { scrapeResults } from './scrape-results';

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  text: async () => '<html><body>Your sample HTML with lottery data here</body></html>',
} as any);

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  (console.error as jest.Mock).mockRestore();
});

describe('scrapeResults', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return an empty array when there is no .w3-theme element in the HTML', async () => {
    // Simulate an HTML response with no lottery data
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => '<html><body>No lottery data here</body></html>',
    } as any);
    
    const result = await scrapeResults('ciudad');
    expect(result).toEqual([]);
  });

  it('should throw an error when the response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => '',
    } as any);
    
    await expect(scrapeResults('ciudad')).rejects.toThrow('Error during the request: 404');
  });

  it('should return parsed result blocks when valid HTML is provided', async () => {
    // Sample HTML with one lottery block
    const sampleHtml = `
      <html>
        <body>
          <div class="w3-theme">
            <h3>Test Lottery</h3>
            (12:34 PM)
            <table class="w3-table-all">
              <tr>
                <td>1</td><td>50</td><td>2</td><td>60</td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => sampleHtml,
    } as any);
    
    const result = await scrapeResults('ciudad');
    expect(result.length).toBe(1);
    const block = result[0];
    expect(block.title).toBe('Test Lottery');
    // drawInfo should include the time string (extracted from the text node)
    expect(block.drawInfo).toContain('12:34 PM');
    // time property should be exactly the matched time
    expect(block.time).toBe('12:34 PM');
    // Verify the parsed lottery results from the table row
    expect(block.results).toEqual({
      1: '50',
      2: '60'
    });
  });

  it('should skip invalid rows in the table and only process numeric positions', async () => {
    // In this HTML, one row has a non-numeric first cell that should be skipped
    const sampleHtml = `
      <html>
        <body>
          <div class="w3-theme">
            <h3>Test Lottery</h3>
            (09:00 AM)
            <table class="w3-table-all">
              <tr>
                <td>1</td><td>45</td><td>2</td><td>55</td>
              </tr>
              <tr>
                <td>Not a number</td><td>?</td><td>3</td><td>65</td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => sampleHtml,
    } as any);
    
    const result = await scrapeResults('ciudad');
    expect(result.length).toBe(1);
    const block = result[0];
    // Expect only valid numeric cells to be added
    expect(block.results).toEqual({
      1: '45',
      2: '55',
      3: '65'
    });
  });
});
