import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonTitle, IonToolbar, ModalController } from '@ionic/angular';
import { UpdateProfilePayload, UserService } from '../../services/user.service';
import { addIcons } from 'ionicons';
import { closeOutline, saveOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.css'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonIcon, IonTitle, IonLabel, IonInput, IonButton, IonButtons, IonToolbar, IonItem, CommonModule, FormsModule],
})
export class EditProfileModalComponent implements OnInit {
  @Input() profile: any = null; //Riceve i dati dalla pagina chiamante
  @Input() isAdminEdit: boolean = false; //Sarà true quando l'admin modificherà il profilo di un altro utente

  private modalCtrl = inject(ModalController);
  private userService = inject(UserService);

  public errorMessage = signal<string | null>(null);
  public successMessage = signal<string | null>(null);

  public editData = {
    name: '',
    surname:'',
    email: '',
    password: '',
    gruppo_sanguigno: '',
    telefono_emergenza: '',
    postazione: '',
    specializzazione: '',
    numero_albo: ''
  };

  constructor() {
    addIcons({ closeOutline, saveOutline });
  }

  ngOnInit() {
    if (this.profile) {
      this.editData.name = this.profile.name || '';
      this.editData.surname = this.profile.surname || '';
      this.editData.email = this.profile.email || '';
      this.editData.gruppo_sanguigno = this.profile.details?.gruppo_sanguigno || '';
      this.editData.telefono_emergenza = this.profile.details?.telefono_emergenza || '';
      this.editData.postazione = this.profile.details?.postazione || '';
      this.editData.specializzazione = this.profile.details?.specializzazione;
      this.editData.numero_albo = this.profile.details?.numero_albo || '';
    }
  }

  public dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  public save() {
    if (!this.profile?.cf) return;

    //Solo l'admin può modificare il nome ed il cognome
    if (this.isAdminEdit && (!this.editData.name.trim() || !this.editData.surname.trim())) {
      this.errorMessage.set("Nome e cognome sono obbligatori");
      return;
    }

    const payload: UpdateProfilePayload = {
      email: this.editData.email
    };

    if (this.isAdminEdit) {
      payload.name = this.editData.name.trim();
      payload.surname = this.editData.surname.trim();
    }

    if (this.editData.password.trim() !== '') payload.password = this.editData.password;

    if (this.profile.role === 'paziente') {
      payload.gruppo_sanguigno = this.editData.gruppo_sanguigno;
      payload.telefono_emergenza = this.editData.telefono_emergenza;
    } else if (this.profile.role === 'sportellista') {
      payload.postazione = this.editData.postazione;
    } else if (this.profile.role === 'medico') {
      payload.specializzazione = this.editData.specializzazione;
      payload.numero_albo = this.editData.numero_albo;
    }

    this.userService.updateUser(this.profile.cf, payload).subscribe({
      next: () => {
        this.successMessage.set("Profilo aggiornato con successo");
        this.errorMessage.set(null);
        this.modalCtrl.dismiss(payload, 'confirm');
      },
      error: (err) => {
        console.log("Errore durante la modifica del profilo", err)
        this.errorMessage.set("Errore durante l'aggiornamento del profilo");
        this.successMessage.set(null);
      }
    });
  }


}