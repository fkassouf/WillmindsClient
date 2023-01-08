import {MatPaginatorIntl} from '@angular/material/paginator';
import {Injectable} from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subject, take } from 'rxjs';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  OF_LABEL = 'of';
  constructor(private _translocoService: TranslocoService) {
    super();  

    this._translocoService.langChanges$
    .subscribe(() => {
      this.getAndInitTranslations();
    });

    this.getAndInitTranslations();
  }

  getAndInitTranslations() {
    this._translocoService.selectTranslate('Records-Per-Page').pipe(take(1))
    .subscribe((translation) => {
        this.itemsPerPageLabel = translation;
        this.nextPageLabel = translation;
        this.previousPageLabel = translation;
        this.changes.next();

    });
      

  }

 getRangeLabel = (page: number, pageSize: number, length: number) =>  {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} / ${length}`;
  }
}