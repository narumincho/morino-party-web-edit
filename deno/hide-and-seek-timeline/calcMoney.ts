import type { Result } from "./type.ts";

export function calcMoney<Player extends string>(
  { items, endTime }: Pick<Result<Player>, "items" | "endTime">,
  player: Player,
): number {
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
  if (typeof prevState === "number") {
    return money + endTime - prevState;
  }
  return money;
}
