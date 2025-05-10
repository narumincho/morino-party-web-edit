import type { Result } from "./type.ts";

export function calcMoney<Player extends string>(
  { items, endTime, tasks, eggs }: Pick<
    Result<Player>,
    "items" | "endTime" | "tasks" | "eggs"
  >,
  player: Player,
): number {
  if (tasks && !tasks.find((task) => task.player === player)?.time) {
    return 0;
  }
  const eggCount = eggs.filter((egg) => egg.player === player).length;

  let money = 0;
  /**
   * 前回の捕まっていない状態時刻
   * null は前回鬼もしくは退出状態だったということ
   */
  let prevState: number | "oni" | "escaped" | "escapedOni" = 0;
  for (const item of items) {
    switch (item.type) {
      case "touch":
        if (item.to === player) {
          if (typeof prevState === "number") {
            money += item.time - prevState;
          }
          prevState = "oni";
        }
        if (item.from === player) {
          prevState = item.time;
        }
        break;
      case "oniChange":
        break;
      case "exit":
        if (item.player === player) {
          if (typeof prevState === "number") {
            money += item.time - prevState;
            prevState = "escaped";
          } else {
            prevState = "escapedOni";
          }
        }
        break;
      case "enter":
        if (item.player === player) {
          if (prevState === "escaped") {
            prevState = item.time;
          }
          if (prevState === "escapedOni") {
            prevState = "oni";
          }
        }
    }
  }

  const eggMultiple = 1 + eggCount * 0.1;
  if (typeof prevState === "number") {
    return Math.ceil((money + endTime - prevState) * eggMultiple);
  }
  return Math.ceil(money * eggMultiple);
}
