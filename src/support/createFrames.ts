export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const shiftRect = (
  rect: Rect,
  deltaX: number,
  deltaY: number
): Rect => ({
  x: rect.x + deltaX,
  y: rect.y + deltaY,
  width: rect.width,
  height: rect.height
});

export const createFrames = (
  source: Rect,
  target: Rect,
  sourceColumnTop: number,
  targetColumnTop: number
): Keyframe[] => {
  let totalDistance = 0;
  const position = { x: 0, y: 0 };
  const frames: Keyframe[] = [];

  const move = (deltaX: number, deltaY: number) => {
    if (deltaX === 0 && deltaY === 0) {
      return;
    }
    totalDistance += Math.abs(deltaY) + Math.abs(deltaX);
    frames.push({
      transform: `translate(${position.x + deltaX}px, ${position.y + deltaY}px)`,
      offset: totalDistance
    });
    position.x += deltaX;
    position.y += deltaY;
  };

  move(0, sourceColumnTop - source.y);
  move(0, Math.min(0, targetColumnTop - sourceColumnTop));
  // This could be more of a curve
  const xDistance = target.x - source.x;

  move(xDistance * 0.2, -20);
  move(xDistance * 0.3, -10);
  move(xDistance * 0.3, 10);
  move(xDistance * 0.2, 20);

  move(0, Math.max(0, targetColumnTop - sourceColumnTop));
  move(0, target.y - targetColumnTop);

  // update offsets
  frames.forEach((frame) => {
    frame.offset! /= totalDistance;
  });

  return frames;
};
