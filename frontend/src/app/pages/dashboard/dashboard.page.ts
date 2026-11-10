import { Component, computed, inject } from '@angular/core';
import { addIcons } from 'ionicons';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonCard, IonCardContent, IonIcon, IonContent } from '@ionic/angular';
import { addCircleOutline, arrowForwardOutline, calendarOutline, chatbubbleEllipsesOutline, chatbubbleOutline, chevronForwardOutline, documentTextOutline, logOutOutline, medkitOutline, notificationsOutline, peopleOutline, personCircleOutline, personOutline, pulseOutline, shieldCheckmarkOutline, statsChartOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css'],
  standalone: true,
  imports: [IonIcon, IonButton, IonCard, IonCardContent, IonContent, RouterLink],
})
export class DashboardPage{
  authService = inject(AuthService);
  router = inject(Router);


  public role = computed(() => this.authService.currentUser()?.role);

  constructor() {
    addIcons({
      calendarOutline, documentTextOutline, personOutline, logOutOutline, notificationsOutline, pulseOutline, timeOutline, chevronForwardOutline, shieldCheckmarkOutline, addCircleOutline, peopleOutline, medkitOutline, statsChartOutline,arrowForwardOutline,personCircleOutline,chatbubbleEllipsesOutline
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
