import { Component, inject, OnInit, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { addCircleOutline, alertCircleOutline, createOutline, personOutline, trashOutline } from 'ionicons/icons';
import { User, UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { IonButton, IonContent, IonHeader, IonIcon, IonSpinner, IonTitle, IonToolbar, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { UserModalComponent } from '../../components/user-modal/user-modal.component';
import { FilterWidgetComponent } from '../../components/filter-widget/filter-widget.component';
import { EditProfileModalComponent } from '../../components/edit-profile-modal/edit-profile-modal.component';

@Component({
  selector: 'app-users.page',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.css'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonSpinner, FilterWidgetComponent],
})
export class UsersPage implements OnInit {
  private userService = inject(UserService);
  public authService = inject(AuthService);
  private modalCtrl = inject(ModalController);

  public usersList = signal<User[]>([]);
  public filteredUsers = signal<User[]>([]);
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);
  public successMessage = signal<string | null>(null);

  constructor() {
    addIcons({
      addCircleOutline, trashOutline, personOutline, alertCircleOutline,createOutline
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);

    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.usersList.set(res);
        this.isLoading.set(false);
      }, error: (err) => {
        console.log(err);
        this.isLoading.set(false);
        this.errorMessage.set("Impossibile caricare gli utenti");
      }
    });
  }

  deleteUser(cf: string) {
    if (!cf) return;

    this.userService.deleteUser(cf).subscribe({
      next: () => {
        this.successMessage.set("Utente eliminato con successo");
        this.loadUsers();
      }, error: (err) => {
        console.log(err);
        this.errorMessage.set("Errore durante l'eliminazione dell'utente");
      }
    });
  }

  public async openAddUserModal() {
    const modal = await this.modalCtrl.create({
      component: UserModalComponent
    });

    modal.onDidDismiss().then((result) => {
      if (result.role === 'confirm') {
        this.successMessage.set("Membro dello staff registrato con successo");
        this.loadUsers();
      }
    });

    await modal.present();
  }

  public async openEditUserModal(cf: string) {
    if (!cf) return;

    this.userService.getUserByCf(cf).subscribe({
      next: async (profile) => {
        const modal = await this.modalCtrl.create({
          component: EditProfileModalComponent,
          componentProps: {
            profile,
            isAdminEdit: true
          }
        });

        modal.onDidDismiss().then((result) => {
          if (result.role === 'confirm') {
            this.errorMessage.set(null);
            this.successMessage.set("Profilo aggiornato con successo");
            this.loadUsers();
          }
        });

        await modal.present();
      }, error: (err) => {
        console.log(err);
        this.successMessage.set(null);
        this.errorMessage.set("Impossibile caricare i dati dell'utente");
      }
    });
  }
}
