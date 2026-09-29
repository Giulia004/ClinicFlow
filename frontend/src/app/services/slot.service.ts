import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

export interface Slot {
    id?: number;
    medico_id: number;
    medico_name: string;
    medico_surname: string;
    specializzazione: string;
    date: string;
    orario_inizio: string;
    orario_fine: string;
    disponibile: boolean;
}

export interface CreateSlotPayload {
    medico_id: number;
    date: string;
    orario_inizio: string;
    orario_fine: string;
    disponibile?: boolean;
}
@Injectable({
    providedIn: 'root'
})

export class SlotService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/slots`;
    private authService = inject(AuthService);

    //Tutti gli slot disponibili per medico
    public getSlotByDocId(medicoId: number): Observable<Slot[]> {
        return this.http.get<Slot[]>(`${this.apiUrl}/medico/${medicoId}`, { headers: this.authService.getHeaders() });
    }

    //Tutti gli slot
    public getAllSlots(): Observable<Slot[]> {
        return this.http.get<Slot[]>(this.apiUrl, { headers: this.authService.getHeaders() });
    }

    //Creazione nuovo slot
    public createSlot(slot: CreateSlotPayload): Observable<Slot> {
        return this.http.post<Slot>(this.apiUrl, slot, { headers: this.authService.getHeaders() });
    }

    //Eliminazione slot
    public deleteSlot(slot_id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${slot_id}`, { headers: this.authService.getHeaders() });
    }

    //Modifica slot (uso di Partial per trasformare tutte le sue proprietà in facoltative)
    public updateSlot(id: number, slot: Partial<CreateSlotPayload>): Observable<Slot> {
        return this.http.put<Slot>(`${this.apiUrl}/${id}`, slot, { headers: this.authService.getHeaders() });
    }
}