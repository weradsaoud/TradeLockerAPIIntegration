import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { Observable, delay, distinctUntilChanged } from 'rxjs';
import { AppTableDataSource } from '../../model/app-table-data-source';
import { InstrumentContract } from '../../contracts/instrument-contract';
import { InstrumentsService } from '../../services/instruments.service';

@Component({
  selector: 'app-instruments',
  standalone: true,
  imports: [MatCardModule, MatDividerModule, MatTableModule],
  templateUrl: './instruments.component.html',
  styleUrl: './instruments.component.scss',
})
export class InstrumentsComponent {
  private readonly instrumentsService = inject(InstrumentsService);
  displayedColumns: string[] = ['name', 'type', 'tradingExchange', 'barSource'];
  data$: Observable<InstrumentContract[]> = this.arrangeInstrumentsProperties();
  dataSource: AppTableDataSource<InstrumentContract> =
    new AppTableDataSource<InstrumentContract>(this.data$);
  selectedRow!: InstrumentContract;
  arrangeInstrumentsProperties(): Observable<InstrumentContract[]> {
    return this.instrumentsService.instruments$
      .asObservable()
      .pipe(delay(0), distinctUntilChanged());
  }

  selectInstrument(row: any) {
    this.selectedRow = row;
    this.instrumentsService.selectInstrument$.next(row);
    this.instrumentsService.currentInstrument = row;
  }
}
