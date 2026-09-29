import { Component, inject } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonContent, IonIcon, } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline, checkmarkCircleOutline, documentTextOutline, logInOutline, medkitOutline, personAddOutline, personCircleOutline, pulseOutline, shieldCheckmarkOutline, shieldOutline, statsChartOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.css'],
  imports: [IonContent, IonButton, IonCard, IonContent, IonCardContent, IonIcon],
})
export class HomePage {
  public authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    addIcons({
      medkitOutline, logInOutline, personAddOutline, checkmarkCircleOutline, shieldOutline, documentTextOutline, calendarOutline, statsChartOutline, shieldCheckmarkOutline, pulseOutline,personCircleOutline
    })
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
