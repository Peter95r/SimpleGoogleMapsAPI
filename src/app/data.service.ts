import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  //dataSsubiect , dataSsubiect2, dataSsubiect3, dataSsubiect4 przechowywują dane
  //dataClients, dataEvents, dataLocation, activeBUttonId są wykorzystywane do dzielenia się tymi danymi
  private dataSubject = new BehaviorSubject<any>(null);
  public dataClients = this.dataSubject.asObservable();

  private dataSubject2 = new BehaviorSubject<any>(null);
  public dataEvents = this.dataSubject2.asObservable();

  private dataSubject3 = new BehaviorSubject<any>(null);
  public dataLocation = this.dataSubject3.asObservable();

  private dataSubject4 = new BehaviorSubject<number>(0);
  public activeBUttonId = this.dataSubject4.asObservable();
  // activeBUttonId: Observable<number> = this.dataSubject4.asObservable();

  //przechowuje Id klienta którego informacje (w tym lokacje) chcemy wyświetlić
  clientLocationIdHolder;

  constructor(private http: HttpClient) {}

  //ta metoda odbiera dane na temat klientów i przechowuje je w polu "dataSubiect"
  fetchData() {
    this.http
      .get('https://my-json-server.typicode.com/mtobik/typicode/clients')
      .subscribe((data) => {
        this.dataSubject.next(data);
      });
  }
  //ta metoda odbiera dane na temat eventów i przechowuje je w polu "dataSubiect2"
  fetchEvents() {
    this.http
      .get('https://my-json-server.typicode.com/mtobik/typicode/events')
      .subscribe((data) => {
        this.dataSubject2.next(data);
      });
  }
  //ta metoda odbiera dane na temat lokacji i przechowuje je w polu "dataSubiect3"
  fetchLocation() {
    this.http
      .get('https://my-json-server.typicode.com/mtobik/typicode/objectGps')
      .subscribe((data) => {
        this.dataSubject3.next(data);
      });
  }
  // ta metoda tworzy nowy objekt i dodaje go do listy eventów
  // na podstawie informacji ze strony: https://my-json-server.typicode.com/mtobik/typicode
  // nowe eventy nie są stale przechowywane
  postNewEvent(id, eventDate, eventName, clientId) {
    this.http.post(
      'https://my-json-server.typicode.com/mtobik/typicode/events',
      {
        id: id,
        eventDate: eventDate,
        eventName: eventName,
        clientId: clientId,
      }
    );
  }

  //zmieniawartośc pola dataSubiect4
  //wartość tak jest wykorzystowan componenty "table-component"
  //elementy html w tym komponencie są generowana na podstawie tej wartości
  // a działa to tak:*ngIf="activeButtonId === 2"
  //activeButtonId z komponentu table =
  updateActiveBUttonId(value) {
    this.dataSubject4.next(value);
  }
}
