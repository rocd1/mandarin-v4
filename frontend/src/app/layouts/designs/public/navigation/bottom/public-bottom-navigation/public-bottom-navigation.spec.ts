import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { PublicBottomNavigation } from './public-bottom-navigation';

describe('PublicBottomNavigation', () => {
  let component: PublicBottomNavigation;
  let fixture: ComponentFixture<PublicBottomNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicBottomNavigation],
      providers: [provideRouter([])], 
    }).compileComponents();

    fixture = TestBed.createComponent(PublicBottomNavigation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
