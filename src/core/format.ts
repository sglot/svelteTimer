export function getSecondsInTwoDigitFormat(number: number): string {
    let seconds = Math.trunc(number % 60);
    let prefix = seconds < 10 ? "0" : "";

    return prefix + seconds;
  }

export function getMinutesInTwoDigitFormat(minutes: number): string {
    let prefix = minutes < 10 ? "0" : "";

    return prefix + minutes;
  }
