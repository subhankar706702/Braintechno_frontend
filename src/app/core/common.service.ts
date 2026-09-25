import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_BASE_URL } from "./api.config";
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class CommonApiService {

    constructor(
        private readonly http: HttpClient
    ) { }


    getbusinessCategorys(): Observable<any> {
        return this.http.get(
            `${API_BASE_URL}/business-categories`,
            {}
        );
    }
}
