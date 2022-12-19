import { createReadStream } from "fs";
import { createInterface } from "readline";

function readInput(input: string) {
  const fileStream = createReadStream(`${__dirname}/${input}`);

  const lines = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  return lines;
}

interface IFileSystem {
  name: string;
  size: number;
  isDirectory: boolean;
  children: Map<string, IFileSystem>;
  parent: IFileSystem | null;
  depth: number;
}

function pushChild(parent: IFileSystem, child: IFileSystem): IFileSystem {
  child.name =
    parent.name === "/" ? `/${child.name}` : `${parent.name}/${child.name}`;
  const existingChild = parent.children.get(child.name);
  if (existingChild) {
    return existingChild;
  }

  parent.children.set(child.name, child);

  if (child.isDirectory) {
    return child;
  }

  let currentParent: IFileSystem | null = parent;

  while (currentParent !== null) {
    currentParent.size += child.size;
    currentParent = currentParent.parent;
  }

  return child;
}

async function createFileSystemTree(input: string): Promise<IFileSystem> {
  let lineNumber = 0;
  const fileSystem: IFileSystem = {
    name: "/",
    size: 0,
    isDirectory: true,
    children: new Map(),
    parent: null,
    depth: 0,
  };

  let currentFileSystem: IFileSystem = fileSystem;
  for await (const consoleHistoryLine of readInput(input)) {
    lineNumber++;
    if (lineNumber === 1) {
      // First line is useless, always starting with the same command
      continue;
    }

    const isCommand = consoleHistoryLine[0] === "$";
    if (isCommand) {
      const [_, command, argument] = consoleHistoryLine.split(" ");
      if (consoleHistoryLine === "$ cd ..") {
        if (currentFileSystem.parent === null) {
          throw new Error("No parent when cd ..");
        }
        currentFileSystem = currentFileSystem.parent;
      } else if (command === "cd") {
        const childFileSystem: IFileSystem = {
          name: argument,
          size: 0,
          children: new Map(),
          parent: currentFileSystem,
          isDirectory: true,
          depth: currentFileSystem.depth + 1,
        };
        currentFileSystem = pushChild(currentFileSystem, childFileSystem);
      } else if (command === "ls") {
        // nothing to do
      }
    } else {
      // ls result lines
      const [sizeOrDir, name] = consoleHistoryLine.split(" ");
      const size = Number(sizeOrDir);
      const isDirectory = isNaN(size);

      pushChild(currentFileSystem, {
        name,
        size: isDirectory ? 0 : size,
        isDirectory,
        children: new Map(),
        parent: currentFileSystem,
        depth: currentFileSystem.depth + 1,
      });
    }
  }

  return fileSystem;
}

function printFileSystem(fileSystem: IFileSystem) {
  const visited: Set<string> = new Set();

  let currentDirectory: IFileSystem | undefined;
  const nextDirectoriesToVisit: IFileSystem[] = [fileSystem];

  while ((currentDirectory = nextDirectoriesToVisit.pop())) {
    if (visited.has(currentDirectory.name)) {
      continue;
    }

    visited.add(currentDirectory.name);
    console.log(
      " ".repeat(currentDirectory.depth) +
        " - " +
        currentDirectory.name +
        (currentDirectory.isDirectory
          ? `(dir, sum=${currentDirectory.size})`
          : `(file, size=${currentDirectory.size})`)
    );

    for (const child of currentDirectory.children.values()) {
      nextDirectoriesToVisit.push(child);
    }
  }
}

function findAllDirectoriesMatchingSize(
  fileSystem: IFileSystem,
  sizeCondition: (size: number) => boolean
): IFileSystem[] {
  const visited: Set<string> = new Set();

  let currentDirectory: IFileSystem | undefined;
  const nextDirectoriesToVisit: IFileSystem[] = [fileSystem];
  const foundDirectories: IFileSystem[] = [];

  while ((currentDirectory = nextDirectoriesToVisit.pop())) {
    if (visited.has(currentDirectory.name)) {
      continue;
    }

    visited.add(currentDirectory.name);

    if (sizeCondition(currentDirectory.size) && currentDirectory.name !== "/") {
      foundDirectories.push(currentDirectory);
    }

    for (const child of currentDirectory.children.values()) {
      if (!child.isDirectory) {
        continue;
      }
      nextDirectoriesToVisit.push(child);
    }
  }
  return foundDirectories;
}

async function example() {
  const fileSystemTree = await createFileSystemTree("7.example.input");
  printFileSystem(fileSystemTree);
}

async function part1() {
  const fileSystemTree = await createFileSystemTree("7.input");
  const foundDirectories = findAllDirectoriesMatchingSize(
    fileSystemTree,
    (size) => size <= 100000
  );

  console.log(
    `PART1 -- "${foundDirectories.reduce(
      (total, directory) => total + directory.size,
      0
    )}"`
  );
}

async function part2() {
  const fileSystemTree = await createFileSystemTree("7.input");
  const totalDiskSpace = 70000000;
  const freeSpace = totalDiskSpace - fileSystemTree.size;
  const sizeToDelete = 30000000 - freeSpace;
  let smallestDirectoryFound = fileSystemTree;

  for (const directory of findAllDirectoriesMatchingSize(
    fileSystemTree,
    (size) => size >= sizeToDelete
  )) {
    if (directory.size <= smallestDirectoryFound.size) {
      smallestDirectoryFound = directory;
    }
  }

  console.log("PART2", "free space", freeSpace);
  console.log("PART2", "size to delete", sizeToDelete);
  console.log("PART2", "directory to delete", smallestDirectoryFound.name);
  console.log(`PART2 -- "${smallestDirectoryFound.size}"`);
}

example()
  .catch(console.error)
  .then(() => part1())
  .catch(console.error)
  .then(() => part2())
  .catch(console.error);
