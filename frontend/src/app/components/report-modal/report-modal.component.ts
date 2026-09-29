import { Component, inject, Input, signal } from '@angular/core';
import { IonButton, IonContent, IonIcon, IonItem, IonSelect, IonSelectOption, IonTextarea, ModalController } from '@ionic/angular';
import { Appointment, AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { closeOutline, cloudUploadOutline, documentOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.css'],
  imports: [CommonModule, IonContent, IonButton, FormsModule, IonIcon],
})
export class ReportModalComponent {
  @Input() appointmentId!: number;
  @Input() pazienteId!: number;
  @Input() medicoId!: number;

  private modalCtrl = inject(ModalController);

  public selectedFile: File | null = null;
  public errorMessage = signal<string | null>(null);

  constructor() {
    addIcons({
      cloudUploadOutline, documentOutline, closeOutline
    });
  }

  ngOnInit() {
  }

  onFileSelected(event:any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.errorMessage.set(null);
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    if (!this.selectedFile) {
      this.errorMessage.set("Seleziona un file da caricare");
      return;
    }

    const formData = new FormData();
    formData.append('appuntamento_id', this.appointmentId.toString());
    formData.append('paziente_id', this.pazienteId.toString());
    formData.append('medico_id', this.medicoId.toString());
    formData.append('file_referto', this.selectedFile);

    this.modalCtrl.dismiss(formData, 'confirm');
  }
}
