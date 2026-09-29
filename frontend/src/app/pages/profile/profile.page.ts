import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User, UserService } from '../../services/user.service';
import { addIcons } from 'ionicons';
import { closeOutline, createOutline, personOutline, saveOutline } from 'ionicons/icons';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonSpinner, IonTitle, IonToolbar, ModalController } from '@ionic/angular';
import { EditProfileModalComponent } from '../../components/edit-profile-modal/edit-profile-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile.page',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.css'],
  imports: [CommonModule, IonItem, IonLabel, IonCard, IonCardContent, IonContent, IonButton, IonCardTitle, IonCardHeader, IonIcon, IonHeader, IonToolbar, IonTitle, IonSpinner, EditProfileModalComponent],
})
export class ProfilePage implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private modalCtrl = inject(ModalController);

  public userProfile = signal<User | null>(null);
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  constructor() {
    addIcons({ personOutline, createOutline, saveOutline, closeOutline });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading.set(true);
    const currentUser = this.authService.currentUser();

    if (!currentUser?.cf) {
      this.errorMessage.set("Utente non autenticato o CF mancante");
      this.isLoading.set(false);
      return;
    }

    this.userService.getUserByCf(currentUser.cf).subscribe({
      next: (res: User) => {
        this.userProfile.set(res);
        this.isLoading.set(false);
        this.errorMessage.set(null);
      },
      error: (err) => {
        console.error("Errore caricamento profilo", err);
        this.isLoading.set(false);
        this.errorMessage.set("Impossibile caricare i dati del profilo");
      }
    });
  }

  public async openEditModal() {
    const modal = await this.modalCtrl.create({
      component: EditProfileModalComponent,
      componentProps: {
        profile: this.userProfile()
      }
    });

    modal.onDidDismiss().then((result) => {
      if (result.role === 'confirm') this.loadProfile();
    });

    await modal.present();
  }

}
