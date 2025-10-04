// TouchControls - Touch input handling for mobile devices
// Translates touch button presses to game actions
// Uses the same ControlAction interface as Controls.ts for consistency

import { TouchButtons, type ButtonAction } from '../ui/TouchButtons';

type ControlAction =
  | { type: 'move'; offset: { x: number; y: number; z: number } }
  | { type: 'rotate'; axis: 'x' | 'y' | 'z'; direction: number }
  | { type: 'fastDrop' }
  | { type: 'pause' }
  | { type: 'restart' };

type ActionHandler = (action: ControlAction) => void;

export class TouchControls {
  private touchButtons: TouchButtons;
  private actionHandler: ActionHandler | null = null;

  constructor() {
    this.touchButtons = new TouchButtons();
    this.touchButtons.setPressHandler(this.handleButtonPress.bind(this));
  }

  setActionHandler(handler: ActionHandler): void {
    this.actionHandler = handler;
  }

  mount(parent: HTMLElement): void {
    this.touchButtons.mount(parent);
  }

  show(): void {
    this.touchButtons.show();
  }

  hide(): void {
    this.touchButtons.hide();
  }

  dispose(): void {
    this.touchButtons.dispose();
  }

  private handleButtonPress(action: ButtonAction): void {
    if (!this.actionHandler) {
      return;
    }

    console.debug(`[TouchControls] Button pressed: ${action}`);

    switch (action) {
      // Movement (D-pad)
      case 'move-left':
        this.actionHandler({ type: 'move', offset: { x: -1, y: 0, z: 0 } });
        break;
      case 'move-right':
        this.actionHandler({ type: 'move', offset: { x: 1, y: 0, z: 0 } });
        break;
      case 'move-up':
        this.actionHandler({ type: 'move', offset: { x: 0, y: 0, z: -1 } });
        break;
      case 'move-down':
        this.actionHandler({ type: 'move', offset: { x: 0, y: 0, z: 1 } });
        break;

      // Rotation
      case 'rotate-x':
        this.actionHandler({ type: 'rotate', axis: 'x', direction: 1 });
        break;
      case 'rotate-y':
        this.actionHandler({ type: 'rotate', axis: 'y', direction: 1 });
        break;
      case 'rotate-z':
        this.actionHandler({ type: 'rotate', axis: 'z', direction: 1 });
        break;

      // Actions
      case 'drop':
        this.actionHandler({ type: 'fastDrop' });
        break;
      case 'pause':
        this.actionHandler({ type: 'pause' });
        break;
    }
  }
}

// Utility function to detect if device is mobile
export function isMobileDevice(): boolean {
  // Check user agent for mobile devices
  const userAgentCheck = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

  // Check screen width (common mobile breakpoint)
  const screenWidthCheck = window.matchMedia('(max-width: 768px)').matches;

  // Check for touch support
  const touchCheck =
    'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Return true if any check passes
  return userAgentCheck || screenWidthCheck || touchCheck;
}
