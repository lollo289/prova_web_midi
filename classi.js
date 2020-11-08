/*jshint esversion: 6 */

//Drawing constants
var NOTE_RADIUS = 10;
var NOTE_LEG_LENGTH = 20;
var NOTE_COLOR;
var NOTE_SPACING = 50;
var BACKGROUND_COLOR;
var CANVAS_HEIGTH = 600;
var CANVAS_WIDTH = 600;
var PENT_SPACING = 15;
var PENT_DIVISION = 15;
var PENT_LENGTH;
var FPS = 24;
var ADD_CUT_LENGHT = 15;

class note{

  constructor(_x, _y, _pitch, _duration = 1){
    this.x = _x;
    this.y = _y;
    this.pitch = _pitch; //ES. C3,A6,F#5
    this.duration = _duration;
  }

  draw_note(){
      fill(NOTE_COLOR);
      ellipse(this.x, this.y, NOTE_RADIUS, NOTE_RADIUS);
      line(this.x + NOTE_RADIUS/2, this.y, this.x + NOTE_RADIUS/2, this.y - NOTE_LEG_LENGTH);
      if(this.pitch.length == 3){
        textSize(20);
        text(this.pitch.charAt(1),this.x-20,this.y+5);
      }
  }
}//FINE CLASS NOTE

class chord{

  constructor(_tonic, _type){
    this.tonic = _tonic;
    this.type = _type;
    this.notes = [];

    var note_grades = [];
    var note_octaves = [];
    note_octaves.push(0);
    var octave;
    var note_name;
    if(this.tonic.length == 3){
      note_name = this.tonic.slice(0,2);
      octave = parseInt(this.tonic.slice(2));
    }else{
      note_name = this.tonic.slice(0,1);
      octave = parseInt(this.tonic.slice(1));
    }


    for (var i=0; i<chords_types[this.type].length; i++){
      note_grades.push(intervals[note_name][chords_types[this.type][i]]);
      if(i>0){
        if(intervals.allpitchs.indexOf(note_grades[0])<intervals.allpitchs.indexOf(note_grades[i])){
          note_octaves.push(0);
        }else{
          note_octaves.push(1);
        }
      }

    }

    octave = Math.abs(octave - note_octaves[note_grades.indexOf(note_name)]);
    for (i=0; i<note_octaves.length;i++){
      note_octaves[i] = note_octaves[i] + octave;
    }

    for (i=0; i<note_grades.length;i++){
      this.notes.push(new note(0,0,note_grades[i]+note_octaves[i]));
    }
  }
}//FINE CLASS CHORD

class pentagram{

  constructor(_x, _y, _key = "violin"){
    this.x = _x;
    this.y = _y;
    this.accordi = [];
    //Define the position of a reference note to calculate all the notes of the keyboard condidering the key of the pentagram.
    //The reference note is F5
    //C4 is the middle C
    if (_key == "violin"){
      this.y_rif = this.y; //+ 38 * PENT_SPACING/2;
    }else{
      this.y_rif = this.y - 12 * PENT_SPACING/2;
    }
  }

  draw_pentagram(){
    for(var i=0 ; i<5 ; i++){
      line(this.x, this.y + i * PENT_SPACING, this.x + PENT_LENGTH, this.y + i * PENT_SPACING);
    }
  }

  draw_notes(){
    for (var i=0;i<this.accordi.length;i++){
      for (var j=0;j<this.accordi[i].notes.length;j++){
        this.accordi[i].notes[j].draw_note();
        //tagli addizionali
        if(this.accordi[i].notes[j].y>this.y + PENT_SPACING*4 + PENT_SPACING/2){
          for(var z=0; z<(this.accordi[i].notes[j].y-(this.y+PENT_SPACING*4))/PENT_SPACING; z++){
            line(this.accordi[i].notes[j].x - ADD_CUT_LENGHT/2, this.accordi[i].notes[j].y-z*PENT_SPACING, this.accordi[i].notes[j].x + ADD_CUT_LENGHT/2, this.accordi[i].notes[j].y-z*PENT_SPACING);
          }
        }

        // if(this.accordi[i].notes[j].y>this.y + PENT_SPACING*4 || this.accordi[i].notes[j].y<this.y){
        //   line(this.accordi[i].notes[j].x - ADD_CUT_LENGHT/2, this.accordi[i].notes[j].y, this.accordi[i].notes[j].x + ADD_CUT_LENGHT/2, this.accordi[i].notes[j].y);
        // }
      }
    }
    //nome accordo sopra
    var note_name;
    for (i=0;i<this.accordi.length;i++){
      if(this.accordi[i].tonic.length == 3){
        note_name = this.accordi[i].tonic.slice(0,2);
      }else{
        note_name = this.accordi[i].tonic.slice(0,1);
      }
      textSize(20);
      text(note_name + this.accordi[i].type,this.accordi[i].notes[0].x,this.y-70);
    }

  }

  shift_notes(){
    //Se sono stata premute le note giuste togli le note da schermo e sposta le altre in avanti
    this.accordi.shift();
    for (var i=0;i<this.accordi.length;i++){
      for (var j=0;j<this.accordi[i].notes.length;j++){
        this.accordi[i].notes[j].x = this.accordi[i].notes[j].x - PENT_LENGTH/PENT_DIVISION;
      }
    }
  }

  y_pos_note(pitch){
    // Define the y position of a note in the pentagram aka the pitch position
    //F5 is the reference for calculus of position
    var note_name = pitch.slice(0,1);
    var octave;
    if(pitch.length == 3){
      octave = parseInt(pitch.slice(2));
    }else{
      octave = parseInt(pitch.slice(1));
    }
    var pitch_distance = (natural_pitchs.indexOf('F') - natural_pitchs.indexOf(note_name)) * -1;
    var octave_distance = (5 - octave) * -1;
    return this.y_rif - octave_distance * 7 * PENT_SPACING/2 - pitch_distance * PENT_SPACING/2;
  }

  x_pos_note(notes, metronomo){
    //Move note along x axis with metronome
    console.log(notes[0].x);
    var zero = this.x + (Math.floor((notes[0].x - this.x) / (PENT_LENGTH / PENT_DIVISION)) + 1) * PENT_LENGTH / PENT_DIVISION;
    //console.log(notes[0].x);
    var delta_pos = (PENT_LENGTH / PENT_DIVISION) * metronome.time_percent;
    notes[0].x = zero - delta_pos;
    for (var i=1; i<n; i++){
      notes[i].x = notes[i].x - delta_pos;
    }
  }

  calculate_notes(min_oct,max_oct,num){
    //rimuovi note non checkate
    //num = numero di accrodi da creare
    this.accordi = [];
    var checked_pitchs = [];
    for(var i=0; i<intervals.allpitchs.length; i++){
      if(document.getElementById(intervals.allpitchs[i]) != null && document.getElementById(intervals.allpitchs[i]).checked){
        checked_pitchs.push(intervals.allpitchs[i]);
      }
    }
    //Rimuovi accordi non checkati
    var keys = Object.keys(chords_types);
    var checked_chords = [];
    keys.shift();
    for(i=0; i<keys.length; i++){
      if(document.getElementById(keys[i]).checked){
        checked_chords.push(keys[i]);
      }
    }

    //Crea gli accordi da suonare
    var a = get_random(min_oct,max_oct);

    for (i=0;i<num;i=i+2){
      var tonic = checked_pitchs[get_random(0,checked_pitchs.length-1)];
      this.accordi[i] = new chord(tonic+a.toString(),'note');
      var type = checked_chords[get_random(0,checked_chords.length-1)];
      this.accordi[i+1] = new chord(tonic+(a+1).toString(),type);
    }

    //Calcolare posizione note nel pentagramma
    for (i=0;i<this.accordi.length;i++){
      for (var j=0;j<this.accordi[i].notes.length;j++){
        this.accordi[i].notes[j].y = penta.y_pos_note(this.accordi[i].notes[j].pitch);
        this.accordi[i].notes[j].x = penta.x + i*PENT_LENGTH/PENT_DIVISION;
      }
    }

  }//FINE CALCULATE_NOTES



}//FINE CLASSE PENTAGRAMM


class metronome{
  constructor(_bpm = 60){
    this.beat = true;
    this.bpm = _bpm;
    this.time_percent = 0;
    this.ref_date = new Date();
    this.last_beat = this.ref_date.getTime();
  }

 count_beat(){
   this.ref_date = new Date();
   //round the time to 1000 milliseconds
   var time_passed = Math.floor((this.ref_date.getTime() - this.last_beat) / 1000) * 1000;
   //calculate percentage time passed
   this.time_percent = ((this.ref_date.getTime() - this.last_beat) / 1000) / (60 / this.bpm);
   //if the right number of milliseconds has passed turns true the beat
   if( time_passed == 60 / this.bpm * 1000 ){
     this.beat = true;
     this.last_beat = this.ref_date.getTime();
   }else{
    this.beat = false;
   }
 }

}//FINE CLASS METRONOME


function get_random_key(obj, min, max) {
    //Restituisce una chiave random dell'array
    var index = Math.floor(Math.random() * (max - min + 1)) + min;
    var keys = Object.keys(obj);
    return keys[index];
}//FINE_GET_RANDOM_KEY

function get_random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min; //Il max è incluso e il min è incluso
}//FINE GET_RANDOM



function compare(note_premute, note_da_premere){
  //Controllare se note_premute e note_da_premere hanno gli stessi elementi
  if(note_premute.length == 0 || note_premute.length != note_da_premere.length){
    return false;
  }
  var flag;
  for (var i=0; i<note_premute.length; i++){
    flag = false;
    for (var j=0; j<note_da_premere.length; j++){
      if(note_premute[i] == note_da_premere[j].pitch){
        flag = true;
      }
    }
    if(flag == false){
      return false;
    }
  }
  return true;
}//FINE COMPARE
