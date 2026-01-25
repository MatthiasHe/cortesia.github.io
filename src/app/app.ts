import { Component, signal, HostListener, Renderer2, inject, DOCUMENT } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);

  protected readonly title = signal('cortesia');
  protected readonly isMenuOpen = signal(false);

  protected openMenu(): void {
    this.isMenuOpen.set(true);
    this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
    this.renderer.setStyle(this.document.body, 'overflow', '');
  }

  @HostListener('document:keydown.escape')
  protected onEscapeKey(): void {
    if (this.isMenuOpen()) {
      this.closeMenu();
    }
  }
}
