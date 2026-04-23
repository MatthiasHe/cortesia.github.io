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
  protected readonly isSubmitting = signal(false);
  protected readonly isSubmitted = signal(false);
  protected readonly submitError = signal<string | null>(null);

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const payload = Object.fromEntries(new FormData(form));

    this.isSubmitting.set(true);
    this.submitError.set(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        this.isSubmitted.set(true);
      } else {
        this.submitError.set(data.message ?? "Une erreur est survenue. Merci de réessayer.");
      }
    } catch {
      this.submitError.set("Impossible d'envoyer la demande. Vérifiez votre connexion et réessayez.");
    } finally {
      this.isSubmitting.set(false);
    }
  }

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
