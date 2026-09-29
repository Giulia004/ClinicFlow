import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonMenuToggle, IonRouterOutlet, IonTitle, IonToolbar,IonRouterLink } from "@ionic/angular";
import { addIcons } from "ionicons";
import { calendarOutline, chatbubbleOutline, documentTextOutline, homeOutline, logOutOutline, medkitOutline, menuOutline, peopleCircleOutline } from "ionicons/icons";
import { AuthService } from "../../app/services/auth.service";

@Component({
    selector: 'app-main-layout',
    templateUrl: 'main-layout.page.html',
    styleUrl: 'main-layout.page.css',
    standalone: true,
    imports: [CommonModule,RouterLink, IonContent, IonList, IonToolbar, IonTitle, IonItem, IonList, IonLabel, IonMenu, IonHeader, IonRouterOutlet, IonButton, IonIcon, IonLabel, IonMenuToggle, IonList, IonButtons, IonContent, IonMenuButton, IonRouterLink]
})

export class MainLayout {
    constructor(public authService: AuthService, private router: Router) {
        addIcons({
            menuOutline, homeOutline, calendarOutline, documentTextOutline, chatbubbleOutline, logOutOutline, medkitOutline,peopleCircleOutline
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/home']);
    }

    goToDashboard() {
        this.router.navigate(['/dashboard']);
    }

    goToAppointments() {
        this.router.navigate(['/dashboard/appointments']);
    }

    goToReports() {

    }

    goToFeedback() {

    }
}