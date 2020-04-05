import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { Driver } from '../interfaces/driver';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  submitedSettings: FormGroup;
  recordsUrl: string = '../assets/records.json';
  driversUrl: string = '../assets/drivers.json';

  private stageData = new BehaviorSubject<Object>([]);

  setSettings(data) {
    this.submitedSettings = data;
  }
  getSettings() {
    return this.submitedSettings;
  }
  getDrivers(category){
    return this.http.get(this.driversUrl)
      .pipe(
        map(cat => cat[category]
        )
      );
  }
  filterStages(presetForm) {
    return this.http.get(this.recordsUrl)
      .pipe(
        map(
          (results: Object[]) => {
            const selCountry = presetForm.controls.country.value;
            const selSurface = presetForm.controls.surface.value;
            const lMin = presetForm.controls.lMin.value;
            const lMax = presetForm.controls.lMax.value;
            return results
              .filter(obj => {
                if(selCountry === "All") return true;
                return obj['country'] === selCountry;
              })
              .filter(obj => {
                if(selSurface === "All") return true;
                return obj['surface'] === selSurface;
              })
              .filter(obj => {
                return (obj['length'] >= lMin && obj['length'] <= lMax );
              })
          }
        )
      )
  }

  timeToSeconds(time: string): number {
    let min = parseInt(time.substring(0,2))*60;
    let sec = parseFloat(time.substring(3))
    sec = Number.isNaN(sec) ? 0 : sec;
    return min + sec;
  }

  timeToString(time:number): string {
    let minutes: any = (time/60) | 0;
    let seconds: any = time%60;
    seconds = seconds.toFixed(2)
    seconds<10 ? seconds = "0" + seconds : 0;
    minutes<10 ? minutes = "0" + minutes : 0;
    return  minutes + ":" + seconds;
  }

  setStageTimes(talent, stage): Object {
    let timeSeconds;
    let crash: boolean;
    const difficulty = this.submitedSettings.controls.difficulty.value;

    const rangeBott = (96+(2*talent.fast));
    const rangeTop= (rangeBott+(4*talent.consistence)); 

    const stageTime = this.timeToSeconds(stage.record) * ((200-difficulty)/100)
    const driverFactor = (((this.getRandomInt(rangeBott, rangeTop)))/100)
    const luckFactorTime = stageTime*(this.getRandomInt(1,100)/10000)

    timeSeconds =  stageTime * driverFactor + luckFactorTime;

    //player with super talent have 25% chance to reduce stage time for 2%
    talent.super && this.getRandomInt(1,6) === 1 ? timeSeconds = timeSeconds * 0.98 : 0;

    // crash to be implemented
    crash = this.getRandomInt(1,100) > (100-talent.safe*2) ? true : false;

    return {
      name: stage.stage,
      timeSeconds: crash ? 9999999999999999 : timeSeconds,
      timeString: crash ? "OUT" : this.timeToString(timeSeconds),
      crash: crash
    }
  }
  getRandomInt(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  sendTotalResults(drivers: Driver[], currentStage, started, settingsForm, driversOut: Driver[]) {
      const data = {drivers: drivers, currentStage: currentStage, started: started, settingsForm: settingsForm, driversOut}
      this.stageData.next(data);
  }

  getTotalResults(): Observable<any> {
      return this.stageData.asObservable();
  }

  setPlayersStageTimes(settingsForm, drivers, currentStage, selectedTracks ){
    let players = settingsForm.controls.selectedPlayers.value;
      players.forEach((player, i) => {
        //set total values
        player.totalTimeSeconds = player.totalTimeSeconds + this.timeToSeconds(player.currentStageTime);
        player.totalTimeString = this.timeToString(player.totalTimeSeconds);
        // player.gap = this.timeToString(drivers[0].totalTimeSeconds - player.totalTimeSeconds);
        
        // set stage values
        player.stages === null ? player.stages = [] : 0;
        let stage = {
          name: selectedTracks[currentStage].stage,
          timeSeconds: this.timeToSeconds(player.currentStageTime),
          timeString: player.currentStageTime,
          crash: player.currentStageTime ? false : true
        }
        player.stages.push(stage)
      });    
      this.submitedSettings.patchValue({
        selectedPlayers: players
      });
    return this.submitedSettings;
  }

  calculateGap(drivers) :Driver[] {
    for(let driver of drivers) {
      driver.gap = this.timeToString(driver.totalTimeSeconds - drivers[0].totalTimeSeconds);
    }
    return drivers;
  }
}
