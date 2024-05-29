import {
  AfterViewInit,
  booleanAttribute,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  inject,
  Injector,
  input,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { debounceTime, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { generateUUID, objectHasOwnProperty } from '../../utils/utils';
import { OptionTemplateDirective } from '../../directives/option-template.directive';
import { InputPrefixDirective } from '../../directives/input-prefix.directive';
import { InputSuffixDirective } from '../../directives/input-suffix.directive';
import { InputComponent } from '../input/input.component';
import { MatIconModule } from '@angular/material/icon';
import { FilterArrayPipe } from '../../pipes/filter-array.pipe';

@Component({
  selector: 'app-select-input',
  standalone: true,
  imports: [
    CommonModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    InputComponent,
    FilterArrayPipe,
  ],
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SelectInputComponent,
    },
  ],
})
export class SelectInputComponent
  implements ControlValueAccessor, OnInit, OnDestroy, AfterViewInit
{
  ngAfterViewInit(): void {
    Promise.resolve(!!this.optionTemplate).then(value => {
      if (!value) return;
      const options = this._selectOptions?.toArray() || [];
      this.selectInput?.options.reset(options);
      this.selectInput?.options.notifyOnChanges();
    });
  }

  private destroy$ = new Subject<void>();

  elementRef = inject(ElementRef);
  @Input()
  disabled = false;
  @Input()
  displayErrors = true;
  @Input()
  size: 'sm' | 'md' | 'lg' = 'md';
  @Input()
  placeholder = '';
  @Input()
  label = 'Please Provide Label';
  @Input()
  labelColor = 'text-slate-700';
  @Input()
  inputColor = 'text-slate-700';
  @Input()
  marginBottom = 'mb-5';
  @Input({ transform: booleanAttribute })
  noMargin = false;
  @Input()
  isMultiple = false;
  @Input()
  name = generateUUID();
  @Input({ required: true })
  options: unknown[] = [];
  @Input()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bindValue?: string | ((item: any) => any);
  @Input()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bindLabel?: string | ((item: any) => any);
  @Input()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bindFilter?: string | ((item: any) => any);
  @Input()
  enableFilter = false;
  @Input()
  divider = false;

  nullable = input(true, { transform: booleanAttribute });

  @ContentChild(OptionTemplateDirective)
  optionTemplate?: OptionTemplateDirective;

  @ViewChild('selectInput')
  selectInput?: MatSelect;

  @ContentChildren(MatOption)
  _selectOptions?: QueryList<MatOption>;

  @ContentChild(InputPrefixDirective)
  inputPrefix?: InputPrefixDirective;

  @ContentChild(InputSuffixDirective)
  inputSuffix?: InputSuffixDirective;

  tailwindClass =
    'flex-auto ltr:peer-[.suffix]:pr-0 rtl:peer-[.suffix]:pl-0 ltr:peer-[.prefix]:pl-0 rtl:peer-[.prefix]:pr-0 outline-none group-[.lg]/input-wrapper:text-lg group-[.md]/input-wrapper:text-base group-[.sm]/input-wrapper:text-sm group-[.sm]/input-wrapper:px-2 group-[.sm]/input-wrapper:py-1 group-[.md]/input-wrapper:px-3 group-[.md]/input-wrapper:py-2 group-[.lg]/input-wrapper:px-5 group-[.lg]/input-wrapper:py-3';

  private injector = inject(Injector);

  private ctrl!: NgControl | null;
  filterControl = new FormControl('');

  @Output()
  selectChange: EventEmitter<unknown> = new EventEmitter<unknown>();

  get filterTxt$() {
    return this.filterControl.valueChanges;
  }

  get errors(): Observable<ValidationErrors | null | undefined> {
    return of(null).pipe(
      debounceTime(200),
      map(() =>
        this.ctrl?.dirty || this.ctrl?.touched ? this.ctrl?.errors : undefined,
      ),
    );
  }

  get isRequired(): boolean {
    return this.ctrl?.control?.hasValidator(Validators.required) || false;
  }

  onChange!: (value: string | null) => void;
  onTouch!: () => void;

  control = new FormControl('');
  // noinspection JSUnusedLocalSymbols
  private values = this.control.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(value => {
      this.selectChange.emit(value);
      return this.onChange && this.onChange(value);
    });

  ngOnInit(): void {
    this.ctrl = this.injector.get(NgControl, null, {
      self: true,
      optional: true,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
    this.values.unsubscribe();
  }

  writeValue(value: string): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: (v: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.disabled
      ? this.control.disable({ emitEvent: false })
      : this.control.enable({ emitEvent: false });
  }

  inputTouch() {
    this.onTouch && this.onTouch();
  }

  delegateFocus() {
    const select = 'mat-select';
    this.elementRef.nativeElement.querySelector(select).focus();
  }

  getBindValue(option: unknown): unknown {
    return this.bindValue && typeof this.bindValue === 'string'
      ? typeof (option as never)[this.bindValue] === 'function'
        ? ((option as never)[this.bindValue] as () => unknown)()
        : objectHasOwnProperty(option, this.bindValue)
          ? option[this.bindValue]
          : option
      : this.bindValue && typeof this.bindValue === 'function'
        ? this.bindValue(option)
        : option;
  }

  getBindLabel(option: unknown): unknown {
    return this.bindLabel && typeof this.bindLabel === 'string'
      ? typeof (option as never)[this.bindLabel] === 'function'
        ? ((option as never)[this.bindLabel] as () => unknown)()
        : objectHasOwnProperty(option, this.bindLabel)
          ? option[this.bindLabel]
          : option
      : this.bindLabel && typeof this.bindLabel === 'function'
        ? this.bindLabel(option)
        : option;
  }

  delete(event: MouseEvent, option: unknown) {
    event.preventDefault();
    event.stopPropagation();
    if (this.control.value === option) this.control.setValue(null);
  }
}
