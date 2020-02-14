import { Component, OnInit, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, FormArray, FormBuilder} from '@angular/forms';
import { map, filter } from 'rxjs/operators';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  surface = ['All', 'Tarmac', 'Gravel', 'Snow'];
  stages = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  countries = [
    'All', 'Argentina', 'Australia', 'Austria', 'Czech Republic', 
    'Estonia', 'Finland', 'France', 'Germany', 'Great Britain',
    'Ireland', 'Italy', 'Japan', 'Lithuania', 'Netherlands',
    'Poland', 'Portugal', 'Slovakia', 'Spain', 'Sweden', 'Switzerland',
    'Ukraine', 'USA'
  ]
  tracks: Object[] = [];
  allTracks: Object[] = [];
  dataUrl: string = '../assets/records.json';

  settingsForm: FormGroup;
  generated: boolean;
  constructor(private http: HttpClient, private fb:FormBuilder, private srv: DataService) {}

  private get selectedTracks(){
    return <FormArray>this.settingsForm.get('selectedTracks')
  }
  
  ngOnInit() {
    this.settingsForm = new FormGroup({
      difficulty: new FormControl('50'),
      surface: new FormControl('All'),
      lMin: new FormControl('3'),
      lMax: new FormControl('8'),
      stages: new FormControl('5'),
      country: new FormControl('All'),
      selectedTracks: this.fb.array([])
    });
  }

  resetControl(form, i) {
    const newStageName = form.value.stage;
    const changed = this.allTracks.find(obj => obj['stage'] === newStageName);
    const controlToChange = <FormArray>this.settingsForm.controls.selectedTracks.get(`${i}`);
    controlToChange.reset({
      stage: changed['stage'],
      record: changed['record'],
      length: changed['length'],
      surface: changed['surface'],
      country: changed['country']
    });
  }

  addNewTrack(track) {
    this.selectedTracks.push(
      this.fb.group({
        stage: track.stage,
        record: track.record,
        length: track.length,
        surface: track.surface,
        country: track.country
      })
    )
  }
  
  deleteTrack(index) {
    this.selectedTracks.removeAt(index);
  }

  generateTracks() {
    this.generated = true;
    let stages = this.settingsForm.controls.stages.value;
    // Now its time to implement filters
    this.http.get(this.dataUrl)
      .pipe(
        map(
          (results: Object[]) => {
            const selCountry = this.settingsForm.controls.country.value;
            if(selCountry === "All") return results; 
            return results
              .filter(obj => obj['country'] === selCountry)
          }
        )
      )
      .subscribe((data:Object[])=>{
        this.allTracks = data;
        this.tracks = this.drawNoRep(this.allTracks, stages);
        if(this.selectedTracks.value.length > 0) {
          let array = this.selectedTracks;
          array.clear();
        };
        this.tracks.forEach((track)=>{
          this.addNewTrack(track);
        })
      })
  }

  onSubmit() {
    console.log('Submited');
    this.srv.setSettings(this.settingsForm);
  }
  
  drawNoRep(arr: Object[], quantity) {
    let drawed = [];
    let includes = false;
    let loopGuard = 0;

    while(drawed.length<quantity) {
      let track = arr[this.getRandomInt(0, arr.length)];
      for(let i=0; i<drawed.length; i++){
        if(track['stage'] === drawed[i].stage) {
          includes = true;
          loopGuard++;
          break
        }
      }
      includes ? 0 : drawed.push(track);
      includes = false;
      if(loopGuard > 20)break;
    }
    return drawed;
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

}


