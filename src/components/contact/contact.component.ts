import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import emailjs from 'emailjs-com';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { environment } from '../../environment';

@Component({
  selector: 'app-contact',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit{

  fb = inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);
  private titleService = inject(Title);

  captchaA?: number;
  captchaB?: number;

  public inLoading = false;

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['+39', [Validators.required, Validators.pattern(/^(\+39)?\s?3\d{2}\s?\d{6,7}$/)]],
    subject: ['Richieste Generali', Validators.required],
    message: ['', Validators.required],
    captcha: ['', [Validators.required, this.validateCaptcha.bind(this)]],
  });

  constructor() {
    this.titleService.setTitle('Contattaci - MediProject')
  }
  ngOnInit(): void {
    this.setRandomCaptcha();
  }

  private randomNumber(): number {
    return Math.floor(Math.random() * 10) + 1;
  }

  setRandomCaptcha() {
    this.captchaA = this.randomNumber();
    this.captchaB = this.randomNumber();
    this.contactForm.get('captcha')?.updateValueAndValidity();
  }

  private validateCaptcha(control: AbstractControl) {
    if(this.captchaA != null && this.captchaB != null){
      const correct = this.captchaA + this.captchaB;
      return +control.value === correct ? null : { invalidCaptcha: true };
    }
    return { invalidCaptcha: true };
  }

  sendEmail() {
    if (this.contactForm.invalid) return;

    const formValue = this.contactForm.value;

    const formattedMessage = `
      Oggetto: ${formValue.subject}

      Email Mittente: ${formValue.email}

      Numero di Telefono: ${formValue.telephone}

      Messaggio: ${formValue.message}
    `;

    const emailData = {
      name: formValue.name,
      email: formValue.email,
      subject: formValue.subject,
      message: formattedMessage,
    };

    console.log(formattedMessage);

    this.setRandomCaptcha();

    this.inLoading = true;
    emailjs.send(
      environment.serviceId,
      environment.templateId,
      emailData,
      environment.userId
    ).then(() => {
      this._snackBar.open(
        'Messaggio inviato correttamente, sarai ricontattato da un membro del nostro team!',
        'OK!',
        {
          panelClass: 'app-notification-success',
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        }
      );
      this.contactForm.reset({ subject: 'Richieste Generali' });
    })
    .catch((err) => {
      this._snackBar.open(
        'Messaggio non inviato, riprova tra qualche minuto!',
        'OK!',
        {  
          panelClass: 'app-notification-error',
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        }
      );
      console.error(err);
    })
    .finally(() => {
      this.inLoading = false;
    });
  }
}
