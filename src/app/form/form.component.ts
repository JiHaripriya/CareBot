import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnDestroy {

  form: FormGroup;
  emotion = '';
  movie_list:string[] = [];
  location: {[index:string]:any} = {};
  movies :string[] = [];
  subscription = new Subscription();

  constructor(private formBuilder: FormBuilder, private service: HttpService) {

    this.form = this.formBuilder.group({
      option: new FormControl(null)
    });

    this.emotion = String(localStorage.getItem("emotion"));
  }

  ngOnInit()  {
    this.service.getGenre(this.emotion).subscribe(
      res => {
        console.log(res)
        for(let movie in JSON.parse(res)){
          this.movies.push(JSON.parse(res)[movie])
        }
        
        setTimeout(() => console.log(this.movies), 5000);
      }
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  submit() {
    console.log(this.form.value.option);
    this.service.getMovies(String(this.form.value.option)).subscribe(
      res => {
        for(let each in JSON.parse(res)) {
          this.movie_list.push(decodeURI(JSON.parse(res)[each]))
        }
        this.service.movieRecommendationData.next(this.movie_list);
        console.log(this.movie_list)
      }
    )
    
    this.service.getLocation(String(this.emotion)).subscribe(
      loc => {
        this.location = JSON.parse(loc)
        this.service.locationRecommendation.next(this.location);
      }
    )
    
    this.service.chatBodyDisplay.next(1);
  }
}
