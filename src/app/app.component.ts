import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const weekLastIndex = week.length - 1;

type MonthPosition = -1 | 0 | 1;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-calendar';
  week = week;

  date = new Date();
  year = this.getYear();
  month = this.getMonth();
  monthNum = this.getMonthNum();

  currMonthLength = this.getMonthLength();
  currMonthDays = this.getMonthDays();

  prevMonthLength = this.getMonthLength(-1);
  prevMonthDays = this.getPrevMonthDays();

  nextMonthLength = this.getMonthLength(1);
  nextMonthDays = this.getNextMonthDays();


  // #region get
  // #region rest

  getYear() {
    return this.date.getFullYear();
  }

  getMonth() {
    return this.date.toLocaleString('default', { month: 'long' });
  }

  getMonthNum() {
    return this.date.getMonth();
  }

  getMonthDays(monthLength = this.currMonthLength) {
    return Array.from({ length: monthLength }, (_, i) => i + 1);
  }

  getMonthLength(monthPosition: MonthPosition = 0) {
    const { year, monthNum } = this;
    const month = monthNum + monthPosition + 1;

    return new Date(year, month, 0).getDate();
  }

  getPrevMonthDays() {
    return this.getMonthDays(this.prevMonthLength).slice(this.prevMonthLength - this.firstWeekDay);
  }

  getNextMonthDays() {
    return this.getMonthDays(this.nextMonthLength).slice(0, weekLastIndex - this.lastWeekDay);
  }

  // #endregion

  get firstWeekDay() {
    const { year, monthNum } = this;
    const date = new Date(year, monthNum, 1);

    return date.getDay();
  }

  get lastWeekDay() {
    const { year, monthNum, currMonthLength } = this;
    const date = new Date(year, monthNum, currMonthLength);

    return date.getDay();
  }

  // #endregion

  updateDate() {
    this.month = this.getMonth();
    this.monthNum = this.getMonthNum();


    this.currMonthLength = this.getMonthLength();
    this.currMonthDays = this.getMonthDays();

    this.prevMonthLength = this.getMonthLength(-1);
    this.prevMonthDays = this.getPrevMonthDays();

    this.nextMonthLength = this.getMonthLength(1);
    this.nextMonthDays = this.getNextMonthDays();

    if (this.year !== this.getYear()) {
      this.year = this.getYear()
    }
  }

  // #region hadnlers

  nextMonthHandler() {
    this.date.setMonth(this.date.getMonth() + 1);
    this.updateDate();
  }

  prevMonthHandler() {
    this.date.setMonth(this.date.getMonth() - 1);
    this.updateDate();
  }

  // #endregion
}
