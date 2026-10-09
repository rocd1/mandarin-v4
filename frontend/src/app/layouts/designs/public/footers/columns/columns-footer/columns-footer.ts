import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-columns-footer',
  imports: [RouterLink],
  templateUrl: './columns-footer.html',
  styleUrl: './columns-footer.css',
})
export class ColumnsFooter {
  readonly brand = input('Project App by Roc');
  readonly year = input(new Date().getFullYear());
}
