export const createAnimationPath = (
  source: DOMRect,
  target: DOMRect,
  sourceColumnTop: number,
  targetColumnTop: number
): string => {
  if (sourceColumnTop < targetColumnTop) {
    // target is below source

    return pathBuilder()
      .move(20, 0) // start from middle of block
      .vertical(sourceColumnTop - source.y) // go to top of source column
      .cubicBezier(
        [0, -50],
        [target.x - source.x, -50],
        [target.x - source.x, 0]
      ) // horizontal to target column
      .vertical(targetColumnTop - sourceColumnTop)
      .vertical(target.y - targetColumnTop)
      .build();
  }
  if (sourceColumnTop > targetColumnTop) {
    // target is above source

    return pathBuilder()
      .move(20, 0) // start from middle of block
      .vertical(sourceColumnTop - source.y) // go to top of source column
      .vertical(targetColumnTop - sourceColumnTop)
      .cubicBezier(
        [0, -50],
        [target.x - source.x, -50],
        [target.x - source.x, 0]
      ) // horizontal to target column
      .vertical(target.y - targetColumnTop)
      .build();
  }
  // Same level

  return pathBuilder()
    .move(20, 0) // start from middle of block
    .vertical(sourceColumnTop - source.y)
    .cubicBezier([0, -50], [target.x - source.x, -50], [target.x - source.x, 0])
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
      path.push(`v${distance}`);
      return api;
    },
    horizontal: (distance: number) => {
      path.push(`h${distance}`);
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
