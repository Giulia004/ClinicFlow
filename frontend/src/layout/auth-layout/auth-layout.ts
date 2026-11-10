import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonButtons, IonContent, IonHeader, IonIcon, IonRouterOutlet, IonTitle, IonToolbar,IonBackButton } from "@ionic/angular";
import { addIcons } from "ionicons";
import { arrowBackOutline, medkitOutline } from "ionicons/icons";

@Component({
    selector: 'app-auth-layout',
    templateUrl: './auth-layout.html',
    styleUrls: ['./auth-layout.css'],
    standalone: true,
    imports: [CommonModule, RouterModule, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent,IonIcon,IonRouterOutlet,IonBackButton]
})

export class AuthLayoutComponent {
    constructor() {
        addIcons({
            arrowBackOutline, medkitOutline
        });
    }
}