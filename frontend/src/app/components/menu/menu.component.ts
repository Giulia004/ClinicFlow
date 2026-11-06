import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonMenuToggle, IonTitle, IonToolbar } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { calendarOutline, chatbubbleOutline, documentTextOutline, homeOutline, logOutOutline, medkitOutline, peopleCircleOutline, shieldCheckmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone:true,
  imports: [CommonModule,RouterModule,IonItem,IonIcon,IonLabel,IonButton,IonHeader,IonToolbar,IonTitle,IonContent,IonList,IonMenuToggle,IonMenu],
})
export class MenuComponent{

  constructor(public authService: AuthService, private router: Router) { 
    addIcons({
      medkitOutline,
      shieldCheckmarkOutline,
      homeOutline,
      calendarOutline,
      documentTextOutline,
      chatbubbleOutline,
      peopleCircleOutline, logOutOutline
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home'])
  }

}
