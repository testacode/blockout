import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TouchControls, isMobileDevice } from './TouchControls';

describe('TouchControls', () => {
  let touchControls: TouchControls;
  let mockActionHandler: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    touchControls = new TouchControls();
    mockActionHandler = vi.fn();
    touchControls.setActionHandler(mockActionHandler);
  });

  afterEach(() => {
    touchControls.dispose();
  });

  describe('Initialization', () => {
    it('should create TouchControls instance', () => {
      expect(touchControls).toBeTruthy();
    });

    it('should mount to parent element', () => {
      const parent = document.createElement('div');
      touchControls.mount(parent);

      const touchControlsEl = parent.querySelector('#touch-controls');
      expect(touchControlsEl).toBeTruthy();
    });
  });

  describe('Movement Actions', () => {
    it('should translate move-left to correct action', () => {
      const parent = document.createElement('div');
      touchControls.mount(parent);

      const btn = parent.querySelector<HTMLElement>('[data-action="move-left"]');
      btn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(mockActionHandler).toHaveBeenCalledWith({
        type: 'move',
        offset: { x: -1, y: 0, z: 0 },
      });
    });

    it('should translate move-right to correct action', () => {
      const parent = document.createElement('div');
      touchControls.mount(parent);

      const btn = parent.querySelector<HTMLElement>('[data-action="move-right"]');
      btn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(mockActionHandler).toHaveBeenCalledWith({
        type: 'move',
        offset: { x: 1, y: 0, z: 0 },
      });
    });

    it('should translate move-up to correct action (Z-axis)', () => {
      const parent = document.createElement('div');
      touchControls.mount(parent);

      const btn = parent.querySelector<HTMLElement>('[data-action="move-up"]');
      btn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(mockActionHandler).toHaveBeenCalledWith({
        type: 'move',
        offset: { x: 0, y: 0, z: -1 },
      });
    });

    it('should translate move-down to correct action (Z-axis)', () => {
      const parent = document.createElement('div');
      touchControls.mount(parent);

      const btn = parent.querySelector<HTMLElement>('[data-action="move-down"]');
      btn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(mockActionHandler).toHaveBeenCalledWith({
        type: 'move',
        offset: { x: 0, y: 0, z: 1 },
      });
    });
  });

  describe('Rotation Actions', () => {
    it('should translate rotate-x to correct action', () => {
      const parent = document.createElement('div');
      touchControls.mount(parent);

      const btn = parent.querySelector<HTMLElement>('[data-action="rotate-x"]');
      btn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(mockActionHandler).toHaveBeenCalledWith({
        type: 'rotate',
        axis: 'x',
        direction: 1,
      });
    });

    it('should translate rotate-y to correct action', () => {
      const parent = document.createElement('div');
      touchControls.mount(parent);

      const btn = parent.querySelector<HTMLElement>('[data-action="rotate-y"]');
      btn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(mockActionHandler).toHaveBeenCalledWith({
        type: 'rotate',
        axis: 'y',
        direction: 1,
      });
    });

    it('should translate rotate-z to correct action', () => {
      const parent = document.createElement('div');
      touchControls.mount(parent);

      const btn = parent.querySelector<HTMLElement>('[data-action="rotate-z"]');
      btn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(mockActionHandler).toHaveBeenCalledWith({
        type: 'rotate',
        axis: 'z',
        direction: 1,
      });
    });
  });

  describe('Special Actions', () => {
    it('should translate drop to fastDrop action', () => {
      const parent = document.createElement('div');
      touchControls.mount(parent);

      const btn = parent.querySelector<HTMLElement>('[data-action="drop"]');
      btn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(mockActionHandler).toHaveBeenCalledWith({
        type: 'fastDrop',
      });
    });

    it('should translate pause to pause action', () => {
      const parent = document.createElement('div');
      touchControls.mount(parent);

      const btn = parent.querySelector<HTMLElement>('[data-action="pause"]');
      btn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(mockActionHandler).toHaveBeenCalledWith({
        type: 'pause',
      });
    });
  });

  describe('Show/Hide', () => {
    it('should show controls', () => {
      const parent = document.createElement('div');
      touchControls.mount(parent);

      touchControls.hide();
      touchControls.show();

      const container = parent.querySelector<HTMLElement>('#touch-controls');
      expect(container?.style.display).toBe('block');
    });

    it('should hide controls', () => {
      const parent = document.createElement('div');
      touchControls.mount(parent);

      touchControls.hide();

      const container = parent.querySelector<HTMLElement>('#touch-controls');
      expect(container?.style.display).toBe('none');
    });
  });

  describe('Dispose', () => {
    it('should clean up on dispose', () => {
      const parent = document.createElement('div');
      touchControls.mount(parent);

      expect(parent.children.length).toBe(1);

      touchControls.dispose();

      expect(parent.children.length).toBe(0);
    });
  });
});

describe('isMobileDevice', () => {
  it('should be a function', () => {
    expect(typeof isMobileDevice).toBe('function');
  });

  it('should return a boolean', () => {
    const result = isMobileDevice();
    expect(typeof result).toBe('boolean');
  });

  // Note: Actual behavior depends on environment
  // In test environment (jsdom), it will likely return false
  it('should return false in test environment', () => {
    const result = isMobileDevice();
    // In jsdom/test environment, typically not mobile
    expect(result).toBe(false);
  });
});
