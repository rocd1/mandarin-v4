import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { HamburgerHeader } from './hamburger-header';

describe('HamburgerHeader', () => {
  let component: HamburgerHeader;
  let fixture: ComponentFixture<HamburgerHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HamburgerHeader],
      providers: [provideRouter([])], 
    }).compileComponents();

    fixture = TestBed.createComponent(HamburgerHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
