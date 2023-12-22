import { Component, OnInit ,Input} from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  @Input() progress1 = 0;

  ind = 1;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChange(){
  
  }

}