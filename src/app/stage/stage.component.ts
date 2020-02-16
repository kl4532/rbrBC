import { Component, OnInit, AfterContentInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss']
})
export class StageComponent implements OnInit {

  drivers: Driver[] = [];

  selectedTracks;
  settingsForm: FormGroup;
  started = false;
  currentStage: number = 0;
  displayAllStages = false;

  constructor(private srv: DataService) { }

  ngOnInit() {
    this.settingsForm = this.srv.getSettings();
    if(this.settingsForm){
      this.selectedTracks = this.settingsForm.value.selectedTracks;
    }
    this.srv.getTotalResults()
      .subscribe(data => {
        if(data.length === 0){
          this.srv.getDrivers("WRC")
          .subscribe(dws => this.drivers = dws);
        }else {
          this.drivers = data.drivers;
          this.currentStage = data.currentStage
          this.started = data.started;
        }
      })
  }

  init() {
    this.started = true;
    this.drivers
      .forEach(dw => {
        this.selectedTracks
          .forEach(stage => {
            dw['stages'].push(this.srv.setStageTimes(dw.talent, stage))
          })
      })
  }

  playStage(index) {
    console.log("SIndex", this.currentStage);
    this.drivers
      .forEach(dw => {
        dw.totalTimeSeconds = dw.totalTimeSeconds ? dw.totalTimeSeconds + dw.stages[index].timeSeconds : dw.stages[index].timeSeconds;
        dw.totalTimeString = this.srv.timeToString(dw.totalTimeSeconds);
      })
    this.drivers.sort((a,b)=>a.stages[index+1].timeSeconds - b.stages[index+1].timeSeconds)
    console.log(this.drivers);
    this.currentStage++;
  }

  logDrivers() {
    console.log("log in stages",this.drivers);
  }

  submitResults() {
    this.playStage(this.currentStage);
    this.srv.sendTotalResults(this.drivers, this.currentStage, this.started);
  }
}
