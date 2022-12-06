import { createReadStream } from "fs";
import { createInterface } from "readline";
import { Letter } from "./types/Letter";

function readInput() {
  const fileStream = createReadStream(`${__dirname}/3.input`);

  const lines = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  return lines;
}

const itemTypePriorities: { [property in Letter]: number } = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8,
  i: 9,
  j: 10,
  k: 11,
  l: 12,
  m: 13,
  n: 14,
  o: 15,
  p: 16,
  q: 17,
  r: 18,
  s: 19,
  t: 20,
  u: 21,
  v: 22,
  w: 23,
  x: 24,
  y: 25,
  z: 26,
  A: 27,
  B: 28,
  C: 29,
  D: 30,
  E: 31,
  F: 32,
  G: 33,
  H: 34,
  I: 35,
  J: 36,
  K: 37,
  L: 38,
  M: 39,
  N: 40,
  O: 41,
  P: 42,
  Q: 43,
  R: 44,
  S: 45,
  T: 46,
  U: 47,
  V: 48,
  W: 49,
  X: 50,
  Y: 51,
  Z: 52,
} as const;

async function part1() {
  let totalPriority = 0;
  for await (const rucksacks of readInput()) {
    const rucksackSize = rucksacks.length / 2;
    if (rucksackSize === 0) {
      continue;
    }

    const itemFound: Map<Letter, boolean> = new Map();
    const rucksacksContent = rucksacks.split("") as Letter[];
    let index = 0;
    for (const item of rucksacksContent) {
      const isFirstRucksack = index < rucksackSize;
      index++;
      if (isFirstRucksack) {
        itemFound.set(item, true);
      } else if (itemFound.has(item)) {
        totalPriority += itemTypePriorities[item];
        break;
      }
    }
  }

  console.log(
    `PART1 -- In total we get "${totalPriority}" for the missing elf items`
  );
}

async function part2() {
  let totalPriority = 0;
  let elfIndex = 0;
  let previouslyFoundItems: Letter[] = [];
  for await (const rucksacks of readInput()) {
    elfIndex++;

    const rucksackSize = rucksacks.length / 2;
    if (rucksackSize === 0) {
      continue;
    }

    const rucksacksContent = rucksacks.split("") as Letter[];
    if (previouslyFoundItems.length === 0) {
      previouslyFoundItems = [...rucksacksContent];
    } else {
      previouslyFoundItems = previouslyFoundItems.filter((item) =>
        rucksacksContent.includes(item)
      );
    }

    if (elfIndex % 3 === 0) {
      if (previouslyFoundItems[0] === undefined) {
        throw new Error("No badge found");
      }

      totalPriority += itemTypePriorities[previouslyFoundItems[0]];
      previouslyFoundItems = [];
    }
  }

  console.log(
    `PART2 -- In total we get "${totalPriority}" for the missing elf items`
  );
}

part1()
  .catch(console.error)
  .then(() => part2())
  .catch(console.error);
