export interface Calendar {
  [year: number]: {
    [monthIndex: number]: {
      name: string;
      monthDays: number[];
    }
  }
}
