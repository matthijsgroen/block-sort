export const createAnimationPath = (
  source: DOMRect,
  target: DOMRect,
  sourceColumnTop: number,
  targetColumnTop: number
): string => {
  return pathBuilder()
    .move(20, 0) // start from middle of block
    .vertical(sourceColumnTop - source.y) // go to top of source column
    .vertical(Math.min(0, targetColumnTop - sourceColumnTop))
    .cubicBezier([0, -50], [target.x - source.x, -50], [target.x - source.x, 0]) // horizontal to target column
    .vertical(Math.max(0, targetColumnTop - sourceColumnTop))
    .vertical(target.y - targetColumnTop)
    .build();
};

type PathElement =
  // Move to
  | `M${number},${number}`
  // Vertical line
  | `v${number}`
  // Horizontal line
  | `h${number}`
  // Cubic bezier curve
  | `c${number},${number} ${number},${number} ${number},${number}`
  // Close path
  | `Z`;

export const pathBuilder = () => {
  const path: PathElement[] = [];

  const api = {
    move: (x: number, y: number) => {
      path.push(`M${x},${y}`);
      return api;
    },
    vertical: (distance: number) => {
      if (distance !== 0) {
        path.push(`v${distance}`);
      }
      return api;
    },
    horizontal: (distance: number) => {
      if (distance !== 0) {
        path.push(`h${distance}`);
      }
      return api;
    },
    cubicBezier: (
      point1: [number, number],
      point2: [number, number],
      point3: [number, number]
    ) => {
      path.push(
        `c${point1[0]},${point1[1]} ${point2[0]},${point2[1]} ${point3[0]},${point3[1]}`
      );
      return api;
    },
    close: () => {
      path.push(`Z`);
      return api;
    },
    build: () => path.join("")
  };
  return api;
};
