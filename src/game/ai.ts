import {
  Animal,
  Hunter,
  GameMap,
  Direction,
  AnimalState,
  TerrainType,
} from './types';

const TILE_SIZE = 48;

function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function isTileBlockedForAnimal(
  map: GameMap,
  tx: number,
  ty: number,
  canSwim: boolean
): boolean {
  if (tx < 0 || tx >= map.width || ty < 0 || ty >= map.height) return true;
  const tile = map.tiles[ty][tx];
  if (tile.terrain === TerrainType.WATER && !canSwim) return true;
  if (tile.obstacle === 'tree' || tile.obstacle === 'rock') return true;
  return false;
}

function canAnimalMoveTo(
  map: GameMap,
  x: number,
  y: number,
  width: number,
  height: number,
  canSwim: boolean
): boolean {
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
    if (isTileBlockedForAnimal(map, tx, ty, canSwim)) {
      return false;
    }
  }
  return true;
}

function getDirectionToward(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): Direction {
  const dx = toX - fromX;
  const dy = toY - fromY;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? Direction.RIGHT : Direction.LEFT;
  } else {
    return dy > 0 ? Direction.DOWN : Direction.UP;
  }
}

function getDirectionAway(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): Direction {
  const dx = fromX - toX;
  const dy = fromY - toY;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? Direction.RIGHT : Direction.LEFT;
  } else {
    return dy > 0 ? Direction.DOWN : Direction.UP;
  }
}

function directionToVector(dir: Direction): { dx: number; dy: number } {
  switch (dir) {
    case Direction.UP:
      return { dx: 0, dy: -1 };
    case Direction.DOWN:
      return { dx: 0, dy: 1 };
    case Direction.LEFT:
      return { dx: -1, dy: 0 };
    case Direction.RIGHT:
      return { dx: 1, dy: 0 };
  }
}

export function updateAnimalAI(
  animal: Animal,
  hunter: Hunter,
  map: GameMap,
  deltaTime: number
): void {
  if (animal.isDead) {
    animal.respawnTimer -= deltaTime;
    return;
  }

  const dist = distance(
    animal.pos.x,
    animal.pos.y,
    hunter.pos.x,
    hunter.pos.y
  );

  const canSwim = animal.type === 'wolf' || animal.type === 'bear';

  // Update cooldown
  if (animal.currentCooldown > 0) {
    animal.currentCooldown -= deltaTime;
  }

  // State transitions based on animal type
  if (animal.isPassive) {
    // Passive animals: flee when hunter is close
    if (dist < animal.detectionRange) {
      animal.state = AnimalState.FLEE;
      animal.fleeTimer = 3;
    } else if (animal.state === AnimalState.FLEE) {
      animal.fleeTimer -= deltaTime;
      if (animal.fleeTimer <= 0) {
        animal.state = AnimalState.WANDER;
      }
    }
  } else if (animal.type === 'boar') {
    // Boar: semi-aggressive, only chase when very close
    if (dist < 100) {
      if (dist < animal.attackRange) {
        animal.state = AnimalState.ATTACK;
      } else {
        animal.state = AnimalState.CHASE;
      }
    } else if (dist < animal.detectionRange) {
      animal.state = AnimalState.FLEE;
      animal.fleeTimer = 2;
    } else if (animal.state === AnimalState.FLEE) {
      animal.fleeTimer -= deltaTime;
      if (animal.fleeTimer <= 0) {
        animal.state = AnimalState.WANDER;
      }
    } else if (animal.state === AnimalState.CHASE || animal.state === AnimalState.ATTACK) {
      if (dist > animal.detectionRange * 2) {
        animal.state = AnimalState.WANDER;
      }
    }
  } else {
    // Aggressive animals (wolf, bear): chase when hunter is detected
    if (dist < animal.attackRange) {
      animal.state = AnimalState.ATTACK;
    } else if (dist < animal.detectionRange) {
      animal.state = AnimalState.CHASE;
    } else if (
      animal.state === AnimalState.CHASE ||
      animal.state === AnimalState.ATTACK
    ) {
      if (dist > animal.detectionRange * 2) {
        animal.state = AnimalState.WANDER;
      }
    }
  }

  // Handle movement based on state
  let moveDir: Direction | null = null;
  let speedMult = 1;

  switch (animal.state) {
    case AnimalState.WANDER: {
      animal.wanderTimer -= deltaTime;
      if (animal.wanderTimer <= 0) {
        // Pick new action
        const roll = Math.random();
        if (roll < 0.2) {
          animal.state = AnimalState.IDLE;
          animal.wanderTimer = 1 + Math.random() * 2;
        } else {
          animal.wanderDirection = [
            Direction.UP,
            Direction.DOWN,
            Direction.LEFT,
            Direction.RIGHT,
          ][Math.floor(Math.random() * 4)] as Direction;
          animal.wanderTimer = 2 + Math.random() * 3;
        }
      }
      if (animal.state === AnimalState.WANDER) {
        moveDir = animal.wanderDirection;
        speedMult = 0.5;
      }
      break;
    }
    case AnimalState.IDLE: {
      animal.wanderTimer -= deltaTime;
      if (animal.wanderTimer <= 0) {
        animal.state = AnimalState.WANDER;
        animal.wanderTimer = 1 + Math.random() * 2;
      }
      break;
    }
    case AnimalState.FLEE: {
      moveDir = getDirectionAway(
        animal.pos.x,
        animal.pos.y,
        hunter.pos.x,
        hunter.pos.y
      );
      speedMult = 1.5;
      break;
    }
    case AnimalState.CHASE: {
      moveDir = getDirectionToward(
        animal.pos.x,
        animal.pos.y,
        hunter.pos.x,
        hunter.pos.y
      );
      speedMult = 1.2;
      break;
    }
    case AnimalState.ATTACK: {
      // Face the hunter
      animal.direction = getDirectionToward(
        animal.pos.x,
        animal.pos.y,
        hunter.pos.x,
        hunter.pos.y
      );
      // Attack if cooldown is ready
      if (animal.currentCooldown <= 0 && animal.damage > 0) {
        if (dist < animal.attackRange) {
          animal.currentCooldown = animal.attackCooldown;
          // Damage will be applied in engine
        } else {
          // Move toward hunter
          moveDir = getDirectionToward(
            animal.pos.x,
            animal.pos.y,
            hunter.pos.x,
            hunter.pos.y
          );
        }
      }
      break;
    }
  }

  if (moveDir) {
    animal.direction = moveDir;
    const vec = directionToVector(moveDir);
    const speed = animal.speed * speedMult * deltaTime;
    const newX = animal.pos.x + vec.dx * speed;
    const newY = animal.pos.y + vec.dy * speed;

    if (canAnimalMoveTo(map, newX, newY, animal.width, animal.height, canSwim)) {
      animal.pos.x = newX;
      animal.pos.y = newY;
    } else {
      // Try moving on just one axis
      if (canAnimalMoveTo(map, newX, animal.pos.y, animal.width, animal.height, canSwim)) {
        animal.pos.x = newX;
      } else if (canAnimalMoveTo(map, animal.pos.x, newY, animal.width, animal.height, canSwim)) {
        animal.pos.y = newY;
      } else {
        // Change wander direction if stuck
        if (animal.state === AnimalState.WANDER) {
          animal.wanderDirection = [
            Direction.UP,
            Direction.DOWN,
            Direction.LEFT,
            Direction.RIGHT,
          ][Math.floor(Math.random() * 4)] as Direction;
          animal.wanderTimer = 1 + Math.random() * 2;
        }
      }
    }
  }

  // Clamp to map bounds
  const mapPixelW = map.width * TILE_SIZE;
  const mapPixelH = map.height * TILE_SIZE;
  animal.pos.x = Math.max(animal.width / 2, Math.min(mapPixelW - animal.width / 2, animal.pos.x));
  animal.pos.y = Math.max(animal.height / 2, Math.min(mapPixelH - animal.height / 2, animal.pos.y));
}

export function shouldAnimalAttack(animal: Animal, hunter: Hunter): boolean {
  if (animal.isDead || animal.damage <= 0) return false;
  if (animal.currentCooldown > 0) return false;
  if (animal.state !== AnimalState.ATTACK) return false;

  const dist = distance(
    animal.pos.x,
    animal.pos.y,
    hunter.pos.x,
    hunter.pos.y
  );
  return dist < animal.attackRange;
}
