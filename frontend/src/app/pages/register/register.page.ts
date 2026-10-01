import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { alertCircleOutline, lockClosedOutline, mailOutline, personAddOutline, personOutline } from 'ionicons/icons';
import { IonButton, IonContent, IonIcon, IonSpinner } from '@ionic/angular';
import { RegisterPayload } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  standalone: true,
  styleUrls: ['./register.page.css'],
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonIcon, IonButton, IonSpinner],
})
export class RegisterPage {

  public userData: RegisterPayload = {
    cf: '',
    name: '',
    surname: '',
    email: '',
    password: '',
    role: 'paziente'
  };
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {
    addIcons({
      personOutline, mailOutline, lockClosedOutline, personAddOutline, alertCircleOutline
    });
  }

  public onRegister() {
    if (!this.userData.name || !this.userData.surname || !this.userData.email || !this.userData.password) {
      this.errorMessage.set('Compila tutti i campi obbligatori.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.register(this.userData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      }, error: (err) => {
        this.isLoading.set(false);
        const msg = err.error?.message || 'Errore durante la registrazione. Riprova.';
        this.errorMessage.set(msg);
      }
    });
  }
}
