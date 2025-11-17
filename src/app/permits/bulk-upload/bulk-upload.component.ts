import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as saveAs from 'file-saver';
import { Constants } from 'src/app/Models/Constants';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent {
  selectedFile: File | null = null;
  isDragOver = false;

  @Output() close = new EventEmitter<void>();

  constructor(private httpService: HttpService,
    public dialogRef: MatDialogRef<BulkUploadComponent>,
    private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files[0]) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files[0]) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      // Handle the file upload logic here
      this.httpService.httpPostFile(Constants.ImportExcelFile, formData, true).subscribe((res: any) => {
        if (res.Success) {
          this.dialogRef.close();
        }
      });
    }
  }

  OpenBulkUploadPopup() {

    let dialogRef = this.dialog.open(BulkUploadComponent, {

    });
    
  }

  removeSelectedFile() {
    this.selectedFile = null;
  }

  closePopup() {
    // For now, just hiding the popup. In a real app, you'd emit an event.
    this.dialogRef.close()
  }

    DownloadExcelFormat() {
      this.httpService.httpGetBlob(Constants.DownloadExcel, null , false).subscribe({
        next: (blob: Blob) => {
          const fileName = 'PermitBulkUploadFormat.xlsx';
          saveAs(blob, fileName); // triggers browser download
        },
        error: (err) => {
          console.error('Error downloading file', err);
        }
      });
    }



}
