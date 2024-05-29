import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subject, takeUntil } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent implements OnInit, OnDestroy, OnChanges {
  @Input() options: { viewValue: string; value: string }[] = [];
  @Output()
  selectChange: EventEmitter<unknown> = new EventEmitter<unknown>();
  control = new FormControl();
  private destroy$ = new Subject<void>();
  ngOnInit(): void {
    !!this.options.length ? this.control.setValue(this.options[0].value) : null;
  }
  ngOnChanges(changes: SimpleChanges): void {
    !!this.options.length ? this.control.setValue(this.options[0].value) : null;
  }
  private values = this.control.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((value) => {
      this.selectChange.emit(value);
      console.log('value: ', value);
    });

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
    this.values.unsubscribe();
  }
}
