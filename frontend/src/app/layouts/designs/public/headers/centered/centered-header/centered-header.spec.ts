import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { CenteredHeader } from './centered-header';

describe('CenteredHeader', () => {
  let component: CenteredHeader;
  let fixture: ComponentFixture<CenteredHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenteredHeader],
      providers: [provideRouter([])], 
    }).compileComponents();

    fixture = TestBed.createComponent(CenteredHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
