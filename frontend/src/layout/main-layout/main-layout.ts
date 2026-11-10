import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { IonButtons, IonContent, IonHeader, IonIcon,  IonMenuButton, IonRouterOutlet, IonTitle, IonToolbar} from "@ionic/angular";
import { addIcons } from "ionicons";
import { menuOutline } from "ionicons/icons";
import { AuthService } from "../../app/services/auth.service";
import { MenuComponent } from "../../app/components/menu/menu.component";

@Component({
    selector: 'app-main-layout',
    templateUrl: 'main-layout.html',
    styleUrl: 'main-layout.css',
    standalone: true,
    imports: [CommonModule, IonContent, IonToolbar, IonTitle, IonHeader, IonRouterOutlet,IonIcon, IonButtons, IonContent, IonMenuButton, MenuComponent,MenuComponent]
})

export class MainLayoutComponent {
    authService = inject(AuthService);
    private router = inject(Router);

    constructor() {
        addIcons({menuOutline});
    }
}