import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { PublicLeftIconNavigation } from './public-left-icon-navigation';

describe('PublicLeftIconNavigation', () => {
  let component: PublicLeftIconNavigation;
  let fixture: ComponentFixture<PublicLeftIconNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicLeftIconNavigation],
      providers: [provideRouter([])], 
    }).compileComponents();

    fixture = TestBed.createComponent(PublicLeftIconNavigation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
