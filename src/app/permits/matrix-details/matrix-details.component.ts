import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from 'src/app/Models/Constants';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-matrix-details',
  templateUrl: './matrix-details.component.html',
  styleUrls: ['./matrix-details.component.scss']
})
export class MatrixDetailsComponent {
  constructor(
     public router: Router,
    private fb: FormBuilder,
    private HttpService : HttpService
  )
  {
    
  }
  SearchForm! : FormGroup;
  ngOnInit()
  {
    this.SearchForm = this.fb.group({
      MatrixName : '',
      TypeOfProject : '',
      Client : ''
    });
    this.SearchForm.disable();
    this.GetMatrixDetailById()
  }
  GetMatrixDetailById()
  {
    // this.HttpService.httpGetCall(Constants.GetMatrixDetailsById, false, true).subscribe((res:any)=>{
    //   if()
    // })
  }


}
