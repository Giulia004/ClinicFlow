import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

export interface Feedback {
    id?: number;
    appuntamento_id: number;
    paziente_id: number;
    medico_id: number;
    voto: number;
    commento?: string;
    data_creazione: string;
}

export interface CreateFeedbackPayload {
    appuntamento_id: number;
    medico_id: number;
    paziente_id: number;
    voto: number;
    commento?: string;
    data_creazione: string;
}

@Injectable({
    providedIn: 'root'
})

export class FeedbackService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/feedback`;
    private authService = inject(AuthService);

    public getAllFeedback(): Observable<Feedback[]> {
        return this.http.get<Feedback[]>(this.apiUrl, { headers: this.authService.getHeaders() });
    }

    public createFeedback(feed: CreateFeedbackPayload): Observable<Feedback> {
        return this.http.post<Feedback>(this.apiUrl, feed, { headers: this.authService.getHeaders() });
    }

    public getFeedbackById(id: number): Observable<Feedback> {
        return this.http.get<Feedback>(`${this.apiUrl}/${id}`);
    }

    public deleteFeedback(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.authService.getHeaders() });
    }
}