import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  selectedTracks: FormGroup;
  setTracks(data) {
    this.selectedTracks = data;
  }
  getTracks() {
    return this.selectedTracks;
  }
}
