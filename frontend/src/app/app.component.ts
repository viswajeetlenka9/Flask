import { Component, OnInit, OnDestroy,Input,ChangeDetectorRef  } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ExamsApiService} from './exams/exams-api.service';
import {Exam} from './exams/exam.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  examsListSubs: Subscription;
  examsList: Exam[];
  titleString: Array<String> = [];
  descriptionString: Array<String> = [];
  @Input() delete_title : string = '';
  @Input() update_title : string = '';
  @Input() exams = { title: '', description: '' }

  constructor(private examsApi: ExamsApiService,public router: Router,private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.examsListSubs = this.examsApi
      .getExams()
      .subscribe((res: any[]) => {
          this.examsList = res;
          let result = Object.values(res);
          var i:number=0; 
          for(i = 0; i < result[0].length; i++) {
            let title = result[0][i].title;
            let description = result[0][i].description;
            let titledescription = title +" : "+ description;
            this.titleString.push(title);
            this.descriptionString.push(description);
          }
        },
        console.error
      );
  }
  ngOnDestroy() {
    this.examsListSubs.unsubscribe();
  }

  add_exam(dataExams)
  {
    this.examsApi.postExams(this.exams).subscribe((data: {}) => {
      this.titleString = [];
      this.descriptionString = [];
      this.ngOnInit();
      this.exams.title='';
      this.exams.description='';
      
    },
    console.error
    );
  }

  delete_exam(dataExams)
  {
    this.examsApi.deleteExams(this.delete_title).subscribe((data: {}) =>{
      this.titleString = [];
      this.descriptionString = [];
      this.ngOnInit();
      this.delete_title='';
    },
    console.error
    );
  }

  update_exam(dataExams)
  {
    console.log(this.update_title);
    console.log(this.exams);
    this.examsApi.updateExams(this.update_title,this.exams).subscribe((data: {}) =>{
      this.titleString = [];
      this.descriptionString = [];
      this.ngOnInit();
      this.update_title='';
      this.exams.title='';
      this.exams.description='';
    },
    console.error
    );
  }
  
}
