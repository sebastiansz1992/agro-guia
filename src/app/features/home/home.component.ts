import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { TreesService } from '../../core/services/trees.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { TreeCardComponent } from '../../shared/components/tree-card/tree-card.component';
import { TreeCategory, ZoneId } from '../../core/models/tree.model';

type FilterOption = 'todos' | TreeCategory;
type ZoneFilter = 'todas' | ZoneId;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, TreeCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly treesService = inject(TreesService);

  activeFilter = signal<FilterOption>('todos');
  activeZone = signal<ZoneFilter>('todas');

  readonly trees = this.treesService.trees;

  readonly filteredTrees = computed(() => {
    const filter = this.activeFilter();
    const zone = this.activeZone();
    const all = this.trees();
    let result = filter === 'todos' ? all : all.filter((t) => t.category === filter);
    if (zone !== 'todas') {
      result = result.filter((t) => t.zones.includes(zone));
    }
    return result;
  });

  readonly filters: { value: FilterOption; label: string; icon: string }[] = [
    { value: 'todos',    label: 'Todos',    icon: '🌳' },
    { value: 'frutal',   label: 'Frutal',   icon: '🍊' },
    { value: 'tropical', label: 'Tropical', icon: '🍌' },
    { value: 'cacao',    label: 'Cacao',    icon: '🍫' },
  ];

  readonly zones: { filterValue: ZoneFilter; name: string; icon: string; altitude: string; climate: string }[] = [
    { filterValue: 'todas',        name: 'Todas las zonas',       icon: '🗺️', altitude: '',            climate: '' },
    { filterValue: 'san-vicente',  name: 'San Vicente de Ferrer', icon: '🏔️', altitude: '~2.050 msnm', climate: 'Frío-templado' },
    { filterValue: 'yali',         name: 'Yalí',                  icon: '🌿', altitude: '~1.750 msnm', climate: 'Templado-cálido' },
    { filterValue: 'rionegro',     name: 'Rionegro',              icon: '🌄', altitude: '~2.125 msnm', climate: 'Frío-templado' },
    { filterValue: 'san-jeronimo', name: 'San Jerónimo',          icon: '☀️', altitude: '~1.000 msnm', climate: 'Cálido' },
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

  setZone(zone: ZoneFilter): void {
    this.activeZone.set(zone);
  }
}
