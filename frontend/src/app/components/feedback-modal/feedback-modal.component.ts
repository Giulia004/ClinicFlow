import { Component, inject, Input, signal } from '@angular/core';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonTextarea, IonTitle, IonToolbar, ModalController } from '@ionic/angular';
import { CreateFeedbackPayload, FeedbackService } from '../../services/feedback.service';
import { addIcons } from 'ionicons';
import { alertCircleOutline, closeOutline, sendOutline, star, starOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.css'],
  imports: [IonContent,IonHeader,CommonModule,FormsModule,IonTitle,IonIcon,IonButton,IonButtons,IonToolbar,IonTextarea,IonItem,IonLabel],
})
export class FeedbackModalComponent {
  @Input() appointmentId!: number;
  @Input() medicoId!: number;
  @Input() pazienteId!: number;

  private modalCtrl = inject(ModalController);
  private feedbackService = inject(FeedbackService);

  //Dati da inserire
  public voto = signal<number>(5);
  public commento = signal<string>('');
  public errorMessage = signal<string | null>(null);

  constructor() { 
    addIcons({
      closeOutline, star, starOutline, sendOutline, alertCircleOutline
    });
  }

  public setRating(stars: number) {
    this.voto.set(stars);
  }

  public dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  public submitFeedback() {
    if (!this.voto()) {
      this.errorMessage.set("Seleziona una valutazione in stelle");
      return;
    }

    const payload: CreateFeedbackPayload = {
      appuntamento_id: this.appointmentId,
      medico_id: this.medicoId,
      paziente_id: this.pazienteId,
      voto: this.voto(),
      commento: this.commento() || undefined,
      data_creazione: new Date().toString()
    };

    this.feedbackService.createFeedback(payload).subscribe({
      next: (res) => this.modalCtrl.dismiss(res, 'confirm'),
      error: (err) => {
        console.error(err);
        this.errorMessage.set("Errore durante l'invio del feedback. Riprova");
      }
    });
  }
}
