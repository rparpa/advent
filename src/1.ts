import { createReadStream } from "fs";
import { createInterface } from "readline";

async function main() {
  const fileStream = createReadStream(`${__dirname}/1.input`);

  const lines = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let topCalories: number[] = [];
  let elfCalories = 0;
  for await (const line of lines) {
    const currentCalories = Number(line);
    if (currentCalories === 0) {
      // next elf
      topCalories.push(elfCalories);
      elfCalories = 0;
    }

    if (line) {
      elfCalories += Number(line);
    }
  }

  topCalories = topCalories.sort((a, b) => b - a).slice(0, 3);

  let total = 0;
  topCalories.forEach((calories) => {
    total += calories;
    console.log(`Elf transporting the most calories: "${calories}"`);
  });

  console.log(`In total top three is transporting: ${total}`);
}

main().catch(console.error);
