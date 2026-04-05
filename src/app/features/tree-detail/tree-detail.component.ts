import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TreesService } from '../../core/services/trees.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Tree, TreeStep } from '../../core/models/tree.model';

@Component({
  selector: 'app-tree-detail',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './tree-detail.component.html',
  styleUrl: './tree-detail.component.scss',
})
export class TreeDetailComponent implements OnInit {
  // Angular 20 route param via withComponentInputBinding
  id = input.required<string>();

  private treesService = inject(TreesService);

  activeStepIndex = signal(0);

  readonly tree = computed<Tree | undefined>(() => this.treesService.getTreeById(this.id()));

  readonly activeStep = computed<TreeStep | undefined>(() =>
    this.tree()?.steps[this.activeStepIndex()]
  );

  readonly isFirst = computed(() => this.activeStepIndex() === 0);
  readonly isLast = computed(() => {
    const t = this.tree();
    return t ? this.activeStepIndex() === t.steps.length - 1 : true;
  });

  ngOnInit(): void {
    this.treesService.loadTrees();
    this.activeStepIndex.set(0);
  }

  goToStep(index: number): void {
    const t = this.tree();
    if (t && index >= 0 && index < t.steps.length) {
      this.activeStepIndex.set(index);
    }
  }

  prevStep(): void {
    if (!this.isFirst()) this.activeStepIndex.update((i) => i - 1);
  }

  nextStep(): void {
    if (!this.isLast()) this.activeStepIndex.update((i) => i + 1);
  }
}
