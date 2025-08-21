import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/app/Models/Constants';
import { DatatransferService } from 'src/app/services/datatransfer.service';
import { HttpService } from 'src/app/services/http.service';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
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
  groupedPermits: { level: string, items: any[] }[] = [];
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
        const grouped = this.PermitList.reduce((acc, permit) => {
          const level = permit.Level || 'Unknown';
          if (!acc[level]) {
            acc[level] = [];
          }
          acc[level].push(permit);
          return acc;
        }, {} as { [key: string]: any[] });
        this.groupedPermits = Object.keys(grouped).map(level => ({
          level,
          items: grouped[level]
        }));
      }
    });  
  }
  EditMtrix() {
    this.datatransferService.setData({
      'data': this.PermitList.map(a => a.Id),
      'MatrixId' :  this.SearchForm.controls['MatrixId'].value,
      'NavigatedFrom': 'Matrix'
    });
    this.router.navigate(["permits/PermitList"]);
  }

  async DownloadExcel()
  {
    let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet("Permits");
        // Add header row
        let headerRow = worksheet.addRow([
          "Category", "Permit Name", "State", "City", "Level",
          "Regulatory Agency Name", "Description", "Threshold",
          "Min Prep Time", "Max Prep Time", "Min Review Time",
          "Max Review Time", "Basic Fees"
        ]);
    
        // Style header
        headerRow.eachCell((cell) => {
          cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: "4F81BD" }
          };
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
    
        // Add data
        this.PermitList.forEach((d: any) => {
          worksheet.addRow([
            d.Category ?? '',
            d.PermitName ?? '',
            d.State ?? '',
            d.City ?? '',
            d.Level ?? '',
            d.RegulatoryAgencyName ?? '',
            d.Description ?? '',
            d.Threshold ?? '',
            d.PrepTimeMin ?? '',
            d.PrepTimeMax ?? '',
            d.AgencyReviewTimeMin ?? '',
            d.AgencyReviewTimeMax ?? '',
            d.BasicFees ?? ''
          ]);
        });
    
        // Auto width
        worksheet.columns.forEach((col: any) => {
          col.width = Math.max(...col.values.map((v: string) => v?.toString().length || 10)) + 2;
        });
    
        worksheet.columns.forEach((col: any) => {
          let maxLength = 10;
          col.eachCell({ includeEmpty: true }, (cell: any) => {
            const len = cell.value ? cell.value.toString().length : 0;
            if (len > maxLength) maxLength = len;
          });
          col.width = maxLength + 2;
        });
    
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, "Permits.xlsx");
    
  }


}
