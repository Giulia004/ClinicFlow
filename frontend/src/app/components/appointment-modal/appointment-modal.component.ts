import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController } from '@ionic/angular';
import { Medico, RegisterPayload, User, UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { calendarOutline, checkmarkCircleOutline, closeOutline, personAddOutline, saveOutline, searchOutline } from 'ionicons/icons';
import { Slot, SlotService } from '../../services/slot.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateAppPayload,AppointmentStatus } from '../../services/appointment.service';
@Component({
  selector: 'app-appointment-modal',
  templateUrl: './appointment-modal.component.html',
  styleUrls: ['./appointment-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonButton, IonToolbar, IonButtons, IonContent, IonTitle, IonHeader, IonIcon],
})

export class AppointmentModalComponent implements OnInit {
  private modalCtrl = inject(ModalController);
  private userService = inject(UserService);
  public authService = inject(AuthService);
  private slotService = inject(SlotService);

  public searchCf = signal<string>('');
  public foundPatient = signal<User | null>(null);
  public isNewPatient = signal<boolean>(false);

  //Informazioni da inserire se l'utente non è registrato
  public newNome: string = '';
  public newCognome: string = '';
  public newEmail: string = '';
  public newGruppoSanguigno = '';
  public newTelefono = '';

  public errorMessage = signal<string | null>(null);
  public successMessage = signal<string | null>(null);

  public mediciList = signal<Medico[]>([]);
  public availableSlots = signal<Slot[]>([]);
  public isLoading = signal<boolean>(false);

  //FormData per l'appuntamento
  public formData = {
    medico_id: null as number | null,
    slot_id: null as number | null,
    paziente_id: null as number | null,
    stato: 'attivo' as AppointmentStatus
  };

  constructor() {
    addIcons({
      closeOutline, saveOutline, calendarOutline, searchOutline, personAddOutline, checkmarkCircleOutline
    });
  }

  ngOnInit() {
    this.loadDocs();
  }

  loadDocs() {
    this.userService.getAllDocs().subscribe({
      next: (res) => this.mediciList.set(res),
      error: (err) => console.log("Errore caricamento dei medici", err)
    });
  }

  //Ricerca del paziente mediante il codice fiscale
  searchPatient() {
    if (!this.searchCf().trim()) {
      this.errorMessage.set("Inserisci un codice fiscale valido per la ricerca");
      return;
    }

    const query = this.searchCf().trim().toUpperCase();
    this.errorMessage.set(null);

    this.userService.getUserByCf(query).subscribe({
      next: (res: any) => {
        if (res) {
          this.foundPatient.set(res);
          this.isNewPatient.set(false);

          this.errorMessage.set(null);
          this.formData.paziente_id = res.id || res.paziente_id;
          this.successMessage.set(`Paziente trovato: ${res.name} ${res.surname}`);
        } else {
          this.foundPatient.set(null);
          this.isNewPatient.set(true);
          this.successMessage.set("Paziente non registrato. Inserisci i dati anagrafici sottostanti.");
        }
      }, error: () => {
        this.foundPatient.set(null);
        this.isNewPatient.set(true);
        this.errorMessage.set("Paziente non trovato in archivio. Compila i dati per registrarlo.");
      }
    });
  }

  //Registrazione nuovo paziente
  registerAndSelectNewPatient() {
    if (!this.newNome || !this.newCognome || !this.searchCf()) {
      this.errorMessage.set("Compila tutti i campi obbligatori per continuare");
      return;
    }

    const newUserPayload: RegisterPayload = {
      cf: this.searchCf().toUpperCase(),
      name: this.newNome,
      surname: this.newCognome,
      email: this.newEmail || undefined,
      role: 'paziente',
      gruppo_sanguigno: this.newGruppoSanguigno || undefined,
      telefono_emergenza: this.newTelefono || undefined
    };

    this.userService.registerUser(newUserPayload).subscribe({
      next: (res: any) => {
        this.successMessage.set("Paziente registrato con successo");
        this.isNewPatient.set(false);
        this.formData.paziente_id = res.paziente_id || res.id;
      }, error: (err) => {
        console.log(err);
        this.errorMessage.set("Errore durante la registrazione del nuovo utente");
      }
    });
  }

  public onDocChange(medico_id: number) {
    if (!medico_id || isNaN(medico_id)) {
      this.availableSlots.set([]);
      return;
    }

    this.slotService.getSlotByDocId(Number(medico_id)).subscribe({
      next: (res) => this.availableSlots.set(res),
      error: (err) => {
        console.error("Errore caricamento slot", err);
        this.availableSlots.set([]);
      }
    });
  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public save() {
    if (!this.formData.medico_id || !this.formData.slot_id) return;

    const currentUser = this.authService.currentUser();
    const role = currentUser?.role === 'sportellista' ? 'sportellista' : 'paziente';

    let pazienteId: number | null = null;

    //Flusso per la prenotazione tramite lo sportello
    if (role === 'sportellista') {
      if (this.isNewPatient()) {
        this.errorMessage.set("Paziente da registrare");
        return;
      }
      pazienteId = Number(this.formData.paziente_id);
    } else {
      pazienteId = (currentUser as any)?.paziente_id || currentUser?.id || null;
    }

    if (!pazienteId || isNaN(pazienteId)) {
      this.errorMessage.set("Paziente non associato correttamente");
      return;
    }

    const appointmentData:CreateAppPayload= {
      medico_id: Number(this.formData.medico_id),
      slot_id: Number(this.formData.slot_id),
      stato: this.formData.stato,
      creato_da: role,
      paziente_id: pazienteId,
      data_creazione: new Date().toISOString()
    }

    this.modalCtrl.dismiss(appointmentData, 'confirm');
  }
}
