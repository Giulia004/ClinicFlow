import { Component, inject,signal } from '@angular/core';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonSelect, IonSelectOption, IonTitle, IonToolbar, ModalController } from '@ionic/angular';
import { RegisterPayload, UserService } from '../../services/user.service';
import { addIcons } from 'ionicons';
import { alertCircleOutline, closeOutline, personAddOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css'],
  imports: [CommonModule, FormsModule, IonHeader, IonInput, IonTitle, IonToolbar, IonButtons, IonContent, IonSelectOption, IonSelect, IonItem,IonButtons,IonButton,IonIcon],
})
export class UserModalComponent {
  private modalCtrl = inject(ModalController);
  private userService = inject(UserService);

  public userData: RegisterPayload = {
    cf: '',
    name: '',
    surname: '',
    email: '',
    password: '',
    role: 'medico',
    specializzazione: '',
    numeroAlbo: '',
    postazione: ''
  };

  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  constructor() {
    addIcons({
      closeOutline, personAddOutline, alertCircleOutline
    });
  }

  public dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  public save() {
    if (!this.userData.cf || !this.userData.name || !this.userData.surname || !this.userData.email || !this.userData.password) {
      this.errorMessage.set('Compila tutti i campi obbligatori.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.userService.registerUser(this.userData).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.modalCtrl.dismiss(res, 'confirm');
      }, error: (err) => {
        console.log(err);
        this.isLoading.set(false);
        this.errorMessage.set("Errore durante la registrazione del nuovo utente");
      }
    });
  }
}
