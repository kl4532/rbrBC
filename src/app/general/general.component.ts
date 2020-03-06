import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../services/data.service';
import { Subscription } from 'rxjs';

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

  ngOnInit() {
    this.subscription = this.srv.getTotalResults()
      .subscribe(data => {
        console.log(data.settingsForm);
        this.drivers = data.drivers;
        this.drivers.sort((a,b)=>a.totalTimeSeconds - b.totalTimeSeconds);
        this.currentStage = data.currentStage;
        this.players = data.settingsForm.controls.selectedPlayers.value;
        
        this.currentStage === this.drivers[0].stages.length ? this.estimateDifficulty() : 0;
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
