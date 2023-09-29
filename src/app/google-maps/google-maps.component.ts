import { Component, OnInit } from '@angular/core';
import {} from 'googlemaps';
import { DataService } from '../data.service';
@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css'],
})
export class GoogleMapsComponent implements OnInit {
  //lat i lng przechowują współrzędne gps (długość i szerokość geograficzne)
  lat = 0;
  lng = 0;

  //clientId przechowuje id klienta aby na podstawie Id wybrac poprawne współrzędne
  clientId = this.dataService.clientLocationIdHolder;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    //dataLocation ma listę lokacji urzytkownika
    //na podstawie clientId -1 dostaję index na którym znajdują sie potrzebene informacje
    this.dataService.dataLocation.subscribe((data) => {
      this.lat = parseFloat(data[this.clientId - 1].lat);
      this.lng = parseFloat(data[this.clientId - 1].long);
    });

    //Google Maps JavaScript API
    const apiKey = 'AIzaSyDqRaSvclHV8A9tzetgPgSF3tiJBVXO8BY';

    //tworze DOM element <script> ktory zostanie dodany do elementu <head>
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    document.head.appendChild(script);

    //window.initMap = () =>{} z jakiegos powodu nie działa
    window['initMap'] = () => {
      //pozycja startowa
      const mapCenter = { lat: this.lat, lng: this.lng };

      // generowanie mapy google, ustawienie zoom, oraz ustalenie ppozycji startowej
      const map = new google.maps.Map(document.getElementById('map'), {
        center: mapCenter,
        zoom: 12,
      });

      // tworzenie znacznika, znacznik jest ustawiony w tym samym miejcu co pozycja startowa mapy
      const marker = new google.maps.Marker({
        position: mapCenter,
        map: map,
        title: 'Tytuł', // Replace with your marker title
      });
    };
  }
}
