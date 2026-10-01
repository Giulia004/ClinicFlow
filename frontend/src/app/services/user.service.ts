import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

export type UserRole = 'admin' | 'sportellista' | 'medico' | 'paziente';

export interface BaseUser {
    id?: number;
    cf: string;
    name: string;
    surname: string;
    email?: string | null;
    role: UserRole;
}

export interface Medico extends BaseUser {
    role: 'medico';
    medico_id: number;
    specializzazione: string;
    numero_albo: string;
}

export interface Paziente extends BaseUser {
    role: 'paziente';
    paziente_id: number;
    telefono_emergenza: string;
    gruppo_sanguigno: string;
}

export interface Sportellista extends BaseUser {
    role: 'sportellista';
    sportellista_id: number;
    postazione: string;
}

export interface Admin extends BaseUser {
    role: 'admin';
}


//Payload isolati per le azioni di scrittura (Registrazione/Modifica)
export interface RegisterPayload extends BaseUser {
    password?: string;
    gruppo_sanguigno?: string;
    telefono_emergenza?: string;
    specializzazione?: string;
    numeroAlbo?: string;
    postazione?: string;
}

export interface UpdateProfilePayload {
    name?: string;
    surname?: string;
    email?: string;
    password?: string;
    gruppo_sanguigno?: string;
    telefono_emergenza?: string;
    specializzazione?: string;
    numero_albo?: string;
    postazione?: string;
}

export type User = Medico | Paziente | Sportellista | Admin;

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private authService = inject(AuthService);
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/users`;

    //Tutti gli utenti
    public getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl, { headers: this.authService.getHeaders() });
    }

    //Elenco di tutti i medici registrati
    public getAllDocs(): Observable<Medico[]> {
        return this.http.get<Medico[]>(`${this.apiUrl}/medici`, { headers: this.authService.getHeaders() });
    }

    //Trova l'utente
    public getUserByCf(cf: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${cf}`, { headers: this.authService.getHeaders() });
    }
    //Eliminazione utente
    public deleteUser(cf: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${cf}`, { headers: this.authService.getHeaders() });
    }

    //Registrazione nuovo paziente
    public registerUser(data: RegisterPayload): Observable<User> {
        return this.http.post<User>(this.apiUrl, data, { headers: this.authService.getHeaders() });
    }

    //Modifiche informazioni utente
    public updateUser(cf: string, data: UpdateProfilePayload): Observable<any> {
        return this.http.put(`${this.apiUrl}/${cf}`, data, { headers: this.authService.getHeaders() });
    }
}