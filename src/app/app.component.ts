import { ViewEncapsulation } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
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
      `
      <div class="row">
        <div class="talk-bubble tri-right left-top bg-success shadow-sm">
          <div class="talktext">
            <p>Tomodachi!!! Welcome :) How are you feeling today?</p>
          </div>
        </div>
      </div>`
  ];

  recording = false;

  constructor(private service: HttpService){}

  ngOnInit() {

    this.chatForm = new FormGroup({
      'chat': new FormControl(null, Validators.required)
    })

    this.service.chatBodyDisplay.subscribe((num: number) => {
      num == 1 ? this.chatBody = true : this.chatBody = false
    })

    this.service.movieRecommendationData.subscribe(
      (data: string[]) => {
        const template = []
        for(let movie of data) {
          template.push(
            `
            <span class="p-2 bg-light text-success border border-default rounded shadow-sm"> ${movie} </span> <br>
            `
          )
        }
        this.replies.push( `
        <div class="row">
          <div class="talk-bubble tri-right left-top bg-success shadow-sm">
            <div class="talktext"> 
              <p>Try the following movies:</p> <br>
              ${template.join('<br/>')}
            </div>
          </div>
        </div>`)
      }
    )

    setTimeout(() => {
      this.service.locationRecommendation.subscribe(
        (site: {[index:string]:any}) => {
          const template = []
          for(let p in site) {
            let place = String(site[p]).split(" :")
            if(place[1].includes("None")){
              template.push(
                `
                <span class="p-2 bg-light text-success border border-default rounded shadow-sm"> ${place[0]} </span> <br>
                `
              )
            }
            else {
              template.push(
                `
                <div class="p-2 bg-light text-success border border-default rounded shadow-sm"> ${place[0]} <br>
                  <span class="text-small"> There's more nearby!!</span> <br> ${place[1]}
                </div> <br>
                `
              )
            }
          }
  
          this.replies.push( `
          <div class="row">
            <div class="talk-bubble tri-right left-top bg-success shadow-sm">
              <div class="talktext">
                <p>Try the following places! </p> <br>
                ${template.join('<br/>')}
              </div>
            </div>
          </div>`)
        }
      )
    }, 4000)

    setTimeout(() => {
      this.startNow = true
    }, 1500);
  }

  sendMessage(){
    this.message = this.chatForm.get('chat')?.value
    setTimeout(() => {
      this.replies.push(
        `<div class="row justify-content-end bg-white">
          <div class="talk-bubble tri-right btm-right shadow-sm">
            <div class="talktext">
              ${ this.message }
            </div>
        </div>
      </div>`
      )
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

          if(this.emotion === 'Happy') {
            this.replies.push(`
            <div class="row">
              <div class="talk-bubble tri-right left-top bg-success shadow-sm">
                <div class="talktext">
                  <p>Oh Yay! Glad to hear that. Could you fill up the form for me please?</p>
                </div>
              </div>
            </div>`)
          }
          else {
            this.replies.push(`
            <div class="row">
              <div class="talk-bubble tri-right left-top bg-success shadow-sm">
                <div class="talktext">
                  <p>Oh! Let me help you with that. Could you fill up the form for me please?</p>
                </div>
              </div>
            </div>`)
          }
          this.fillForm = true;
        }
      )
    }
    this.emotion = localStorage.getItem('emotion');
    this.chatForm.reset();
    this.match = false;
  }

  showForm(){
    this.fillForm = false;
    this.service.storeEmotionSubject.next(this.emotion);
    this.chatBody = false
  }

  formReject() {
    this.fillForm = false;
    this.replies.push(`
        <div class="row">
          <div class="talk-bubble tri-right left-top bg-success shadow-sm">
            <div class="talktext">
              <p>Let us talk after sometime alright? Hang in there.</p>
            </div>
          </div>
    </div><hr>`)
  }

  startRecording() {
    this.recording = true;
  }

  stopRecording() {
    this.recording = false;
  }
}