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
  settingsForm: FormGroup;
  started = false;
  allDriversResults;

  constructor(private srv: DataService) { }

  ngOnInit() {
    this.settingsForm = this.srv.getSettings();
    if(this.settingsForm){
      this.selectedTracks = this.settingsForm.value.selectedTracks;
      console.log(this.selectedTracks);
    }
    this.srv.getDrivers("WRC")
      .subscribe(dws => this.drivers = dws);
  }
  start() {
    this.drivers
      .forEach(dw => {
        this.selectedTracks
          .forEach(stage => {
            dw['stages'].push(this.srv.setStageTimes(dw.talent, stage))
          })
      })
    this.started = true;
  }
  logDrivers() {
    console.log(this.drivers);
  }



}
