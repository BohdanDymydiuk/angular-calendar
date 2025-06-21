import { Component, Input } from '@angular/core';
import { Calendar } from '../../types/calendar';
import { MonthOffset } from '../../enums/month-offset';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() month!: string;
  @Input() year!: number;
  @Input() prevMonthHandler!: () => void;
  @Input() nextMonthHandler!: () => void;
}
