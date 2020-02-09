import { Component, OnInit, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, FormArray, FormBuilder} from '@angular/forms';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  difficulty = ['100', '80', '70', '60', '50', '40'];
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
  constructor(private http: HttpClient, private fb:FormBuilder) {}

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
            return results.filter(obj => obj.country === selCountry)
          }
        )
      )
      .subscribe((data)=>{
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

  mock = [
    {
      "stage": "Ai - Petri Winter",
      "length": 17.3,
      "surface": "Snow",
      "record": "12:32.9",
      "country": "Ukraine"
    },
    {
      "stage": "Ai - Petri",
      "length": 17.3,
      "surface": "Tarmac",
      "record": "10:59.99",
      "country": "Ukraine"
    },
    {
      "stage": "Akagi Mountain",
      "length": 3.5,
      "surface": "Tarmac",
      "record": "02:23.88",
      "country": "Japan"
    },
    {
      "stage": "Akagi Mountain II",
      "length": 3.5,
      "surface": "Tarmac",
      "record": "02:25.77",
      "country": "Japan"
    },
    {
      "stage": "Autiovaara",
      "length": 6.1,
      "surface": "Snow",
      "record": "02:57.69",
      "country": "Finland"
    },
    {
      "stage": "Autiovaara II",
      "length": 6.1,
      "surface": "Snow",
      "record": "03:02.75",
      "country": "Finland"
    },
    {
      "stage": "Azov",
      "length": 19.1,
      "surface": "Gravel",
      "record": "12:24",
      "country": "Ukraine"
    },
    {
      "stage": "Azov II",
      "length": 19.2,
      "surface": "Gravel",
      "record": "13:38",
      "country": "Ukraine"
    },
    {
      "stage": "Barum rally 2009 Semetin",
      "length": 11.7,
      "surface": "Tarmac",
      "record": "05:29.91",
      "country": "Czech Republic"
    },
    {
      "stage": "Barum rally 2010 Semetin",
      "length": 11.7,
      "surface": "Tarmac",
      "record": "05:36.53",
      "country": "Czech Republic"
    },
    {
      "stage": "Bergheim",
      "length": 8,
      "surface": "Tarmac",
      "record": "04:43.84",
      "country": "Germany"
    },
    {
      "stage": "Berica",
      "length": 14.8,
      "surface": "Gravel",
      "record": "07:14.53",
      "country": "Italy"
    },
    {
      "stage": "Bisanne",
      "length": 5.6,
      "surface": "Tarmac",
      "record": "03:39.35",
      "country": "France"
    },
    {
      "stage": "Bisanne II",
      "length": 5.6,
      "surface": "Tarmac",
      "record": "03:40.25",
      "country": "France"
    },
    {
      "stage": "Bisanne Snow II",
      "length": 5.6,
      "surface": "Snow",
      "record": "04:48.5",
      "country": "France"
    },
    {
      "stage": "Blanare",
      "length": 7.6,
      "surface": "Snow",
      "record": "04:55.35",
      "country": "Switzerland"
    },
    {
      "stage": "Blanare II",
      "length": 6.6,
      "surface": "Snow",
      "record": "04:32.06",
      "country": "Switzerland"
    },
    {
      "stage": "Bruchsal - Unterowisheim",
      "length": 8.9,
      "surface": "Tarmac",
      "record": "04:11.50",
      "country": "Germany"
    },
    {
      "stage": "Capo Di Feno",
      "length": 4.5,
      "surface": "Tarmac",
      "record": "02:39.54",
      "country": "France"
    },
    {
      "stage": "Capo Di Feno II",
      "length": 4.5,
      "surface": "Tarmac",
      "record": "02:40.24",
      "country": "France"
    },
    {
      "stage": "Carvalho de Rei 2008",
      "length": 8.2,
      "surface": "Gravel",
      "record": "05:11.02",
      "country": "Portugal"
    },
    {
      "stage": "Carvalho de Rei 2008 II",
      "length": 8.2,
      "surface": "Gravel",
      "record": "05:11.02",
      "country": "Portugal"
    },
    {
      "stage": "Castrezzato",
      "length": 8.1,
      "surface": "Tarmac",
      "record": "04:14.9",
      "country": "Italy"
    },
    {
      "stage": "Chirdonhead",
      "length": 7,
      "surface": "Gravel",
      "record": "02:59.71",
      "country": "Great Britain"
    },
    {
      "stage": "Chirdonhead II",
      "length": 6.9,
      "surface": "Gravel",
      "record": "03:01.13",
      "country": "Great Britain"
    },
    {
      "stage": "Cote D'Arbroz",
      "length": 4.5,
      "surface": "Tarmac",
      "record": "02:03.51",
      "country": "France"
    },
    {
      "stage": "Cote D'Arbroz II",
      "length": 4.3,
      "surface": "Tarmac",
      "record": "02:13.87",
      "country": "France"
    },
    {
      "stage": "Cote D'Arbroz Snow",
      "length": 4.5,
      "surface": "Snow",
      "record": "03:38.25",
      "country": "France"
    },
    {
      "stage": "Cote D'Arbroz Snow II",
      "length": 4.5,
      "surface": "Snow",
      "record": "02:44.9",
      "country": "France"
    },
    {
      "stage": "Courcelles Val'd Esnoms",
      "length": 9.9,
      "surface": "Tarmac",
      "record": "04:49.41",
      "country": "France"
    },
    {
      "stage": "Diamond Creek",
      "length": 7.1,
      "surface": "Gravel",
      "record": "02:43.4",
      "country": "USA"
    },
    {
      "stage": "Diamond Creek II",
      "length": 6.8,
      "surface": "Gravel",
      "record": "02:39.21",
      "country": "USA"
    },
    {
      "stage": "Dolmen",
      "length": 13.3,
      "surface": "Gravel",
      "record": "06:35.2",
      "country": "Italy"
    },
    {
      "stage": "East - West",
      "length": 9.5,
      "surface": "Gravel",
      "record": "05:33.84",
      "country": "Australia"
    },
    {
      "stage": "East - West II",
      "length": 9.6,
      "surface": "Gravel",
      "record": "05:37.99",
      "country": "Australia"
    },
    {
      "stage": "Falstone",
      "length": 6.6,
      "surface": "Gravel",
      "record": "03:21.66",
      "country": "Great Britain"
    },
    {
      "stage": "Falstone II",
      "length": 6.6,
      "surface": "Gravel",
      "record": "03:26.61",
      "country": "Great Britain"
    },
    {
      "stage": "Fernet Branca",
      "length": 6,
      "surface": "Gravel",
      "record": "05:07.97",
      "country": "Argentina"
    },
    {
      "stage": "Foron",
      "length": 9.2,
      "surface": "Tarmac",
      "record": "05:28.64",
      "country": "France"
    },
    {
      "stage": "Foron II",
      "length": 9.2,
      "surface": "Tarmac",
      "record": "05:33.35",
      "country": "France"
    },
    {
      "stage": "Foron Snow",
      "length": 9.1,
      "surface": "Snow",
      "record": "06:17.29",
      "country": "France"
    },
    {
      "stage": "Foron Snow II",
      "length": 9.1,
      "surface": "Snow",
      "record": "06:20.35",
      "country": "France"
    },
    {
      "stage": "Fraizer Wells",
      "length": 5,
      "surface": "Gravel",
      "record": "01:49.95",
      "country": "USA"
    },
    {
      "stage": "Fraizer Wells II",
      "length": 5,
      "surface": "Gravel",
      "record": "01:48.71",
      "country": "USA"
    },
    {
      "stage": "FSO Zeran - Warsaw",
      "length": 7.1,
      "surface": "Tarmac",
      "record": "05:11.9",
      "country": "Poland"
    },
    {
      "stage": "GB Sprint Extreme",
      "length": 6.7,
      "surface": "Gravel",
      "record": "04:05.14",
      "country": "Great Britain"
    },
    {
      "stage": "Gestel",
      "length": 7.2,
      "surface": "Tarmac",
      "record": "03:27.24",
      "country": "Netherlands"
    },
    {
      "stage": "Grand Canaria ROC 2000",
      "length": 3.8,
      "surface": "Gravel",
      "record": "01:52.93",
      "country": "Spain"
    },
    {
      "stage": "Greenhills",
      "length": 6,
      "surface": "Gravel",
      "record": "03:02.9",
      "country": "Australia"
    },
    {
      "stage": "Greenhills II",
      "length": 6,
      "surface": "Gravel",
      "record": "03:06.53",
      "country": "Australia"
    },
    {
      "stage": "Halenkovice Shakedown",
      "length": 4.2,
      "surface": "Tarmac",
      "record": "02:11.63",
      "country": "Czech Republic"
    },
    {
      "stage": "Harwood Forest",
      "length": 6.1,
      "surface": "Gravel",
      "record": "03:03.10",
      "country": "Great Britain"
    },
    {
      "stage": "Harwood Forest II",
      "length": 5.9,
      "surface": "Gravel",
      "record": "03:01.42",
      "country": "Great Britain"
    },
    {
      "stage": "Haugenau 2012",
      "length": 5.7,
      "surface": "Tarmac",
      "record": "03:44.94",
      "country": "France"
    },
    {
      "stage": "Hradek",
      "length": 5.8,
      "surface": "Tarmac",
      "record": "03:23.17",
      "country": "Czech Republic"
    },
    {
      "stage": "Hradek II",
      "length": 5.8,
      "surface": "Tarmac",
      "record": "03:22.15",
      "country": "Czech Republic"
    },
    {
      "stage": "Hualapai Nation",
      "length": 8.6,
      "surface": "Gravel",
      "record": "03:28.78",
      "country": "USA"
    },
    {
      "stage": "Hualapai Nation II",
      "length": 8.6,
      "surface": "Gravel",
      "record": "03:24.92",
      "country": "USA"
    },
    {
      "stage": "Humalamaki",
      "length": 4.4,
      "surface": "Gravel",
      "record": "01:40.91",
      "country": "Finland"
    },
    {
      "stage": "Humalamaki II",
      "length": 4.4,
      "surface": "Gravel",
      "record": "01:43.35",
      "country": "Finland"
    },
    {
      "stage": "Hyppyjulma Gravel",
      "length": 6.1,
      "surface": "Gravel",
      "record": "03:12.22",
      "country": "Finland"
    },
    {
      "stage": "Hyppyjulma Gravel II",
      "length": 6.1,
      "surface": "Gravel",
      "record": "03:09.64",
      "country": "Finland"
    },
    {
      "stage": "Hyppyjulma Tarmac",
      "length": 6.1,
      "surface": "Tarmac",
      "record": "02:56.75",
      "country": "Finland"
    },
    {
      "stage": "Hyppyjulma Tarmac II",
      "length": 6.1,
      "surface": "Tarmac",
      "record": "02:57.65",
      "country": "Finland"
    },
    {
      "stage": "Joukkovaara Gravel",
      "length": 10.2,
      "surface": "Gravel",
      "record": "05:18.2",
      "country": "Finland"
    },
    {
      "stage": "Joukkovaara Gravel II",
      "length": 10.2,
      "surface": "Gravel",
      "record": "05:23.6",
      "country": "Finland"
    },
    {
      "stage": "Joukkovaara Tarmac",
      "length": 10.2,
      "surface": "Tarmac",
      "record": "05:32.20",
      "country": "Finland"
    },
    {
      "stage": "Joukkovaara Tarmac II",
      "length": 10.2,
      "surface": "Tarmac",
      "record": "05:23.37",
      "country": "Finland"
    },
    {
      "stage": "Joux Plane",
      "length": 11.1,
      "surface": "Tarmac",
      "record": "04:56.93",
      "country": "France"
    },
    {
      "stage": "Joux Plane II",
      "length": 11.1,
      "surface": "Tarmac",
      "record": "05:04.14",
      "country": "France"
    },
    {
      "stage": "Joux Plane Snow",
      "length": 11.1,
      "surface": "Snow",
      "record": "08:59.8",
      "country": "France"
    },
    {
      "stage": "Joux Plane Snow II",
      "length": 11.1,
      "surface": "Snow",
      "record": "07:00.3",
      "country": "France"
    },
    {
      "stage": "Joux Verte",
      "length": 7.9,
      "surface": "Tarmac",
      "record": "04:38.30",
      "country": "France"
    },
    {
      "stage": "Joux Verte II",
      "length": 7.8,
      "surface": "Tarmac",
      "record": "04:31.62",
      "country": "France"
    },
    {
      "stage": "Joux Verte Snow",
      "length": 7.9,
      "surface": "Snow",
      "record": "03:23.1",
      "country": "France"
    },
    {
      "stage": "Joux Verte Snow II",
      "length": 7.9,
      "surface": "Snow",
      "record": "04:55.8",
      "country": "France"
    },
    {
      "stage": "Junior Weels",
      "length": 5.6,
      "surface": "Gravel",
      "record": "04:11.2",
      "country": "Australia"
    },
    {
      "stage": "Junior Wheels II",
      "length": 5.6,
      "surface": "Gravel",
      "record": "04:58.79",
      "country": "Australia"
    },
    {
      "stage": "Kaihuavaara",
      "length": 6.1,
      "surface": "Snow",
      "record": "03:20.58",
      "country": "Finland"
    },
    {
      "stage": "Kaihuavaara II",
      "length": 6.1,
      "surface": "Snow",
      "record": "03:25.12",
      "country": "Finland"
    },
    {
      "stage": "Karlstad",
      "length": 1.9,
      "surface": "Snow",
      "record": "01:20.73",
      "country": "Sweeden"
    },
    {
      "stage": "Karlstad II",
      "length": 1.9,
      "surface": "Snow",
      "record": "01:22.70",
      "country": "Sweeden"
    },
    {
      "stage": "Karowa 2009",
      "length": 1.6,
      "surface": "Tarmac",
      "record": "01:20.49",
      "country": "Poland"
    },
    {
      "stage": "Kolmenjarvet Gravel",
      "length": 6.1,
      "surface": "Gravel",
      "record": "04:30.46",
      "country": "Finland"
    },
    {
      "stage": "Kolmenjarvet Gravel II",
      "length": 6.1,
      "surface": "Gravel",
      "record": "04:16.43",
      "country": "Finland"
    },
    {
      "stage": "Kolmenjarvet Tarmac",
      "length": 6.1,
      "surface": "Tarmac",
      "record": "03:40.39",
      "country": "Finland"
    },
    {
      "stage": "Kolmenjarvet Tarmac II",
      "length": 6.1,
      "surface": "Tarmac",
      "record": "04:13.36",
      "country": "Finland"
    },
    {
      "stage": "Kormoran",
      "length": 10.3,
      "surface": "Gravel",
      "record": "06:46.15",
      "country": "Poland"
    },
    {
      "stage": "Kormoran II",
      "length": 12,
      "surface": "Gravel",
      "record": "08:29.96",
      "country": "Poland"
    },
    {
      "stage": "Kormoran Shakedown",
      "length": 5.2,
      "surface": "Gravel",
      "record": "03:39.83",
      "country": "Poland"
    },
    {
      "stage": "Kuadonvaara",
      "length": 5.7,
      "surface": "Snow",
      "record": "03:27.73",
      "country": "Finland"
    },
    {
      "stage": "La Rocca",
      "length": 7.4,
      "surface": "Gravel",
      "record": "05:06.97",
      "country": "Italy"
    },
    {
      "stage": "Liptakov",
      "length": 6,
      "surface": "Tarmac",
      "record": "03:15.77",
      "country": "Czech Republic"
    },
    {
      "stage": "Liptakov II",
      "length": 6,
      "surface": "Tarmac",
      "record": "03:12.60",
      "country": "Czech Republic"
    },
    {
      "stage": "Livadija",
      "length": 5.5,
      "surface": "Tarmac",
      "record": "03:01.54",
      "country": "Ukraine"
    },
    {
      "stage": "Livadija II",
      "length": 5.5,
      "surface": "Tarmac",
      "record": "03:04.43",
      "country": "Ukraine"
    },
    {
      "stage": "Loch Ard",
      "length": 8.3,
      "surface": "Gravel",
      "record": "03:59.48",
      "country": "Great Britain"
    },
    {
      "stage": "Loch Ard II",
      "length": 8.3,
      "surface": "Gravel",
      "record": "04:03.78",
      "country": "Great Britain"
    },
    {
      "stage": "Lousada - RX",
      "length": 3.6,
      "surface": "Tarmac",
      "record": "02:37.2",
      "country": "Portugal"
    },
    {
      "stage": "Lousada - RG",
      "length": 3.8,
      "surface": "Gravel",
      "record": "02:33.34",
      "country": "Portugal"
    },
    {
      "stage": "Lousada - WRC",
      "length": 3.3,
      "surface": "Gravel",
      "record": "02:44.6",
      "country": "Portugal"
    },
    {
      "stage": "Luceram - Col Saint Roch",
      "length": 5.6,
      "surface": "Tarmac",
      "record": "03:54.3",
      "country": "France"
    },
    {
      "stage": "Lyon - Gerland",
      "length": 0.7,
      "surface": "Tarmac",
      "record": "00:36.5",
      "country": "France"
    },
    {
      "stage": "Maton",
      "length": 3.5,
      "surface": "Tarmac",
      "record": "02:45.66",
      "country": "France"
    },
    {
      "stage": "Maton II",
      "length": 3.5,
      "surface": "Tarmac",
      "record": "02:49.47",
      "country": "France"
    },
    {
      "stage": "Maton Snow",
      "length": 3.5,
      "surface": "Snow",
      "record": "03:30.49",
      "country": "France"
    },
    {
      "stage": "Maton Snow II",
      "length": 3.5,
      "surface": "Snow",
      "record": "03:44.6",
      "country": "France"
    },
    {
      "stage": "Mineshaft",
      "length": 8.2,
      "surface": "Gravel",
      "record": "04:10.45",
      "country": "Australia"
    },
    {
      "stage": "Mineshaft II",
      "length": 8.2,
      "surface": "Gravel",
      "record": "04:16.87 R",
      "country": "Australia"
    },
    {
      "stage": "Mitterbach",
      "length": 2.7,
      "surface": "Snow",
      "record": "01:30.70",
      "country": "Austria"
    },
    {
      "stage": "Mlynky",
      "length": 7.1,
      "surface": "Tarmac",
      "record": "03:10.02",
      "country": "Slovakia"
    },
    {
      "stage": "Mlynky II",
      "length": 7.1,
      "surface": "Tarmac",
      "record": "03:12.98",
      "country": "Slovakia"
    },
    {
      "stage": "Mlynky Snow",
      "length": 7.1,
      "surface": "Snow",
      "record": "03:34.18",
      "country": "Slovakia"
    },
    {
      "stage": "Mlynky Snow II",
      "length": 7.1,
      "surface": "Snow",
      "record": "03:33.25",
      "country": "Slovakia"
    },
    {
      "stage": "Mustaselka",
      "length": 7.9,
      "surface": "Snow",
      "record": "04:07.91",
      "country": "Finland"
    },
    {
      "stage": "Mustaselka II",
      "length": 7.7,
      "surface": "Snow",
      "record": "04:05.55",
      "country": "Finland"
    },
    {
      "stage": "New Bobs",
      "length": 10.1,
      "surface": "Gravel",
      "record": "04:43.16",
      "country": "Australia"
    },
    {
      "stage": "New Bobs II",
      "length": 10,
      "surface": "Gravel",
      "record": "04:38.83",
      "country": "Australia"
    },
    {
      "stage": "Noiker",
      "length": 13.8,
      "surface": "Gravel",
      "record": "06:41.7",
      "country": "Japan"
    },
    {
      "stage": "Noiker II",
      "length": 13.7,
      "surface": "Gravel",
      "record": "06:40.94",
      "country": "Japan"
    },
    {
      "stage": "Northumbria Gravel",
      "length": 9,
      "surface": "Gravel",
      "record": "05:01.95",
      "country": "Great Britain"
    },
    {
      "stage": "Northumbria Tarmac",
      "length": 9,
      "surface": "Tarmac",
      "record": "04:34.53",
      "country": "Great Britain"
    },
    {
      "stage": "Osli - Stryckovy",
      "length": 10.6,
      "surface": "Tarmac",
      "record": "03:19.52",
      "country": "Czech Republic"
    },
    {
      "stage": "Passo Valle",
      "length": 5.8,
      "surface": "Tarmac",
      "record": "05:17.20",
      "country": "Italy"
    },
    {
      "stage": "Passo Valle II",
      "length": 5.8,
      "surface": "Tarmac",
      "record": "03:34.9",
      "country": "Italy"
    },
    {
      "stage": "Peklo",
      "length": 8.5,
      "surface": "Tarmac",
      "record": "04:43.84",
      "country": "Slovakia"
    },
    {
      "stage": "Peklo II",
      "length": 8.5,
      "surface": "Tarmac",
      "record": "04:44.84",
      "country": "Slovakia"
    },
    {
      "stage": "Peklo Snow",
      "length": 8.5,
      "surface": "Snow",
      "record": "05:32.33",
      "country": "Slovakia"
    },
    {
      "stage": "Peklo Snow II",
      "length": 8.5,
      "surface": "Snow",
      "record": "06:13.3",
      "country": "Slovakia"
    },
    {
      "stage": "Peyregrosse - Mandagout",
      "length": 12.8,
      "surface": "Tarmac",
      "record": "07:54.26",
      "country": "France"
    },
    {
      "stage": "Peyregrosse - Mandagout Night",
      "length": 12.8,
      "surface": "Tarmac",
      "record": "08:06.11",
      "country": "France"
    },
    {
      "stage": "Pian del Colle",
      "length": 8.3,
      "surface": "Tarmac",
      "record": "03:52.95",
      "country": "Italy"
    },
    {
      "stage": "Pian del Colle II",
      "length": 8.4,
      "surface": "Tarmac",
      "record": "04:14.87",
      "country": "Italy"
    },
    {
      "stage": "Pian del Colle Snow",
      "length": 8.3,
      "surface": "Snow",
      "record": "4:40",
      "country": "Italy"
    },
    {
      "stage": "Pikes Peak 2008",
      "length": 19.9,
      "surface": "Tarmac",
      "record": "10:15.28",
      "country": "USA"
    },
    {
      "stage": "Pirka Menoko",
      "length": 6.7,
      "surface": "Gravel",
      "record": "04:18.39",
      "country": "Japan"
    },
    {
      "stage": "Pirka Menoko II",
      "length": 6.7,
      "surface": "Gravel",
      "record": "04:19.50",
      "country": "Japan"
    },
    {
      "stage": "Prospect Ridge",
      "length": 7.8,
      "surface": "Gravel",
      "record": "03:48.07",
      "country": "USA"
    },
    {
      "stage": "Prospect Ridge II",
      "length": 7.9,
      "surface": "Gravel",
      "record": "03:50.90",
      "country": "USA"
    },
    {
      "stage": "Prospect Ridge II A",
      "length": 7.6,
      "surface": "Gravel",
      "record": "03:45.87",
      "country": "USA"
    },
    {
      "stage": "PTD Rallysprint",
      "length": 5.1,
      "surface": "Gravel",
      "record": "03:10.65",
      "country": "Netherlands"
    },
    {
      "stage": "Puy du Lac",
      "length": 5,
      "surface": "Tarmac",
      "record": "02:42.77",
      "country": "France"
    },
    {
      "stage": "Rally del Salento 2014 Shakedown",
      "length": 3.8,
      "surface": "Tarmac",
      "record": "02:20.3",
      "country": "Italy"
    },
    {
      "stage": "Rally Poland 2009 Shakedown",
      "length": 4.4,
      "surface": "Gravel",
      "record": "03:12.2",
      "country": "Poland"
    },
    {
      "stage": "Rally Poland 2009 Shakedown II",
      "length": 4.4,
      "surface": "Gravel",
      "record": "02:41.8",
      "country": "Poland"
    },
    {
      "stage": "Rally School Czech",
      "length": 3.2,
      "surface": "Tarmac",
      "record": "01:30.77",
      "country": "Czech Republic"
    },
    {
      "stage": "Rally School Czech II",
      "length": 3.1,
      "surface": "Tarmac",
      "record": "01:30.84",
      "country": "Czech Republic"
    },
    {
      "stage": "Rally School Mix",
      "length": 5.2,
      "surface": "Gravel",
      "record": "03:01.56",
      "country": "Great Britain"
    },
    {
      "stage": "Rally School Mix II",
      "length": 5.2,
      "surface": "Gravel",
      "record": "03:01.56",
      "country": "Great Britain"
    },
    {
      "stage": "Rally School Stage",
      "length": 2.2,
      "surface": "Gravel",
      "record": "01:10.25",
      "country": "Great Britain"
    },
    {
      "stage": "Rally School Stage II",
      "length": 2.3,
      "surface": "Gravel",
      "record": "01:11.64",
      "country": "Great Britain"
    },
    {
      "stage": "Rally School Tarmac",
      "length": 5.2,
      "surface": "Tarmac",
      "record": "02:53.73",
      "country": "Great Britain"
    },
    {
      "stage": "Rally School Tarmac II",
      "length": 5.2,
      "surface": "Tarmac",
      "record": "02:53.73",
      "country": "Great Britain"
    },
    {
      "stage": "Rally Wisla Shakedown",
      "length": 2.5,
      "surface": "Tarmac",
      "record": "01:39.52",
      "country": "Poland"
    },
    {
      "stage": "Rallysprint Hondarribia 2011",
      "length": 8,
      "surface": "Tarmac",
      "record": "05:15.51",
      "country": "Spain"
    },
    {
      "stage": "Red Bull Hill Climb",
      "length": 14,
      "surface": "Gravel",
      "record": "08:59.03",
      "country": "Italy"
    },
    {
      "stage": "ROC 2008",
      "length": 2,
      "surface": "Tarmac",
      "record": "01:13.62",
      "country": "Great Britain"
    },
    {
      "stage": "RSI Slalom gegeWRC",
      "length": 1.8,
      "surface": "Tarmac",
      "record": "01:32.76",
      "country": "Ireland"
    },
    {
      "stage": "RSI Slalom Shonen",
      "length": 1,
      "surface": "Tarmac",
      "record": "00:51.43",
      "country": "Ireland"
    },
    {
      "stage": "Sardian",
      "length": 5.1,
      "surface": "Tarmac",
      "record": "03:06.63",
      "country": "USA"
    },
    {
      "stage": "Sardian Night",
      "length": 5.1,
      "surface": "Tarmac",
      "record": "02:14.11",
      "country": "USA"
    },
    {
      "stage": "Shepherds Shield",
      "length": 4.8,
      "surface": "Gravel",
      "record": "02:18.88",
      "country": "Great Britain"
    },
    {
      "stage": "Shepherds Shield II",
      "length": 4.9,
      "surface": "Gravel",
      "record": "02:22.15",
      "country": "Great Britain"
    },
    {
      "stage": "Sherwood Forest Summer",
      "length": 13.5,
      "surface": "Gravel",
      "record": "08:26.0",
      "country": "Great Britain"
    },
    {
      "stage": "Sherwood Forest Summer II",
      "length": 13.5,
      "surface": "Gravel",
      "record": "08:20.8",
      "country": "Great Britain"
    },
    {
      "stage": "Shomaru Pass",
      "length": 5.8,
      "surface": "Tarmac",
      "record": "04:05.18",
      "country": "Japan"
    },
    {
      "stage": "Shomaru Pass II",
      "length": 5.8,
      "surface": "Tarmac",
      "record": "04:08.92",
      "country": "Japan"
    },
    {
      "stage": "Shurdin",
      "length": 22.1,
      "surface": "Gravel",
      "record": "12:22.2",
      "country": "Ukraine"
    },
    {
      "stage": "Shurdin II",
      "length": 22.1,
      "surface": "Gravel",
      "record": "12:40",
      "country": "Ukraine"
    },
    {
      "stage": "Sieversdorf",
      "length": 8,
      "surface": "Tarmac",
      "record": "03:56.74",
      "country": "Germany"
    },
    {
      "stage": "Sikakama",
      "length": 10.2,
      "surface": "Snow",
      "record": "04:55.12",
      "country": "Finland"
    },
    {
      "stage": "Sikakama II",
      "length": 10.2,
      "surface": "Snow",
      "record": "04:54.99",
      "country": "Finland"
    },
    {
      "stage": "Sipirkakim",
      "length": 8.7,
      "surface": "Gravel",
      "record": "04:15.99",
      "country": "Japan"
    },
    {
      "stage": "Sipirkakim II",
      "length": 8.7,
      "surface": "Gravel",
      "record": "04:18.22",
      "country": "Japan"
    },
    {
      "stage": "Slovakia Ring 2014",
      "length": 11,
      "surface": "Tarmac",
      "record": "06:01.30",
      "country": "Slovakia"
    },
    {
      "stage": "Slovakia Ring 2014 II",
      "length": 11,
      "surface": "Tarmac",
      "record": "06:09.34",
      "country": "Slovakia"
    },
    {
      "stage": "Sorica",
      "length": 15.5,
      "surface": "Tarmac",
      "record": "07:23.78",
      "country": "Slovenia"
    },
    {
      "stage": "SS Daniel Bonara",
      "length": 5.5,
      "surface": "Tarmac",
      "record": "03:01.31",
      "country": "Italy"
    },
    {
      "stage": "SSS Mikolajki",
      "length": 2.6,
      "surface": "Gravel",
      "record": "01:41.50",
      "country": "Poland"
    },
    {
      "stage": "SSS Mikolajki II",
      "length": 2.6,
      "surface": "Gravel",
      "record": "01:39.07",
      "country": "Poland"
    },
    {
      "stage": "SSS York",
      "length": 4.3,
      "surface": "Gravel",
      "record": "03:17.08",
      "country": "Australia"
    },
    {
      "stage": "Stryckovy - Zadni Porici",
      "length": 6.9,
      "surface": "Tarmac",
      "record": "02:47.80",
      "country": "Czech Republic"
    },
    {
      "stage": "Stryckovy okruh",
      "length": 9.2,
      "surface": "Tarmac",
      "record": "03:04.61",
      "country": "Czech Republic"
    },
    {
      "stage": "Sturec",
      "length": 8.1,
      "surface": "Tarmac",
      "record": "04:58.9",
      "country": "Slovakia"
    },
    {
      "stage": "Sturec II",
      "length": 8.2,
      "surface": "Tarmac",
      "record": "5:00",
      "country": "Slovakia"
    },
    {
      "stage": "Sturec Snow",
      "length": 8.1,
      "surface": "Snow",
      "record": "5:47",
      "country": "Slovakia"
    },
    {
      "stage": "Sturec Snow II",
      "length": 8.2,
      "surface": "Snow",
      "record": "5:44",
      "country": "Slovakia"
    },
    {
      "stage": "Svince",
      "length": 4.8,
      "surface": "Tarmac",
      "record": "02:20.17",
      "country": "Czech Republic"
    },
    {
      "stage": "Svince II",
      "length": 4.8,
      "surface": "Tarmac",
      "record": "02:24.10",
      "country": "Czech Republic"
    },
    {
      "stage": "Sweet Lamb",
      "length": 5.1,
      "surface": "Gravel",
      "record": "02:40.03",
      "country": "Great Britain"
    },
    {
      "stage": "Sweet Lamb II",
      "length": 5.1,
      "surface": "Gravel",
      "record": "02:40.85",
      "country": "Great Britain"
    },
    {
      "stage": "Swiss Gravel II",
      "length": 5.6,
      "surface": "Gravel",
      "record": "03:34.29",
      "country": "Switzerland"
    },
    {
      "stage": "Swiss Gravel IV",
      "length": 8.2,
      "surface": "Gravel",
      "record": "03:54.66",
      "country": "Switzerland"
    },
    {
      "stage": "Swiss Tarmac I",
      "length": 5.6,
      "surface": "Tarmac",
      "record": "06:15.26",
      "country": "Switzerland"
    },
    {
      "stage": "Swiss Tarmac III",
      "length": 8.2,
      "surface": "Tarmac",
      "record": "07:09.03",
      "country": "Switzerland"
    },
    {
      "stage": "Tanner",
      "length": 3.9,
      "surface": "Gravel",
      "record": "02:36.39",
      "country": "Japan"
    },
    {
      "stage": "Tanner II",
      "length": 4,
      "surface": "Gravel",
      "record": "02:36.16",
      "country": "Japan"
    },
    {
      "stage": "Tavia",
      "length": 3.8,
      "surface": "Gravel",
      "record": "02:01.29",
      "country": "Italy"
    },
    {
      "stage": "Torre Vecchia",
      "length": 9.8,
      "surface": "Tarmac",
      "record": "05:18.24",
      "country": "Italy"
    },
    {
      "stage": "Travanca do Monte",
      "length": 3,
      "surface": "Gravel",
      "record": "01:34.39",
      "country": "Portugal"
    },
    {
      "stage": "Uchan - Su",
      "length": 10.8,
      "surface": "Tarmac",
      "record": "07:31.56",
      "country": "Ukraine"
    },
    {
      "stage": "Uchan - Su Winter",
      "length": 10.8,
      "surface": "Snow",
      "record": "11:13.32",
      "country": "Ukraine"
    },
    {
      "stage": "Uhorna",
      "length": 11.5,
      "surface": "Tarmac",
      "record": "06:07.72",
      "country": "Slovakia"
    },
    {
      "stage": "Undva",
      "length": 10,
      "surface": "Gravel",
      "record": "05:44.41",
      "country": "Estonia"
    },
    {
      "stage": "Undva II",
      "length": 10,
      "surface": "Gravel",
      "record": "05:42.58",
      "country": "Estonia"
    },
    {
      "stage": "Verkiai 2010 I",
      "length": 5.6,
      "surface": "Tarmac",
      "record": "00:56.69",
      "country": "Lithuania"
    },
    {
      "stage": "Versme",
      "length": 3.2,
      "surface": "Gravel",
      "record": "01:41.20",
      "country": "Lithuania"
    },
    {
      "stage": "Vicar",
      "length": 4.7,
      "surface": "Tarmac",
      "record": "2:52.55",
      "country": "Spain"
    },
    {
      "stage": "Vieux Moulin - Perrancey",
      "length": 20.5,
      "surface": "Gravel",
      "record": "11:58",
      "country": "France"
    },
    {
      "stage": "Vinec - Skalsko",
      "length": 17.8,
      "surface": "Tarmac",
      "record": "10:46",
      "country": "Czech Republic"
    }
  ]
}


