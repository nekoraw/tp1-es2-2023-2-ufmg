const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export function verifyEmailRegex(email: string) {
  return emailRegex.test(email);
}

export function evaluatePossiblyUndefinedBoolean(
  expected_value: undefined | boolean
): boolean {
  if (expected_value === undefined) return true;
  else return expected_value;
}
