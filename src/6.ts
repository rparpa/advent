import { readFileSync } from "fs";

async function part1() {
  const transmission = readFileSync(__dirname + "/6.input", "utf-8");

  const currentSequence: string[] = [];
  let charNumber: number = 0;

  for (const [position, char] of transmission.split("").entries()) {
    if (currentSequence.length === 4) {
      currentSequence.shift();
      currentSequence.push(char);
      if (new Set(currentSequence).size === 4) {
        charNumber = position + 1;
        break;
      }
    } else {
      currentSequence.push(char);
    }
  }

  console.log(`PART1 -- "${charNumber}"`);
}

async function part2() {
  const transmission = readFileSync(__dirname + "/6.input", "utf-8");

  const currentSequence: string[] = [];
  let charNumber: number = 0;

  for (const [position, char] of transmission.split("").entries()) {
    if (currentSequence.length === 14) {
      currentSequence.shift();
      currentSequence.push(char);
      if (new Set(currentSequence).size === 14) {
        charNumber = position + 1;
        break;
      }
    } else {
      currentSequence.push(char);
    }
  }

  console.log(`PART2 -- "${charNumber}`);
}

part1()
  .catch(console.error)
  .then(() => part2())
  .catch(console.error);
