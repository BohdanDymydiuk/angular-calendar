import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-days',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './days.component.html',
  styleUrl: './days.component.scss',
})
export class DaysComponent {
  @Input() prevMonthDays!: number[];
  @Input() monthDays!: number[];
  @Input() nextMonthDays!: number[];
}
