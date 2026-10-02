import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningTest } from './learning-test';

describe('LearningTest', () => {
  let component: LearningTest;
  let fixture: ComponentFixture<LearningTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningTest],
    }).compileComponents();

    fixture = TestBed.createComponent(LearningTest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
