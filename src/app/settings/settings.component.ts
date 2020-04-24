import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators} from '@angular/forms';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

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
  settingsForm: FormGroup;
  generated: boolean;

  constructor( 
    private fb:FormBuilder, 
    private srv: DataService,
    private router: Router) {}

  private get selectedTracks(){
    return <FormArray>this.settingsForm.get('selectedTracks')
  }

  private get selectedPlayers(){
    return <FormArray>this.settingsForm.get('selectedPlayers')
  }
  // TODO add validator for player name input in selectedPlayers 
  ngOnInit() {
    this.settingsForm = new FormGroup({
      difficulty: new FormControl('75'),
      surface: new FormControl('All'),
      lMin: new FormControl('3'),
      lMax: new FormControl('11'),
      stages: new FormControl('5'),
      country: new FormControl('All'),
      selectedTracks: this.fb.array([]),
      players: new FormControl('1'),
      selectedPlayers: this.fb.array([], [Validators.required])
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

  generateTracks() {
    let stages = this.settingsForm.controls.stages.value;
    this.selectedTracks.clear();
    this.selectedPlayers.clear();
    this.srv.filterStages(this.settingsForm)
      .subscribe((data:Object[])=>{
        this.allTracks = data;
        this.tracks = this.allTracks.length > 0 ? this.drawNoRep(this.allTracks, stages) : [];
        this.tracks.forEach((track)=>{
          this.addNewTrack(track);
        })
        this.generated = true;
      })
    this.generatePlayers();
  }

  generatePlayers() {
    for(let i=0; i<this.settingsForm.controls.players.value; i++) {
      this.selectedPlayers.push(
        this.fb.group({
          id: i+100,
          name: "Player " + (i+1),
          talent: {},
          stages: [],
          totalTimeSeconds: 0,
          totalTimeString: "",
          gap: "0",
          currentStageTime: "",
          player: true
        })
      )
    }
  }

  onSubmit() {
    console.log(this.settingsForm);
    this.srv.setSettings(this.settingsForm);
    this.router.navigateByUrl('/stage');
  }
  
  drawNoRep(arr: Object[], quantity) {
    let drawed = [];
    let includes = false;
    let loopGuard = 0;

    while(drawed.length<quantity) {
      let track = arr[this.srv.getRandomInt(0, arr.length)];
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

}


