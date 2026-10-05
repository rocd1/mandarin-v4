import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HskSelection } from './hsk-selection';

describe('HskSelection', () => {
  let component: HskSelection;
  let fixture: ComponentFixture<HskSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HskSelection],
    }).compileComponents();

    fixture = TestBed.createComponent(HskSelection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
