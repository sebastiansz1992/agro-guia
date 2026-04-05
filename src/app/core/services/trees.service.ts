import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tree } from '../models/tree.model';

@Injectable({ providedIn: 'root' })
export class TreesService {
  private http = inject(HttpClient);

  private _trees = signal<Tree[]>([]);
  readonly trees = this._trees.asReadonly();

  readonly loaded = computed(() => this._trees().length > 0);

  loadTrees(): void {
    if (this.loaded()) return;
    this.http.get<Tree[]>('/data/trees.json').subscribe({
      next: (data) => this._trees.set(data),
      error: (err) => console.error('Error cargando datos de árboles:', err),
    });
  }

  getTreeById(id: string): Tree | undefined {
    return this._trees().find((t) => t.id === id);
  }
}
