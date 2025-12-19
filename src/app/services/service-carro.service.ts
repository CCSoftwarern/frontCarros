import { Injectable } from '@angular/core';
import { map,Observable } from "rxjs";
import { environment } from '../environments/environment';
import { Carro } from '../interface/carro';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ServiceCarroService {
  private apiURL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCarros(): Observable<Carro[]>{
    const body = {};
    return this.http.get<Carro[]>(this.apiURL+"/listarCarros", body).pipe(map((response: any) => response));
}

postCarro(id: string, modelo: string, preco: string): Observable<Carro> {
  const body = {
    id,
    modelo,
    preco
  };

  const url = `${this.apiURL}/saveCarro`;

  return this.http.post<Carro>(url, body).pipe(
    map((response: Carro) => response)
  );
}

 deleteCarro(modelo:string): Observable<any> {
  const url = `${this.apiURL}/deleteCarro`;
  const headers = { 'Content-Type': 'text/plain' };
  const body = `${modelo}`;
  return this.http.post(url, body, { headers}).pipe(
    map(response => response)
  );
}

// deleteCarro(carro: Carro): Observable<void> {
//   const url = `${this.apiURL}deleteCarro?modelo=${carro.modelo}`;
//   return this.http.post<void>(url); // Envie um corpo vazio {}
// }



saveCarro(carro: Carro): Observable<any> {
  const url = `${this.apiURL}/saveCarro`;
  const headers = { 'Content-Type': 'text/plain' };
  const body = `${carro.modelo},${carro.preco}`;

  return this.http.post(url, body, { headers}).pipe(
    map(response => response)
  );
}

// saveCarro(carro: Carro): Observable<any> {
//   const url = `${this.apiURL}saveCarro?modelo=${carro.modelo}`;
//   const headers = { 'Content-Type': 'application/json' };

//   return this.http.post(url, carro, { headers}).pipe(
//     map(response => response)
//   );
// }


editarCarro(carro: Carro, idCarro:number): Observable<any> {
  const url = `${this.apiURL}/updateCarro`;
  const headers = { 'Content-Type': 'text/plain' };
  const body = `${carro.modelo},${carro.preco}`;
  return this.http.post(url, body, { headers }).pipe(
    map(response => response)
  );

}






}
