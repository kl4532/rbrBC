import { Component, OnInit, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, FormArray, FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  difficulty = ['100', '80', '70', '60', '50', '40'];
  surface = ['Mixed', 'Tarmac', 'Gravel', 'Snow'];
  stages = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  tracks: Object[] = [];
  allTracks: Object[] = [];
  dataUrl: string = '../assets/records.json';

  settingsForm: FormGroup;
  constructor(private http: HttpClient, private fb:FormBuilder) {}

  private get selectedTracks(){
    return <FormArray>this.settingsForm.get('selectedTracks')
  }
  
  ngOnInit() {
    this.settingsForm = new FormGroup({
      difficulty: new FormControl('50'),
      surface: new FormControl('Mixed'),
      lMin: new FormControl('3'),
      lMax: new FormControl('8'),
      stages: new FormControl('5'),
      // selectedTracks: this.fb.array([]),
      //Need to add one more nested array or formGroup with stats object inside
      selectedTracks: this.fb.array([])
    });
  }

  resetControl(form, i) {
    const newStageName = form.value.stage;
    const changed = this.allTracks.find(obj => obj['Stage'] === newStageName);
    const controlToChange = <FormArray>this.settingsForm.controls.selectedTracks.get(`${i}`);
    controlToChange.reset({
      stage: changed['Stage'],
      record: changed['Time'],
      length: changed['Length'],
      type: changed['Track type']
    });
  }

  addNewTrack(track) {
    this.selectedTracks.push(
      this.fb.group({
        stage: track.Stage,
        record: track.Time,
        length: track.Length,
        type: track['Track type'],
      })
    )
  }
  
  deleteTrack(index) {
    this.selectedTracks.removeAt(index);
  }

  generateTracks() {
    let stages = this.settingsForm.controls.stages.value;

    this.http.get(this.dataUrl)
      .subscribe((data: Object[])=>{
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
    
    // add mock table with data
  
    // this.allTracks = this.mock;
    // this.tracks = this.drawNoRep(this.allTracks, stages);
    // if(this.selectedTracks.value.length > 0) {
    //   let array = <FormArray>this.settingsForm.controls.selectedTracks;
    //   array.clear();
    // };
    // this.tracks.forEach((track)=>{
    //   this.addNewTrack(track);
    // })
  }

  onSubmit() {
    console.log(this.settingsForm);
  }

  drawNoRep(arr: Object[], quantity) {
    let drawed = [];
    let includes = false;
    let loopGuard = 0;

    while(drawed.length<quantity) {
      let track = arr[this.getRandomInt(0, arr.length)];
      for(let i=0; i<drawed.length; i++){
        if(track["Stage"] === drawed[i].Stage) {
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

  mock = [
    {
      "Stage": "Ai-Petri",
      "Time": "10:59.99",
      "Length": 17.3,
      "Track type": "T"
    },
    {
      "Stage": "Akagi Mountain",
      "Time": "02:23.88",
      "Length": 3.5,
      "Track type": "T"
    },
    {
      "Stage": "Akagi Mountain II",
      "Time": "02:25.77",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Autiovaara",
      "Time": "02:57.69",
      "Length": 6.1,
      "Track type": "S"
    },
    {
      "Stage": "Autiovaara II",
      "Time": "03:02.75",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Barum rally 2009 Semetin",
      "Time": "05:29.91",
      "Length": 11.7,
      "Track type": "T"
    },
    {
      "Stage": "Barum rally 2010 Semetin",
      "Time": "05:36.53",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Bergheim v1.1",
      "Time": "04:43.84",
      "Length": 8,
      "Track type": "T"
    },
    {
      "Stage": "Berica",
      "Time": "07:14.53",
      "Length": 14.8,
      "Track type": "G"
    },
    {
      "Stage": "Bisanne",
      "Time": "03:39.35",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Bisanne II",
      "Time": "03:40.25",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Blanare",
      "Time": "04:55.4",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Blanare II",
      "Time": "04:32.06",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Bruchsal-Unteroewisheim",
      "Time": "04:11.50",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Capo Di Feno",
      "Time": "02:39.54",
      "Length": 4.5,
      "Track type": "T"
    },
    {
      "Stage": "Capo Di Feno II",
      "Time": "02:40.24",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Carvalho de Rei 2008",
      "Time": "05:11.02",
      "Length": 8.2,
      "Track type": "G"
    },
    {
      "Stage": "Castrezzato",
      "Time": "04:14.9",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Chirdonhead",
      "Time": "02:59.71",
      "Length": 6.9,
      "Track type": "G"
    },
    {
      "Stage": "Chirdonhead II",
      "Time": "03:01.13",
      "Length": 6.9,
      "Track type": "G"
    },
    {
      "Stage": "Cote D'Arbroz",
      "Time": "02:03.51",
      "Length": 4.5,
      "Track type": "T"
    },
    {
      "Stage": "Cote D'Arbroz II",
      "Time": "02:13.87",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Courcelles Val'd Esnoms",
      "Time": "04:49.41",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Diamond Creek",
      "Time": "02:43.4",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Diamond Creek II",
      "Time": "02:39.21",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "East-West",
      "Time": "05:33.84",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "East-West II",
      "Time": "05:37.99",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Falstone",
      "Time": "03:21.66",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Falstone II",
      "Time": "03:26.61",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Fernet Branca",
      "Time": "05:07.97",
      "Length": 6,
      "Track type": "G"
    },
    {
      "Stage": "Foron",
      "Time": "05:28.64",
      "Length": 9.2,
      "Track type": "T"
    },
    {
      "Stage": "Foron II",
      "Time": "05:33.35",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Foron Snow",
      "Time": "06:17.29",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Foron Snow II",
      "Time": "06:20.35",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Fraizer Wells",
      "Time": "01:49.95",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Frazier Wells II",
      "Time": "01:48.71",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "FSO Zeran - Warsaw",
      "Time": "05:11.9",
      "Length": 7.1,
      "Track type": "T"
    },
    {
      "Stage": "GB Sprint Extreme",
      "Time": "04:05.14",
      "Length": 6.7,
      "Track type": "G"
    },
    {
      "Stage": "Gestel",
      "Time": "03:27.24",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Grand Canaria ROC 2000",
      "Time": "01:52.93",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Greenhills",
      "Time": "03:02.9",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Greenhills II",
      "Time": "03:06.53",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Halenkovice SD",
      "Time": "02:11.63",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Harwood Forest",
      "Time": "03:03.10",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Harwood Forest II",
      "Time": "03:01.42",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Haugenau 2012",
      "Time": "03:44.94",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Hradek 1",
      "Time": "03:23.17",
      "Length": 5.8,
      "Track type": "T"
    },
    {
      "Stage": "Hradek 2",
      "Time": "03:22.15",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Hroudovany II",
      "Time": "02:46.75",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Hualapai Nation",
      "Time": "03:28.78",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Hualapai Nation II",
      "Time": "03:24.92",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Humalamaki 1.0",
      "Time": "01:40.91",
      "Length": "",
      "Track type": "G"
    },
    {
      "Stage": "Humalamaki Reversed",
      "Time": "01:43.35",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Hyppyjulma gravel",
      "Time": "03:12.22",
      "Length": 6.1,
      "Track type": "G"
    },
    {
      "Stage": "Hyppyjulma gravel II",
      "Time": "03:09.64",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Hyppyjulma tarmac",
      "Time": "02:56.75",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Hyppyjulma tarmac II",
      "Time": "02:57.65",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Jirkovicky",
      "Time": "02:15.34",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Jirkovicky II",
      "Time": "02:19.44",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Joukkovaara tarmac",
      "Time": "05:32.20",
      "Length": 10.2,
      "Track type": "T"
    },
    {
      "Stage": "Joukkovaara tarmac II",
      "Time": "05:23.37",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Joux Plane",
      "Time": "04:56.93",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Joux Plane II",
      "Time": "05:04.14",
      "Length": 11.2,
      "Track type": "T"
    },
    {
      "Stage": "Joux Verte",
      "Time": "04:38.30",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Joux Verte II",
      "Time": "04:31.62",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Junior Wheels I",
      "Time": "04:11.2",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Junior Wheels II",
      "Time": "04:58.79",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Kaihuavaara",
      "Time": "03:20.58",
      "Length": 6.1,
      "Track type": "S"
    },
    {
      "Stage": "Kaihuavaara II",
      "Time": "03:25.12",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Karlstad",
      "Time": "01:20.73",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Karlstad II",
      "Time": "01:22.70",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Karowa 2009",
      "Time": "01:20.49",
      "Length": 1.6,
      "Track type": "T"
    },
    {
      "Stage": "Kolmenjarvet gravel",
      "Time": "04:30.46",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Kolmenjarvet gravel II",
      "Time": "04:16.43",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Kolmenjarvet tarmac",
      "Time": "03:40.39",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Kolmenjarvet tarmac II",
      "Time": "04:13.36",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Kormoran I",
      "Time": "06:46.15",
      "Length": 1,
      "Track type": ""
    },
    {
      "Stage": "Kormoran II",
      "Time": "08:29.96",
      "Length": 12,
      "Track type": "G"
    },
    {
      "Stage": "Kormoran Shakedown",
      "Time": "03:39.83",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Kuadonvaara",
      "Time": "03:27.73",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "La Rocca",
      "Time": "05:06.97",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Lernovec",
      "Time": "01:55.05",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Lernovec II",
      "Time": "01:54.31",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Liptakov 1",
      "Time": "03:15.77",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Liptakov 2",
      "Time": "03:12.60",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Livadija",
      "Time": "03:01.54",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Livadija II",
      "Time": "03:04.43",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Loch Ard",
      "Time": "03:59.48",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Loch Ard II",
      "Time": "04:03.78",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Lousada - WRC",
      "Time": "02:33.34",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Maton I",
      "Time": "02:45.66",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Maton II",
      "Time": "02:49.47",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Maton snow II",
      "Time": "03:30.49",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Mineshaft",
      "Time": "04:10.45",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Mineshaft II",
      "Time": "04:16.9",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Mitterbach",
      "Time": "01:30.70",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Mlynky",
      "Time": "03:10.02",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Mlynky II",
      "Time": "03:12.98",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Mlynky Snow",
      "Time": "03:34.18",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Mlynky Snow II",
      "Time": "03:33.25",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Mustaselka",
      "Time": "04:07.91",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Mustaselka II",
      "Time": "04:05.55",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "New Bobs",
      "Time": "04:43.16",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "New Bobs II",
      "Time": "04:38.83",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Noiker",
      "Time": "06:41.7",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Noiker II",
      "Time": "06:40.94",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Northumbria",
      "Time": "05:01.95",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Northumbria Tarmac",
      "Time": "04:34.53",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Osli - Stryckovy",
      "Time": "03:19.52",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Passo Valle",
      "Time": "05:17.20",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Peklo",
      "Time": "04:43.84",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Peklo II",
      "Time": "04:44.84",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Peklo II Snow",
      "Time": "05:32.33",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Peklo Snow",
      "Time": "05:27.95",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Peyregrosse - Mandagout",
      "Time": "07:54.26",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Peyregrosse - Mandagout NIGHT",
      "Time": "08:06.11",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Pian del Colle",
      "Time": "03:52.95",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Pian del Colle Reversed",
      "Time": "04:14.87",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Pikes Peak 2008",
      "Time": "10:15.28",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Pirka Menoko",
      "Time": "04:18.39",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Pirka Menoko II",
      "Time": "04:19.50",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Prospect Ridge",
      "Time": "03:48.07",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Prospect Ridge II",
      "Time": "03:50.90",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Prospect Ridge II A",
      "Time": "03:45.87",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "PTD Rallysprint",
      "Time": "03:10.65",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Puy du Lac",
      "Time": "02:42.77",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Rally School Czech",
      "Time": "01:30.77",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Rally School Czech II",
      "Time": "01:30.84",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Rally school mix",
      "Time": "03:01.56",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Rally School Stage",
      "Time": "01:10.25",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Rally School Stage II",
      "Time": "01:11.64",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Rally school tarmac",
      "Time": "02:53.73",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Rally Wisla Shakedown",
      "Time": "01:39.52",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Rallysprint Hondarribia 2011",
      "Time": "05:15.51",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Red Bull HC",
      "Time": "08:59.03",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "ROC 2008",
      "Time": "01:13.62",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "RP 2009 Shakedown",
      "Time": "02:58.20",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "RP 2009 Shakedown Reversed",
      "Time": "02:28.04",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "RSI slalom gegeWRC",
      "Time": "01:32.76",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "RSI slalom Shonen",
      "Time": "00:51.43",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Sardian",
      "Time": "03:06.63",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Shakedown Rally del Salento 2014",
      "Time": "02:14.11",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Shepherds Shield",
      "Time": "02:18.88",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Shepherds Shield II",
      "Time": "02:22.15",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Shomaru Pass",
      "Time": "04:05.18",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Shomaru Pass II",
      "Time": "04:08.92",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Sieversdorf V1.1",
      "Time": "03:56.74",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Sikakama",
      "Time": "04:55.12",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Sikakama II",
      "Time": "04:54.99",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Sipirkakim",
      "Time": "04:15.99",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Sipirkakim II",
      "Time": "04:18.22",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Slovakia Ring 2014",
      "Time": "06:01.30",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Slovakia Ring 2014 II",
      "Time": "06:09.34",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Snekovice",
      "Time": "03:33.79",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Snekovice II",
      "Time": "03:32.88",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Snow Cote D'Arbroz II",
      "Time": "03:38.25",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Sorica",
      "Time": "07:23.78",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Sosnova",
      "Time": "04:33.13",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Sourkov",
      "Time": "03:02.92",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Sourkov 2",
      "Time": "03:01.42",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "SS Daniel Bonara",
      "Time": "03:01.31",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "SSS Mikolajki I",
      "Time": "01:41.50",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "SSS Mikolajki II",
      "Time": "01:39.07",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "SSS York I",
      "Time": "03:17.08",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Stryckovy - Zadni Porici",
      "Time": "02:47.80",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Stryckovy okruh",
      "Time": "03:04.61",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Sumburk 2007",
      "Time": "06:11.3",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Svince",
      "Time": "02:20.17",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Svince II",
      "Time": "02:24.10",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Sweet Lamb",
      "Time": "02:40.03",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Sweet Lamb II",
      "Time": "02:40.85",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "SWISS I",
      "Time": "03:34.29",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "SWISS II",
      "Time": "03:54.66",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Swiss III",
      "Time": "06:15.26",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Swiss IV",
      "Time": "07:09.03",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Tanner",
      "Time": "02:36.39",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Tanner II",
      "Time": "02:36.16",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Tavia",
      "Time": "02:01.29",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Torre Vecchia",
      "Time": "05:18.24",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Travanca do Monte",
      "Time": "01:34.39",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Uchan-Su",
      "Time": "07:31.56",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Uchan-Su Winter",
      "Time": "11:13.32",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Uhorna",
      "Time": "06:07.72",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Undva",
      "Time": "05:44.41",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Undva Reversed",
      "Time": "05:42.58",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Uzkotin",
      "Time": "04:06.91",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Uzkotin II",
      "Time": "04:06.43",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Verkiai 2010 SSS",
      "Time": "00:56.69",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Versme",
      "Time": "01:41.20",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Zaraso Salos Trekas - 2 laps",
      "Time": "00:58.67",
      "Length": "",
      "Track type": ""
    },
    {
      "Stage": "Zaraso Salos Trekas - 5 laps",
      "Time": "02:32.80",
      "Length": "",
      "Track type": ""
    }
  ]

}


