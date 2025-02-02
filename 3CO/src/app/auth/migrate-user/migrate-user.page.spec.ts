import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MigrateUserPage } from './migrate-user.page';

describe('MigrateUserPage', () => {
  let component: MigrateUserPage;
  let fixture: ComponentFixture<MigrateUserPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MigrateUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
