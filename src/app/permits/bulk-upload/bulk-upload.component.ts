import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent {
   selectedFile: File | null = null;
  isDragOver = false;

  @Output() close = new EventEmitter<void>();

  constructor() { }

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
      // Handle the file upload logic here
      console.log('Uploading file:', this.selectedFile);
      this.closePopup();
    }
  }

  removeSelectedFile() {
    this.selectedFile = null;
  }

  closePopup() {
    // For now, just hiding the popup. In a real app, you'd emit an event.
     this.close.emit();
  }

 

}
