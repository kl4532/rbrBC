import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  selectedTracks: FormGroup;
  setTracks(data) {
    this.selectedTracks = data;
  }
  getTracks() {
    return this.selectedTracks;
  }
  getDrivers() {
    return this.http.get('../../assets/drivers.json');
  }
}
