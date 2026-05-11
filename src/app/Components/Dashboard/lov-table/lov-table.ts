import { Component, inject, input, output } from '@angular/core';
import { PrimengModule } from '../../../Module/primeng.module';
import { LovService } from '../../../Services/lov.service';
import { LovItem } from '../../../Interface/interface/lo-v-interface';

@Component({
  selector: 'app-lov-table',
  imports: [PrimengModule],
  templateUrl: './lov-table.html',
  styleUrl: './lov-table.css',
})
export class LovTable {
  public loVServ = inject(LovService);
  data = input<LovItem[]>([]);
  loading = input<boolean>(true);
  onView = output<LovItem>();
  onDelete = output<LovItem>();
}