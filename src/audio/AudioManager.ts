// AudioManager - Web Audio API wrapper for game sounds
// Loads and plays sound effects using native Web Audio API

export class AudioManager {
  private audioContext: AudioContext | null = null
  private sounds: Map<string, AudioBuffer> = new Map()
  private enabled: boolean = false

  constructor() {
    // Audio context requires user interaction to start (browser security)
    // We'll initialize it on first sound play
  }

  private async initAudioContext(): Promise<void> {
    if (this.audioContext) {
      return
    }

    try {
      this.audioContext = new AudioContext()
      await this.loadSounds()
      this.enabled = true
      console.debug('[AudioManager] Initialized and sounds loaded')
    } catch (error) {
      console.warn('[AudioManager] Failed to initialize:', error)
      this.enabled = false
    }
  }

  private async loadSounds(): Promise<void> {
    if (!this.audioContext) {
      return
    }

    const soundFiles = {
      move: '/sound/drop-piece.wav',
      rotate: '/sound/rotate.wav',
      lock: '/sound/lock.wav',
      clear: '/sound/line-clear.wav'
    }

    const loadPromises = Object.entries(soundFiles).map(async ([name, path]) => {
      try {
        const response = await fetch(path)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer)
        this.sounds.set(name, audioBuffer)
        console.debug(`[AudioManager] Loaded sound: ${name}`)
      } catch (error) {
        console.warn(`[AudioManager] Failed to load sound ${name}:`, error)
      }
    })

    await Promise.all(loadPromises)
  }

  private async playSound(name: string, volume: number = 0.3): Promise<void> {
    // Initialize on first play (requires user interaction)
    if (!this.audioContext) {
      await this.initAudioContext()
    }

    if (!this.enabled || !this.audioContext) {
      return
    }

    const buffer = this.sounds.get(name)
    if (!buffer) {
      return
    }

    try {
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()

      source.buffer = buffer
      gainNode.gain.value = volume

      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      source.start(0)
    } catch (error) {
      console.warn(`[AudioManager] Failed to play sound ${name}:`, error)
    }
  }

  playPieceMove(): void {
    this.playSound('move', 0.2)
  }

  playPieceRotate(): void {
    this.playSound('rotate', 0.3)
  }

  playPieceLock(): void {
    this.playSound('lock', 0.4)
  }

  playLineClear(): void {
    this.playSound('clear', 0.5)
  }

  playGameOver(): void {
    // Could add a game over sound later
  }
}
