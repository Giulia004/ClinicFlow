import { Component, effect, input, output, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { appsOutline, filterOutline } from 'ionicons/icons';
import { IonSearchbar, IonIcon, IonItem, IonSelect, IonSelectOption } from '@ionic/angular';

@Component({
  selector: 'app-filter-widget',
  templateUrl: './filter-widget.component.html',
  styleUrls: ['./filter-widget.component.css'],
  imports: [IonSearchbar, IonIcon,IonItem,IonSelect,IonSelectOption],
})
export class FilterWidgetComponent {
  public data = input.required<any[]>();
  public searchKeys = input<string[]>([]);
  public filterProperty = input<string>('');
  public filterOptions = input<{ label: string, value: string }[]>([]);

  //Dati in uscita
  public filterData = output<any[]>();

  //Stato interno
  public searchTerm = signal<string>('');
  public activeFilter = signal<string>('all');

  constructor() {
    addIcons({ filterOutline,appsOutline });
    //Ricalcolo dei dati filtrati ogni volta che cambiano input o selezioni
    effect(() => {
      const term = this.searchTerm().toLowerCase().trim();
      const currentFilter = this.activeFilter();
      const rawData = this.data();

      if (!rawData) return;

      const result = rawData.filter(item => {
        const matchesSearch = this.searchKeys().length === 0 || this.searchKeys().some(key => {
          const val = item[key];
          return val && String(val).toLowerCase().includes(term);
        });

        const filterValue = item[this.filterProperty()];
        const normalizedFilterValue = filterValue === 0 ? 'false' : filterValue === 1 ? 'true' : String(filterValue).toLowerCase().trim();
        const matchesFilter = currentFilter === 'all' || !this.filterProperty() ||
          normalizedFilterValue === String(currentFilter).toLowerCase().trim();

        return matchesSearch && matchesFilter;
      });

      this.filterData.emit(result);
    });
  }

  public onSearch(event: any) {
    this.searchTerm.set(event.detail.value || '');
  }

  public setFilter(value: string) {
    this.activeFilter.set(value);
  }


}