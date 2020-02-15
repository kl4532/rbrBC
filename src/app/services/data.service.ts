import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  submitedSettings: FormGroup;
  recordsUrl: string = '../assets/records.json';
  driversUrl: string = '../../assets/drivers.json';

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
    return parseInt(time.substring(0,2))*60 + parseFloat(time.substring(3));
  }

  timeToString(time:number): string {
    let minutes: any = (time/60) | 0;
    let seconds = time%60
    minutes<10 ? minutes = "0" + minutes  : 0;
    return  minutes + ":" + seconds.toFixed(2);
  }

  setStageTimes(talent, stage): Object {
    let timeSeconds;
    let crash: boolean;
    let difficulty = this.submitedSettings.controls.difficulty.value;

    switch (talent) {
      case 1:
        timeSeconds = this.timeToSeconds(stage.record)*(200-difficulty)/100*this.getRandomInt(100,110)/100;
        crash = this.getRandomInt(1,100) > 99 ? true : false;
        break;
      case 2:
        timeSeconds = this.timeToSeconds(stage.record)*(200-difficulty)/100*this.getRandomInt(105,120)/100
        crash = this.getRandomInt(1,100) > 98 ? true : false;
        break;
      case 3:
        timeSeconds = this.timeToSeconds(stage.record)*(200-difficulty)/100*this.getRandomInt(110,130)/100
        crash = this.getRandomInt(1,100) > 97 ? true : false;
        break;        
    
      default:
        break;
    }

    return {
      name: stage.stage,
      timeSeconds: timeSeconds,
      timeString: this.timeToString(timeSeconds),
      crash: crash
    }
  }
  getRandomInt(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  sendTotalResults(drivers: Driver[], currentStage, started) {
      const data = {drivers: drivers, currentStage: currentStage, started: started}
      this.stageData.next(data);
      console.log("inSRV", data);
  }

  getTotalResults(): Observable<any> {
      return this.stageData.asObservable();
  }
}
