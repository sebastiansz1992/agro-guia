import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tree } from '../../../core/models/tree.model';

@Component({
  selector: 'app-tree-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tree-card.component.html',
  styleUrl: './tree-card.component.scss',
})
export class TreeCardComponent {
  @Input({ required: true }) tree!: Tree;
}
