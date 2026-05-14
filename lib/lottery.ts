export type LotteryPrize = {
  id: string;
  name: string;
  reward: number;
  amount: number;
  numbers: string[];
  matchType: "full" | "front3" | "back3" | "back2";
};

export type LotteryResult = {
  date: string;
  sourceEndpoint?: string;
  prizes: LotteryPrize[];
};

export type LotteryDraw = {
  id: string;
  date: string;
};

export type LotteryHistoryItem = LotteryDraw & {
  result?: LotteryResult;
};

export type LotteryApiPayload = {
  result: LotteryResult;
  disclaimer: string;
  provider: {
    name: string;
    url: string;
  };
};

export type LotteryCheckMatch = {
  id: string;
  name: string;
  reward: number;
  matchedNumber: string;
};

type RayriffyPrize = {
  id?: string;
  name?: string;
  reward?: string | number;
  amount?: number;
  number?: string[];
};

type RayriffyResponse = {
  status?: string;
  response?: {
    date?: string;
    endpoint?: string;
    prizes?: RayriffyPrize[];
    runningNumbers?: RayriffyPrize[];
  };
};

type RayriffyDraw = {
  id?: string;
  date?: string;
};

type RayriffyListResponse = {
  status?: string;
  response?: RayriffyDraw[];
};

function toNumber(value: string | number | undefined) {
  if (typeof value === "number") return value;
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizePrize(prize: RayriffyPrize, matchType: LotteryPrize["matchType"]): LotteryPrize {
  return {
    id: prize.id ?? prize.name ?? matchType,
    name: prize.name ?? "รางวัลสลากกินแบ่งรัฐบาล",
    reward: toNumber(prize.reward),
    amount: prize.amount ?? prize.number?.length ?? 0,
    numbers: prize.number ?? [],
    matchType,
  };
}

function getRunningMatchType(id: string | undefined): LotteryPrize["matchType"] {
  if (id === "runningNumberFrontThree") return "front3";
  if (id === "runningNumberBackThree") return "back3";
  return "back2";
}

export function normalizeLotteryResult(payload: RayriffyResponse): LotteryResult {
  const response = payload.response;

  if (payload.status !== "success" || !response?.date) {
    throw new Error("Invalid lottery API response");
  }

  const prizes = [
    ...(response.prizes ?? []).map((prize) => normalizePrize(prize, "full")),
    ...(response.runningNumbers ?? []).map((prize) => normalizePrize(prize, getRunningMatchType(prize.id))),
  ];

  return {
    date: response.date,
    sourceEndpoint: response.endpoint,
    prizes,
  };
}

export function normalizeLotteryDraws(payload: RayriffyListResponse): LotteryDraw[] {
  if (payload.status !== "success" || !Array.isArray(payload.response)) {
    throw new Error("Invalid lottery list API response");
  }

  return payload.response
    .filter((draw): draw is Required<RayriffyDraw> => Boolean(draw.id && draw.date))
    .map((draw) => ({
      id: draw.id,
      date: draw.date,
    }));
}

export function checkLotteryNumber(result: LotteryResult, input: string): LotteryCheckMatch[] {
  const number = input.replace(/\D/g, "").slice(0, 6);

  if (number.length !== 6) {
    return [];
  }

  return result.prizes.flatMap((prize) => {
    const target =
      prize.matchType === "front3"
        ? number.slice(0, 3)
        : prize.matchType === "back3"
          ? number.slice(-3)
          : prize.matchType === "back2"
            ? number.slice(-2)
            : number;

    return prize.numbers.includes(target)
      ? [
          {
            id: prize.id,
            name: prize.name,
            reward: prize.reward,
            matchedNumber: target,
          },
        ]
      : [];
  });
}
