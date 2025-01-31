import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountValidatorPage } from './account-validator.page';

describe('AccountValidatorPage', () => {
  let component: AccountValidatorPage;
  let fixture: ComponentFixture<AccountValidatorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountValidatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
