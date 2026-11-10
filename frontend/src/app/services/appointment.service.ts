import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

export type AppointmentStatus = 'attivo' | 'confermato' | 'annullato' | 'completato';

//Interfaccia per la tipizzazione dell'appuntamento
export interface Appointment {
    id?: number;
    paziente_id?: number;
    patient_name?: string;
    patient_surname?: string;
    patient_email?: string;
    medico_id: number;
    medico_name?: string;
    medico_surname?: string;
    medico_specializzazione?: string;
    slot_id: number;
    data: string;
    orario_inizio: string;
    orario_fine: string;
    stato: AppointmentStatus;
    creato_da: 'paziente' | 'sportellista';
    data_creazione?: string;
}

export interface CreateAppPayload {
    medico_id: number;
    slot_id: number;
    paziente_id?: number;
    creato_da: 'paziente' | 'sportellista';
    stato: AppointmentStatus;
    data_creazione: string;
}
@Injectable({
    providedIn: 'root'
})

export class AppointmentService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);

    private apiUrl = `${environment.apiUrl}/appointments`;

    //Tutti gli appuntamenti
    public getAppointments(): Observable<Appointment[]> {
        return this.http.get<Appointment[]>(this.apiUrl, { headers: this.authService.getHeaders() });
    }

    //Creazione appuntamento
    public createAppointment(app: CreateAppPayload): Observable<{ message: string; appointment: Appointment }> {
        return this.http.post<{ message: string; appointment: Appointment }>(this.apiUrl, app, { headers: this.authService.getHeaders() });
    }

    //Aggiornamento appuntamento
    public updateAppointment(id: number, app: Partial<Appointment>): Observable<unknown> {
        return this.http.put<Appointment>(`${this.apiUrl}/${id}`, app, { headers: this.authService.getHeaders() });
    }

    //Eliminazione appuntamento
    public removeAppointment(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers: this.authService.getHeaders() });
    }

    //Conferma appuntamento (check-in)
    public confirmAppointment(id: number): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.apiUrl}/${id}/confirm`, {}, { headers: this.authService.getHeaders() });
    }

    //Completa appuntamento
    public completeAppointment(id: number): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.apiUrl}/${id}/complete`, {}, { headers: this.authService.getHeaders() });
    }

    //Disdire appuntamento
    public unsubscribeAppointment(id: number): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.apiUrl}/${id}/unsubscribe`, {}, { headers: this.authService.getHeaders() });
    }
}