import { Component, effect, inject, input, output, signal } from '@angular/core';
import { PrimengModule } from '../../../Module/primeng.module';
import { LoV } from '../../../Services/ListOfView/lo-v';

@Component({
  selector: 'app-lov-table',
  imports: [PrimengModule],
  templateUrl: './lov-table.html',
  styleUrl: './lov-table.css',
})
export class LovTable {
  public loVServ = inject(LoV);
  data = input<any[]>([]);
  loading = input<boolean>(true);
  onView = output<any>();
  onDelete = output<any>();
}