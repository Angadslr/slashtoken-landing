"use client";

import { type CSSProperties, useEffect, useRef } from "react";

class Gradient {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly z: number,
  ) {}

  dot2(x: number, y: number) {
    return this.x * x + this.y * y;
  }
}

class PerlinNoise {
  private readonly gradients = [
    new Gradient(1, 1, 0),
    new Gradient(-1, 1, 0),
    new Gradient(1, -1, 0),
    new Gradient(-1, -1, 0),
    new Gradient(1, 0, 1),
    new Gradient(-1, 0, 1),
    new Gradient(1, 0, -1),
    new Gradient(-1, 0, -1),
    new Gradient(0, 1, 1),
    new Gradient(0, -1, 1),
    new Gradient(0, 1, -1),
    new Gradient(0, -1, -1),
  ];

  private readonly source = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
    140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148,
    247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
    57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
    74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122,
    60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54,
    65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169,
    200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3,
    64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85,
    212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170,
    213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43,
    172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185,
    112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191,
    179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31,
    181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150,
    254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195,
    78, 66, 215, 61, 156, 180,
  ];

  private readonly permutations = new Array<number>(512);
  private readonly gradientPermutations = new Array<Gradient>(512);

  constructor(seed: number) {
    let normalizedSeed = seed > 0 && seed < 1 ? seed * 65536 : seed;
    normalizedSeed = Math.floor(normalizedSeed);
    if (normalizedSeed < 256) normalizedSeed |= normalizedSeed << 8;

    for (let index = 0; index < 256; index += 1) {
      const value =
        index & 1
          ? this.source[index] ^ (normalizedSeed & 255)
          : this.source[index] ^ ((normalizedSeed >> 8) & 255);
      this.permutations[index] = this.permutations[index + 256] = value;
      this.gradientPermutations[index] =
        this.gradientPermutations[index + 256] = this.gradients[value % 12];
    }
  }

  private fade(value: number) {
    return value * value * value * (value * (value * 6 - 15) + 10);
  }

  private lerp(start: number, end: number, amount: number) {
    return (1 - amount) * start + amount * end;
  }

  perlin2(xInput: number, yInput: number) {
    let xFloor = Math.floor(xInput);
    let yFloor = Math.floor(yInput);
    const x = xInput - xFloor;
    const y = yInput - yFloor;
    xFloor &= 255;
    yFloor &= 255;

    const lowerLeft = this.gradientPermutations[xFloor + this.permutations[yFloor]].dot2(x, y);
    const upperLeft = this.gradientPermutations[xFloor + this.permutations[yFloor + 1]].dot2(x, y - 1);
    const lowerRight = this.gradientPermutations[xFloor + 1 + this.permutations[yFloor]].dot2(x - 1, y);
    const upperRight = this.gradientPermutations[xFloor + 1 + this.permutations[yFloor + 1]].dot2(x - 1, y - 1);
    const fadeX = this.fade(x);

    return this.lerp(
      this.lerp(lowerLeft, lowerRight, fadeX),
      this.lerp(upperLeft, upperRight, fadeX),
      this.fade(y),
    );
  }
}

interface WavePoint {
  x: number;
  y: number;
  wave: { x: number; y: number };
  cursor: { x: number; y: number; velocityX: number; velocityY: number };
}

interface PointerState {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  smoothX: number;
  smoothY: number;
  smoothVelocity: number;
  angle: number;
  initialized: boolean;
}

export interface InteractiveWavesBackgroundProps {
  lineColor?: string;
  backgroundColor?: string;
  waveSpeedX?: number;
  waveSpeedY?: number;
  waveAmpX?: number;
  waveAmpY?: number;
  xGap?: number;
  yGap?: number;
  friction?: number;
  tension?: number;
  maxCursorMove?: number;
  className?: string;
  style?: CSSProperties;
}

export function InteractiveWavesBackground({
  lineColor = "rgba(199, 255, 159, 0.42)",
  backgroundColor = "transparent",
  waveSpeedX = 0.0125,
  waveSpeedY = 0.005,
  waveAmpX = 32,
  waveAmpY = 16,
  xGap = 13,
  yGap = 36,
  friction = 0.925,
  tension = 0.005,
  maxCursorMove = 72,
  className = "",
  style = {},
}: InteractiveWavesBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!container || !canvas || !context) return;

    const noise = new PerlinNoise(1729);
    let lines: WavePoint[][] = [];
    let frameId: number | null = null;
    let width = 0;
    let height = 0;
    let left = 0;
    let top = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer: PointerState = {
      x: -10,
      y: 0,
      previousX: 0,
      previousY: 0,
      smoothX: 0,
      smoothY: 0,
      smoothVelocity: 0,
      angle: 0,
      initialized: false,
    };

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      left = bounds.left;
      top = bounds.top;
      canvas.width = Math.max(1, Math.floor(width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(height * pixelRatio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const overflowWidth = width + 200;
      const overflowHeight = height + 40;
      const lineCount = Math.ceil(overflowWidth / xGap);
      const pointCount = Math.ceil(overflowHeight / yGap);
      const xStart = (width - xGap * lineCount) / 2;
      const yStart = (height - yGap * pointCount) / 2;

      lines = Array.from({ length: lineCount + 1 }, (_, lineIndex) =>
        Array.from({ length: pointCount + 1 }, (_, pointIndex) => ({
          x: xStart + xGap * lineIndex,
          y: yStart + yGap * pointIndex,
          wave: { x: 0, y: 0 },
          cursor: { x: 0, y: 0, velocityX: 0, velocityY: 0 },
        })),
      );
    };

    const updatePointer = (clientX: number, clientY: number) => {
      pointer.x = clientX - left;
      pointer.y = clientY - top;
      if (!pointer.initialized) {
        pointer.smoothX = pointer.previousX = pointer.x;
        pointer.smoothY = pointer.previousY = pointer.y;
        pointer.initialized = true;
      }
    };

    const onPointerMove = (event: PointerEvent) => updatePointer(event.clientX, event.clientY);

    const draw = (time: number) => {
      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.08;
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.08;
      const deltaX = pointer.x - pointer.previousX;
      const deltaY = pointer.y - pointer.previousY;
      const velocity = Math.hypot(deltaX, deltaY);
      pointer.smoothVelocity += (velocity - pointer.smoothVelocity) * 0.08;
      pointer.smoothVelocity = Math.min(80, pointer.smoothVelocity);
      pointer.previousX = pointer.x;
      pointer.previousY = pointer.y;
      pointer.angle = Math.atan2(deltaY, deltaX);

      for (const points of lines) {
        for (const point of points) {
          const movement =
            noise.perlin2(
              (point.x + time * waveSpeedX) * 0.002,
              (point.y + time * waveSpeedY) * 0.0015,
            ) * 12;
          point.wave.x = Math.cos(movement) * waveAmpX;
          point.wave.y = Math.sin(movement) * waveAmpY;

          if (!reducedMotion) {
            const distanceX = point.x - pointer.smoothX;
            const distanceY = point.y - pointer.smoothY;
            const distance = Math.hypot(distanceX, distanceY);
            const influenceRadius = Math.max(150, pointer.smoothVelocity);

            if (distance < influenceRadius) {
              const strength = 1 - distance / influenceRadius;
              const force = Math.cos(distance * 0.001) * strength;
              point.cursor.velocityX +=
                Math.cos(pointer.angle) * force * influenceRadius * pointer.smoothVelocity * 0.00045;
              point.cursor.velocityY +=
                Math.sin(pointer.angle) * force * influenceRadius * pointer.smoothVelocity * 0.00045;
            }

            point.cursor.velocityX += -point.cursor.x * tension;
            point.cursor.velocityY += -point.cursor.y * tension;
            point.cursor.velocityX *= friction;
            point.cursor.velocityY *= friction;
            point.cursor.x = Math.max(
              -maxCursorMove,
              Math.min(maxCursorMove, point.cursor.x + point.cursor.velocityX * 2),
            );
            point.cursor.y = Math.max(
              -maxCursorMove,
              Math.min(maxCursorMove, point.cursor.y + point.cursor.velocityY * 2),
            );
          }
        }
      }

      context.clearRect(0, 0, width, height);
      context.beginPath();
      context.strokeStyle = lineColor;
      context.lineWidth = 1;

      for (const points of lines) {
        points.forEach((point, index) => {
          const isLast = index === points.length - 1;
          const x = point.x + point.wave.x + (isLast ? 0 : point.cursor.x);
          const y = point.y + point.wave.y + (isLast ? 0 : point.cursor.y);
          if (index === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        });
      }
      context.stroke();

      if (!reducedMotion) frameId = window.requestAnimationFrame(draw);
    };

    resize();
    draw(0);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [friction, lineColor, maxCursorMove, tension, waveAmpX, waveAmpY, waveSpeedX, waveSpeedY, xGap, yGap]);

  return (
    <div
      ref={containerRef}
      className={`interactive-waves ${className}`}
      style={{ backgroundColor, ...style }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
