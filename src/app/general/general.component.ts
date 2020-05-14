import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../services/data.service';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Driver } from '../interfaces/driver';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit, OnDestroy {

  constructor(private srv: DataService) { }
  drivers: Driver[];
  currentStage: number;
  subscription: Subscription;
  players: Driver[];
  sugDifficulty: number;
  settingsForm: FormGroup;
  started: boolean = false;
  finished: boolean = false;
  driversOut: Driver[];
  totalDistance: number;
  points: number[] = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

  ngOnInit() {
    this.subscription = this.srv.getTotalResults()
      .subscribe(data => {
        console.log("data ",data);
          //check if tournament started and first time submited
          if(data.started && data.currentStage > 0) {
              this.settingsForm = data.settingsForm;
              this.drivers = data.drivers;
              this.driversOut = data.driversOut;
              this.players = data.settingsForm.controls.selectedPlayers.value;
              
              this.started = data.started;
              
              this.drivers = data.drivers.filter(driver => !driver.player);
              this.players.forEach(player => this.drivers.push(player));
      
              this.drivers.sort((a,b)=>a.totalTimeSeconds - b.totalTimeSeconds);
              this.drivers =  this.srv.calculateGap(this.drivers);
              this.currentStage = data.currentStage;
              
              this.currentStage === this.drivers[0].stages.length ? this.estimateDifficulty() : 0;
              this.totalDistance = this.settingsForm.value.selectedTracks
                .map(track=> track.length)
                .slice(0, this.currentStage)
                .reduce((total, length)=>{
                  return total + length;
                })
                .toFixed(0);
              if(this.currentStage === +data.settingsForm.value.stages) {
                this.finished = true;
              }
          }
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  estimateDifficulty() {
    let settingsForm = this.srv.getSettings();
    let bestPossibleTotalTime = settingsForm.value.selectedTracks
      .map(track=> this.srv.timeToSeconds(track.record))
      .reduce((total, record)=>{
        return total + record;
      })
    this.players.forEach(player => {
      player.sugDifficulty = +(200 - +(player.totalTimeSeconds/bestPossibleTotalTime * 100)).toFixed(0);
    })
  }
}
