// Controls - Keyboard input handling
// Translates keyboard events to game actions

type ControlAction =
  | { type: 'move'; offset: { x: number; y: number; z: number } }
  | { type: 'rotate'; axis: 'x' | 'y' | 'z'; direction: number }
  | { type: 'fastDrop' }
  | { type: 'pause' }
  | { type: 'restart' };

type ActionHandler = (action: ControlAction) => void;

export class Controls {
  private actionHandler: ActionHandler | null = null;
  private boundKeyHandler: (e: KeyboardEvent) => void;

  constructor() {
    this.boundKeyHandler = this.handleKeyDown.bind(this);
  }

  setActionHandler(handler: ActionHandler): void {
    this.actionHandler = handler;
  }

  enable(): void {
    window.addEventListener('keydown', this.boundKeyHandler);
  }

  disable(): void {
    window.removeEventListener('keydown', this.boundKeyHandler);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.actionHandler) {
      return;
    }

    // Prevent default browser behavior for game keys
    const gameKeys = [
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      ' ',
      'p',
      'r',
      'q',
      'w',
      'a',
      's',
      'z',
      'x',
      'Q',
      'W',
      'A',
      'S',
      'Z',
      'X',
      'R',
    ];

    // Only process game keys (ignore unregistered keys)
    if (!gameKeys.includes(e.key)) {
      return;
    }

    e.preventDefault();

    // Filter out key repeat for movement and rotation to prevent input spam
    // Allow key repeat only for fast drop (Space) and special keys (P, R)
    const movementKeys = [
      'arrowleft',
      'arrowright',
      'arrowup',
      'arrowdown',
      'q',
      'w',
      'a',
      's',
      'z',
      'x',
    ];
    if (e.repeat && movementKeys.includes(e.key.toLowerCase())) {
      return;
    }

    console.debug(`[Controls] Key pressed: ${e.key}, repeat: ${e.repeat}`);

    switch (e.key.toLowerCase()) {
      // Lateral movement (X/Z plane)
      case 'arrowleft':
        this.actionHandler({ type: 'move', offset: { x: -1, y: 0, z: 0 } });
        break;
      case 'arrowright':
        this.actionHandler({ type: 'move', offset: { x: 1, y: 0, z: 0 } });
        break;
      case 'arrowup':
        this.actionHandler({ type: 'move', offset: { x: 0, y: 0, z: -1 } });
        break;
      case 'arrowdown':
        this.actionHandler({ type: 'move', offset: { x: 0, y: 0, z: 1 } });
        break;

      // Rotation around X-axis
      case 'q':
        this.actionHandler({ type: 'rotate', axis: 'x', direction: 1 });
        break;
      case 'w':
        this.actionHandler({ type: 'rotate', axis: 'x', direction: -1 });
        break;

      // Rotation around Y-axis
      case 'a':
        this.actionHandler({ type: 'rotate', axis: 'y', direction: 1 });
        break;
      case 's':
        this.actionHandler({ type: 'rotate', axis: 'y', direction: -1 });
        break;

      // Rotation around Z-axis
      case 'z':
        this.actionHandler({ type: 'rotate', axis: 'z', direction: 1 });
        break;
      case 'x':
        this.actionHandler({ type: 'rotate', axis: 'z', direction: -1 });
        break;

      // Fast drop
      case ' ':
        this.actionHandler({ type: 'fastDrop' });
        break;

      // Pause
      case 'p':
        this.actionHandler({ type: 'pause' });
        break;

      // Restart
      case 'r':
        this.actionHandler({ type: 'restart' });
        break;
    }
  }
}
