import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ViverosService } from '../../core/services/viveros.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Vivero, ViveroProduct } from '../../core/models/vivero.model';

interface ViveroView {
  vivero: Vivero;
  products: ViveroProduct[];
}

const TREE_ICONS: Record<string, string> = {
  mango:     '🥭',
  aguacate:  '🥑',
  platano:   '🍌',
  cacao:     '🍫',
  citricos:  '🍊',
  guanabana: '🌿',
};

@Component({
  selector: 'app-viveros',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CurrencyPipe, RouterLink],
  templateUrl: './viveros.component.html',
  styleUrl: './viveros.component.scss',
})
export class ViverosComponent implements OnInit {
  private readonly viverosService = inject(ViverosService);

  readonly viveros = this.viverosService.viveros;
  readonly productFilter = signal('');

  readonly filteredViews = computed<ViveroView[]>(() => {
    const query = this.productFilter().toLowerCase().trim();
    return this.viveros()
      .map((v) => ({
        vivero: v,
        products: query
          ? v.products.filter((p) => p.name.toLowerCase().includes(query))
          : v.products,
      }))
      .filter((v) => v.products.length > 0);
  });

  readonly totalProducts = computed(() =>
    this.viveros().reduce((sum, v) => sum + v.products.length, 0)
  );

  readonly filteredProductCount = computed(() =>
    this.filteredViews().reduce((sum, v) => sum + v.products.length, 0)
  );

  readonly isFiltering = computed(() => this.productFilter().trim().length > 0);

  ngOnInit(): void {
    this.viverosService.loadViveros();
  }

  onSearch(event: Event): void {
    this.productFilter.set((event.target as HTMLInputElement).value);
  }

  clearSearch(): void {
    this.productFilter.set('');
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .filter((w) => w.length > 2)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');
  }

  formatWhatsApp(number: string): string {
    return `https://wa.me/${number}`;
  }

  getTreeIcon(treeId?: string): string {
    return treeId ? (TREE_ICONS[treeId] ?? '🌱') : '';
  }

  getTreeRoute(treeId?: string): string | null {
    return treeId ? `/arbol/${treeId}` : null;
  }
}
