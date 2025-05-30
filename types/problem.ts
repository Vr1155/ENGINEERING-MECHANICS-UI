export interface Point {
  name: string;
  x: number;
  y: number;
}

export interface Force {
  point: string;
  dir: "up" | "down" | "left" | "right";
  mag: number;
  preset?: boolean;
}

export interface RigidBody {
  name: string;
  isGround: boolean;
  image?: string; // fallback: procedurally draw SVG arc
  points: Point[];
  forces: Force[]; // external forces only
}

export interface ProblemShapeData {
  bodies: RigidBody[];
  symbols: Record<string, number>;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  data: ProblemShapeData;
}