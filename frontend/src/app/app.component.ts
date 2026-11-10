import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet} from '@ionic/angular';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  authService = inject(AuthService);
}
