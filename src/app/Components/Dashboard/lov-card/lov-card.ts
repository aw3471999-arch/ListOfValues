import { Component, inject, input, output } from '@angular/core';
import { PrimengModule } from '../../../Module/primeng.module';
import { LovTable } from "../lov-table/lov-table";
import { LovService } from '../../../Services/lov.service';

@Component({
  selector: 'app-lov-card',
  imports: [PrimengModule, LovTable,],
  templateUrl: './lov-card.html',
  styleUrl: './lov-card.css',
})
export class LovCard {
public lo = inject(LovService);
data = input<any[]>([]);
  loading = input<boolean>(true);
  
  onOpenSearch = output<void>();
  onOpenAdd = output<void>();

  onViewItem = output<any>();
  onDeleteItem = output<any>();

  onSearch(criteria: any) {
    this.onOpenSearch.emit();
  }
  onAddItem(newItem: any) {
    this.onOpenAdd.emit();
  }
  onDelete(item: any) {
    this.onDeleteItem.emit(item);
  }
}
