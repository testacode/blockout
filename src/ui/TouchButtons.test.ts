import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TouchButtons, type ButtonAction } from './TouchButtons';

describe('TouchButtons', () => {
  let touchButtons: TouchButtons;
  let mockHandler: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    touchButtons = new TouchButtons();
    mockHandler = vi.fn();
    touchButtons.setPressHandler(mockHandler);
  });

  afterEach(() => {
    touchButtons.dispose();
  });

  describe('UI Creation', () => {
    it('should create touch controls container', () => {
      const parent = document.createElement('div');
      touchButtons.mount(parent);

      const container = parent.querySelector('#touch-controls');
      expect(container).toBeTruthy();
      expect(container?.classList.contains('touch-controls')).toBe(true);
    });

    it('should create all movement buttons (D-pad)', () => {
      const parent = document.createElement('div');
      touchButtons.mount(parent);

      const upBtn = parent.querySelector('[data-action="move-up"]');
      const downBtn = parent.querySelector('[data-action="move-down"]');
      const leftBtn = parent.querySelector('[data-action="move-left"]');
      const rightBtn = parent.querySelector('[data-action="move-right"]');

      expect(upBtn).toBeTruthy();
      expect(downBtn).toBeTruthy();
      expect(leftBtn).toBeTruthy();
      expect(rightBtn).toBeTruthy();
    });

    it('should create all rotation buttons', () => {
      const parent = document.createElement('div');
      touchButtons.mount(parent);

      const rotateX = parent.querySelector('[data-action="rotate-x"]');
      const rotateY = parent.querySelector('[data-action="rotate-y"]');
      const rotateZ = parent.querySelector('[data-action="rotate-z"]');

      expect(rotateX).toBeTruthy();
      expect(rotateY).toBeTruthy();
      expect(rotateZ).toBeTruthy();
    });

    it('should create action buttons (drop, pause)', () => {
      const parent = document.createElement('div');
      touchButtons.mount(parent);

      const dropBtn = parent.querySelector('[data-action="drop"]');
      const pauseBtn = parent.querySelector('[data-action="pause"]');

      expect(dropBtn).toBeTruthy();
      expect(pauseBtn).toBeTruthy();
    });
  });

  describe('Button Press Handling', () => {
    it('should call handler on mousedown with correct action', () => {
      const parent = document.createElement('div');
      touchButtons.mount(parent);

      const moveUpBtn = parent.querySelector<HTMLElement>('[data-action="move-up"]');
      expect(moveUpBtn).toBeTruthy();

      moveUpBtn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(mockHandler).toHaveBeenCalledTimes(1);
      expect(mockHandler).toHaveBeenCalledWith('move-up');
    });

    it('should call handler for all movement buttons', () => {
      const parent = document.createElement('div');
      touchButtons.mount(parent);

      const actions: ButtonAction[] = ['move-up', 'move-down', 'move-left', 'move-right'];

      for (const action of actions) {
        mockHandler.mockClear();
        const btn = parent.querySelector<HTMLElement>(`[data-action="${action}"]`);
        btn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

        expect(mockHandler).toHaveBeenCalledWith(action);
      }
    });

    it('should call handler for all rotation buttons', () => {
      const parent = document.createElement('div');
      touchButtons.mount(parent);

      const actions: ButtonAction[] = ['rotate-x', 'rotate-y', 'rotate-z'];

      for (const action of actions) {
        mockHandler.mockClear();
        const btn = parent.querySelector<HTMLElement>(`[data-action="${action}"]`);
        btn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

        expect(mockHandler).toHaveBeenCalledWith(action);
      }
    });

    it('should call handler for drop and pause buttons', () => {
      const parent = document.createElement('div');
      touchButtons.mount(parent);

      const actions: ButtonAction[] = ['drop', 'pause'];

      for (const action of actions) {
        mockHandler.mockClear();
        const btn = parent.querySelector<HTMLElement>(`[data-action="${action}"]`);
        btn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

        expect(mockHandler).toHaveBeenCalledWith(action);
      }
    });

    it('should add "pressed" class on button press', () => {
      const parent = document.createElement('div');
      touchButtons.mount(parent);

      const btn = parent.querySelector<HTMLElement>('[data-action="drop"]');
      expect(btn).toBeTruthy();

      btn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(btn?.classList.contains('pressed')).toBe(true);
    });

    it('should remove "pressed" class on button release', () => {
      const parent = document.createElement('div');
      touchButtons.mount(parent);

      const btn = parent.querySelector<HTMLElement>('[data-action="drop"]');
      expect(btn).toBeTruthy();

      btn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(btn?.classList.contains('pressed')).toBe(true);

      btn?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      expect(btn?.classList.contains('pressed')).toBe(false);
    });
  });

  describe('Show/Hide', () => {
    it('should show controls when show() is called', () => {
      const parent = document.createElement('div');
      touchButtons.mount(parent);

      touchButtons.hide();
      touchButtons.show();

      const container = parent.querySelector<HTMLElement>('#touch-controls');
      expect(container?.style.display).toBe('block');
    });

    it('should hide controls when hide() is called', () => {
      const parent = document.createElement('div');
      touchButtons.mount(parent);

      touchButtons.hide();

      const container = parent.querySelector<HTMLElement>('#touch-controls');
      expect(container?.style.display).toBe('none');
    });
  });

  describe('Mount/Unmount', () => {
    it('should mount to parent element', () => {
      const parent = document.createElement('div');
      touchButtons.mount(parent);

      expect(parent.children.length).toBe(1);
      expect(parent.querySelector('#touch-controls')).toBeTruthy();
    });

    it('should remove from DOM on unmount', () => {
      const parent = document.createElement('div');
      touchButtons.mount(parent);

      expect(parent.children.length).toBe(1);

      touchButtons.unmount();

      expect(parent.children.length).toBe(0);
    });

    it('should clean up on dispose', () => {
      const parent = document.createElement('div');
      touchButtons.mount(parent);

      touchButtons.dispose();

      expect(parent.children.length).toBe(0);
    });
  });
});
