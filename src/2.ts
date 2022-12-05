import { createReadStream } from "fs";
import { createInterface } from "readline";

function readInput() {
  const fileStream = createReadStream(`${__dirname}/2.input`);

  const lines = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  return lines;
}

// [Result, Total = Result + ChoiceValue]
const possibleRoundResult = {
  AX: [3, 4], // Rock vs Rock
  AY: [6, 8], // Rock vs Paper
  AZ: [0, 3], // Rock vs Scissor
  BX: [0, 1], // Paper vs Rock
  BY: [3, 5], // Paper vs Paper,
  BZ: [6, 9], // Paper vs Scissor,
  CX: [6, 7], // Scissor vs Rock,
  CY: [0, 2], // Scissor vs Paper,
  CZ: [3, 6], // Scissor vs Scissor
} as const;

async function part1() {
  let totalPoints: number = 0;

  const choicePoints = {
    X: 1, // Rock = 1
    Y: 2, // Paper = 2
    Z: 3, // Scissor = 3
  } as const;

  for await (const roundString of readInput()) {
    if (roundString.length === 0) {
      continue;
    }

    const [opponentChoice, myChoice] = roundString.split(" ") as [
      "A" | "B" | "C",
      "X" | "Y" | "Z"
    ];

    totalPoints +=
      possibleRoundResult[`${opponentChoice}${myChoice}`][0] +
      choicePoints[myChoice];
  }

  console.log(
    `PART1 -- In total we get "${totalPoints}" following the strategy guide`
  );
}

async function part2() {
  let totalPoints: number = 0;

  const expectedResultPoints = {
    X: 0, // Loose = 0
    Y: 3, // Draw = 3
    Z: 6, // Win = 6
  } as const;

  const possibleChoices = ["X", "Y", "Z"] as const;

  for await (const roundString of readInput()) {
    if (roundString.length === 0) {
      continue;
    }

    const [opponentChoice, expectedResult] = roundString.split(" ") as [
      "A" | "B" | "C",
      "X" | "Y" | "Z"
    ];

    const foundChoice = possibleChoices.find(
      (choice) =>
        possibleRoundResult[`${opponentChoice}${choice}`][0] ===
        expectedResultPoints[expectedResult]
    );

    if (foundChoice === undefined) {
      throw new Error("Should have found something");
    }

    totalPoints += possibleRoundResult[`${opponentChoice}${foundChoice}`][1];
  }

  console.log(
    `PART2 -- In total we get "${totalPoints}" following the strategy guide`
  );
}

part1()
  .catch(console.error)
  .then(() => part2())
  .catch(console.error);
