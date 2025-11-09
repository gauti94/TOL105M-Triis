export class Input {
    constructor(piece, landedPieces = []) {
        this.piece = piece;
        this.landedPieces = landedPieces;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (!this.piece) return;
            switch (event.key) {
                case 'ArrowLeft':
                    this.piece.moveLeft(this.landedPieces);
                    break;
                case 'ArrowRight':
                    this.piece.moveRight(this.landedPieces);
                    break;
                case 'ArrowDown':
                    this.piece.moveBackward(this.landedPieces);
                    break;
                case 'ArrowUp':
                    this.piece.moveForward(this.landedPieces);
                    break;
                case 'a':
                    this.piece.rotateZ(1, this.landedPieces);
                    break;
                case 'z':
                    this.piece.rotateZ(-1, this.landedPieces);
                    break;
                case 's':
                    this.piece.rotateY(1, this.landedPieces);
                    break;
                case 'x':
                    this.piece.rotateY(-1, this.landedPieces);
                    break;
                case 'd':
                    this.piece.rotateX(1, this.landedPieces);
                    break;
                case 'c':
                    this.piece.rotateX(-1, this.landedPieces);
                    break;
                case ' ':
                    this.piece.drop(this.landedPieces);
                    break;
            }
        });
    }

    setPiece(piece, landedPieces = []) {
        this.piece = piece;
        this.landedPieces = landedPieces;
    }
}