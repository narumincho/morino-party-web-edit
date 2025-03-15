export type Item<Player extends string> = {
  readonly type: "touch";
  readonly from: Player;
  readonly time: Time;
} | {
  /**
   * 実際に鬼が移った
   */
  readonly type: "oniChange";
  readonly from: Player | undefined;
  readonly to: Player | undefined;
  readonly time: Time;
} | {
  /**
   * 死亡したり抜けた
   */
  readonly type: "exit";
  readonly player: Player;
  readonly time: Time;
} | {
  readonly type: "enter";
  readonly player: Player;
  readonly time: Time;
};

export type Time = `${number}:${number}`;

export function parseTime(time: Time): number {
  const result = /^(\d+):(\d+)$/.exec(time)!;
  return Number.parseInt(result[1]!) * 60 + Number.parseInt(result[2]!);
}
