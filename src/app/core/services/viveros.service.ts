import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vivero } from '../models/vivero.model';

@Injectable({ providedIn: 'root' })
export class ViverosService {
  private http = inject(HttpClient);

  private _viveros = signal<Vivero[]>([]);
  readonly viveros = this._viveros.asReadonly();

  readonly loaded = computed(() => this._viveros().length > 0);

  loadViveros(): void {
    if (this.loaded()) return;
    this.http.get<Vivero[]>('/data/viveros.json').subscribe({
      next: (data) => this._viveros.set(data),
      error: (err) => console.error('Error cargando viveros:', err),
    });
  }
}
