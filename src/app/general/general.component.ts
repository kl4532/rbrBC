import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  drivers: Driver[] = [];

  selectedTracks;
  tracksForm: FormGroup;
  started = false;

  constructor(private srv: DataService) { }

  ngOnInit() {
    this.tracksForm = this.srv.getTracks();
    if(this.tracksForm){
      this.selectedTracks = this.tracksForm.value.selectedTracks;
      console.log(this.selectedTracks);
    }
    this.srv.getDrivers()
      .subscribe(data => {
        console.log(data);
        this.drivers = data.WRC;
      })
  }



}
