import { Component, computed, OnInit, signal, inject } from '@angular/core';
import { Feedback, FeedbackService } from '../../services/feedback.service';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { calendarOutline, chatbubbleEllipsesOutline, chatbubbleOutline, chatbubblesOutline, personOutline, star, starOutline, trashOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonSpinner, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-feedback.page',
  templateUrl: './feedback.page.html',
  standalone: true,
  styleUrls: ['./feedback.page.css'],
  imports: [CommonModule, IonIcon, IonContent, IonSpinner, IonButton, IonCard, IonCardContent],
})
export class FeedbackPage implements OnInit {
  private feedbackService = inject(FeedbackService);
  authService = inject(AuthService);

  public feedbackList = signal<Feedback[]>([]);
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  role = computed(() => this.authService.currentUser()?.role);

  constructor() {
    addIcons({
      star, starOutline, chatbubbleOutline, calendarOutline, trashOutline, personOutline, chatbubbleEllipsesOutline, chatbubblesOutline
    });
  }

  ngOnInit() {
    this.loadFeedback();
  }

  loadFeedback() {
    this.isLoading.set(true);

    this.feedbackService.getAllFeedback().subscribe({
      next: (res) => {
        const currentUser = this.authService.currentUser();
        let data = res;

        if (currentUser && this.role() === 'medico') {
          const medicoId = currentUser.id || (currentUser as any).medico_id;
          data = res.filter(f => f.medico_id === medicoId);
        } else if (currentUser && this.role() === 'paziente') {
          const pazienteId = currentUser.id || (currentUser as any).paziente_id;
          data = res.filter(f => f.paziente_id === pazienteId);
        }
        this.feedbackList.set(data);
        this.isLoading.set(false);
        this.errorMessage.set(null);
      }, error: (err) => {
        console.log(err);
        this.isLoading.set(false);
        this.errorMessage.set("Impossibile caricare i feedback");
      }
    });
  }

  deleteFeedback(id: number) {
    if (!id) return;

    this.feedbackService.deleteFeedback(id).subscribe({
      next: () => this.loadFeedback(),
      error: (err) => console.log(err)
    });
  }
}
