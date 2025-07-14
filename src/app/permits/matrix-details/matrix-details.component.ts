import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/app/Models/Constants';
import { DatatransferService } from 'src/app/services/datatransfer.service';
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
    private route: ActivatedRoute,
    private datatransferService : DatatransferService
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
      Client : '',
      MatrixId: 0
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
         Client : responseobj.ClientName,
         MatrixId : responseobj.Id
        });
        this.PermitList = res["Data"].PermitList;
      }
    });  
  }
  EditMtrix() {
    this.datatransferService.setData({
      'data': this.PermitList.map(a => a.Id),
      'MatrixId' :  this.SearchForm.controls['MatrixId'].value,
      'NavigatedFrom': 'Matrix'
    });
    this.router.navigate(["permits/permitlist", this.PermitList[0]?.State, this.PermitList[0]?.City ?? ""]);
  }


}
