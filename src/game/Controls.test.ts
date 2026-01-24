import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Controls } from './Controls';

describe('Controls', () => {
  let controls: Controls;
  let actionHandler: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    controls = new Controls();
    actionHandler = vi.fn();
    controls.setActionHandler(actionHandler);
    controls.enable();
  });

  const createKeyboardEvent = (key: string, repeat: boolean = false): KeyboardEvent => {
    return new KeyboardEvent('keydown', { key, repeat, bubbles: true });
  };

  describe('key repeat filtering', () => {
    it('should handle first keydown for movement keys', () => {
      window.dispatchEvent(createKeyboardEvent('ArrowLeft', false));
      expect(actionHandler).toHaveBeenCalledWith({
        type: 'move',
        offset: { x: -1, y: 0, z: 0 },
      });
    });

    it('should ignore key repeat for movement keys', () => {
      window.dispatchEvent(createKeyboardEvent('ArrowLeft', true));
      expect(actionHandler).not.toHaveBeenCalled();
    });

    it('should ignore key repeat for ArrowRight', () => {
      window.dispatchEvent(createKeyboardEvent('ArrowRight', true));
      expect(actionHandler).not.toHaveBeenCalled();
    });

    it('should ignore key repeat for ArrowUp', () => {
      window.dispatchEvent(createKeyboardEvent('ArrowUp', true));
      expect(actionHandler).not.toHaveBeenCalled();
    });

    it('should ignore key repeat for ArrowDown', () => {
      window.dispatchEvent(createKeyboardEvent('ArrowDown', true));
      expect(actionHandler).not.toHaveBeenCalled();
    });

    it('should ignore key repeat for rotation key Q', () => {
      window.dispatchEvent(createKeyboardEvent('q', true));
      expect(actionHandler).not.toHaveBeenCalled();
    });

    it('should ignore key repeat for rotation key W', () => {
      window.dispatchEvent(createKeyboardEvent('w', true));
      expect(actionHandler).not.toHaveBeenCalled();
    });

    it('should ignore key repeat for rotation key A', () => {
      window.dispatchEvent(createKeyboardEvent('a', true));
      expect(actionHandler).not.toHaveBeenCalled();
    });

    it('should ignore key repeat for rotation key S', () => {
      window.dispatchEvent(createKeyboardEvent('s', true));
      expect(actionHandler).not.toHaveBeenCalled();
    });

    it('should ignore key repeat for rotation key Z', () => {
      window.dispatchEvent(createKeyboardEvent('z', true));
      expect(actionHandler).not.toHaveBeenCalled();
    });

    it('should ignore key repeat for rotation key X', () => {
      window.dispatchEvent(createKeyboardEvent('x', true));
      expect(actionHandler).not.toHaveBeenCalled();
    });

    it('should allow first keydown for rotation keys', () => {
      window.dispatchEvent(createKeyboardEvent('q', false));
      expect(actionHandler).toHaveBeenCalledWith({
        type: 'rotate',
        axis: 'x',
        direction: 1,
      });
    });
  });

  describe('special keys', () => {
    it('should handle pause key', () => {
      window.dispatchEvent(createKeyboardEvent('p', false));
      expect(actionHandler).toHaveBeenCalledWith({ type: 'pause' });
    });

    it('should handle restart key', () => {
      window.dispatchEvent(createKeyboardEvent('r', false));
      expect(actionHandler).toHaveBeenCalledWith({ type: 'restart' });
    });

    it('should handle fast drop key', () => {
      window.dispatchEvent(createKeyboardEvent(' ', false));
      expect(actionHandler).toHaveBeenCalledWith({ type: 'fastDrop' });
    });
  });

  describe('cleanup', () => {
    it('should not call handler after disable', () => {
      controls.disable();
      window.dispatchEvent(createKeyboardEvent('ArrowLeft', false));
      expect(actionHandler).not.toHaveBeenCalled();
    });
  });
});
