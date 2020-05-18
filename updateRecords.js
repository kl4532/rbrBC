const fs = require('fs');
const records = './assets/records.json';
const recordsSRC = './src/assets/records.json';
const update = './assets/recordsUpdate.json'
let count = 0;

let oldData = JSON.parse(fs.readFileSync(records));

const updateData = JSON.parse(fs.readFileSync(update));

oldData.forEach((track)=>{
    for(let i = 0; i < updateData.length; i++) {
        if (updateData[i].stage === track.stage) {
            trackUpdate = track.stage;
            track.record = updateData[i].record;
            count++;
            break;
        }
    }
});

fs.writeFile (records, JSON.stringify(oldData), function(err) {
    if (err) throw err;
    console.log(count + ` records of ${oldData.length} tracks updated`);
    }
);

fs.writeFile (recordsSRC, JSON.stringify(oldData), function(err) {
    if (err) throw err;
    console.log(count + ` records of ${oldData.length} tracks in SRC updated`);
    }
);