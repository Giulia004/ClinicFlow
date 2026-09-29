import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable, tap } from "rxjs";
import { RegisterPayload, User, UserRole } from "./user.service";

//Il server risponderà inviando un oggetto JSON contenente il token e i dati dell'utente loggato
export interface AuthResponse{
    token: string | string[];
    user: User;
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/auth`;

    public currentUser = signal<User | null>(this.getStoredUser());
    public token = signal<string | null>(this.getStoredToken());

    //Recupero e decodifica dell'utente salvato nel localStorage all'avvio
    private getStoredUser(): User | null {
        const userStr = sessionStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    //Recupero del token da localStorage e correzione di eventuali anomalie
    private getStoredToken(): string | null {
        const token = sessionStorage.getItem('token');
        if (!token) return null;
        return token.includes(',') ? token.split(',')[0] : token;
    }

    //Genera gli HttpHeaders con il Bearer Token per le richieste HTTP protette
    public getHeaders(): HttpHeaders{
        const currentToken = this.token() || this.getStoredToken();
        if (!currentToken) return new HttpHeaders();
        return new HttpHeaders().set('Authorization', `Bearer ${currentToken}`);
    }

    //Verifica se l'utente risulta autenticato controllando la presenza del token
    public isLoggedIn(): boolean {
        return !!this.token() || !!sessionStorage.getItem('token');
    }

    //Effettua il login mediante email e password e memorizza token e dati utente
    public login(credentials: { email: string, password: string }): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                if (response && response.token) {
                    const tokenToSave = Array.isArray(response.token) ? response.token[0] : response.token;
                    sessionStorage.setItem('token', tokenToSave);
                    sessionStorage.setItem('user', JSON.stringify(response.user));;

                    this.currentUser.set(response.user);
                    this.token.set(tokenToSave);
                }
            })
        );
    }

    //Registra un nuovo utente e memorizza la sessione
    public register(userData: RegisterPayload): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
            tap(response => {
                if (response && response.token) {
                    const tokenToSave = Array.isArray(response.token) ? response.token[0] : response.token;
                    sessionStorage.setItem('token', tokenToSave);
                    sessionStorage.setItem('user', JSON.stringify(response.user));

                    this.currentUser.set(response.user);
                    this.token.set(tokenToSave);
                }
            })
        );
    }

    //Effettua il logout pulendo il localStorage e azzerando i signals
    logout(): void {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        this.currentUser.set(null);
        this.token.set(null);
    }
}