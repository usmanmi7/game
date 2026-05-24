export enum TerrainType {
  GRASS = 'grass',
  WATER = 'water',
  DIRT = 'dirt',
}

export enum Direction {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

export enum AnimalType {
  RABBIT = 'rabbit',
  DEER = 'deer',
  BOAR = 'boar',
  WOLF = 'wolf',
  BEAR = 'bear',
}

export enum AnimalState {
  WANDER = 'wander',
  FLEE = 'flee',
  CHASE = 'chase',
  ATTACK = 'attack',
  IDLE = 'idle',
}

export enum TreeSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum TimeOfDay {
  DAY = 'day',
  NIGHT = 'night',
}

export interface Position {
  x: number;
  y: number;
}

export interface Entity {
  pos: Position;
  width: number;
  height: number;
  direction: Direction;
  speed: number;
}

export interface Hunter extends Entity {
  health: number;
  maxHealth: number;
  isAttacking: boolean;
  attackCooldown: number;
  attackRange: number;
  attackDamage: number;
  score: number;
  capturedAnimals: number;
  invincibleTimer: number;
}

export interface Animal extends Entity {
  type: AnimalType;
  state: AnimalState;
  health: number;
  maxHealth: number;
  damage: number;
  detectionRange: number;
  attackRange: number;
  attackCooldown: number;
  currentCooldown: number;
  isDead: boolean;
  wanderTimer: number;
  wanderDirection: Direction;
  fleeTimer: number;
  points: number;
  isPassive: boolean;
  respawnTimer: number;
}

export interface MapTile {
  terrain: TerrainType;
  obstacle: 'tree' | 'rock' | 'bush' | null;
  obstaclePos: Position | null;
  treeSize?: TreeSize;
}

export interface GameMap {
  width: number;
  height: number;
  tiles: MapTile[][];
}

export interface Camera {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SpriteMap {
  [key: string]: HTMLImageElement;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface DamageNumber {
  x: number;
  y: number;
  value: number;
  life: number;
  color: string;
}
