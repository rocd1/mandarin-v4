import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { LearningService } from '../../../core/learning/services/learning.service';

import { HSKLevel } from '../../../core/learning/models/learning.models';


@Component({
  selector: 'app-hsk-selection',
  standalone: true,
  imports: [],
  templateUrl: './hsk-selection.html',
  styleUrl: './hsk-selection.css',
})
export class HskSelection implements OnInit {
  private learningService = inject(LearningService);
  private router = inject(Router);

  levels = signal<HSKLevel[]>([]);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.loadLevels();
  }

  loadLevels(): void {
    this.loading.set(true);
    this.error.set('');

    this.learningService.getHskLevels().subscribe({
      next: (levels) => {
        this.levels.set(levels);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('HSK levels error:', error);

        this.error.set(
          'Failed to load HSK levels.',
        );

        this.loading.set(false);
      },
    });
  }

  selectLevel(level: HSKLevel): void {
    this.router.navigate([
      '/learning/hsk',
      level.order,
    ]);
  }
}