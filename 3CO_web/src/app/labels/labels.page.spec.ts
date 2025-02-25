import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabelsPage } from './labels.page';

describe('LabelsPage', () => {
  let component: LabelsPage;
  let fixture: ComponentFixture<LabelsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
