import {
  Hunter,
  Animal,
  GameMap,
  Camera,
  SpriteMap,
  Direction,
  Particle,
  DamageNumber,
  TerrainType,
  TreeSize,
  TimeOfDay,
} from './types';
import { generateMap, isTileWalkable } from './map';
import { createHunter, createAnimal, spawnAnimals, findWalkablePosition } from './entities';
import { updateAnimalAI, shouldAnimalAttack } from './ai';
import { drawSprite } from './sprites';

const TILE_SIZE = 48;

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  map: GameMap;
  hunter: Hunter;
  animals: Animal[];
  camera: Camera;
  sprites: SpriteMap;
  keys: Set<string>;
  particles: Particle[];
  damageNumbers: DamageNumber[];
  tileSize: number;
  isRunning: boolean;
  isGameOver: boolean;
  isPaused: boolean;
  lastTime: number;
  animationFrameId: number;
  gameTime: number;
  timeOfDay: TimeOfDay;
  nightAlpha: number;
  targetNightAlpha: number;
  windTime: number;
  onTimeChange?: (time: TimeOfDay) => void;
  private keyDownHandler: (e: KeyboardEvent) => void;
  private keyUpHandler: (e: KeyboardEvent) => void;
  private resizeHandler: () => void;

  constructor(canvas: HTMLCanvasElement, sprites: SpriteMap) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.sprites = sprites;
    this.tileSize = TILE_SIZE;
    this.keys = new Set();
    this.particles = [];
    this.damageNumbers = [];
    this.isRunning = false;
    this.isGameOver = false;
    this.isPaused = false;
    this.lastTime = 0;
    this.animationFrameId = 0;
    this.gameTime = 0;
    this.timeOfDay = TimeOfDay.DAY;
    this.nightAlpha = 0;
    this.targetNightAlpha = 0;
    this.windTime = 0;

    // Generate map
    this.map = generateMap();

    // Create hunter at center
    const centerX = (this.map.width / 2) * TILE_SIZE;
    const centerY = (this.map.height / 2) * TILE_SIZE;
    this.hunter = createHunter(centerX, centerY);

    // Spawn animals
    this.animals = spawnAnimals(this.map, 25);

    // Camera
    this.camera = {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    };

    // Event handlers
    this.keyDownHandler = (e: KeyboardEvent) => {
      this.keys.add(e.key);
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(
          e.key
        )
      ) {
        e.preventDefault();
      }
      if (e.key === 'p' || e.key === 'P') {
        this.isPaused = !this.isPaused;
      }
      if (e.key === 'r' || e.key === 'R') {
        if (this.isGameOver) {
          this.restart();
        }
      }
      if (e.key === 'n' || e.key === 'N') {
        this.toggleTimeOfDay();
      }
    };

    this.keyUpHandler = (e: KeyboardEvent) => {
      this.keys.delete(e.key);
    };

    this.resizeHandler = () => {
      this.handleResize();
    };

    window.addEventListener('keydown', this.keyDownHandler);
    window.addEventListener('keyup', this.keyUpHandler);
    window.addEventListener('resize', this.resizeHandler);

    this.handleResize();
  }

  init(): void {
    this.updateCamera();
  }

  start(): void {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  restart(): void {
    this.map = generateMap();
    const centerX = (this.map.width / 2) * TILE_SIZE;
    const centerY = (this.map.height / 2) * TILE_SIZE;
    this.hunter = createHunter(centerX, centerY);
    this.animals = spawnAnimals(this.map, 25);
    this.particles = [];
    this.damageNumbers = [];
    this.isGameOver = false;
    this.isPaused = false;
    this.gameTime = 0;
    this.updateCamera();
  }

  toggleTimeOfDay(): void {
    if (this.timeOfDay === TimeOfDay.DAY) {
      this.timeOfDay = TimeOfDay.NIGHT;
      this.targetNightAlpha = 0.55;
    } else {
      this.timeOfDay = TimeOfDay.DAY;
      this.targetNightAlpha = 0;
    }
    if (this.onTimeChange) {
      this.onTimeChange(this.timeOfDay);
    }
  }

  gameLoop(timestamp: number): void {
    if (!this.isRunning) return;

    const deltaTime = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;

    if (!this.isPaused && !this.isGameOver) {
      this.update(deltaTime);
    }

    this.render();
    this.animationFrameId = requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(deltaTime: number): void {
    this.gameTime += deltaTime;
    this.windTime += deltaTime;
    this.updateHunter(deltaTime);
    this.updateAnimals(deltaTime);
    this.updateCamera();
    this.updateParticles(deltaTime);
    this.updateDamageNumbers(deltaTime);
    this.checkHunterAttack();
    this.handleAnimalAttacks(deltaTime);
    this.checkAnimalRespawn(deltaTime);

    // Smooth night/day transition
    const transitionSpeed = 2;
    if (this.nightAlpha < this.targetNightAlpha) {
      this.nightAlpha = Math.min(this.targetNightAlpha, this.nightAlpha + transitionSpeed * deltaTime);
    } else if (this.nightAlpha > this.targetNightAlpha) {
      this.nightAlpha = Math.max(this.targetNightAlpha, this.nightAlpha - transitionSpeed * deltaTime);
    }
  }

  updateHunter(deltaTime: number): void {
    let dx = 0;
    let dy = 0;

    if (this.keys.has('ArrowUp') || this.keys.has('w') || this.keys.has('W')) dy -= 1;
    if (this.keys.has('ArrowDown') || this.keys.has('s') || this.keys.has('S')) dy += 1;
    if (this.keys.has('ArrowLeft') || this.keys.has('a') || this.keys.has('A')) dx -= 1;
    if (this.keys.has('ArrowRight') || this.keys.has('d') || this.keys.has('D')) dx += 1;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;
    }

    // Update facing direction
    if (dx !== 0 || dy !== 0) {
      if (Math.abs(dx) > Math.abs(dy)) {
        this.hunter.direction = dx > 0 ? Direction.RIGHT : Direction.LEFT;
      } else {
        this.hunter.direction = dy > 0 ? Direction.DOWN : Direction.UP;
      }
    }

    const speed = this.hunter.speed * deltaTime;
    const newX = this.hunter.pos.x + dx * speed;
    const newY = this.hunter.pos.y + dy * speed;

    // Try full movement
    if (this.isWalkable(newX, newY, this.hunter.width, this.hunter.height)) {
      this.hunter.pos.x = newX;
      this.hunter.pos.y = newY;
    } else if (this.isWalkable(newX, this.hunter.pos.y, this.hunter.width, this.hunter.height)) {
      this.hunter.pos.x = newX;
    } else if (this.isWalkable(this.hunter.pos.x, newY, this.hunter.width, this.hunter.height)) {
      this.hunter.pos.y = newY;
    }

    // Clamp to map
    const mapPixelW = this.map.width * TILE_SIZE;
    const mapPixelH = this.map.height * TILE_SIZE;
    this.hunter.pos.x = Math.max(this.hunter.width / 2, Math.min(mapPixelW - this.hunter.width / 2, this.hunter.pos.x));
    this.hunter.pos.y = Math.max(this.hunter.height / 2, Math.min(mapPixelH - this.hunter.height / 2, this.hunter.pos.y));

    // Update attack cooldown
    if (this.hunter.attackCooldown > 0) {
      this.hunter.attackCooldown -= deltaTime;
    }

    // Update invincibility
    if (this.hunter.invincibleTimer > 0) {
      this.hunter.invincibleTimer -= deltaTime;
    }

    // Check game over
    if (this.hunter.health <= 0) {
      this.isGameOver = true;
    }
  }

  updateAnimals(deltaTime: number): void {
    for (const animal of this.animals) {
      updateAnimalAI(animal, this.hunter, this.map, deltaTime);
    }
  }

  updateCamera(): void {
    const targetX = this.hunter.pos.x - this.camera.width / 2;
    const targetY = this.hunter.pos.y - this.camera.height / 2;

    // Smooth interpolation
    this.camera.x += (targetX - this.camera.x) * 0.1;
    this.camera.y += (targetY - this.camera.y) * 0.1;

    // Clamp camera to map boundaries
    const mapPixelW = this.map.width * TILE_SIZE;
    const mapPixelH = this.map.height * TILE_SIZE;
    this.camera.x = Math.max(0, Math.min(mapPixelW - this.camera.width, this.camera.x));
    this.camera.y = Math.max(0, Math.min(mapPixelH - this.camera.height, this.camera.y));
  }

  updateParticles(deltaTime: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.life -= deltaTime;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  updateDamageNumbers(deltaTime: number): void {
    for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
      const d = this.damageNumbers[i];
      d.y -= 40 * deltaTime;
      d.life -= deltaTime;
      if (d.life <= 0) {
        this.damageNumbers.splice(i, 1);
      }
    }
  }

  checkHunterAttack(): void {
    if (this.keys.has(' ') && this.hunter.attackCooldown <= 0) {
      this.hunter.isAttacking = true;
      this.hunter.attackCooldown = 0.5;

      // Spawn slash particles
      const dir = this.hunter.direction;
      let offsetX = 0;
      let offsetY = 0;
      const range = this.hunter.attackRange;

      switch (dir) {
        case Direction.UP:
          offsetY = -range / 2;
          break;
        case Direction.DOWN:
          offsetY = range / 2;
          break;
        case Direction.LEFT:
          offsetX = -range / 2;
          break;
        case Direction.RIGHT:
          offsetX = range / 2;
          break;
      }

      this.spawnParticles(
        this.hunter.pos.x + offsetX,
        this.hunter.pos.y + offsetY,
        '#ffff88',
        6
      );

      // Check for hits on animals
      for (const animal of this.animals) {
        if (animal.isDead) continue;

        const dist = this.getDistance(
          this.hunter.pos.x + offsetX,
          this.hunter.pos.y + offsetY,
          animal.pos.x,
          animal.pos.y
        );

        if (dist < range) {
          animal.health -= this.hunter.attackDamage;
          this.spawnParticles(animal.pos.x, animal.pos.y, '#ff4444', 8);
          this.damageNumbers.push({
            x: animal.pos.x,
            y: animal.pos.y - 20,
            value: this.hunter.attackDamage,
            life: 1,
            color: '#ff4444',
          });

          if (animal.health <= 0) {
            animal.isDead = true;
            animal.respawnTimer = 10 + Math.random() * 5;
            this.hunter.score += animal.points;
            this.hunter.capturedAnimals += 1;
            this.spawnParticles(animal.pos.x, animal.pos.y, '#ffaa00', 12);
            this.damageNumbers.push({
              x: animal.pos.x,
              y: animal.pos.y - 40,
              value: animal.points,
              life: 1.5,
              color: '#ffaa00',
            });
          }
        }
      }

      // Reset attacking state after a short delay
      setTimeout(() => {
        this.hunter.isAttacking = false;
      }, 150);
    }
  }

  handleAnimalAttacks(_deltaTime: number): void {
    if (this.hunter.invincibleTimer > 0) return;

    for (const animal of this.animals) {
      if (shouldAnimalAttack(animal, this.hunter)) {
        this.hunter.health -= animal.damage;
        this.hunter.invincibleTimer = 0.5;
        this.spawnParticles(this.hunter.pos.x, this.hunter.pos.y, '#ff0000', 6);
        this.damageNumbers.push({
          x: this.hunter.pos.x,
          y: this.hunter.pos.y - 20,
          value: animal.damage,
          life: 1,
          color: '#ff0000',
        });

        if (this.hunter.health <= 0) {
          this.hunter.health = 0;
          this.isGameOver = true;
        }
        break;
      }
    }
  }

  checkAnimalRespawn(deltaTime: number): void {
    for (const animal of this.animals) {
      if (animal.isDead) {
        if (animal.respawnTimer > 0) {
          animal.respawnTimer -= deltaTime;
        } else {
          const pos = findWalkablePosition(
            this.map,
            this.hunter.pos.x,
            this.hunter.pos.y,
            400
          );
          if (pos) {
            const newAnimal = createAnimal(
              animal.type,
              pos.x,
              pos.y
            );
            Object.assign(animal, newAnimal);
          } else {
            animal.respawnTimer = 5;
          }
        }
      }
    }
  }

  spawnParticles(x: number, y: number, color: string, count: number): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 100;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.3 + Math.random() * 0.5,
        maxLife: 0.8,
        color,
        size: 2 + Math.random() * 3,
      });
    }
  }

  // Get tree sprite key based on size
  getTreeSpriteKey(treeSize?: TreeSize): string {
    switch (treeSize) {
      case TreeSize.SMALL: return 'tree_small';
      case TreeSize.MEDIUM: return 'tree_medium';
      case TreeSize.LARGE: return 'tree_large';
      default: return 'tree_medium';
    }
  }

  // Get tree render dimensions based on size (1.3x original)
  getTreeDimensions(treeSize?: TreeSize): { width: number; height: number; offsetX: number; offsetY: number } {
    switch (treeSize) {
      case TreeSize.SMALL:
        return { width: 74, height: 94, offsetX: -13, offsetY: -46 };
      case TreeSize.LARGE:
        return { width: 126, height: 146, offsetX: -39, offsetY: -98 };
      case TreeSize.MEDIUM:
      default:
        return { width: 94, height: 114, offsetX: -23, offsetY: -66 };
    }
  }

  // Calculate wind sway offset for trees
  getWindSway(x: number, _y: number, treeSize?: TreeSize): number {
    const intensity = treeSize === TreeSize.LARGE ? 5 : treeSize === TreeSize.MEDIUM ? 4 : 3;
    const frequency = 1.3;
    const phase = x * 0.01;
    return Math.sin(this.windTime * frequency + phase) * intensity;
  }

  render(): void {
    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = false;

    // Clear
    ctx.fillStyle = this.timeOfDay === TimeOfDay.NIGHT ? '#0a0a1a' : '#1a1a2e';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);

    this.renderTerrain();
    this.renderObstaclesGround();
    this.renderEntities();
    this.renderTrees();
    this.renderParticlesLayer();
    this.renderDamageNumbersLayer();

    ctx.restore();

    // Night overlay
    if (this.nightAlpha > 0.01) {
      ctx.fillStyle = `rgba(5, 5, 30, ${this.nightAlpha})`;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Render torch/light glow around hunter
      this.renderNightLight();
    }

    // HUD renders in screen space
    this.renderHUD();
    this.renderMinimap();
    this.renderTimeToggleButton();

    if (this.isPaused) {
      this.renderPauseScreen();
    }
    if (this.isGameOver) {
      this.renderGameOver();
    }
  }

  renderNightLight(): void {
    const ctx = this.ctx;
    const hx = this.hunter.pos.x - this.camera.x;
    const hy = this.hunter.pos.y - this.camera.y;
    const lightRadius = 180;

    // Create radial gradient for torch light
    const gradient = ctx.createRadialGradient(hx, hy, 0, hx, hy, lightRadius);
    gradient.addColorStop(0, `rgba(255, 200, 100, ${0.3 * this.nightAlpha})`);
    gradient.addColorStop(0.3, `rgba(255, 180, 80, ${0.15 * this.nightAlpha})`);
    gradient.addColorStop(0.7, `rgba(255, 150, 50, ${0.05 * this.nightAlpha})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = gradient;
    ctx.fillRect(hx - lightRadius, hy - lightRadius, lightRadius * 2, lightRadius * 2);
    ctx.globalCompositeOperation = 'source-over';

    // Stars in night mode
    if (this.nightAlpha > 0.3) {
      this.renderStars();
    }
  }

  renderStars(): void {
    const ctx = this.ctx;
    const starAlpha = (this.nightAlpha - 0.3) / 0.25;
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.8, starAlpha)})`;

    // Use deterministic positions based on index
    for (let i = 0; i < 60; i++) {
      const sx = ((i * 137.508) % this.canvas.width);
      const sy = ((i * 97.331) % (this.canvas.height * 0.4));
      const twinkle = Math.sin(this.gameTime * 2 + i * 0.5) * 0.3 + 0.7;
      const size = i % 3 === 0 ? 2 : 1;
      ctx.globalAlpha = twinkle * Math.min(0.8, starAlpha);
      ctx.fillRect(sx, sy, size, size);
    }
    ctx.globalAlpha = 1;
  }

  renderTerrain(): void {
    const ctx = this.ctx;
    const startCol = Math.max(0, Math.floor(this.camera.x / TILE_SIZE));
    const endCol = Math.min(
      this.map.width,
      Math.ceil((this.camera.x + this.camera.width) / TILE_SIZE) + 1
    );
    const startRow = Math.max(0, Math.floor(this.camera.y / TILE_SIZE));
    const endRow = Math.min(
      this.map.height,
      Math.ceil((this.camera.y + this.camera.height) / TILE_SIZE) + 1
    );

    for (let y = startRow; y < endRow; y++) {
      for (let x = startCol; x < endCol; x++) {
        const tile = this.map.tiles[y][x];
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        let spriteKey: string;
        switch (tile.terrain) {
          case TerrainType.GRASS:
            spriteKey = 'grass_tile';
            break;
          case TerrainType.WATER:
            spriteKey = 'water_tile';
            break;
          case TerrainType.DIRT:
            spriteKey = 'dirt_tile';
            break;
        }

        const sprite = this.sprites[spriteKey];
        if (sprite) {
          // Water animation
          if (tile.terrain === TerrainType.WATER) {
            const offset = Math.sin(this.gameTime * 2 + x * 0.5 + y * 0.3) * 2;
            ctx.drawImage(sprite, px, py + offset, TILE_SIZE, TILE_SIZE);
          } else {
            ctx.drawImage(sprite, px, py, TILE_SIZE, TILE_SIZE);
          }
        } else {
          // Fallback colors
          switch (tile.terrain) {
            case TerrainType.GRASS:
              const shade = ((x * 7 + y * 13) % 3) * 5;
              ctx.fillStyle = `rgb(${60 + shade}, ${120 + shade}, ${40 + shade})`;
              break;
            case TerrainType.WATER:
              ctx.fillStyle = '#3366aa';
              break;
            case TerrainType.DIRT:
              ctx.fillStyle = '#8b7355';
              break;
          }
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        }
      }
    }
  }

  renderObstaclesGround(): void {
    const ctx = this.ctx;
    const startCol = Math.max(0, Math.floor(this.camera.x / TILE_SIZE));
    const endCol = Math.min(
      this.map.width,
      Math.ceil((this.camera.x + this.camera.width) / TILE_SIZE) + 1
    );
    const startRow = Math.max(0, Math.floor(this.camera.y / TILE_SIZE));
    const endRow = Math.min(
      this.map.height,
      Math.ceil((this.camera.y + this.camera.height) / TILE_SIZE) + 1
    );

    for (let y = startRow; y < endRow; y++) {
      for (let x = startCol; x < endCol; x++) {
        const tile = this.map.tiles[y][x];
        if (!tile.obstacle) continue;

        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        if (tile.obstacle === 'bush') {
          const sprite = this.sprites['bush'];
          if (sprite) {
            ctx.drawImage(sprite, px - 6, py - 6, TILE_SIZE + 12, TILE_SIZE + 12);
          } else {
            ctx.fillStyle = '#2d6a2d';
            ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
          }
        } else if (tile.obstacle === 'rock') {
          const sprite = this.sprites['rock'];
          if (sprite) {
            ctx.drawImage(sprite, px - 10, py - 10, TILE_SIZE + 20, TILE_SIZE + 20);
          } else {
            ctx.fillStyle = '#777777';
            ctx.fillRect(px + 6, py + 6, TILE_SIZE - 12, TILE_SIZE - 12);
          }
        }
        // Trees are rendered separately in renderTrees
      }
    }
  }

  renderTrees(): void {
    const ctx = this.ctx;
    // Extended range for bigger trees that extend well beyond their tile
    const startCol = Math.max(0, Math.floor(this.camera.x / TILE_SIZE) - 4);
    const endCol = Math.min(
      this.map.width,
      Math.ceil((this.camera.x + this.camera.width) / TILE_SIZE) + 5
    );
    const startRow = Math.max(0, Math.floor(this.camera.y / TILE_SIZE) - 4);
    const endRow = Math.min(
      this.map.height,
      Math.ceil((this.camera.y + this.camera.height) / TILE_SIZE) + 5
    );

    for (let y = startRow; y < endRow; y++) {
      for (let x = startCol; x < endCol; x++) {
        const tile = this.map.tiles[y][x];
        if (tile.obstacle !== 'tree') continue;

        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        const spriteKey = this.getTreeSpriteKey(tile.treeSize);
        const dims = this.getTreeDimensions(tile.treeSize);
        const sprite = this.sprites[spriteKey];

        // Calculate wind sway
        const sway = this.getWindSway(x, y, tile.treeSize);

        if (sprite) {
          ctx.save();
          // Apply wind sway by translating from the base
          ctx.translate(px + TILE_SIZE / 2, py + TILE_SIZE);
          ctx.translate(sway, 0);
          ctx.translate(-(px + TILE_SIZE / 2), -(py + TILE_SIZE));
          ctx.drawImage(sprite, px + dims.offsetX, py + dims.offsetY, dims.width, dims.height);
          ctx.restore();
        } else {
          // Fallback tree drawing (scaled for 2x bigger trees)
          const fallbackDims = this.getTreeDimensions(tile.treeSize);
          ctx.save();
          ctx.translate(px + TILE_SIZE / 2, py + TILE_SIZE);
          ctx.translate(sway, 0);
          ctx.translate(-(px + TILE_SIZE / 2), -(py + TILE_SIZE));
          ctx.fillStyle = '#5a3a1a';
          const tw = fallbackDims.width * 0.15;
          const th = fallbackDims.height * 0.4;
          ctx.fillRect(px + TILE_SIZE/2 - tw/2, py + TILE_SIZE - th - 10, tw, th);
          ctx.fillStyle = '#1a5a1a';
          ctx.beginPath();
          const cr = fallbackDims.width * 0.35;
          ctx.arc(px + TILE_SIZE/2, py + TILE_SIZE - th - 10 - cr * 0.3, cr, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }
  }

  renderEntities(): void {
    const ctx = this.ctx;

    // Collect all entities and sort by Y position for depth
    const entities: Array<{ y: number; render: () => void }> = [];

    // Add hunter
    entities.push({
      y: this.hunter.pos.y,
      render: () => this.renderHunter(),
    });

    // Add animals
    for (const animal of this.animals) {
      if (animal.isDead) continue;
      entities.push({
        y: animal.pos.y,
        render: () => this.renderAnimal(animal),
      });
    }

    // Sort by Y (entities further up are rendered first)
    entities.sort((a, b) => a.y - b.y);

    for (const entity of entities) {
      entity.render();
    }
  }

  renderHunter(): void {
    const ctx = this.ctx;
    const h = this.hunter;

    // Flash red when hit
    const isFlashing = h.invincibleTimer > 0 && Math.floor(h.invincibleTimer * 10) % 2 === 0;

    const sprite = this.sprites['hunter'];
    // 20px larger than before (was 36, now 56)
    const renderWidth = 56;
    const renderHeight = 56;
    const x = h.pos.x - renderWidth / 2;
    const y = h.pos.y - renderHeight / 2;

    if (isFlashing) {
      ctx.save();
      ctx.globalAlpha = 0.6;
    }

    if (sprite) {
      drawSprite(ctx, sprite, x, y, renderWidth, renderHeight, h.direction);
    } else {
      ctx.fillStyle = isFlashing ? '#ff4444' : '#8B4513';
      ctx.fillRect(x, y, renderWidth, renderHeight);
      ctx.fillStyle = '#DEB887';
      ctx.fillRect(x + 8, y + 2, renderWidth - 16, renderHeight / 2);
    }

    if (isFlashing) {
      ctx.restore();
    }

    // Draw attack indicator
    if (h.isAttacking) {
      ctx.save();
      ctx.strokeStyle = '#ffff88';
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.8;

      const cx = h.pos.x;
      const cy = h.pos.y;
      const range = h.attackRange;

      switch (h.direction) {
        case Direction.UP:
          ctx.beginPath();
          ctx.moveTo(cx - 15, cy - range);
          ctx.lineTo(cx, cy - range - 10);
          ctx.lineTo(cx + 15, cy - range);
          ctx.stroke();
          break;
        case Direction.DOWN:
          ctx.beginPath();
          ctx.moveTo(cx - 15, cy + range);
          ctx.lineTo(cx, cy + range + 10);
          ctx.lineTo(cx + 15, cy + range);
          ctx.stroke();
          break;
        case Direction.LEFT:
          ctx.beginPath();
          ctx.moveTo(cx - range, cy - 15);
          ctx.lineTo(cx - range - 10, cy);
          ctx.lineTo(cx - range, cy + 15);
          ctx.stroke();
          break;
        case Direction.RIGHT:
          ctx.beginPath();
          ctx.moveTo(cx + range, cy - 15);
          ctx.lineTo(cx + range + 10, cy);
          ctx.lineTo(cx + range, cy + 15);
          ctx.stroke();
          break;
      }
      ctx.restore();
    }
  }

  renderAnimal(animal: Animal): void {
    const ctx = this.ctx;

    // Larger sprite sizes (20px more)
    const sizeMap: Record<string, number> = {
      rabbit: 44,
      deer: 52,
      boar: 54,
      wolf: 50,
      bear: 60,
    };
    const renderSize = sizeMap[animal.type] || 48;
    const x = animal.pos.x - renderSize / 2;
    const y = animal.pos.y - renderSize / 2;

    const spriteKey = animal.type;
    const sprite = this.sprites[spriteKey];

    if (sprite) {
      drawSprite(ctx, sprite, x, y, renderSize, renderSize, animal.direction);
    } else {
      const colors: Record<string, string> = {
        rabbit: '#c0c0c0',
        deer: '#b5651d',
        boar: '#6b4423',
        wolf: '#808080',
        bear: '#4a3520',
      };
      ctx.fillStyle = colors[animal.type] || '#ff00ff';
      ctx.fillRect(x, y, renderSize, renderSize);
    }

    // Health bar (only for damaged animals)
    if (animal.health < animal.maxHealth && animal.health > 0) {
      const barWidth = renderSize + 8;
      const barHeight = 4;
      const barX = animal.pos.x - barWidth / 2;
      const barY = animal.pos.y - renderSize / 2 - 10;
      const healthPct = animal.health / animal.maxHealth;

      ctx.fillStyle = '#333333';
      ctx.fillRect(barX, barY, barWidth, barHeight);
      ctx.fillStyle = healthPct > 0.5 ? '#44cc44' : healthPct > 0.25 ? '#cccc44' : '#cc4444';
      ctx.fillRect(barX, barY, barWidth * healthPct, barHeight);
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
  }

  renderParticlesLayer(): void {
    const ctx = this.ctx;
    for (const p of this.particles) {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  renderDamageNumbersLayer(): void {
    const ctx = this.ctx;
    for (const d of this.damageNumbers) {
      const alpha = Math.min(1, d.life);
      ctx.globalAlpha = alpha;
      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = d.color;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      const text = `-${d.value}`;
      ctx.strokeText(text, d.x - 10, d.y);
      ctx.fillText(text, d.x - 10, d.y);
    }
    ctx.globalAlpha = 1;
  }

  renderHUD(): void {
    const ctx = this.ctx;

    // Health bar
    const hbX = 20;
    const hbY = 20;
    const hbW = 200;
    const hbH = 24;
    const healthPct = this.hunter.health / this.hunter.maxHealth;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(hbX - 2, hbY - 2, hbW + 4, hbH + 4);

    ctx.fillStyle = '#331111';
    ctx.fillRect(hbX, hbY, hbW, hbH);

    const healthColor = healthPct > 0.5 ? '#cc2222' : healthPct > 0.25 ? '#cc8822' : '#cc2222';
    ctx.fillStyle = healthColor;
    ctx.fillRect(hbX, hbY, hbW * healthPct, hbH);

    ctx.strokeStyle = '#551111';
    ctx.lineWidth = 2;
    ctx.strokeRect(hbX, hbY, hbW, hbH);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(
      `HP: ${this.hunter.health}/${this.hunter.maxHealth}`,
      hbX + hbW / 2,
      hbY + 17
    );

    // Score
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`Score: ${this.hunter.score}`, 20, 65);

    // Captured count
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`Captured: ${this.hunter.capturedAnimals}`, 20, 88);

    // Time of day indicator
    const timeIcon = this.timeOfDay === TimeOfDay.DAY ? '☀' : '🌙';
    ctx.font = '18px sans-serif';
    ctx.fillText(timeIcon, 20, 112);

    // Controls hint
    ctx.textAlign = 'center';
    ctx.font = '12px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(
      'Arrow Keys: Move | Space: Attack | P: Pause | N: Night/Day',
      this.canvas.width / 2,
      this.canvas.height - 15
    );

    ctx.textAlign = 'left';
  }

  renderTimeToggleButton(): void {
    const ctx = this.ctx;
    const btnW = 100;
    const btnH = 36;
    const btnX = this.canvas.width - btnW - 20;
    const btnY = this.canvas.height - btnH - 50;

    // Button background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.strokeStyle = this.timeOfDay === TimeOfDay.DAY ? '#d4a44a' : '#6688cc';
    ctx.lineWidth = 2;

    // Rounded rect
    const r = 8;
    ctx.beginPath();
    ctx.moveTo(btnX + r, btnY);
    ctx.lineTo(btnX + btnW - r, btnY);
    ctx.quadraticCurveTo(btnX + btnW, btnY, btnX + btnW, btnY + r);
    ctx.lineTo(btnX + btnW, btnY + btnH - r);
    ctx.quadraticCurveTo(btnX + btnW, btnY + btnH, btnX + btnW - r, btnY + btnH);
    ctx.lineTo(btnX + r, btnY + btnH);
    ctx.quadraticCurveTo(btnX, btnY + btnH, btnX, btnY + btnH - r);
    ctx.lineTo(btnX, btnY + r);
    ctx.quadraticCurveTo(btnX, btnY, btnX + r, btnY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Button text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'center';
    const label = this.timeOfDay === TimeOfDay.DAY ? '🌙 Night' : '☀ Day';
    ctx.fillText(label, btnX + btnW / 2, btnY + btnH / 2 + 5);
    ctx.textAlign = 'left';
  }

  renderMinimap(): void {
    const ctx = this.ctx;
    const mmW = 160;
    const mmH = 120;
    const mmX = this.canvas.width - mmW - 15;
    const mmY = 15;

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(mmX - 2, mmY - 2, mmW + 4, mmH + 4);

    // Draw terrain (simplified)
    const scaleX = mmW / this.map.width;
    const scaleY = mmH / this.map.height;

    for (let y = 0; y < this.map.height; y += 2) {
      for (let x = 0; x < this.map.width; x += 2) {
        const tile = this.map.tiles[y][x];
        if (this.timeOfDay === TimeOfDay.NIGHT) {
          switch (tile.terrain) {
            case TerrainType.GRASS:
              ctx.fillStyle = '#152015';
              break;
            case TerrainType.WATER:
              ctx.fillStyle = '#112244';
              break;
            case TerrainType.DIRT:
              ctx.fillStyle = '#3a2a1a';
              break;
          }
        } else {
          switch (tile.terrain) {
            case TerrainType.GRASS:
              ctx.fillStyle = '#2a5a2a';
              break;
            case TerrainType.WATER:
              ctx.fillStyle = '#2255aa';
              break;
            case TerrainType.DIRT:
              ctx.fillStyle = '#6b5535';
              break;
          }
        }
        ctx.fillRect(mmX + x * scaleX, mmY + y * scaleY, scaleX * 2 + 1, scaleY * 2 + 1);
      }
    }

    // Draw animals as red dots
    for (const animal of this.animals) {
      if (animal.isDead) continue;
      const ax = mmX + (animal.pos.x / (this.map.width * TILE_SIZE)) * mmW;
      const ay = mmY + (animal.pos.y / (this.map.height * TILE_SIZE)) * mmH;
      ctx.fillStyle = animal.isPassive ? '#88aaff' : '#ff4444';
      ctx.fillRect(ax - 1, ay - 1, 3, 3);
    }

    // Draw hunter as green dot
    const hx = mmX + (this.hunter.pos.x / (this.map.width * TILE_SIZE)) * mmW;
    const hy = mmY + (this.hunter.pos.y / (this.map.height * TILE_SIZE)) * mmH;
    ctx.fillStyle = '#44ff44';
    ctx.fillRect(hx - 2, hy - 2, 5, 5);

    // Border
    ctx.strokeStyle = '#444444';
    ctx.lineWidth = 2;
    ctx.strokeRect(mmX - 2, mmY - 2, mmW + 4, mmH + 4);
  }

  renderGameOver(): void {
    const ctx = this.ctx;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#cc2222';
    ctx.font = 'bold 48px monospace';
    ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(
      `Score: ${this.hunter.score}`,
      this.canvas.width / 2,
      this.canvas.height / 2 + 10
    );
    ctx.fillText(
      `Animals Captured: ${this.hunter.capturedAnimals}`,
      this.canvas.width / 2,
      this.canvas.height / 2 + 45
    );

    ctx.fillStyle = '#aaaaaa';
    ctx.font = '18px monospace';
    ctx.fillText(
      'Press R to Restart',
      this.canvas.width / 2,
      this.canvas.height / 2 + 90
    );

    ctx.textAlign = 'left';
  }

  renderPauseScreen(): void {
    const ctx = this.ctx;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px monospace';
    ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);

    ctx.fillStyle = '#aaaaaa';
    ctx.font = '18px monospace';
    ctx.fillText(
      'Press P to Resume',
      this.canvas.width / 2,
      this.canvas.height / 2 + 40
    );

    ctx.textAlign = 'left';
  }

  isWalkable(x: number, y: number, width: number, height: number): boolean {
    const halfW = width / 2 - 2;
    const halfH = height / 2 - 2;
    const corners = [
      { x: x - halfW, y: y - halfH },
      { x: x + halfW, y: y - halfH },
      { x: x - halfW, y: y + halfH },
      { x: x + halfW, y: y + halfH },
    ];

    for (const corner of corners) {
      const tx = Math.floor(corner.x / TILE_SIZE);
      const ty = Math.floor(corner.y / TILE_SIZE);
      if (!isTileWalkable(this.map, tx, ty)) {
        return false;
      }
    }
    return true;
  }

  getDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  handleResize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.camera.width = this.canvas.width;
    this.camera.height = this.canvas.height;
  }

  cleanup(): void {
    this.stop();
    window.removeEventListener('keydown', this.keyDownHandler);
    window.removeEventListener('keyup', this.keyUpHandler);
    window.removeEventListener('resize', this.resizeHandler);
  }
}
