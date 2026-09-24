import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { PublicLeftNavigation } from './public-left-navigation';

describe('PublicLeftNavigation', () => {
  let component: PublicLeftNavigation;
  let fixture: ComponentFixture<PublicLeftNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicLeftNavigation],
      providers: [provideRouter([])], 
    }).compileComponents();

    fixture = TestBed.createComponent(PublicLeftNavigation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
