// Define the structure of the results table
interface LotteryResults {
  [position: number]: string;
}

// Define the structure of each result block
interface ResultBlock {
  title: string;
  drawInfo?: string;
  time?: string;
  results?: LotteryResults;
  error?: string;
}

export type { LotteryResults };
export type { ResultBlock };
