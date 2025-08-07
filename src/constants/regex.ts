export const REGEX = {
  mongoId: /^[a-f0-9]{24}$/i,
} as const;

export type RegexKey = keyof typeof REGEX;
