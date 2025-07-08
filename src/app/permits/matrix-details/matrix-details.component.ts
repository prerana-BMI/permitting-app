import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    private HttpService: HttpService,
    private route: ActivatedRoute
  )
  {
   this.MatrixId = Number(this.route.snapshot.paramMap.get('id'));
  }
  SearchForm! : FormGroup;
  PermitList : Array<any> = [];
  MatrixId : number = 0;
  ngOnInit()
  {
    this.SearchForm = this.fb.group({
      MatrixName : '',
      TypeOfProject : '',
      Client : ''
    });
    this.SearchForm.disable();
    this.GetMatrixDetailById();
  }
  GetMatrixDetailById()
  {
    this.HttpService.httpGetCall(Constants.GetMatrixDetailsById + this.MatrixId, false, true).subscribe((res:any)=>{
      if(res["Success"])
      {
        let responseobj = res["Data"].MatrixDetails;
        this.SearchForm.patchValue({
         MatrixName : responseobj.MatrixName,
         TypeOfProject :  responseobj.TypeOfProject,
         Client : responseobj.ClientName
        });
        this.PermitList = res["Data"].PermitList;
      }
    });  
  }


}
