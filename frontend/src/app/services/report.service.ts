import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

export interface Report {
    id?: number;
    appuntamento_id: number;
    paziente_id: number;
    medico_id: number;
    file_referto: string; //Nome file o URL
    patient_name?: string;
    patient_surname?: string;
    medico_name?: string;
    medico_surname?: string;
    medico_specializzazione?: string;
    data_creazione?: string;
}

@Injectable({
    providedIn: 'root'
})

export class ReportService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/reports`;
    private authService = inject(AuthService);

    public getAllReports(): Observable<Report[]> {
        return this.http.get<Report[]>(this.apiUrl, { headers: this.authService.getHeaders() });
    }
    //Report di un paziente specifico
    public getReportsByPatient(patient_id: number): Observable<Report[]> {
        return this.http.get<Report[]>(`${this.apiUrl}/paziente/${patient_id}`, { headers: this.authService.getHeaders() });
    }

    //Report di scritti da un medico specifico
    public getReportsByDoc(medico_id: number): Observable<Report[]> {
        return this.http.get<Report[]>(`${this.apiUrl}/medico/${medico_id}`, { headers: this.authService.getHeaders() });
    }

    //Caricamento nuovo referto
    public createReport(formData: FormData): Observable<Report> {
        return this.http.post<Report>(this.apiUrl, formData, { headers: this.authService.getHeaders() });
    }

    //Download referto
    public downloadReport(id: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob', headers: this.authService.getHeaders() })
    }
    //Eliminazione referto
    public deleteReport(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.authService.getHeaders() });
    }
}