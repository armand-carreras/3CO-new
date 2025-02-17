import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartScreenPage } from './start-screen.page';

describe('StartScreenPage', () => {
  let component: StartScreenPage;
  let fixture: ComponentFixture<StartScreenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StartScreenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
