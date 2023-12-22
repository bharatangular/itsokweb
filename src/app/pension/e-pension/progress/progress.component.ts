import { Component, OnInit ,Input} from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  @Input() progress = 0;
  @Input() progress1 = 0;
  @Input() id :any;
  ind = 1;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChange(){
    console.log(this.id)
  }

}