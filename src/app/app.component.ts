import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';

interface Equipment {
  id: number;
  latitude?: number;
  longitude?: number;
  // …other fields if you like
}

@Component({
  selector:    'app-root',
  standalone:  true,
  imports:     [GoogleMapsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls:   ['./app.component.css']
})
export class AppComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 27.994402, lng: -81.760254 };
  markerPosition: google.maps.LatLngLiteral = { ...this.center };
  zoom = 7;
  missileId = 11;

  
  // Use the token from environment.ts
  // In future, replace with a AuthService + localStorage
  private authHeaders = new HttpHeaders({
    Authorization: environment.jwtToken
  });

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    interval(2000)
      .pipe(
        switchMap(() =>
          this.http.get<Equipment>(
            `${environment.apiBaseUrl}/api/equipment/${this.missileId}`,
            { headers: this.authHeaders }
          )
        )
      )
      .subscribe(e => {
        if (e.latitude != null && e.longitude != null) {
          this.markerPosition = { lat: e.latitude, lng: e.longitude };
        }
      });
  }
}
