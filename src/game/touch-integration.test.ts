import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TouchControls } from './TouchControls';
import type { ButtonAction } from '../ui/TouchButtons';

/**
 * Integration tests for touch controls
 * Tests the full flow: Button press → TouchButtons → TouchControls → Game action
 */

describe('Touch Controls Integration', () => {
  let touchControls: TouchControls;
  let parent: HTMLElement;

  beforeEach(() => {
    parent = document.createElement('div');
    touchControls = new TouchControls();
    touchControls.mount(parent);
  });

  afterEach(() => {
    touchControls.dispose();
  });

  describe('Full Action Flow', () => {
    it('should trigger correct game action when D-pad button is pressed', () => {
      const mockHandler = vi.fn();
      touchControls.setActionHandler(mockHandler);

      // Simulate pressing the "up" button on D-pad
      const upBtn = parent.querySelector<HTMLElement>('[data-action="move-up"]');
      upBtn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      // Should translate to move action with correct offset
      expect(mockHandler).toHaveBeenCalledWith({
        type: 'move',
        offset: { x: 0, y: 0, z: -1 },
      });
    });

    it('should trigger rotation action when rotate button is pressed', () => {
      const mockHandler = vi.fn();
      touchControls.setActionHandler(mockHandler);

      // Simulate pressing the rotate-Y button
      const rotateBtn = parent.querySelector<HTMLElement>('[data-action="rotate-y"]');
      rotateBtn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      // Should translate to rotate action
      expect(mockHandler).toHaveBeenCalledWith({
        type: 'rotate',
        axis: 'y',
        direction: 1,
      });
    });

    it('should trigger fastDrop action when drop button is pressed', () => {
      const mockHandler = vi.fn();
      touchControls.setActionHandler(mockHandler);

      // Simulate pressing the drop button
      const dropBtn = parent.querySelector<HTMLElement>('[data-action="drop"]');
      dropBtn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      // Should translate to fastDrop action
      expect(mockHandler).toHaveBeenCalledWith({
        type: 'fastDrop',
      });
    });

    it('should handle multiple sequential button presses', () => {
      const mockHandler = vi.fn();
      touchControls.setActionHandler(mockHandler);

      // Press multiple buttons in sequence
      const leftBtn = parent.querySelector<HTMLElement>('[data-action="move-left"]');
      const rotateXBtn = parent.querySelector<HTMLElement>('[data-action="rotate-x"]');
      const dropBtn = parent.querySelector<HTMLElement>('[data-action="drop"]');

      leftBtn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      rotateXBtn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      dropBtn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      // Should have been called 3 times with correct actions
      expect(mockHandler).toHaveBeenCalledTimes(3);
      expect(mockHandler).toHaveBeenNthCalledWith(1, {
        type: 'move',
        offset: { x: -1, y: 0, z: 0 },
      });
      expect(mockHandler).toHaveBeenNthCalledWith(2, {
        type: 'rotate',
        axis: 'x',
        direction: 1,
      });
      expect(mockHandler).toHaveBeenNthCalledWith(3, {
        type: 'fastDrop',
      });
    });
  });

  describe('Action Mapping Consistency', () => {
    it('should have consistent action mapping for all buttons', () => {
      const mockHandler = vi.fn();
      touchControls.setActionHandler(mockHandler);

      // Test all button actions
      const buttonTests: Array<{
        action: ButtonAction;
        expectedType: string;
        expectedPayload?: Record<string, unknown>;
      }> = [
        { action: 'move-left', expectedType: 'move', expectedPayload: { offset: { x: -1, y: 0, z: 0 } } },
        { action: 'move-right', expectedType: 'move', expectedPayload: { offset: { x: 1, y: 0, z: 0 } } },
        { action: 'move-up', expectedType: 'move', expectedPayload: { offset: { x: 0, y: 0, z: -1 } } },
        { action: 'move-down', expectedType: 'move', expectedPayload: { offset: { x: 0, y: 0, z: 1 } } },
        { action: 'rotate-x', expectedType: 'rotate', expectedPayload: { axis: 'x', direction: 1 } },
        { action: 'rotate-y', expectedType: 'rotate', expectedPayload: { axis: 'y', direction: 1 } },
        { action: 'rotate-z', expectedType: 'rotate', expectedPayload: { axis: 'z', direction: 1 } },
        { action: 'drop', expectedType: 'fastDrop' },
        { action: 'pause', expectedType: 'pause' },
      ];

      for (const test of buttonTests) {
        mockHandler.mockClear();
        const btn = parent.querySelector<HTMLElement>(`[data-action="${test.action}"]`);
        btn?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

        expect(mockHandler).toHaveBeenCalledTimes(1);
        const call = mockHandler.mock.calls[0][0];
        expect(call.type).toBe(test.expectedType);

        if (test.expectedPayload) {
          expect(call).toMatchObject(test.expectedPayload);
        }
      }
    });
  });

  describe('Touch Event Support', () => {
    it('should respond to touch events as well as mouse events', () => {
      const mockHandler = vi.fn();
      touchControls.setActionHandler(mockHandler);

      const btn = parent.querySelector<HTMLElement>('[data-action="move-left"]');

      // Simulate touch event
      const touchEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [{ clientX: 0, clientY: 0 } as Touch],
      });

      btn?.dispatchEvent(touchEvent);

      // Should trigger action
      expect(mockHandler).toHaveBeenCalledWith({
        type: 'move',
        offset: { x: -1, y: 0, z: 0 },
      });
    });
  });
});
