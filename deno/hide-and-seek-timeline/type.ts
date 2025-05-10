import { calcMoney } from "./calcMoney.ts";

export type Item<Player extends string, Time = StrTime> = {
  /**
   * タッチし鬼が移るはずだが, タッチされた側が気づいていない
   */
  readonly type: "touch";
  readonly from: Player | undefined;
  readonly to: Player | undefined;
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
  readonly title: string;
  readonly players: ReadonlyArray<Player>;
  readonly items: ReadonlyArray<Item<Player>>;
  readonly offset: StrTime;
  /**
   * 開催時間 オフセット分の時間は含めない
   */
  readonly endTime: StrTime;
  readonly colors: ReadonlyArray<string>;
  readonly tasks?: Record<Player, { start: StrTime; end: StrTime } | undefined>;
  readonly eggs?: Record<Player, Record<Egg, StrTime | undefined>>;
};

type Egg = typeof allEgg[number];

export const allEgg = [
  "大木の中には空洞がある",
  "赤、緑、黄色といえば",
  "屋根の下で目を凝らせ",
  "小さな木を見上げてお花見をしよう",
  "それはドーナッツ？",
  "3匹の大豚",
  "HOT or COLD",
  "運命の分かれ道",
  "ホームシアターの部屋",
  "絵画の世界に飛び込もう",
  "さて、どう料理してやろうか",
  "ケーキが見つめる先に",
  "二角獣の腹の中は煙たい",
  "群れない茶色",
  "4つならんだ…",
] as const;

export type Result<Player extends string> = {
  readonly title: string;
  readonly players: ReadonlyArray<Player>;
  readonly items: ReadonlyArray<Item<Player, number>>;
  /**
   * 開催時間
   */
  readonly endTime: number;
  readonly colors: ReadonlyArray<string>;
  readonly tasks:
    | ReadonlyArray<
      {
        readonly player: Player;
        readonly time:
          | { readonly start: number; readonly end: number }
          | undefined;
      }
    >
    | undefined;
  readonly eggs: ReadonlyArray<{
    readonly player: Player;
    readonly egg: Egg;
    readonly time: number;
  }>;
};

export function resultInputToResult<Player extends string>(
  resultInput: ResultInput<Player>,
): Result<Player> {
  const offset = parseTime(resultInput.offset);
  const tasks = resultInput.tasks
    ? Object.entries<
      {
        start: StrTime;
        end: StrTime;
      } | undefined
    >(resultInput.tasks).map(([player, time]) => ({
      player: player as Player,
      time: time === undefined ? undefined : {
        start: parseTime(time.start) - offset,
        end: parseTime(time.end) - offset,
      },
    }))
    : undefined;
  const eggs = resultInput.eggs
    ? Object.entries<
      Record<Egg, StrTime | undefined>
    >(resultInput.eggs).flatMap(([player, eggs]) =>
      Object.entries<StrTime | undefined>(eggs).flatMap(([egg, time]) =>
        time
          ? [{
            player: player as Player,
            egg: egg as Egg,
            time: parseTime(time) - offset,
          }]
          : []
      )
    )
    : [];
  const items = resultInput.items.map((item) => ({
    ...item,
    time: parseTime(item.time) - offset,
  })).sort((a, b) => a.time - b.time);
  const endTime = parseTime(resultInput.endTime);
  return {
    title: resultInput.title,
    players: resultInput.players.toSorted((a, b) =>
      calcMoney({ items, endTime, tasks, eggs }, a) -
      calcMoney({ items, endTime, tasks, eggs }, b)
    ),
    items,
    endTime,
    colors: resultInput.colors,
    tasks,
    eggs,
  };
}
