import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Calendar } from './types/calendar';
import { MonthOffset } from './enums/month-offset';
import { MonthEnds } from './enums/month-ends';
import { HeaderComponent } from './components/header/header.component';
import { WeekComponent } from './components/week/week.component';
import { DaysComponent } from './components/days/days.component';

// constants
const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const weekLastIndex = week.length - 1;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    WeekComponent,
    DaysComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-calendar';
  week = week;
  date = new Date();

  // indexes
  monthIndex = this.date.getMonth();
  prevMonthIndex = this.getPrevMonthIndex();
  nextMonthIndex = this.getNextMonthIndex();

  // year, month
  year = this.date.getFullYear();
  month = this.getMonth();

  // month lenght and days
  monthLength = this.getMonthLength(MonthOffset.curr);
  monthDays = this.getMonthDays(this.monthLength);
  prevMonthLength = this.getMonthLength(MonthOffset.prev);
  prevMonthDays = this.getPrevDays(this.getMonthDays(this.prevMonthLength));
  nextMonthLength = this.getMonthLength(MonthOffset.next);
  nextMonthDays = this.getNextDays(this.getMonthDays(this.nextMonthLength));

  // calendar
  calendar: Calendar = {
    [this.year]: {
      [this.monthIndex]: {
        name: this.month,
        monthDays: this.monthDays,
      },
    },
  };

  // #region methods 1

  getMonth(year = this.year, monthIndex = this.monthIndex) {
    const date = new Date(year, monthIndex);

    return date.toLocaleString('default', { month: 'long' });
  }

  getPrevMonthIndex() {
    return this.monthIndex + MonthOffset.prev < MonthEnds.first
      ? MonthEnds.last
      : this.monthIndex + MonthOffset.prev;
  }

  getNextMonthIndex() {
    return this.monthIndex + MonthOffset.next > MonthEnds.last
      ? MonthEnds.first
      : this.monthIndex + MonthOffset.next;
  }

  getMonthLength(monthOffset: MonthOffset) {
    const { monthIndex, year, calendar } = this;
    const month = monthIndex + monthOffset;
    const nextYear = year + 1;
    const prevYear = year - 1;

    if (
      monthIndex === MonthEnds.first &&
      !calendar[prevYear] &&
      monthOffset === MonthOffset.prev
    ) {
      this.setPrevYear(prevYear);
    }

    if (
      monthIndex === MonthEnds.last &&
      !calendar[nextYear] &&
      monthOffset === MonthOffset.next
    ) {
      console.log(this.month);

      this.setNextYear(nextYear);
    }

    return new Date(this.year, month + 1, 0).getDate();
  }

  getMonthDays(monthLength: number) {
    return Array.from({ length: monthLength }, (_, i) => i + 1);
  }

  getPrevDays(days: number[]) {
    return days.slice(this.prevMonthLength - this.firstWeekDay);
  }

  getNextDays(days: number[]) {
    return days.slice(0, weekLastIndex - this.lastWeekDay);
  }

  setPrevYear(prevYear: number) {
    if (!this.calendar[prevYear]) {
      this.calendar[prevYear] = {};
    }

    const name = this.getMonth(prevYear, MonthEnds.last);
    const monthDays = this.getMonthDays(this.nextMonthLength);

    this.calendar[prevYear][MonthEnds.last] = { name, monthDays };
  }

  setNextYear(nextYear: number) {
    if (!this.calendar[nextYear]) {
      this.calendar[nextYear] = {};
    }

    const name = this.getMonth(nextYear, MonthEnds.first);
    const monthDays = this.getMonthDays(this.nextMonthLength);

    this.calendar[nextYear][MonthEnds.first] = { name, monthDays };
  }

  // #endregion
  // #region getters

  get firstWeekDay() {
    const { year, monthIndex } = this;
    const date = new Date(year, monthIndex, 1);

    return date.getDay();
  }

  get lastWeekDay() {
    const { year, monthIndex, monthLength } = this;
    const date = new Date(year, monthIndex, monthLength);

    return date.getDay();
  }

  // #endregion
  // #region methods 2

  updateDate() {
    this.prevMonthIndex =
      this.monthIndex + MonthOffset.prev < MonthEnds.first
        ? MonthEnds.last
        : this.monthIndex + MonthOffset.prev;

    this.nextMonthIndex =
      this.monthIndex + MonthOffset.next > MonthEnds.last
        ? MonthEnds.first
        : this.monthIndex + MonthOffset.next;

    this.monthLength = this.getMonthLength(MonthOffset.curr);
    this.monthDays = this.getMonthDays(this.monthLength);

    this.prevMonthLength = this.getMonthLength(MonthOffset.prev);
    this.prevMonthDays = this.getPrevDays(
      this.getMonthDays(this.prevMonthLength)
    );

    this.nextMonthLength = this.getMonthLength(MonthOffset.next);
    this.nextMonthDays = this.getNextDays(
      this.getMonthDays(this.nextMonthLength)
    );
  }

  prevMonthHandler() {
    const { monthIndex, prevMonthIndex, prevMonthLength, calendar, year } =
      this;
    const prevYear = year - 1;

    this.monthIndex = prevMonthIndex;

    if (monthIndex === MonthEnds.first) {
      this.year = prevYear;

      this.month = calendar[prevYear][MonthEnds.last].name;
    } else {
      if (!calendar[year][prevMonthIndex]) {
        const name = this.getMonth(year, prevMonthIndex);
        const monthDays = this.getMonthDays(prevMonthLength);

        this.calendar[year][prevMonthIndex] = { name, monthDays };
      }

      this.month = calendar[year][prevMonthIndex].name;
    }

    this.updateDate();
  }

  nextMonthHandler() {
    const { monthIndex, nextMonthIndex, nextMonthLength, calendar, year } =
      this;
    const nextYear = year + 1;

    this.monthIndex = nextMonthIndex;

    if (monthIndex === MonthEnds.last) {
      this.year = nextYear;

      this.month = calendar[nextYear][MonthEnds.first].name;
    } else {
      if (!calendar[year][nextMonthIndex]) {
        const name = this.getMonth(year, nextMonthIndex);
        const monthDays = this.getMonthDays(nextMonthLength);

        this.calendar[year][nextMonthIndex] = { name, monthDays };
      }

      this.month = calendar[year][nextMonthIndex].name;
    }

    this.updateDate();
  }

  // #endregion
}
