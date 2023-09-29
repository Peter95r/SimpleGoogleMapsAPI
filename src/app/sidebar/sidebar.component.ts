import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  //html content w komponencie "table-component" jest generowany na podstawie "activeButtonId".
  //jego wartość jest zmieniana wzalezności od kliknietego przycisku z listy "buttons".
  //wartość to index z tej listy i moze wynosić 0,1,2
  //Na początek wartośc wynosi 0
  activeButtonId = 0;

  //na podstawie tej listy za pomocą *ngIf będą wygenerowane 3 przyciski
  //@label jest to content tego przycisku
  //@active w zalezności od wartości true/false do elementu html będzie dodane klasa "btn-primary" lub "btn-dark"
  buttons = [
    { label: 'Lista Klientów', active: false },
    { label: 'Lista Zdarzeń', active: false },
    { label: 'Dodaj Zdarzenie', active: false },
  ];

  //w konstruktorze na początek wartośc "active" z pierwszego przycisku z listy "buttons"
  //jest ustawiony na true
  //oraz jest wywołana metoda fetchData() z data.service.ts
  constructor(private http: HttpClient, private dataService: DataService) {
    this.buttons[0].active = true;
    this.dataService.fetchData();
  }

  // tam metoda wykonuje 4 czynności
  //1.ustawia wartość wszystkich pól "active" z obiektów z listy "buttons" na false
  //2.nastepnie ustawaia wartośc kliknietego przycisku na true
  //3.zmienia wartość pola "activeButtonId" na indeks kliknietego przycisku
  //4wywołuje metode "updateActiveBUttonId()" z data.service.ts
  toggleClass(clickedButton) {
    this.buttons.forEach((button) => (button.active = false));
    clickedButton.active = true;
    this.activeButtonId = this.buttons.indexOf(clickedButton);
    this.dataService.updateActiveBUttonId(this.activeButtonId);
  }

  ngOnInit(): void {}
}
