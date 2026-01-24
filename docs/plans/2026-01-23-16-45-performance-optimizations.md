# Performance Optimizations - Implementation Plan

## Goal

Optimizar Blockout de forma preventiva aplicando técnicas de rendering y algoritmos eficientes, reduciendo draw calls, memory leaks y complejidad algorítmica.

## Contexto

Documento de referencia: optimizaciones Canvas 2D para isometric-city.
Aplicación: adaptar técnicas transferibles a Three.js/WebGL + otras optimizaciones detectadas.

---

## Estado Actual (Problemas Detectados)

### Rendering

| Problema | Ubicación | Impacto |
|----------|-----------|---------|
| BoxGeometry creada/descartada por cada bloque ocupado | `Renderer.ts:146-162` | N draw calls, GC pressure |
| Material duplicado por color | `Renderer.ts:114,153` | Múltiples instancias innecesarias |
| LineSegments separados por bloque | `Renderer.ts:120,155` | Múltiples draw calls |
| No hay InstancedMesh | - | Oportunidad perdida |

### Memory Leaks

| Problema | Ubicación | Impacto |
|----------|-----------|---------|
| `.bind(this)` en addEventListener/removeEventListener | `Renderer.ts:51,91-94` | Listener nunca removido |
| AudioContext sin cleanup | `AudioManager.ts` | AudioContext persiste |
| ParticleEffects sin dispose | `Renderer.ts:91-94` | Geometrías/materiales huérfanos |

### Algoritmos Ineficientes

| Problema | Ubicación | Complejidad Actual | Mejora |
|----------|-----------|-------------------|--------|
| dropBlocksAbove 4 nested loops | `Game.ts:328-353` | O(layers × h × w × d) = 1500 ops | O(occupiedBlocks) |
| isLayerComplete itera siempre 25 celdas | `Well.ts:159-172` | O(25) sin early exit | O(cells) con early exit |
| renderNextPiece recrea DOM cada frame | `GameUI.ts:161-172` | 960 DOM ops/sec | Memoizar por pieza |

### Input/Game Logic

| Problema | Ubicación | Fix |
|----------|-----------|-----|
| Sin filtro para key repeat | `Controls.ts:33-124` | `if (e.repeat && movementKey) return;` |
| Fall timer sin rollover | `Game.ts:115-120` | `fallTimer -= fallSpeed` en lugar de `= 0` |

---

## Análisis Big O - Antes vs Después

| Función | Antes | Después | Ganancia |
|---------|-------|---------|----------|
| `dropBlocksAbove()` | O(layers × h × w × d) = O(1500) | O(occupiedBlocks) ≤ O(375) | ~4x mejor |
| `isLayerComplete()` | O(w × d) = O(25) siempre | O(1) a O(25) con early exit | Variable |
| `updateOccupiedBlocks()` | O(n) draw calls | O(1) draw call (InstancedMesh) | n× mejor |
| `renderNextPiece()` | O(16) DOM ops cada frame | O(1) si no cambió pieza | ~16x mejor por frame |
| `checkCollision()` | O(blocks) = O(4) | Sin cambio necesario | Ya óptimo |

### Complejidad Total Game Loop (por frame)

**Antes:**
- Update: O(1)
- Collision: O(4)
- Layer check: O(25)
- Render: O(occupiedBlocks) draw calls
- UI: O(16) DOM ops

**Después:**
- Update: O(1)
- Collision: O(4)
- Layer check: O(1) a O(25)
- Render: O(1) draw calls
- UI: O(1) si pieza no cambió

---

## Steps

### Grupo A: Fixes Críticos (Primero)

1. **Fix memory leak resize listener** - `Renderer.ts`
   ```typescript
   private boundResizeHandler = this.onWindowResize.bind(this);
   // constructor: window.addEventListener('resize', this.boundResizeHandler);
   // dispose: window.removeEventListener('resize', this.boundResizeHandler);
   ```

2. **Fix key repeat filter** - `Controls.ts`
   ```typescript
   if (e.repeat && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
     return;
   }
   ```

3. **Fix fall timer rollover** - `Game.ts`
   ```typescript
   this.fallTimer -= this.state.fallSpeed; // en lugar de = 0
   ```

### Grupo B: Rendering Optimizations

4. **Geometry/Material Cache** - `Renderer.ts`
   ```typescript
   private geometryCache = {
     box: new THREE.BoxGeometry(1, 1, 1),
     edges: new THREE.EdgesGeometry(this.geometryCache.box)
   };
   private materialCache = new Map<string, THREE.LineBasicMaterial>();
   ```

5. **Object Pooling para wireframes**
   ```typescript
   private wireframePool: THREE.LineSegments[] = [];
   getFromPool() / returnToPool()
   ```

6. **InstancedMesh para occupied blocks**
   ```typescript
   // 1 draw call en lugar de N
   private occupiedBlocksMesh: THREE.InstancedMesh; // capacity: 375
   ```

7. **Dirty flag rendering**
   ```typescript
   private needsRender = true;
   render() { if (!this.needsRender) return; ... }
   ```

### Grupo C: Algorithmic Improvements

8. **dropBlocksAbove O(n) refactor** - `Game.ts`
   - Iterar Map directamente en lugar de grid
   - Calcular dropDistance por bloque

9. **isLayerComplete early exit** - `Well.ts`
   - Return false tan pronto como celda vacía encontrada

10. **renderNextPiece memoization** - `GameUI.ts`
    - Solo re-render si pieza cambió

### Grupo D: Cleanup

11. **AudioContext cleanup** - `AudioManager.ts`
    ```typescript
    dispose() { this.audioContext?.close(); }
    ```

12. **ParticleEffects dispose** - `ParticleEffects.ts`
    - Limpiar geometrías y materiales activos

---

## Tests Unitarios

### Estructura

```
src/
├── game/
│   ├── Controls.test.ts     # key repeat filtering
│   ├── Game.test.ts         # fall timer, dropBlocksAbove
│   ├── Renderer.test.ts     # cache, dispose
│   ├── GameUI.test.ts       # memoization
│   └── Well.test.ts         # isLayerComplete (extender)
├── audio/
│   └── AudioManager.test.ts # dispose
└── effects/
    └── ParticleEffects.test.ts # dispose
```

### Tests por Grupo

**Grupo A:**
- `should ignore key repeat events for movement keys`
- `should preserve excess time in fall timer`
- `should remove resize listener on dispose`

**Grupo B:**
- `should reuse geometry from cache`
- `should reuse material for same color`
- `should properly dispose resources on cleanup`

**Grupo C:**
- `isLayerComplete should early exit when layer incomplete`
- `dropBlocksAbove should maintain block colors`
- `should not re-render next piece if unchanged`

**Grupo D:**
- `should close AudioContext on dispose`
- `should dispose all active particle systems`

### Coverage Goals

| Área | Target |
|------|--------|
| Renderer.ts | 70% |
| Controls.ts | 80% |
| Well.ts | 90% |
| Game.ts | 60% |
| GameUI.ts | 50% |

---

## Archivos a Modificar

- `src/game/Renderer.ts` (principal)
- `src/game/Controls.ts`
- `src/game/Game.ts`
- `src/game/GameUI.ts`
- `src/game/Well.ts`
- `src/audio/AudioManager.ts`
- `src/effects/ParticleEffects.ts`

---

## Considerations

- **No breaking changes** - El juego debe funcionar igual visualmente
- **Tests antes de refactor** - Escribir tests que capturen comportamiento actual
- **Incremental** - Un grupo a la vez, verificar después de cada uno
- **Profiling opcional** - DevTools Performance para medir mejoras

---

## Success Criteria

- [ ] Memory leak de resize listener eliminado
- [ ] Key repeat no genera múltiples acciones
- [ ] Fall timer sin double-drop bugs
- [ ] Geometry/Material cache funcionando
- [ ] Draw calls reducidos (verificar en DevTools)
- [ ] dropBlocksAbove O(n) implementado
- [ ] Tests pasando para cada grupo
- [ ] `npm run check` pasa sin errores
