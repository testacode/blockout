// TouchButtons - Virtual button UI for mobile touch controls
// Creates and manages DOM elements for touch input

export type ButtonAction =
  | 'move-left'
  | 'move-right'
  | 'move-up'
  | 'move-down'
  | 'rotate-x'
  | 'rotate-y'
  | 'rotate-z'
  | 'drop'
  | 'pause';

export type ButtonPressHandler = (action: ButtonAction) => void;

export class TouchButtons {
  private container: HTMLElement;
  private pressHandler: ButtonPressHandler | null = null;
  private buttons: Map<ButtonAction, HTMLElement> = new Map();

  constructor() {
    this.container = this.createUI();
    this.attachEventListeners();
  }

  setPressHandler(handler: ButtonPressHandler): void {
    this.pressHandler = handler;
  }

  private createUI(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'touch-controls';
    container.className = 'touch-controls';

    container.innerHTML = `
      <div class="touch-controls-layout">
        <!-- D-Pad for movement -->
        <div class="dpad-container">
          <div class="dpad">
            <button class="dpad-btn dpad-up" data-action="move-up">
              <span class="btn-icon">↑</span>
            </button>
            <button class="dpad-btn dpad-left" data-action="move-left">
              <span class="btn-icon">←</span>
            </button>
            <button class="dpad-btn dpad-center"></button>
            <button class="dpad-btn dpad-right" data-action="move-right">
              <span class="btn-icon">→</span>
            </button>
            <button class="dpad-btn dpad-down" data-action="move-down">
              <span class="btn-icon">↓</span>
            </button>
          </div>
          <div class="dpad-label">MOVE</div>
        </div>

        <!-- Action buttons -->
        <div class="action-buttons">
          <div class="rotate-buttons">
            <button class="action-btn rotate-btn" data-action="rotate-x">
              <span class="btn-label">X</span>
            </button>
            <button class="action-btn rotate-btn" data-action="rotate-y">
              <span class="btn-label">Y</span>
            </button>
            <button class="action-btn rotate-btn" data-action="rotate-z">
              <span class="btn-label">Z</span>
            </button>
          </div>
          <div class="rotate-label">ROTATE</div>

          <button class="action-btn drop-btn" data-action="drop">
            <span class="btn-label">DROP</span>
          </button>

          <button class="action-btn pause-btn" data-action="pause">
            <span class="btn-label">⏸</span>
          </button>
        </div>
      </div>
    `;

    return container;
  }

  private attachEventListeners(): void {
    // Find all buttons with data-action attribute
    const buttons = this.container.querySelectorAll<HTMLElement>('[data-action]');

    buttons.forEach((button) => {
      const action = button.getAttribute('data-action') as ButtonAction;
      if (!action) return;

      this.buttons.set(action, button);

      // Use touchstart for immediate response on mobile
      button.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent mouse events
        this.handlePress(action, button);
      });

      // Add visual feedback on touchend
      button.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.handleRelease(button);
      });

      // Also support mouse for testing on desktop
      button.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.handlePress(action, button);
      });

      button.addEventListener('mouseup', (e) => {
        e.preventDefault();
        this.handleRelease(button);
      });

      // Handle touch cancel (finger leaves button area)
      button.addEventListener('touchcancel', () => {
        this.handleRelease(button);
      });
    });
  }

  private handlePress(action: ButtonAction, button: HTMLElement): void {
    button.classList.add('pressed');

    if (this.pressHandler) {
      this.pressHandler(action);
    }
  }

  private handleRelease(button: HTMLElement): void {
    button.classList.remove('pressed');
  }

  mount(parent: HTMLElement): void {
    parent.appendChild(this.container);
  }

  unmount(): void {
    this.container.remove();
  }

  show(): void {
    this.container.style.display = 'block';
  }

  hide(): void {
    this.container.style.display = 'none';
  }

  dispose(): void {
    this.unmount();
    this.buttons.clear();
  }
}
