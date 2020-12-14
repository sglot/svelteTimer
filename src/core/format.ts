import { exception } from "console";

export function getSecondsInTwoDigitFormat(number: number): string {
  if (number < 0) {
    throw new Error("Секунды не могут быть отрицательными");
  }
  
  let seconds = Math.trunc(number % 60);
  let prefix = seconds < 10 ? "0" : "";

  return prefix + seconds;
}

export function getMinutesInTwoDigitFormat(minutes: number): string {
  if (minutes < 0) {
    throw new Error("Минуты не могут быть отрицательными");
  }

  let prefix = minutes < 10 ? "0" : "";

  return prefix + minutes;
}
