import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { TreesService } from '../../core/services/trees.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { TreeCardComponent } from '../../shared/components/tree-card/tree-card.component';
import { TreeCategory } from '../../core/models/tree.model';

type FilterOption = 'todos' | TreeCategory;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, TreeCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private treesService = inject(TreesService);

  activeFilter = signal<FilterOption>('todos');

  readonly trees = this.treesService.trees;

  readonly filteredTrees = computed(() => {
    const filter = this.activeFilter();
    const all = this.trees();
    return filter === 'todos' ? all : all.filter((t) => t.category === filter);
  });

  readonly filters: { value: FilterOption; label: string; icon: string }[] = [
    { value: 'todos',    label: 'Todos',    icon: '🌳' },
    { value: 'frutal',   label: 'Frutal',   icon: '🍊' },
    { value: 'tropical', label: 'Tropical', icon: '🍌' },
    { value: 'cacao',    label: 'Cacao',    icon: '🍫' },
  ];

  readonly howItWorks = [
    { icon: '📖', title: 'Elige tu árbol', desc: 'Explora las guías completas de los 6 árboles frutales más cultivados en Colombia.' },
    { icon: '🗺️', title: 'Sigue los pasos', desc: 'Cada guía tiene 4 pasos claros: preparación, siembra, cuidados y cosecha con métricas reales.' },
    { icon: '🧺', title: 'Cosecha con éxito', desc: 'Aprende los índices de cosecha, técnicas de recolección y manejo postcosecha para cada especie.' },
  ];

  ngOnInit(): void {
    this.treesService.loadTrees();
  }

  setFilter(filter: FilterOption): void {
    this.activeFilter.set(filter);
  }
}
