import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListacarrosComponent } from "./components/listacarros/listacarros.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ListacarrosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontCarros';
}
