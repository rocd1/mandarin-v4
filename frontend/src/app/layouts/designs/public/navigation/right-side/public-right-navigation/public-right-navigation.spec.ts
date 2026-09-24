import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { PublicRightNavigation } from './public-right-navigation';

describe('PublicRightNavigation', () => {
  let component: PublicRightNavigation;
  let fixture: ComponentFixture<PublicRightNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicRightNavigation],
      providers: [provideRouter([])], 
    }).compileComponents();

    fixture = TestBed.createComponent(PublicRightNavigation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
