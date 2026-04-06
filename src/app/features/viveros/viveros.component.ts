import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ViverosService } from '../../core/services/viveros.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-viveros',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CurrencyPipe],
  templateUrl: './viveros.component.html',
  styleUrl: './viveros.component.scss',
})
export class ViverosComponent implements OnInit {
  private readonly viverosService = inject(ViverosService);

  readonly viveros = this.viverosService.viveros;

  ngOnInit(): void {
    this.viverosService.loadViveros();
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
}
