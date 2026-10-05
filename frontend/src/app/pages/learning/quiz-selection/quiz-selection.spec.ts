import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizSelection } from './quiz-selection';

describe('QuizSelection', () => {
  let component: QuizSelection;
  let fixture: ComponentFixture<QuizSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizSelection],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizSelection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
