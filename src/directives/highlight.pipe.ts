import { inject, Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  sanitizer = inject(DomSanitizer);

  transform(value: string, args: string): string | null {
    if (!args) {
      return value;
    }
    // Match in a case-insensitive
    const re = new RegExp(args, 'gi');
    const match = String(value).match(re);

    // If there's no match, just return the original value.
    if (!match) {
      return value;
    }

    const result = String(value).replace(re, '<mark>' + match[0] + '</mark>');
    return this.sanitizer.sanitize(SecurityContext.HTML, result);
  }
}
