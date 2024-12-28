type Line = {
  left: string;
  right: string;
  out: string;
};

const outputPathCombine = (
  level: number,
  paths: ReadonlyArray<string>,
): ReadonlyArray<Line> => {
  if (paths.length <= 1) {
    return [];
  }

  const result: Line[] = [];
  const nextLevelPaths: string[] = [];

  for (let i = 0; i < paths.length; i += 2) {
    if (i + 1 < paths.length) {
      const out = `${level}-${i / 2}`;
      result.push({
        left: paths[i]!,
        right: paths[i + 1]!,
        out,
      });
      nextLevelPaths.push(out);
    } else {
      // 奇数個の場合、最後の要素を次のレベルへ
      nextLevelPaths.push(paths[i]!);
    }
  }

  return [...result, ...outputPathCombine(level + 1, nextLevelPaths)];
};

const path =
  "/Users/narumi/Library/Application Support/ModrinthApp/profiles/moripa-main/flashback/replays";

const filePaths = [];
for await (const file of Deno.readDir(path)) {
  if (file.name.startsWith(".")) {
    continue;
  }
  filePaths.push(file.name);
}
filePaths.sort();

Deno.writeTextFile(
  "./output.md",
  outputPathCombine(0, filePaths).map((line) =>
    `- [ ] ${line.left} -> ${line.right} = ${line.out}`
  ).join("\n"),
);
