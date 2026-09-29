import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CreateSlotPayload, Slot } from '../../services/slot.service';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonSelect, IonSelectOption, IonTitle, IonToolbar, ModalController } from '@ionic/angular';
import { Medico, UserService } from '../../services/user.service';
import { addIcons } from 'ionicons';
import { calendarOutline, closeOutline, saveOutline, timeOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-slot-modal',
  templateUrl: './slot-modal.component.html',
  styleUrls: ['./slot-modal.component.css'],
  standalone: true,
  imports: [IonHeader, IonIcon, IonButton, IonButtons, IonToolbar, IonTitle, IonSelect, IonSelectOption, IonItem, IonInput, IonContent, CommonModule, FormsModule],
})
export class SlotModalComponent implements OnInit {
  private modalCtrl = inject(ModalController);
  private userService = inject(UserService);

  @Input() slot: Slot | null = null;

  public isEditMode = false;
  public docList = signal<Medico[]>([]);

  //Form per l'inserimento dei dati
  public formData = {
    medico_id: null as number | null,
    data: '',
    orario_inizio: '',
    orario_fine: '',
    disponibile: true
  };

  constructor() {
    addIcons({
      closeOutline, saveOutline, calendarOutline, timeOutline
    });
  }

  ngOnInit() {
    this.loadDocs();

    if (this.slot) {
      this.isEditMode = true;
      const formattedDate = this.slot.date ? this.slot.date.split('T')[0] : '';

      this.formData = {
        medico_id: this.slot.medico_id,
        data: formattedDate,
        orario_inizio: this.slot.orario_inizio,
        orario_fine: this.slot.orario_fine,
        disponibile: this.slot.disponibile
      };
    }
  }

  loadDocs() {
    this.userService.getAllDocs().subscribe({
      next: (res) => {
        this.docList.set(res)
      },
      error: (err) => console.log(err)
    });
  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public save() {
    if (!this.formData.medico_id || !this.formData.orario_inizio || !this.formData.orario_fine) {
      return;
    }
    const resultData: CreateSlotPayload = {
      medico_id: Number(this.formData.medico_id),
      date: this.formData.data,
      orario_inizio: this.formData.orario_inizio,
      orario_fine: this.formData.orario_fine,
      disponibile: this.formData.disponibile
    };

    this.modalCtrl.dismiss(resultData, 'confirm');
  }
}
