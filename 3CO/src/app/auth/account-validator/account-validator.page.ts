
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInput, ViewDidEnter } from '@ionic/angular';
import { InputInputEventDetail, IonInputCustomEvent, PredefinedColors } from '@ionic/core';
import { ToastService } from 'src/app/shared/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-validator',
  templateUrl: './account-validator.page.html',
  styleUrls: ['./account-validator.page.scss'],
})
export class AccountValidatorPage implements OnInit, ViewDidEnter {
  
  @ViewChildren('digitInput') inputElements!: QueryList<IonInput>;

  email: string = '';
  verificationCode: string = '';
  toastMessage: string | null = null;
  inputs: string[] = new Array(6).fill('');
  validationForm: FormGroup;

  constructor(
    private http: HttpClient,
    private toastController: ToastService,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.validationForm = this.fb.group({
      inputs: this.fb.array(
        new Array(6).fill('').map(() => this.fb.control('', [Validators.required, Validators.pattern('^[0-9]$')])),
      ),
    });
  }
  
  get validNumber(): boolean {
    return !this.inputs.every(value => value !== '');
  }
  
  ionViewDidEnter(): void {
    this.inputElements.toArray()[0].setFocus();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.email = params['email'] || '';  // Retrieve the 'email' parameter or set to empty string
      console.log('Email from route:', this.email);  // Log the email parameter
    });
  }

  onInputChange(event: IonInputCustomEvent<InputInputEventDetail>, index: number): void {
    const inputElement = event.target;
    let value = event.detail.value?.replace(/\D/g, ''); // Allow only numbers

    if (value && value.length > 1) {
      this.handlePaste(value);
      return;
    }

    else if (event.detail.value === '') {
      // Handle Backspace by clearing and moving focus back
      this.inputs[index] = '';
      if(index > 0) {
        console.log('moving back');
        this.moveFocus(index, -1);
      } else {
        this.moveFocus(1, -1);
      }
    } else if(value && value.trim().length===1) {
      // Normal input: Store the digit ansd move focus forward
      this.inputs[index] = value;
      console.log('newInput', index, this.inputs, value);
      if(index < 5) {
        console.log('moving forward');
        this.moveFocus(index, 1);
      } else {
        this.moveFocus(4, 1);
      }
    }

    inputElement.value = '';
  }

  private moveFocus(index: number, direction: number): void {
    setTimeout(() => {
      const inputsArray = this.inputElements.toArray();
      const nextIndex = index + direction;
      if (nextIndex >= 0 && nextIndex < inputsArray.length) {
        inputsArray[nextIndex].setFocus();
      }
    }, 50);
  }


  private handlePaste(value: string): void {
    const digits = value.slice(0, 6).split('');
    this.inputs = digits.concat(new Array(6 - digits.length).fill('')); // Fill remaining slots

    setTimeout(() => {
      const inputsArray = this.inputElements.toArray();
      const lastFilledIndex = digits.length - 1;
      if (lastFilledIndex >= 0 && lastFilledIndex < inputsArray.length) {
        inputsArray[lastFilledIndex].setFocus();
      }
    }, 50);
  }



  async onSubmit() {

    this.verificationCode = this.inputs.join('');

    if (!this.verificationCode) {
      this.showToast('Please enter a valid code', 'warning');
      return;
    }

    const url = environment.paths.base_api + environment.paths.verification;
    const payload = {
      email: this.email,
      verification_code: this.verificationCode,
    };

    this.http.post(url, payload).subscribe({
      next: (response: any) => {
        this.showToast('Email verified successfully!', 'success');
        this.router.navigate(['auth/login']);
        // Handle token (e.g., save to storage, navigate to another page)
        console.log('Auth Token:', response);
      },
      error: (error) => {
        if (error.status === 400 || error.status === 404) {
          const message = error.error?.message || 'An error occurred. Please try again.';
          this.showToast(message, 'danger');
        } else {
          this.showToast('Something went wrong. Please try again later.', 'danger');
        }
      },
    });
  }

  private async showToast(message: string, color: PredefinedColors) {
    const toast = await this.toastController.presentAutoDismissToast(message, color, 1000);
  }
}
