import * as THREE from "three";

export class GamePiece {
  constructor(position = { x: 0, y: 0, z: 0 }, color = 0xffffff) {
    this.group = new THREE.Group();
    this.pivot = new THREE.Group();
    this.group.add(this.pivot);
    this.color = color;
    this.createIPiece();
    this.group.position.set(position.x, position.y, position.z);
    this.rotationSteps = { x: 0, y: 0, z: 0 };
  }

  static getRandomColor() {
    const colors = [0xff0000, 0xffffff, 0x0000ff];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  createIPiece() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: this.color });
    for (let i = -1; i <= 1; i++) {
      const IPiece = new THREE.Mesh(geometry, material);
      IPiece.position.set(0, i, 0);
      const edges = new THREE.EdgesGeometry(geometry);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
      const wireframe = new THREE.LineSegments(edges, lineMaterial);
      IPiece.add(wireframe);
      this.pivot.add(IPiece);
    }
    this.pivot.position.set(0.5, 1.5, 0.5);
  }

  getBounds() {
    this.group.updateMatrixWorld(true);
    return new THREE.Box3().setFromObject(this.group);
  }

  isWithinBounds(bounds) {
    const EPS = 1e-5;
    const MAX_X = 6,
      MAX_Y = 20,
      MAX_Z = 6;
    return (
      bounds.min.x >= -EPS &&
      bounds.max.x <= MAX_X + EPS &&
      bounds.min.y >= -EPS &&
      bounds.max.y <= MAX_Y + EPS &&
      bounds.min.z >= -EPS &&
      bounds.max.z <= MAX_Z + EPS
    );
  }

  collisionWithPieces(landedPieces) {
    const myBounds = this.getBounds();
    const MARGIN = 0.01;
    const checkBounds = myBounds.clone();
    checkBounds.min.x += MARGIN;
    checkBounds.min.y += MARGIN;
    checkBounds.min.z += MARGIN;
    checkBounds.max.x -= MARGIN;
    checkBounds.max.y -= MARGIN;
    checkBounds.max.z -= MARGIN;
    for (let piece of landedPieces) {
      const otherBounds = piece.getBounds();
      if (checkBounds.intersectsBox(otherBounds)) {
        return true;
      }
    }
    return false;
  }

  tryMove(dx, dy, dz, landedPieces = []) {
    this.group.position.x += dx;
    this.group.position.y += dy;
    this.group.position.z += dz;

    const bounds = this.getBounds();
    const valid =
      this.isWithinBounds(bounds) && !this.collisionWithPieces(landedPieces);
    if (!valid) {
      this.group.position.x -= dx;
      this.group.position.y -= dy;
      this.group.position.z -= dz;
    }
    return valid;
  }
  tryRotate(axis, direction = 1, landedPieces = []) {
    const prev = this.rotationSteps[axis];
    this.rotationSteps[axis] = (prev + direction + 4) % 4;

    this.pivot.rotation.x = (this.rotationSteps.x * Math.PI) / 2;
    this.pivot.rotation.y = (this.rotationSteps.y * Math.PI) / 2;
    this.pivot.rotation.z = (this.rotationSteps.z * Math.PI) / 2;

    const bounds = this.getBounds();
    const valid =
      this.isWithinBounds(bounds) && !this.collisionWithPieces(landedPieces);

    if (!valid) {
      this.rotationSteps[axis] = prev;
      this.pivot.rotation.x = (this.rotationSteps.x * Math.PI) / 2;
      this.pivot.rotation.y = (this.rotationSteps.y * Math.PI) / 2;
      this.pivot.rotation.z = (this.rotationSteps.z * Math.PI) / 2;
    }

    return valid;
  }

  fall(distance = 1, landedPieces = []) {
    this.tryMove(0, -distance, 0, landedPieces);
  }
  hasLanded(landedPieces = []) {
    const bounds = this.getBounds();
    const EPS = 1e-5;
    if (bounds.min.y <= 0 + EPS) {
      return true;
    }
    this.group.position.y -= 0.01;
    const willCollide = this.collisionWithPieces(landedPieces);
    this.group.position.y += 0.01;
    return willCollide;
  }

  moveLeft(landedPieces = []) {
    this.tryMove(-1, 0, 0, landedPieces);
  }
  moveRight(landedPieces = []) {
    this.tryMove(1, 0, 0, landedPieces);
  }
  moveForward(landedPieces = []) {
    this.tryMove(0, 0, -1, landedPieces);
  }
  moveBackward(landedPieces = []) {
    this.tryMove(0, 0, 1, landedPieces);
  }
  drop(landedPieces = []) {
    while (this.tryMove(0, -0.1, 0, landedPieces)) {}
    // const bounds = this.getBounds();
    // const dy = bounds.min.y;
    // if (dy > 0) this.tryMove(0, -dy, 0, landedPieces);
  }
  rotateX(direction = 1, landedPieces = []) {
    this.tryRotate("x", direction, landedPieces);
  }
  rotateY(direction = 1, landedPieces = []) {
    this.tryRotate("y", direction, landedPieces);
  }
  rotateZ(direction = 1, landedPieces = []) {
    this.tryRotate("z", direction, landedPieces);
  }
  addToScene(scene) {
    scene.add(this.group);
  }

  removeFromScene(scene) {
    scene.remove(this.group);
  }
}
