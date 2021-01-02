import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  emotion = 'http://localhost:3000/emotion'
  genre = 'http://localhost:3000/movieProcess'
  movies = 'http://localhost:3000/movieRecommendation'
  location = 'http://localhost:3000/location'
  voice = 'http://localhost:3000/api/test'
  songlist = 'http://localhost:3000/songProcess'

  emotionResult = '';
  mapping: {[index : string]: string} = {
    'Happy' : '0',
    'Sad':'1',
    'Anger':'2',
    'Fear':'3',
    'Surprise':'4',
    'Calm':'5'
  }
  storeEmotionSubject = new Subject<number>();
  chatBodyDisplay = new Subject<number>();
  movieRecommendationData = new Subject<string[]>();
  locationRecommendation = new Subject<{[index:string]:any}>();
  songRecommendation = new Subject<{[index:string]:any}>();
  

  constructor(private httpClient: HttpClient) {   
  }

  getEmotion(text:string){
    let params = new HttpParams().set('text', text);
    return this.httpClient.get(this.emotion, {params: params, responseType: 'text'});
  }

  getGenre(emotion:string) {
    let params = new HttpParams().set('emotion', emotion);
    return this.httpClient.get(this.genre, {params: params, responseType: 'text'});
  }

  getMovies(movie:string) {
    let params = new HttpParams().set('movie', movie);
    return this.httpClient.get(this.movies, {params: params, responseType: 'text'});
  }

  getLocation(emotion: string){
    let params = new HttpParams().set('emotion', emotion);
    return this.httpClient.get(this.location, {params: params, responseType: 'text'});
  }

  storeEmotion(index:any){
    const reverseMapping: {[index : string]: any} = {'0': 'Happy',
    '1': 'Sad',
    '2': 'Anger',
    '3': 'Fear',
    '4': 'Surprise',
    '5': 'Calm'}
    this.emotionResult = reverseMapping[this.mapping[index]];
    localStorage.setItem("emotion", this.emotionResult);
  }

  fetchEmotion() {
    return String(localStorage.getItem("emotion"));
  }

  getSongList(emotion:string) {
    let params = new HttpParams().set('emotion', emotion);
    return this.httpClient.get(this.songlist, {params: params, responseType: 'text'});
  }

  sendVoiceInput(voiceInput: any) {
    let params = new HttpParams().set('voice', voiceInput);
    return this.httpClient.get(this.voice, {params: params, responseType: 'text'})
  }
}
