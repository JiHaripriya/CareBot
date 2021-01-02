import { ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from './http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent implements OnInit{
  title = 'carebot';
  convo = false;
  message = '';
  emotion: any;
  startNow = false;
  chatForm : FormGroup = new FormGroup({});
  ignorePhrases = [
    'Hii', 'hii', 'hi', 'Hey', 'hey', 'Yo', 'yo', 'Mm', 'mm', 'Hmm', 'yeah', 'yup', 'okay', 'ok', 'bye'
  ]
  match = false;
  fillForm = false;
  chatBody = true;

  replies = [
    this.botResponse('Tomodachi!!! Welcome :) You can text me or send me voice messages now! How are you feeling today?'),
    this.botResponse('If you\'re sending me a voice message, make sure to send me path to processed audio file. I\'m unable to fix the audio corruption that is happening while recording. Sorry!'),
  ];

  recording = false;

  constructor(private service: HttpService){}

  ngOnInit() {

    this.chatForm = new FormGroup({'chat': new FormControl(null, Validators.required)})

    this.service.chatBodyDisplay.subscribe((num: number) => num == 1 ? this.chatBody = true : this.chatBody = false)

    this.service.movieRecommendationData.subscribe(
      (data: string[]) => {
        const template = []
        for(let movie of data) template.push(`<span class="p-2 bg-light text-success border border-default rounded shadow-sm"> ${movie} </span> <br>`)
        this.replies.push( this.recommendation('movies', template))
      }
    )

    this.service.locationRecommendation.subscribe(
      (site: {[index:string]:any}) => {
        const template = []
        for(let p in site) {
          let place = String(site[p]).split(" :")
          if(place[1].includes("None")) template.push(`<span class="p-2 bg-light text-success border border-default rounded shadow-sm"> ${place[0]} </span> <br>`)
          else {
            template.push(`<div class="p-2 bg-light text-success border border-default rounded shadow-sm"> ${place[0]} <br>
                <span class="text-small"> There's more nearby!!</span> <br> ${place[1]}
              </div>`)
          }
        }

        this.replies.push(this.recommendation('places', template))
      }
    )

    this.service.songRecommendation.subscribe(
      (songList: {[index:string]:any}) => {
        const template = []
        for(let song in songList) {
          template.push(`<span class="p-2 bg-light text-success border border-default rounded shadow-sm"> ${songList[song]} </span> <br>`)
        }
        // "albums"
        this.replies.push( this.recommendation('albums', template))
      }
    )

    setTimeout(() => this.startNow = true, 1500);

  }


  sendMessage(){
    this.message = this.chatForm.get('chat')?.value
    // Voice recorder
    if(this.message.includes('wav')){
      this.service.sendVoiceInput(this.message).subscribe(emotion => this.emotionResponse(emotion[0]))
    }
    else {
      setTimeout(() => {
        this.replies.push( this.userResponse(this.message))
      }, 1000)
    
      const search = this.message.split(' ');
      for(let eachWord of search){
        if(this.ignorePhrases.includes(eachWord.toLocaleLowerCase()) && search.length == 1){
          this.match = true;
          break;
        } 
      }
  
      if(!this.match) {
        this.service.getEmotion(this.message).subscribe(
          (response: string) => {
            this.emotion = response.trim();
            this.service.storeEmotion(this.emotion);
            this.emotionResponse(this.emotion);
          }
        )
      }
      this.emotion = localStorage.getItem('emotion');
    }

    this.chatForm.reset();
    this.match = false;
  }

  private emotionResponse(emotion: string) {
    if(emotion === 'Happy') this.replies.push(this.botResponse('Oh Yay! Glad to hear that. Could you fill up the form for me please?'))
    else this.replies.push(this.botResponse('Oh! Let me help you with that. Could you fill up the form for me please?'))
    this.fillForm = true;
  }

  showForm(){
    this.fillForm = false;
    this.service.storeEmotionSubject.next(this.emotion);
    this.chatBody = false
  }

  formReject() {
    this.fillForm = false;
    this.replies.push(this.botResponse('Let us talk after sometime alright? Hang in there.'))
  }

  chunks:string[] = [];
  mediaRecorder : any;

  startRecording() {
    this.recording = true;
    navigator.mediaDevices.getUserMedia({audio: true})
    .then(mediaStream => {
      this.mediaRecorder = new MediaRecorder(mediaStream);
      this.mediaRecorder.start();
      this.mediaRecorder.ondataavailable = (e: { [index:string]: any }) => this.chunks.push(e.data);
    })
    .catch(err => console.log(err.message));
  }

  stopRecording() {
    this.recording = false;
    this.mediaRecorder.stop();

    this.replies.push(this.botResponse('Your recording will be downloaded now. Could you please send me the file path next?'))
    
    this.mediaRecorder.onstop = () => {

      let blob = new Blob(this.chunks, {'type': "audio/wav;codecs=opus"});
      let audioUrl = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = audioUrl;
      a.download = 'audio.wav';
      a.click();

      this.chunks = [];
    }
  }

  private botResponse(message: string) {
    return `<div class="row">
              <div class="talk-bubble tri-right left-top bg-success shadow-sm">
                <div class="talktext">
                  <p>${message}</p>
                </div>
              </div>
            </div>`
  }

  private userResponse(message: string) {
    return  `<div class="row justify-content-end bg-white">
                <div class="talk-bubble tri-right btm-right shadow-sm">
                  <div class="talktext">
                    ${message }
                  </div>
              </div>
            </div>`
  }

  private recommendation(type:string, content: string[]) {
    return `<div class="row">
              <div class="talk-bubble tri-right left-top bg-success shadow-sm">
                <div class="talktext"> 
                  <p>Try the following ${type}:</p> <br>
                  ${content.join('<br/>')}
                </div>
              </div>
            </div>`
  }
}