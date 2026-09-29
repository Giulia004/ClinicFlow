import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { addCircleOutline, alertCircleOutline, calendarOutline, checkmarkCircleOutline, closeCircleOutline, medkitOutline, personOutline, timeOutline, todayOutline, trashOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Appointment, AppointmentService, CreateAppPayload } from '../../services/appointment.service';
import { IonButton, IonContent, IonIcon, ModalController } from '@ionic/angular';
import { AppointmentModalComponent } from '../../components/appointment-modal/appointment-modal.component';
import { FilterWidgetComponent } from '../../components/filter-widget/filter-widget.component';
import { FeedbackModalComponent } from '../../components/feedback-modal/feedback-modal.component';
import { ReportModalComponent } from '../../components/report-modal/report-modal.component';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-appointments.page',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonIcon, IonButton, IonContent, FilterWidgetComponent, AppointmentModalComponent],
})
export class AppointmentsPage implements OnInit {
  private appService = inject(AppointmentService);
  private modalCtrl = inject(ModalController);
  private reportService = inject(ReportService);

  public appointments = signal<Appointment[]>([]);
  public filteredAppointments = signal<Appointment[]>([]);
  public successMessage = signal<string | null>(null);
  public errorMessage = signal<string | null>(null);

  role = computed(() => this.authService.currentUser()?.role);

  constructor(public authService: AuthService) {
    addIcons({
      calendarOutline, timeOutline, medkitOutline, personOutline, checkmarkCircleOutline, trashOutline, addCircleOutline, alertCircleOutline, todayOutline, closeCircleOutline
    });
  }

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.appService.getAppointments().subscribe({
      next: (res) => {
        const currentUser = this.authService.currentUser();
        let data = res;

        //Se l'utente è un medico allora filtriamo i suoi appuntamenti
        if (currentUser && currentUser.role === 'medico') {
          data = res.filter((app: any) => app.medico_id === currentUser.id || app.medico_id === currentUser.medico_id);

          const today = new Date().toISOString().split('T')[0];

          const todayApps = data.filter(app => {
            const appDate = app.data ? app.data.split('T')[0] : '';
            return appDate === today;
          });
          this.appointments.set(todayApps);
          this.filteredAppointments.set(todayApps);
        }
        else {
          this.appointments.set(data);
          this.filteredAppointments.set(data);
        }
        this.errorMessage.set(null);
        console.log(res);
      },
      error: (err) => {
        console.log("Errore durante il caricamento degli appuntamenti,", err);
        this.errorMessage.set("Impossibile caricare gli appuntamenti");
      }
    });
  }

  private createReport(formData: FormData) {
    this.reportService.createReport(formData).subscribe({
      next: () => {
        this.successMessage.set("Referto creato con successo");
        this.errorMessage.set(null);
        this.loadAppointments();
      }, error: (err) => {
        console.log(err);
        this.errorMessage.set("Errore durante la creazione del referto");
      }
    });
  }
  public async openAddModal() {
    const modal = await this.modalCtrl.create({
      component: AppointmentModalComponent
    });

    modal.onDidDismiss().then((result) => {
      if (result.role === 'confirm' && result.data) this.createBooking(result.data);
    });

    await modal.present();
  }

  public async openReportModal(appointment: any) {
    const modal = await this.modalCtrl.create({
      component: ReportModalComponent,
      componentProps: {
        appointmentId: appointment.id,
        pazienteId: appointment.paziente_id,
        medicoId: appointment.medico_id
      }
    });

    modal.onWillDismiss().then((result) => {
      if (result.role === 'confirm') {
        this.successMessage.set("Referto salvato con successo");
        this.createReport(result.data);
      }
    });

    await modal.present();
  }
  public async openFeedbackModal(appointment: any) {
    const modal = this.modalCtrl.create({
      component: FeedbackModalComponent,
      componentProps: {
        appointmentId: appointment.id,
        medicoId: appointment.medico_id,
        pazienteId: appointment.paziente_id
      }
    });

    (await modal).onDidDismiss().then((result) => {
      if (result.role === 'confirm') this.loadAppointments();
    });

    (await modal).present();
  }
  //Creazione nuova prenotazione
  private createBooking(payload: CreateAppPayload) {
    console.log(payload);
    this.appService.createAppointment(payload).subscribe({
      next: () => {
        this.successMessage.set("Prenotazione avvenuta con successo");
        this.errorMessage.set(null);
        this.loadAppointments();
      }, error: (err) => {
        this.errorMessage.set("Errore durante la prenotazione");
        this.successMessage.set(null);
        console.log(err);
      }
    });
  }

  public confirmBooking(id: number) {
    if (!id) return;

    this.appService.confirmAppointment(id).subscribe({
      next: () => {
        this.successMessage.set("Check-in effettuato");
        this.loadAppointments();
      },
      error: (err) => {
        this.errorMessage.set("Qualcosa è andato storto");
        console.log(err);
      }
    });
  }

  public cancelBooking(id?: number) {
    if (!id) return;

    this.appService.deleteAppointment(id).subscribe({
      next: () => {
        this.loadAppointments();
        this.successMessage.set("Appuntamento cancellato con successo");
      }, error: (err) => console.error("Errore durante la cancellazione:", err)
    });
  }

  public completeBooking(id: number) {
    if (!id) return;
    this.appService.completeAppointment(id).subscribe({
      next: () => this.successMessage.set("Appuntamento completato"),
      error: (err) => {
        this.errorMessage.set("Qualcosa è andato storto");
        console.log(err);
      }
    });
  }

  public removeBooking(id: number) {
    if (!id) return;

    this.appService.removeAppointment(id).subscribe({
      next: () => this.successMessage.set("Eliminazione avvenuta con successo"),
      error: (err) => {
        this.errorMessage.set("Errore durante la rimozione");
        console.log(err);
      }
    });
  }
}
