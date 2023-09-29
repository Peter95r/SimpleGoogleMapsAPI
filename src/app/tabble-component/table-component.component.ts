import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-table-component',
  templateUrl: './table-component.component.html',
  styleUrls: ['./table-component.component.css'],
})
export class TableComponentComponent implements OnInit {
  // ikona z font awesome
  faInfo = faInfoCircle;

  // isDisabled mowi o tym czy mozna wysłać nowy event
  //true= nie mozna wysłać
  //false= mozna wysłac
  // wartość tru jest tylko wtedy kiedy wszystkie pola w formularzu są uzupełnione
  isDisabled = true;

  //lista klientów
  clients = [];
  //lista klientów po uzyciu metody applyFilter()
  filteredClients = [];
  //lista eventów
  events = [];
  //lista eventów po uzyciu metody applyFilter()
  filteredEvents = [];

  // active button moze miec wartosc od 0 do 3 i za pomocą ngIf będą pokazywane odpowiednie elementy html
  activeButtonId = 0;

  activeButtonIdHolder;
  clientIdHolder;

  //selectSortOption moze mieć 3 wartości
  // none (na start)
  //imie i nazwisko
  //na podstawie tych wartosci bedzie segregowana lista klientów
  // przykładowo jezeli warośc = "imie"
  // wtedy lista klientów bedzie pokazana w kolejności alfabetycznej imion
  selectedSortOption: string = 'none';

  //na podstwie tej wartości jest filtrowana lista klientów lub eventów za pomocą metody applyFIlter()
  filterText: string = '';

  //wszystkie 3 elementy z adotacją "@ViewChild" to wartości uzyskane z elementów html
  // i wykorzystane do metody sendTheData() w celu utworzenia nowego objektu w formacie JSON
  //potrzebenego do wysłania nowego eventu
  @ViewChild('selectedClient') elecetedClient: ElementRef;
  @ViewChild('data') elecetedData: ElementRef;
  @ViewChild('zdarzenie') elecetedEvent: ElementRef;

  constructor(private http: HttpClient, private dataService: DataService) {}

  //ta metoda słuzy do pokazania tylko listy eventów nalezacych do tego samego klienta
  getEventsForClient(clientId: number) {
    return this.events.filter((event) => event.clientId === clientId);
  }
  //ta metoda pokazuje wszystkie dane konkretnego klienta
  //number przyjmuje wartość id klienta
  openDetails(number) {
    this.clientIdHolder = number;
    this.activeButtonIdHolder = this.activeButtonId;
    this.activeButtonId = 4;
    this.dataService.clientLocationIdHolder = number;
  }

  getClientById(clientId: number) {
    return this.clients.find((client) => client.id === clientId);
  }

  //ta metoda składa sie z 2 cześci.
  //czesc 1 filtruje klientów na podstawie nazwiska, imienia lub nr telefonu
  //czesc 2 filtruje eventy na podstawie nazwiska lub imienia klienta
  applyFilter() {
    const filterTextLower = this.filterText.toLowerCase().trim();
    //część 1
    this.filteredClients = this.clients.filter((client) => {
      const nameMatch = client.firstName
        .toLowerCase()
        .includes(filterTextLower);
      const surnameMatch = client.lastName
        .toLowerCase()
        .includes(filterTextLower);
      const phoneMatch = client.contact.some(
        (contact) =>
          contact.type === 'phone' &&
          contact.value.toLowerCase().includes(filterTextLower)
      );
      return nameMatch || surnameMatch || phoneMatch;
    });
    //część 2
    this.filteredEvents = this.events.filter((event) => {
      const eventNameMatch = event.eventName
        .toLowerCase()
        .includes(filterTextLower);
      if (this.activeButtonId === 1) {
        const firstNameMatch = this.getFirstName(event.clientId)
          .toLowerCase()
          .includes(filterTextLower);
        const secondNameMatch = this.getSecondName(event.clientId)
          .toLowerCase()
          .includes(filterTextLower);
        return firstNameMatch || secondNameMatch;
      } else {
        return eventNameMatch;
      }
    });
  }

  //ta metoda soruje klientów
  // są 2 opcje sortowania: imie oraz nazwisko
  sortClients() {
    if (this.activeButtonId === 0) {
      if (this.selectedSortOption === 'Imie') {
        this.filteredClients.sort((a, b) =>
          a.firstName.localeCompare(b.firstName)
        );
      } else if (this.selectedSortOption === 'Nazwisko') {
        this.filteredClients.sort((a, b) =>
          a.lastName.localeCompare(b.lastName)
        );
      }
    }
  }

  //ta metoda zwraca imie klienta na podstawie id
  getFirstName(clientId: number) {
    const client = this.clients.find((item) => item.id === clientId);
    return client ? client.firstName : '';
  }
  //ta metoda zwraca nazwisko klienta na podstawie id
  getSecondName(clientId: number) {
    const client = this.clients.find((item) => item.id === clientId);
    return client ? client.lastName : '';
  }

  // ta metoda sparawdza  czy zostały spełnione warunki abym mogł wystłac dane z formularza
  canISend() {
    const zdarzenieValue = this.elecetedEvent.nativeElement.value;
    const dataValue = this.elecetedData.nativeElement.value;
    this.isDisabled = !(zdarzenieValue && dataValue);
  }

  //ta metoda tworzy nowy objekt i wysyła go
  // zanim to sie jednak stanie, jest wywoływana metoda canISend() aby sprawdzic czyy mozna wysłac dane
  sendTheData(data) {
    this.canISend();
    const dateObject = new Date(data);
    const timestamp = Math.floor(dateObject.getTime() / 1000);
    const selectedOption = this.elecetedClient.nativeElement;
    const aaaa = selectedOption.querySelector('span');
    let id = aaaa.textContent;
    this.dataService.postNewEvent(
      7,
      data,
      this.elecetedEvent.nativeElement.value,
      id
    );
    alert(
      'Zgłoszenie zostało wysłane. Data w formacie timestamp: ' + timestamp
    );
  }

  //na starcie pobieram wszystkie dane
  ngOnInit(): void {
    this.dataService.fetchLocation();
    this.dataService.activeBUttonId.subscribe((value) => {
      this.activeButtonId = value;
    });
    this.dataService.fetchData();
    this.dataService.dataClients.subscribe((data) => {
      this.clients = data;
      this.filteredClients = [...this.clients];
    });
    this.dataService.fetchEvents();
    this.dataService.dataEvents.subscribe((data) => {
      this.events = data;
      this.filteredEvents = [...this.events];
    });
  }
}
