import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageComponent } from './stage.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DataService } from '../services/data.service';
import { of } from 'rxjs';

fdescribe('StageComponent', () => {
  let component: StageComponent;
  let fixture: ComponentFixture<StageComponent>;
  let srv: DataService;
  const formBuilder: FormBuilder = new FormBuilder();

  const mockSettings = {
    value: {
      "difficulty": "75",
      "surface": "All",
      "lMin": "3",
      "lMax": "11",
      "stages": "5",
      "country": "All",
      "selectedTracks": [
        {
          "stage": "Maton II",
          "record": "02:49.47",
          "length": 3.5,
          "surface": "Tarmac",
          "country": "France"
        },
        {
          "stage": "Torre Vecchia",
          "record": "05:18.24",
          "length": 9.8,
          "surface": "Tarmac",
          "country": "Italy"
        },
        {
          "stage": "New Bobs II",
          "record": "04:38.83",
          "length": 10,
          "surface": "Gravel",
          "country": "Australia"
        },
        {
          "stage": "Hyppyjulma Gravel",
          "record": "03:12.22",
          "length": 6.1,
          "surface": "Gravel",
          "country": "Finland"
        },
        {
          "stage": "Rally del Salento 2014 Shakedown",
          "record": "02:20.3",
          "length": 3.8,
          "surface": "Tarmac",
          "country": "Italy"
        }
      ],
      "players": "1",
      "selectedPlayers": [
        {
          "id": 100,
          "name": "Player 1",
          "talent": {},
          "stages": null,
          "totalTimeSeconds": 0,
          "totalTimeString": "",
          "gap": "0",
          "currentStageTime": "",
          "player": true
        }
      ]
    }
  }

  const mockDrivers = [
    {
      "id": 1,
      "name": "Thierry Neuville",
      "talent": {
        "fast": 1,
        "consistence": 2,
        "safe": 2,
        "super": false
      },
      "stages": [
        {
          "name": "Maton II",
          "timeSeconds": 214.633755,
          "timeString": "03:34.63",
          "crash": false
        },
        {
          "name": "Torre Vecchia",
          "timeSeconds": 407.46654,
          "timeString": "06:47.47",
          "crash": false
        },
        {
          "name": "New Bobs II",
          "timeSeconds": 363.1063675,
          "timeString": "06:03.11",
          "crash": false
        },
        {
          "name": "Hyppyjulma Gravel",
          "timeSeconds": 254.28303250000002,
          "timeString": "04:14.28",
          "crash": false
        },
        {
          "name": "Rally del Salento 2014 Shakedown",
          "timeSeconds": 180.1627375,
          "timeString": "03:00.16",
          "crash": false
        }
      ],
      "totalTimeSeconds": 214.633755,
      "totalTimeString": "03:34.63",
      "crash": false,
      "gap": "00:05.13"
    },
    {
      "id": 2,
      "name": "Ott Tänak",
      "talent": {
        "fast": 1,
        "consistence": 2,
        "safe": 2,
        "super": true
      },
      "stages": [
        {
          "name": "Maton II",
          "timeSeconds": 211.6256625,
          "timeString": "03:31.63",
          "crash": false
        },
        {
          "name": "Torre Vecchia",
          "timeSeconds": 395.73144,
          "timeString": "06:35.73",
          "crash": false
        },
        {
          "name": "New Bobs II",
          "timeSeconds": 344.52931874999996,
          "timeString": "05:44.53",
          "crash": false
        },
        {
          "name": "Hyppyjulma Gravel",
          "timeSeconds": 250.24641250000002,
          "timeString": "04:10.25",
          "crash": false
        },
        {
          "name": "Rally del Salento 2014 Shakedown",
          "timeSeconds": 175.58545,
          "timeString": "02:55.59",
          "crash": false
        }
      ],
      "totalTimeSeconds": 211.6256625,
      "totalTimeString": "03:31.63",
      "crash": false,
      "gap": "00:02.12"
    },
    {
      "id": 3,
      "name": "Sébastien Ogier",
      "talent": {
        "fast": 2,
        "consistence": 1,
        "safe": 1,
        "super": true
      },
      "stages": [
        {
          "name": "Maton II",
          "timeSeconds": 213.38391375,
          "timeString": "03:33.38",
          "crash": false
        },
        {
          "name": "Torre Vecchia",
          "timeSeconds": 413.39376000000004,
          "timeString": "06:53.39",
          "crash": false
        },
        {
          "name": "New Bobs II",
          "timeSeconds": 360.28321374999996,
          "timeString": "06:00.28",
          "crash": false
        },
        {
          "name": "Hyppyjulma Gravel",
          "timeSeconds": 249.30934,
          "timeString": "04:09.31",
          "crash": false
        },
        {
          "name": "Rally del Salento 2014 Shakedown",
          "timeSeconds": 176.0765,
          "timeString": "02:56.08",
          "crash": false
        }
      ],
      "totalTimeSeconds": 213.38391375,
      "totalTimeString": "03:33.38",
      "crash": false,
      "gap": "00:03.88"
    },
    {
      "id": 4,
      "name": "Elfyn Evans",
      "talent": {
        "fast": 2,
        "consistence": 1,
        "safe": 2,
        "super": false
      },
      "stages": [
        {
          "name": "Maton II",
          "timeSeconds": 214.71849000000003,
          "timeString": "03:34.72",
          "crash": false
        },
        {
          "name": "Torre Vecchia",
          "timeSeconds": 411.80256,
          "timeString": "06:51.80",
          "crash": false
        },
        {
          "name": "New Bobs II",
          "timeSeconds": 353.97468499999997,
          "timeString": "05:53.97",
          "crash": false
        },
        {
          "name": "Hyppyjulma Gravel",
          "timeSeconds": 242.1731725,
          "timeString": "04:02.17",
          "crash": false
        },
        {
          "name": "Rally del Salento 2014 Shakedown",
          "timeSeconds": 177.3918125,
          "timeString": "02:57.39",
          "crash": false
        }
      ],
      "totalTimeSeconds": 214.71849000000003,
      "totalTimeString": "03:34.72",
      "crash": false,
      "gap": "00:05.21"
    },
    {
      "id": 5,
      "name": "Esapekka Lappi",
      "talent": {
        "fast": 2,
        "consistence": 2,
        "safe": 1,
        "super": false
      },
      "stages": [
        {
          "name": "Maton II",
          "timeSeconds": 215.75649375000003,
          "timeString": "03:35.76",
          "crash": false
        },
        {
          "name": "Torre Vecchia",
          "timeSeconds": 415.66122000000007,
          "timeString": "06:55.66",
          "crash": false
        },
        {
          "name": "New Bobs II",
          "timeSeconds": 372.8654175,
          "timeString": "06:12.87",
          "crash": false
        },
        {
          "name": "Hyppyjulma Gravel",
          "timeSeconds": 241.3562375,
          "timeString": "04:01.36",
          "crash": false
        },
        {
          "name": "Rally del Salento 2014 Shakedown",
          "timeSeconds": 181.96910000000003,
          "timeString": "03:01.97",
          "crash": false
        }
      ],
      "totalTimeSeconds": 215.75649375000003,
      "totalTimeString": "03:35.76",
      "crash": false,
      "gap": "00:06.25"
    },
    {
      "id": 6,
      "name": "Teemu Suninen",
      "talent": {
        "fast": 2,
        "consistence": 2,
        "safe": 2,
        "super": false
      },
      "stages": [
        {
          "name": "Maton II",
          "timeSeconds": 216.22253625000002,
          "timeString": "03:36.22",
          "crash": false
        },
        {
          "name": "Torre Vecchia",
          "timeSeconds": 423.97524,
          "timeString": "07:03.98",
          "crash": false
        },
        {
          "name": "New Bobs II",
          "timeSeconds": 371.92436625,
          "timeString": "06:11.92",
          "crash": false
        },
        {
          "name": "Hyppyjulma Gravel",
          "timeSeconds": 254.49928000000003,
          "timeString": "04:14.50",
          "crash": false
        },
        {
          "name": "Rally del Salento 2014 Shakedown",
          "timeSeconds": 183.07396250000002,
          "timeString": "03:03.07",
          "crash": false
        }
      ],
      "totalTimeSeconds": 216.22253625000002,
      "totalTimeString": "03:36.22",
      "crash": false,
      "gap": "00:06.72"
    },
    {
      "id": 7,
      "name": "Takamoto Katsuta",
      "talent": {
        "fast": 3,
        "consistence": 1,
        "safe": 2,
        "super": false
      },
      "stages": [
        {
          "name": "Maton II",
          "timeSeconds": 216.81568125,
          "timeString": "03:36.82",
          "crash": false
        },
        {
          "name": "Torre Vecchia",
          "timeSeconds": 408.06324,
          "timeString": "06:48.06",
          "crash": false
        },
        {
          "name": "New Bobs II",
          "timeSeconds": 364.74449375,
          "timeString": "06:04.74",
          "crash": false
        },
        {
          "name": "Hyppyjulma Gravel",
          "timeSeconds": 247.3631125,
          "timeString": "04:07.36",
          "crash": false
        },
        {
          "name": "Rally del Salento 2014 Shakedown",
          "timeSeconds": 184.02098750000002,
          "timeString": "03:04.02",
          "crash": false
        }
      ],
      "totalTimeSeconds": 216.81568125,
      "totalTimeString": "03:36.82",
      "crash": false,
      "gap": "00:07.31"
    },
    {
      "id": 8,
      "name": "Eric Camilli",
      "talent": {
        "fast": 3,
        "consistence": 2,
        "safe": 3,
        "super": false
      },
      "stages": [
        {
          "name": "Maton II",
          "timeSeconds": 220.67112375000002,
          "timeString": "03:40.67",
          "crash": false
        },
        {
          "name": "Torre Vecchia",
          "timeSeconds": 430.26048000000003,
          "timeString": "07:10.26",
          "crash": false
        },
        {
          "name": "New Bobs II",
          "timeSeconds": 361.36367999999993,
          "timeString": "06:01.36",
          "crash": false
        },
        {
          "name": "Hyppyjulma Gravel",
          "timeSeconds": 259.1365875,
          "timeString": "04:19.14",
          "crash": false
        },
        {
          "name": "Rally del Salento 2014 Shakedown",
          "timeSeconds": 183.16165,
          "timeString": "03:03.16",
          "crash": false
        }
      ],
      "totalTimeSeconds": 220.67112375000002,
      "totalTimeString": "03:40.67",
      "crash": false,
      "gap": "00:11.16"
    },
    {
      "id": 9,
      "name": "Gus Greensmith",
      "talent": {
        "fast": 3,
        "consistence": 1,
        "safe": 1,
        "super": false
      },
      "stages": [
        {
          "name": "Maton II",
          "timeSeconds": 217.02751875,
          "timeString": "03:37.03",
          "crash": false
        },
        {
          "name": "Torre Vecchia",
          "timeSeconds": 408.3417,
          "timeString": "06:48.34",
          "crash": false
        },
        {
          "name": "New Bobs II",
          "timeSeconds": 365.51127625,
          "timeString": "06:05.51",
          "crash": false
        },
        {
          "name": "Hyppyjulma Gravel",
          "timeSeconds": 247.050755,
          "timeString": "04:07.05",
          "crash": false
        },
        {
          "name": "Rally del Salento 2014 Shakedown",
          "timeSeconds": 180.49595,
          "timeString": "03:00.50",
          "crash": false
        }
      ],
      "totalTimeSeconds": 217.02751875,
      "totalTimeString": "03:37.03",
      "crash": false,
      "gap": "00:07.52"
    },
    {
      "id": 10,
      "name": "Kalle Rovanperä",
      "talent": {
        "fast": 2,
        "consistence": 2,
        "safe": 1,
        "super": true
      },
      "stages": [
        {
          "name": "Maton II",
          "timeSeconds": 227.25927000000001,
          "timeString": "03:47.26",
          "crash": false
        },
        {
          "name": "Torre Vecchia",
          "timeSeconds": 407.58588000000003,
          "timeString": "06:47.59",
          "crash": false
        },
        {
          "name": "New Bobs II",
          "timeSeconds": 369.55431125,
          "timeString": "06:09.55",
          "crash": false
        },
        {
          "name": "Hyppyjulma Gravel",
          "timeSeconds": 253.05763000000002,
          "timeString": "04:13.06",
          "crash": false
        },
        {
          "name": "Rally del Salento 2014 Shakedown",
          "timeSeconds": 180.4784125,
          "timeString": "03:00.48",
          "crash": false
        }
      ],
      "totalTimeSeconds": 227.25927000000001,
      "totalTimeString": "03:47.26",
      "crash": false,
      "gap": "00:17.75"
    },
    {
      "id": 11,
      "name": "Robert Kubica",
      "talent": {
        "fast": 1,
        "consistence": 2,
        "safe": 4,
        "super": true
      },
      "stages": [
        {
          "name": "Maton II",
          "timeSeconds": 209.50728750000002,
          "timeString": "03:29.51",
          "crash": false
        },
        {
          "name": "Torre Vecchia",
          "timeSeconds": 399.5901,
          "timeString": "06:39.59",
          "crash": false
        },
        {
          "name": "New Bobs II",
          "timeSeconds": 352.82451124999994,
          "timeString": "05:52.82",
          "crash": false
        },
        {
          "name": "Hyppyjulma Gravel",
          "timeSeconds": 249.30934,
          "timeString": "04:09.31",
          "crash": false
        },
        {
          "name": "Rally del Salento 2014 Shakedown",
          "timeSeconds": 179.6716875,
          "timeString": "02:59.67",
          "crash": false
        }
      ],
      "totalTimeSeconds": 209.50728750000002,
      "totalTimeString": "03:29.51",
      "crash": false,
      "gap": "00:00"
    }
  ]
  let elements = {
    btnStart: () => document.body.querySelector('.btn-start') as HTMLInputElement,
    input: () => document.body.querySelector('.player-time-input') as HTMLInputElement,
    btnSubmit: () => document.body.querySelector('.btn-submit') as HTMLInputElement,
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [ StageComponent ],
      providers: [
        DataService,
        { provide: FormBuilder, useClass: formBuilder }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    srv = TestBed.get(DataService);
    // create mock settingsForm
    const settingsForm =  new FormGroup({
      difficulty: new FormControl('75'),
      surface: new FormControl('All'),
      lMin: new FormControl('3'),
      lMax: new FormControl('11'),
      stages: new FormControl('5'),
      country: new FormControl('All'),
      selectedTracks: formBuilder.array(mockSettings.value.selectedTracks),
      players: new FormControl('1'),
      selectedPlayers: formBuilder.array([
        formBuilder.group({
          id: 100,
          name: "Player 1",
          talent: {},
          stages: [],
          totalTimeSeconds: 0,
          totalTimeString: "",
          gap: "0",
          currentStageTime: "",
          player: true
        })
      ], [Validators.required])
    });
    spyOn(srv, 'getSettings').and.returnValue(settingsForm);
    spyOn(srv, 'getDrivers').and.returnValue(of(mockDrivers));


    fixture = TestBed.createComponent(StageComponent);
    component = fixture.componentInstance;
    spyOn(component, 'init').and.callThrough();
    spyOn(component, 'playStage').and.callThrough();

    fixture.detectChanges();

    elements.btnStart().click();
    fixture.detectChanges();
  });

  it('should create and start tournament', () => {
    expect(srv.getSettings).toHaveBeenCalled();
    expect(component.init).toHaveBeenCalled();
    expect(component.started).toBeTruthy();
    expect(elements.btnStart()).toBe(null);
  });

  it('should validate user input and submit if correct', () => {
    console.log("DW", component.drivers);
    spyOn(component, 'areTimesValid').and.callThrough()
    // expect(component.playStage).toHaveBeenCalled();

    component.playStage(0);
    // elements.input().value = "12:00.1";
    elements.input().value = "SHOULD NOT PASS";
    fixture.detectChanges();
    elements.btnSubmit().click;
    fixture.detectChanges();
    // expect(component.areTimesValid).toHaveBeenCalled();
  });

});
