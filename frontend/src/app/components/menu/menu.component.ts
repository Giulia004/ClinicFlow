import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonMenuToggle, IonTitle, IonToolbar } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { calendarOutline, chatbubbleEllipsesOutline, chatbubbleOutline, documentTextOutline, gridOutline, homeOutline, logOutOutline, medkitOutline, peopleCircleOutline, peopleOutline, personCircleOutline, shieldCheckmarkOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone:true,
  imports: [CommonModule,RouterModule,IonItem,IonIcon,IonLabel,IonButton,IonContent,IonList,IonMenuToggle,IonMenu],
})
export class MenuComponent{

  constructor(public authService: AuthService, private router: Router) { 
    addIcons({
      medkitOutline,
      shieldCheckmarkOutline,
      homeOutline,
      calendarOutline,
      documentTextOutline,
      chatbubbleEllipsesOutline,
      peopleOutline, logOutOutline,gridOutline,timeOutline,personCircleOutline
    });
  }

  public currentUser = this.authService.currentUser();

  logout() {
    this.authService.logout();
    this.router.navigate(['/home'])
  }

}
