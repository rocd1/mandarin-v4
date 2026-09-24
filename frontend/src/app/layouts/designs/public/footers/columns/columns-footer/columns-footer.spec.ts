import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import { ColumnsFooter } from './columns-footer';

describe('ColumnsFooter', () => {
  let component: ColumnsFooter;
  let fixture: ComponentFixture<ColumnsFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnsFooter],
      providers: [provideRouter([])], 
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnsFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
