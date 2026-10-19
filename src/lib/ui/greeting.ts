export function getFirstName(
  fullName: string | null | undefined
): string {
  if (!fullName?.trim()) {
    return "there";
  }

  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "there";
  }

  // Handle names such as "A. Aneesh" or "CH Aneesh".
  if (
    parts.length > 1 &&
    parts[0].replace(/\./g, "").length <= 3 &&
    /^[A-Za-z.]+$/.test(parts[0])
  ) {
    return parts[parts.length - 1];
  }

  return parts[0];
}

type TimePeriod =
  | "earlyMorning"
  | "morning"
  | "afternoon"
  | "evening"
  | "night"
  | "lateNight";

interface GreetingContext {
  hour: number;
  period: TimePeriod;
}

interface GreetingOption {
  message: (name: string) => string;
}

function getTimeContext(date: Date): GreetingContext {
  const hour = date.getHours();

  let period: TimePeriod;

  if (hour >= 5 && hour < 7) {
    period = "earlyMorning";
  } else if (hour >= 7 && hour < 12) {
    period = "morning";
  } else if (hour >= 12 && hour < 17) {
    period = "afternoon";
  } else if (hour >= 17 && hour < 20) {
    period = "evening";
  } else if (hour >= 20 && hour < 23) {
    period = "night";
  } else {
    period = "lateNight";
  }

  return { hour, period };
}

const GREETINGS: Record<TimePeriod, GreetingOption[]> = {
  earlyMorning: [
    { message: (name) => `A new day, ${name}.` },
    { message: (name) => `Good morning, ${name}.` },
    { message: (name) => `Start with intention, ${name}.` },
    { message: (name) => `What will you build today, ${name}?` },
    { message: (name) => `A fresh beginning, ${name}.` },
    { message: (name) => `Your next chapter starts here, ${name}.` },
  ],

  morning: [
    { message: (name) => `Good morning, ${name}.` },
    { message: (name) => `Ready for what's next, ${name}?` },
    { message: (name) => `Let's make today count, ${name}.` },
    { message: (name) => `What are we building today, ${name}?` },
    { message: (name) => `One step forward, ${name}.` },
    { message: (name) => `Good to see you, ${name}.` },
    { message: (name) => `Your next idea starts here, ${name}.` },
    { message: (name) => `Let's turn a thought into progress, ${name}.` },
  ],

  afternoon: [
    { message: (name) => `Good afternoon, ${name}.` },
    { message: (name) => `What's next on your mind, ${name}?` },
    { message: (name) => `Let's keep the momentum, ${name}.` },
    { message: (name) => `What can we move forward, ${name}?` },
    { message: (name) => `Back to building, ${name}?` },
    { message: (name) => `Every step adds up, ${name}.` },
    { message: (name) => `Let's make your next move count, ${name}.` },
    { message: (name) => `A good time for a new perspective, ${name}.` },
  ],

  evening: [
    { message: (name) => `Good evening, ${name}.` },
    { message: (name) => `What are we working toward, ${name}?` },
    { message: (name) => `Let's give your next idea some shape, ${name}.` },
    { message: (name) => `Still room to make progress, ${name}.` },
    { message: (name) => `What would you like to figure out, ${name}?` },
    { message: (name) => `Let's bring some clarity to your ideas, ${name}.` },
    { message: (name) => `Your next breakthrough starts with a question, ${name}.` },
  ],

  night: [
    { message: (name) => `Good evening, ${name}.` },
    { message: (name) => `What are you thinking about tonight, ${name}?` },
    { message: (name) => `Let's explore that idea, ${name}.` },
    { message: (name) => `One clear thought can change your direction, ${name}.` },
    { message: (name) => `What's worth figuring out tonight, ${name}?` },
    { message: (name) => `Big ideas begin with good questions, ${name}.` },
  ],

  lateNight: [
    { message: (name) => `Still exploring ideas, ${name}?` },
    { message: (name) => `What's on your mind tonight, ${name}?` },
    { message: (name) => `A quiet moment to think, ${name}.` },
    { message: (name) => `Let's capture that idea, ${name}.` },
    { message: (name) => `What would you like to understand, ${name}?` },
    { message: (name) => `Ideas can wait; rest matters too, ${name}.` },
  ],
};

function getDailyIndex(
  name: string,
  period: TimePeriod,
  count: number,
  date: Date
): number {
  // Use the user's local calendar date.
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const key = `${year}-${month}-${day}-${name}-${period}`;

  let hash = 0;

  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }

  return (hash >>> 0) % count;
}

export function getGreeting(
  fullName: string | null | undefined,
  date: Date = new Date()
): string {
  const name = getFirstName(fullName);
  const { period } = getTimeContext(date);

  const options = GREETINGS[period];

  const index = getDailyIndex(
    name,
    period,
    options.length,
    date
  );

  return options[index].message(name);
}