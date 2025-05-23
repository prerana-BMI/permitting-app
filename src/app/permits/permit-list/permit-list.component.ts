import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Constants } from 'src/app/Models/Constants';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-permit-list',
  templateUrl: './permit-list.component.html',
  styleUrls: ['./permit-list.component.css']
})
export class PermitListComponent implements OnInit{
  constructor(private httpService : HttpService,
    private toastr: ToastrService
  )
  {

  }
ngOnInit()
{
//this.GetAllPermits();
this.toastr.success('Trigggered Hello', 'Success');
}

 GetAllPermits() {
  this.httpService.httpGetCall(Constants.GetAllProjectMaster)
}
}

