import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { alertCircleOutline, lockClosedOutline, logInOutline, mailOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { IonButton, IonContent, IonIcon, IonSpinner } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login.page',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
  imports: [CommonModule,IonContent,IonIcon,FormsModule,IonButton,IonSpinner],
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  public credentials = {
    email: '',
    password: ''
  };

  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  constructor() {
    addIcons({
      mailOutline, lockClosedOutline, alertCircleOutline,logInOutline
    });
  }

  onLogin() {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage.set("Compila tutti i campi");
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const msg = err.error?.message || "Credenziali non valide";
        this.errorMessage.set(msg);
      }
    });
  }


}
