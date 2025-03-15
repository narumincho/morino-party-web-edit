import { calcMoney } from "./calcMoney.ts";

export type Item<Player extends string, Time = StrTime> = {
  /**
   * タッチし鬼が移るはずだが, タッチされた側が気づいていない
   */
  readonly type: "touch";
  readonly from: Player | undefined;
  readonly to: Player;
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

export function touchAndOniChange<Player extends string>(
  { from, to, time }: {
    readonly from: NoInfer<Player> | undefined;
    readonly to: NoInfer<Player>;
    readonly time: StrTime;
  },
): ReadonlyArray<Item<Player>> {
  return [{
    type: "touch",
    from,
    to,
    time,
  }, {
    type: "oniChange",
    from,
    to,
    time,
  }];
}

export type StrTime = `${number}:${number}`;

export function parseTime(time: StrTime): number {
  const result = /^(\d+):(\d+)$/.exec(time)!;
  return Number.parseInt(result[1]!) * 60 + Number.parseInt(result[2]!);
}

export type ResultInput<Player extends string> = {
  readonly players: ReadonlyArray<Player>;
  readonly items: ReadonlyArray<Item<Player>>;
  readonly offset: StrTime;
  /**
   * 開催時間 オフセット分の時間は含めない
   */
  readonly endTime: StrTime;
};

export type Result<Player extends string> = {
  readonly players: ReadonlyArray<Player>;
  readonly items: ReadonlyArray<Item<Player, number>>;
  /**
   * 開催時間
   */
  readonly endTime: number;
};

export function resultInputToResult<Player extends string>(
  resultInput: ResultInput<Player>,
): Result<Player> {
  const items = resultInput.items.map((item) => ({
    ...item,
    time: parseTime(item.time) - parseTime(resultInput.offset),
  })).sort((a, b) => a.time - b.time);
  const endTime = parseTime(resultInput.endTime);
  return {
    players: resultInput.players.toSorted((a, b) =>
      calcMoney({ items, endTime }, a) - calcMoney({ items, endTime }, b)
    ),
    items,
    endTime,
  };
}
