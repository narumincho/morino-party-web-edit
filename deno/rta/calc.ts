import scoreListJson from "./scoreList.json" with { type: "json" };
import { distinctBy } from "@std/collections";

const formatScoreValue = (scoreValue: number): string => {
  const minute = Math.floor(scoreValue / (60 * 1000));
  return `${Math.floor(scoreValue / (60 * 1000))}分${
    (Math.floor(scoreValue / 1000) - minute * 60).toString().padStart(2, "0")
  }秒`;
};

const rankToString = (rankBase1: number): string => {
  switch (rankBase1) {
    case 1:
      return ":first_place: 1位";
    case 2:
      return ":second_place: 2位";
    case 3:
      return ":third_place: 3位";
    default:
      return `${rankBase1}位`;
  }
};

const calcScoreValue = (
  { startTimestamp, endTimestamp }: {
    startTimestamp: string;
    endTimestamp: string;
  },
): number => {
  return new Date(endTimestamp).getTime() -
    new Date(startTimestamp).getTime();
};

const messages: ReadonlyArray<
  {
    readonly embeds: ReadonlyArray<
      {
        readonly fields: ReadonlyArray<
          { readonly name: string; readonly value: string }
        >;
      }
    >;
    readonly timestamp: string;
  }
> = JSON.parse(
  await Deno.readTextFile(new URL(import.meta.resolve("./messages.json"))),
);

type PickedMessage = {
  readonly type: "start" | "goal";
  readonly player: string;
  readonly timestamp: string;
};

type Score = {
  readonly startTimestamp: string;
  readonly endTimestamp: string;
  readonly player: string;
};

const pickedMessages = messages.flatMap(
  (message): readonly [] | readonly [PickedMessage] => {
    const embed = message.embeds.at(0);
    if (!embed) {
      return [];
    }
    const shop = embed.fields.find((field) => field.name === "ショップ")
      ?.value;
    const seller = embed.fields.find((field) => field.name === "売却者")?.value;
    if (!seller) {
      return [];
    }
    switch (shop) {
      case "world -9589, 219, -1567":
        return [{ type: "goal", player: seller, timestamp: message.timestamp }];
      case "world -9617, 63, -1568":
        return [{
          type: "start",
          player: seller,
          timestamp: message.timestamp,
        }];
      default:
        return [];
    }
  },
).toSorted((a, b) =>
  new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
);

const playerStartTimestampMap = new Map<string, string>();
const scoreList: Array<Score> = [];

for (const message of pickedMessages) {
  switch (message.type) {
    case "start": {
      playerStartTimestampMap.set(message.player, message.timestamp);
      break;
    }
    case "goal": {
      const startTimestamp = playerStartTimestampMap.get(message.player);
      if (!startTimestamp) {
        console.warn("入場通知本を買っていない?", message);
      } else {
        scoreList.push({
          startTimestamp,
          endTimestamp: message.timestamp,
          player: message.player,
        });
      }
      break;
    }
  }
}

const allScoreList: ReadonlyArray<Score> = distinctBy(
  [...scoreListJson, ...scoreList],
  (score) => JSON.stringify(score),
);

await Deno.writeTextFile(
  new URL(import.meta.resolve("./scoreList.json")),
  JSON.stringify(allScoreList, undefined, 2),
);

const playerScoreCount = new Map<string, number>();
const playerBestScore = new Map<
  string,
  { score: Score; index: number; scoreValue: number }
>();

for (const score of allScoreList) {
  const index = playerScoreCount.get(score.player) ?? 0;
  playerScoreCount.set(score.player, index + 1);
  const scoreValue = calcScoreValue(score);
  const oldScore = playerBestScore.get(score.player)?.score;
  if (oldScore) {
    const oldScoreValue = new Date(oldScore.endTimestamp).getTime() -
      new Date(oldScore.startTimestamp).getTime();
    if (scoreValue < oldScoreValue) {
      playerBestScore.set(score.player, { score, index, scoreValue });
    }
  } else {
    playerBestScore.set(score.player, { score, index, scoreValue });
  }
}

const sortedScore = [...playerBestScore.values()].toSorted((a, b) =>
  a.scoreValue - b.scoreValue
);

await Deno.writeTextFile(
  new URL(import.meta.resolve("./result.md")),
  sortedScore
    .map(({ index, score, scoreValue }, rank) => {
      // 最速以外のタイムも出力する
      const rankBase1 = rank + 1;
      return `# ${rankToString(rankBase1)} ${score.player} ${
        formatScoreValue(scoreValue)
      }
${Math.ceil(10000 / rankBase1)}:donguri:
${
        allScoreList.filter((e) => e.player === score.player).map((e, i) =>
          `- ${
            new Intl.DateTimeFormat("ja", {
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(
              new Date(e.startTimestamp),
            )
          }〜 ${formatScoreValue(calcScoreValue(e))}${
            i === index ? " :white_check_mark:" : ""
          }`
        ).join("\n")
      }
`;
    }).join("\n\n"),
);
