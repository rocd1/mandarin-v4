import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { SimpleFooter } from './simple-footer';

describe('SimpleFooter', () => {
  let component: SimpleFooter;
  let fixture: ComponentFixture<SimpleFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleFooter],
      providers: [provideRouter([])], 
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
