import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { AppBar } from './app-bar';

describe('AppBar', () => {
  let component: AppBar;
  let fixture: ComponentFixture<AppBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppBar],
      providers: [provideRouter([])], 
    }).compileComponents();

    fixture = TestBed.createComponent(AppBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
