import {
  Hunter,
  Animal,
  AnimalType,
  AnimalState,
  Direction,
  GameMap,
  TerrainType,
} from './types';

const TILE_SIZE = 48;

export function createHunter(x: number, y: number): Hunter {
  return {
    pos: { x, y },
    width: 36,
    height: 36,
    direction: Direction.DOWN,
    speed: 180,
    health: 100,
    maxHealth: 100,
    isAttacking: false,
    attackCooldown: 0,
    attackRange: 60,
    attackDamage: 25,
    score: 0,
    capturedAnimals: 0,
    invincibleTimer: 0,
  };
}

export function createAnimal(type: AnimalType, x: number, y: number): Animal {
  const base = {
    pos: { x, y },
    direction: Direction.DOWN,
    state: AnimalState.WANDER,
    isDead: false,
    wanderTimer: Math.random() * 3,
    wanderDirection: Direction.DOWN,
    fleeTimer: 0,
    currentCooldown: 0,
    respawnTimer: 0,
  };

  switch (type) {
    case AnimalType.RABBIT:
      return {
        ...base,
        type,
        width: 24,
        height: 24,
        speed: 240,
        health: 20,
        maxHealth: 20,
        damage: 0,
        detectionRange: 120,
        attackRange: 0,
        attackCooldown: 0,
        points: 10,
        isPassive: true,
      };
    case AnimalType.DEER:
      return {
        ...base,
        type,
        width: 32,
        height: 32,
        speed: 210,
        health: 40,
        maxHealth: 40,
        damage: 0,
        detectionRange: 150,
        attackRange: 0,
        attackCooldown: 0,
        points: 25,
        isPassive: true,
      };
    case AnimalType.BOAR:
      return {
        ...base,
        type,
        width: 34,
        height: 34,
        speed: 150,
        health: 60,
        maxHealth: 60,
        damage: 15,
        detectionRange: 100,
        attackRange: 40,
        attackCooldown: 1.5,
        points: 40,
        isPassive: false,
      };
    case AnimalType.WOLF:
      return {
        ...base,
        type,
        width: 30,
        height: 30,
        speed: 228,
        health: 50,
        maxHealth: 50,
        damage: 20,
        detectionRange: 200,
        attackRange: 40,
        attackCooldown: 1.0,
        points: 50,
        isPassive: false,
      };
    case AnimalType.BEAR:
      return {
        ...base,
        type,
        width: 40,
        height: 40,
        speed: 120,
        health: 100,
        maxHealth: 100,
        damage: 30,
        detectionRange: 160,
        attackRange: 45,
        attackCooldown: 1.5,
        points: 75,
        isPassive: false,
      };
  }
}

function isWalkableTile(map: GameMap, tx: number, ty: number): boolean {
  if (tx < 0 || tx >= map.width || ty < 0 || ty >= map.height) return false;
  const tile = map.tiles[ty][tx];
  if (tile.terrain === TerrainType.WATER) return false;
  if (tile.obstacle === 'tree' || tile.obstacle === 'rock') return false;
  return true;
}

export function spawnAnimals(map: GameMap, count: number = 25): Animal[] {
  const animals: Animal[] = [];
  const types = [
    AnimalType.RABBIT,
    AnimalType.RABBIT,
    AnimalType.DEER,
    AnimalType.DEER,
    AnimalType.BOAR,
    AnimalType.WOLF,
    AnimalType.BEAR,
  ];

  let attempts = 0;
  while (animals.length < count && attempts < 1000) {
    attempts++;
    const tx = Math.floor(Math.random() * map.width);
    const ty = Math.floor(Math.random() * map.height);

    if (!isWalkableTile(map, tx, ty)) continue;

    // Don't spawn too close to center (hunter start)
    const centerX = map.width / 2;
    const centerY = map.height / 2;
    const dist = Math.sqrt((tx - centerX) ** 2 + (ty - centerY) ** 2);
    if (dist < 8) continue;

    const type = types[Math.floor(Math.random() * types.length)];
    const animal = createAnimal(type, tx * TILE_SIZE, ty * TILE_SIZE);
    animals.push(animal);
  }

  return animals;
}

export function findWalkablePosition(
  map: GameMap,
  farFromX: number,
  farFromY: number,
  minDistance: number = 400
): { x: number; y: number } | null {
  let attempts = 0;
  while (attempts < 200) {
    attempts++;
    const tx = Math.floor(Math.random() * map.width);
    const ty = Math.floor(Math.random() * map.height);

    if (!isWalkableTile(map, tx, ty)) continue;

    const px = tx * TILE_SIZE;
    const py = ty * TILE_SIZE;
    const dist = Math.sqrt((px - farFromX) ** 2 + (py - farFromY) ** 2);

    if (dist >= minDistance) {
      return { x: px, y: py };
    }
  }
  return null;
}
