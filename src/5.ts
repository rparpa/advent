import { createReadStream } from "fs";
import { createInterface, Interface } from "readline";
import { LetterUppercase } from "./types/Letter";

function readInput() {
  const fileStream = createReadStream(`${__dirname}/5.input`);

  const lines = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  return lines;
}

async function initStacks(
  lineIterator: Interface
): Promise<Map<number, LetterUppercase[]>> {
  const stacks: Map<number, LetterUppercase[]> = new Map();
  const initContent: string[] = [];

  for await (const line of lineIterator) {
    const isLastStackLineContent = line.length === 0;

    if (!isLastStackLineContent) {
      initContent.push(line);
      continue;
    }

    const stackPositions: Map<number, number> = new Map();
    initContent
      .pop()
      ?.split("")
      .forEach((value, position) => {
        const key = Number(value);
        if (key >= 1) {
          stackPositions.set(position, key);
          stacks.set(key, []);
        }
      });

    initContent.reverse().forEach((lineContent) => {
      for (const [position, key] of stackPositions.entries()) {
        if (lineContent[position] === " ") {
          continue;
        }
        stacks.get(key)?.push(lineContent[position] as LetterUppercase);
      }
    });

    break;
  }

  return stacks;
}

async function part1() {
  const lineIterator = readInput();
  const stacks = await initStacks(lineIterator);
  for await (const moveLine of lineIterator) {
    if (moveLine.length === 0) {
      continue;
    }

    const [numberOfCratesToMove, from, to] = moveLine
      .split(" ")
      .map(Number)
      .filter((number) => !isNaN(number));

    const fromStack = stacks.get(from);
    const toStack = stacks.get(to);
    const restack: LetterUppercase[] = [];
    for (let moveIndex = 0; moveIndex < numberOfCratesToMove; moveIndex++) {
      const removed = fromStack?.pop();
      if (removed) {
        // crates are moved one by one
        restack.push(removed);
      }
    }

    toStack?.push(...restack);
  }
  console.log(
    `PART1 -- "${Array.from(stacks.values())
      .map((stack) => stack.pop())
      .join("")}"`
  );
}

async function part2() {
  const lineIterator = readInput();
  const stacks = await initStacks(lineIterator);
  for await (const moveLine of lineIterator) {
    if (moveLine.length === 0) {
      continue;
    }

    const [numberOfCratesToMove, from, to] = moveLine
      .split(" ")
      .map(Number)
      .filter((number) => !isNaN(number));

    const fromStack = stacks.get(from);
    const toStack = stacks.get(to);
    const restack: LetterUppercase[] = [];
    for (let moveIndex = 0; moveIndex < numberOfCratesToMove; moveIndex++) {
      const removed = fromStack?.pop();
      if (removed) {
        // crates are moved by batch
        restack.unshift(removed);
      }
    }

    toStack?.push(...restack);
  }
  console.log(
    `PART2 -- "${Array.from(stacks.values())
      .map((stack) => stack.pop())
      .join("")}"`
  );
}

part1()
  .catch(console.error)
  .then(() => part2())
  .catch(console.error);
