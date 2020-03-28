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
  timesValidator = true;
  finish = false;

  constructor(private srv: DataService) { 
  }

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
          this.currentStage = data.currentStage
          this.currentStage == this.settingsForm.value.stages ? this.finish = true : this.finish = false;
          if(!this.finish){
            this.drivers = data.drivers.filter(driver => !driver.player);
            this.drivers.sort((a,b)=>a.stages[this.currentStage].timeSeconds - b.stages[this.currentStage].timeSeconds);
            this.started = data.started;
          }
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
    this.playStage(0);
    // indicate that tournament started
    this.srv.sendTotalResults(this.drivers, this.currentStage, this.started, this.settingsForm);
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
          //TOFIX
          dw.gap = this.srv.timeToString(dw.totalTimeSeconds - this.drivers[0].totalTimeSeconds); 
        }
      })
  }

  submitResults() {
    if(this.areTimesValid()){
      this.srv.setPlayersStageTimes(this.settingsForm, this.drivers, this.currentStage, this.selectedTracks);
      if(this.currentStage>0 && this.currentStage < this.drivers[0].stages.length){
        this.playStage(this.currentStage);
      }
      this.currentStage++
  
      this.srv.sendTotalResults(this.drivers, this.currentStage, this.started, this.settingsForm);
    }
  }

  areTimesValid(): boolean {
    this.timesValidator = true;
    const regex = /^(([0-9]{2,3}):([0-9]{1,2})(\.[0-9]{1,3})?)$/;
    for (let player of this.settingsForm.value.selectedPlayers) {
      if(!regex.test(player.currentStageTime)) {
        this.timesValidator = false;
        break;
      }
    }
    return this.timesValidator;
  }
}
