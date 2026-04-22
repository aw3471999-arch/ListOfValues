import { Component } from '@angular/core';
import { CategoryToolbar } from "../../category-toolbar/category-toolbar";
import { CategoryCard } from "../../category-card/category-card";

@Component({
  selector: 'app-dashboard',
  imports: [CategoryCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}
