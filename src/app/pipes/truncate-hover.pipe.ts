import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateHover'
})
export class TruncateHoverPipe implements PipeTransform {

  transform(value: string, limit: number = 50): string {
    if (!value) return '';
    if (value.length <= limit) return value;

    // Truncate and return with tooltip
    const truncatedText = value.substring(0, limit) + '...';
    const fullText = value.replace(/"/g, '&quot;'); // escape quotes for HTML safety
    return `<span title="${fullText}">${truncatedText}</span>`;
  }

}

