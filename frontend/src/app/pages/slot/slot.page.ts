import { Component, inject, OnInit, signal } from '@angular/core';
import { Slot, SlotService } from '../../services/slot.service';
import { Medico, UserService } from '../../services/user.service';
import { addIcons } from 'ionicons';
import { addOutline, calendarOutline, closeOutline, timeOutline, trashOutline } from 'ionicons/icons';
import { IonButton, IonIcon, IonSpinner, ModalController } from '@ionic/angular';
import { SlotModalComponent } from '../../components/slot-modal/slot-modal.component';
import { IonContent } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { FilterWidgetComponent } from '../../components/filter-widget/filter-widget.component';

@Component({
  selector: 'app-slot.page',
  templateUrl: './slot.page.html',
  styleUrls: ['./slot.page.css'],
  standalone: true,
  imports: [IonContent, IonIcon, IonButton, CommonModule, IonSpinner, FilterWidgetComponent],
})
export class SlotPage implements OnInit {
  //private authService = inject(AuthService);
  private slotService = inject(SlotService);
  private userService = inject(UserService);
  private modalCtrl = inject(ModalController);

  public slots = signal<Slot[]>([]);
  public filteredSlots = signal<Slot[]>([]);
  public docList = signal<Medico[]>([]);
  public isLoading = signal<boolean>(false);

  public newSlot = {
    medico_id: null as number | null,
    date: '',
    orario_inizio: '',
    orario_fine: '',
    disponibile: true
  };

  constructor() {
    addIcons({
      addOutline, trashOutline, calendarOutline, timeOutline, closeOutline
    });
  }

  ngOnInit() {
    this.loadSlots();
    this.loadDocs();
  }

  loadSlots() {
    this.isLoading.set(true);
    this.slotService.getAllSlots().subscribe({
      next: (res) => {
        this.slots.set(res);
        console.log(this.slots);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error("Errore durante il caricamento degli slot", err);
        this.isLoading.set(false);
      }
    });
  }

  loadDocs() {
    this.userService.getAllDocs().subscribe({
      next: (res) => this.docList.set(res),
      error: (err) => console.error("Errore durante il caricamento dei medici")
    })
  }

  public async openSlotModal(slotToEdit?: Slot) {
    const modal = await this.modalCtrl.create({
      component: SlotModalComponent,
      componentProps: { slot: slotToEdit || null }
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      if (slotToEdit && slotToEdit.id) {
        this.slotService.updateSlot(slotToEdit.id, data).subscribe({
          next: () => this.loadSlots(),
          error: (err) => console.error(err)
        });
      }
      else {
        this.slotService.createSlot(data).subscribe({
          next: () => this.loadSlots(),
          error: (err) => console.error(err)
        });
      }
    }
  }

  public deleteSlot(id: number) {
    if (!id) return;
    this.slotService.deleteSlot(id).subscribe({
      next: () => this.loadSlots(),
      error: (err) => console.error("Errore durante l'eliminazione dello slot")
    });
  }
}
