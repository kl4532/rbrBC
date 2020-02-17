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
          console.log("loadedInitial");
          this.srv.getDrivers("WRC")
            .subscribe(dws => this.drivers = dws);
        }else {
          console.log("loadedPrevious");
          this.drivers = data.drivers;
          this.currentStage = data.currentStage
          this.started = data.started;
        }
      })
  }

  init() {
    console.log("currentStage", this.currentStage);
    this.started = true;
    this.drivers
      .forEach(dw => {
        this.selectedTracks
          .forEach(stage => {
            dw['stages'].push(this.srv.setStageTimes(dw.talent, stage))
          })
      })
    this.playStage(0);
  }

  playStage(index) {
    this.drivers
      .forEach(dw => {
        dw.totalTimeSeconds = dw.totalTimeSeconds ? dw.totalTimeSeconds + dw.stages[index].timeSeconds : dw.stages[index].timeSeconds;
        dw.totalTimeString = this.srv.timeToString(dw.totalTimeSeconds);
      })
    this.drivers.sort((a,b)=>a.stages[index].timeSeconds - b.stages[index].timeSeconds);
    this.drivers
      .forEach((dw, i) => {
        if(i==0){
          dw.gap = "00:00"
        } else{
          dw.gap = this.srv.timeToString(dw.totalTimeSeconds - this.drivers[0].totalTimeSeconds); 
        }
      })
  }

  //TODO implement player time input


  submitResults() {
    this.currentStage++
    if(this.currentStage < this.drivers[0].stages.length-1){
      this.playStage(this.currentStage);
    }
    this.srv.sendTotalResults(this.drivers, this.currentStage, this.started);
  }
}
