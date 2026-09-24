import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { SimpleAppHeader } from './simple-header';

describe('SimpleHeader', () => {
  let component: SimpleAppHeader;
  let fixture: ComponentFixture<SimpleAppHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleAppHeader],
      providers: [provideRouter([])], 
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleAppHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
