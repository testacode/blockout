// Controls - Keyboard input handling
// Translates keyboard events to game actions

type ControlAction =
  | { type: 'move', offset: { x: number, y: number, z: number } }
  | { type: 'fastDrop' }
  | { type: 'pause' }

type ActionHandler = (action: ControlAction) => void

export class Controls {
  private actionHandler: ActionHandler | null = null
  private boundKeyHandler: (e: KeyboardEvent) => void

  constructor() {
    this.boundKeyHandler = this.handleKeyDown.bind(this)
  }

  setActionHandler(handler: ActionHandler): void {
    this.actionHandler = handler
  }

  enable(): void {
    window.addEventListener('keydown', this.boundKeyHandler)
  }

  disable(): void {
    window.removeEventListener('keydown', this.boundKeyHandler)
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.actionHandler) {
      return
    }

    // Prevent default browser behavior for game keys
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'p'].includes(e.key)) {
      e.preventDefault()
    }

    switch (e.key) {
      // Lateral movement (X/Z plane)
      case 'ArrowLeft':
        this.actionHandler({ type: 'move', offset: { x: -1, y: 0, z: 0 } })
        break
      case 'ArrowRight':
        this.actionHandler({ type: 'move', offset: { x: 1, y: 0, z: 0 } })
        break
      case 'ArrowUp':
        this.actionHandler({ type: 'move', offset: { x: 0, y: 0, z: -1 } })
        break
      case 'ArrowDown':
        this.actionHandler({ type: 'move', offset: { x: 0, y: 0, z: 1 } })
        break

      // Fast drop
      case ' ':
        this.actionHandler({ type: 'fastDrop' })
        break

      // Pause
      case 'p':
      case 'P':
        this.actionHandler({ type: 'pause' })
        break

      // TODO: Phase 3.2 - Rotation controls
      // case 'q': case 'Q': // Rotate X axis
      // case 'w': case 'W': // Rotate X axis
      // case 'a': case 'A': // Rotate Y axis
      // case 's': case 'S': // Rotate Y axis
      // case 'z': case 'Z': // Rotate Z axis
      // case 'x': case 'X': // Rotate Z axis
    }
  }
}
