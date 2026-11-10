import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { calendarOutline, chatbubbleEllipsesOutline, chatbubbleOutline, documentTextOutline, gridOutline, homeOutline, logOutOutline, medkitOutline,peopleOutline, personCircleOutline, shieldCheckmarkOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone:true,
  imports: [CommonModule,RouterModule,IonItem,IonIcon,IonLabel,IonButton,IonContent,IonList,IonMenuToggle,IonMenu],
})
export class MenuComponent{
  authService = inject(AuthService);
  private router = inject(Router);


  constructor() { 
    addIcons({
      medkitOutline,
      shieldCheckmarkOutline,
      homeOutline,
      calendarOutline,
      documentTextOutline,
      chatbubbleEllipsesOutline,
      peopleOutline, logOutOutline,gridOutline,timeOutline,personCircleOutline,chatbubbleOutline
    });
  }

  public currentUser = this.authService.currentUser();

  logout() {
    this.authService.logout();
    this.router.navigate(['/home'])
  }

}