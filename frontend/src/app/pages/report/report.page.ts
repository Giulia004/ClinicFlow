import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportService, Report } from '../../services/report.service';
import { AuthService } from '../../services/auth.service';
import { IonButton, IonContent, IonIcon, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addCircleOutline, alertCircleOutline, checkmarkCircleOutline, documentOutline, downloadOutline, searchOutline, trashOutline } from 'ionicons/icons';
import { FilterWidgetComponent } from '../../components/filter-widget/filter-widget.component';
import { ReportModalComponent } from '../../components/report-modal/report-modal.component';

@Component({
  selector: 'app-report.page',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.css'],
  imports: [CommonModule, FormsModule,IonButton,IonIcon,IonContent,FilterWidgetComponent],
})
export class ReportPage implements OnInit {
  private reportService = inject(ReportService);
  private modalCtrl = inject(ModalController);
  public authService = inject(AuthService);

  public reports = signal<Report[]>([]);
  public filteredReports = signal<Report[]>([]);
  public successMessage = signal<string | null>(null);
  public errorMessage = signal<string | null>(null);

  constructor() {
    addIcons({
      documentOutline, downloadOutline, trashOutline, addCircleOutline, alertCircleOutline, checkmarkCircleOutline, searchOutline
    });
  }

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    const user = this.authService.currentUser();

    if (!user) return;

    let request$;

    //Logica basata sul ruolo
    if (user.role === 'admin')
      request$ = this.reportService.getAllReports();
    else if (user.role === 'medico') {
      request$ = this.reportService.getReportsByDoc(user.id! || user.medico_id!);
    }
    else if (user.role === 'paziente') {
      request$ = this.reportService.getReportsByPatient(user.id! || user.paziente_id!);
    }
    else request$ = this.reportService.getAllReports();

    request$.subscribe({
      next: (res) => {
        this.reports.set(res);
        this.filteredReports.set(res);
        this.errorMessage.set(null);
      }, error: (err) => {
        console.log(err);
        this.errorMessage.set("Impossibile caricare i referti");
      }
    });
  }

  //Funzione per scaricare il PDF del referto
  downloadReport(id?: number, fileName?: string) {
    if (!id) return;

    this.reportService.downloadReport(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || `referto_${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.successMessage.set("Download completato");
      }, error: (err) => {
        console.error(err);
        this.errorMessage.set("Errore durante il download");
      }
    });
  }

  //Eliminazione del referto
  deleteReport(id: number) {
    if (!id) return;

    this.reportService.deleteReport(id).subscribe({
      next: () => {
        this.successMessage.set("Referto eliminato dal sistema");
        this.loadReports();
      }, error: (err) => {
        console.error(err);
        this.errorMessage.set("Impossibile eliminare il referto");
      }
    });
  }
}
