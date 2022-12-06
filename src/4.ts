import { createReadStream } from "fs";
import { createInterface } from "readline";

function readInput() {
  const fileStream = createReadStream(`${__dirname}/4.input`);

  const lines = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  return lines;
}

async function part1() {
  let assignmentDuplicateNumber = 0;
  for await (const line of readInput()) {
    if (line.length === 0) {
      continue;
    }

    const [firstRangeString, secondRangeString] = line.split(",");
    const [firstRangeMin, firstRangeMax] = firstRangeString
      .split("-")
      .map(Number);

    const [secondRangeMin, secondRangeMax] = secondRangeString
      .split("-")
      .map(Number);

    if (firstRangeMin <= secondRangeMin && firstRangeMax >= secondRangeMax) {
      assignmentDuplicateNumber++;
    } else if (
      secondRangeMin <= firstRangeMin &&
      secondRangeMax >= firstRangeMax
    ) {
      assignmentDuplicateNumber++;
    }
  }
  console.log(`PART1 -- In total we get "${assignmentDuplicateNumber}"`);
}

async function part2() {
  let overlapNumber = 0;
  for await (const line of readInput()) {
    if (line.length === 0) {
      continue;
    }

    const [firstRangeString, secondRangeString] = line.split(",");
    const [firstRangeMin, firstRangeMax] = firstRangeString
      .split("-")
      .map(Number);

    const [secondRangeMin, secondRangeMax] = secondRangeString
      .split("-")
      .map(Number);

    if (
      (firstRangeMin >= secondRangeMin && firstRangeMin <= secondRangeMax) ||
      (firstRangeMax >= secondRangeMin && firstRangeMax <= secondRangeMax)
    ) {
      overlapNumber++;
    } else if (
      (secondRangeMin >= firstRangeMin && secondRangeMin <= firstRangeMax) ||
      (secondRangeMax >= firstRangeMin && secondRangeMax <= firstRangeMax)
    ) {
      overlapNumber++;
    }
  }
  console.log(`PART2 -- In total we get "${overlapNumber}"`);
}

part1()
  .catch(console.error)
  .then(() => part2())
  .catch(console.error);
