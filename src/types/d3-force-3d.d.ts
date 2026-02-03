/**
 * Type definitions for d3-force-3d
 *
 * d3-force-3d is a 3D version of D3's force layout simulation
 * https://github.com/vasturiano/d3-force-3d
 */

declare module 'd3-force-3d' {
  export interface SimulationNode {
    index?: number;
    x?: number;
    y?: number;
    z?: number;
    vx?: number;
    vy?: number;
    vz?: number;
    fx?: number | null;
    fy?: number | null;
    fz?: number | null;
    [key: string]: any;
  }

  export interface SimulationLink<NodeType extends SimulationNode> {
    source: NodeType | string | number;
    target: NodeType | string | number;
    index?: number;
    [key: string]: any;
  }

  export interface Simulation<NodeType extends SimulationNode = SimulationNode> {
    restart(): this;
    stop(): this;
    tick(iterations?: number): this;
    nodes(): NodeType[];
    nodes(nodes: NodeType[]): this;
    alpha(): number;
    alpha(alpha: number): this;
    alphaMin(): number;
    alphaMin(min: number): this;
    alphaDecay(): number;
    alphaDecay(decay: number): this;
    alphaTarget(): number;
    alphaTarget(target: number): this;
    velocityDecay(): number;
    velocityDecay(decay: number): this;
    force(name: string): Force<NodeType> | undefined;
    force(name: string, force: Force<NodeType> | null): this;
    find(x: number, y: number, z: number, radius?: number): NodeType | undefined;
    on(typenames: string): ((...args: any[]) => void) | undefined;
    on(typenames: string, listener: ((...args: any[]) => void) | null): this;
  }

  export interface Force<NodeType extends SimulationNode = SimulationNode> {
    (alpha: number): void;
    initialize?(nodes: NodeType[]): void;
  }

  export interface ForceLink<
    NodeType extends SimulationNode = SimulationNode,
    LinkType extends SimulationLink<NodeType> = SimulationLink<NodeType>
  > extends Force<NodeType> {
    links(): LinkType[];
    links(links: LinkType[]): this;
    id(): (node: NodeType, index: number, nodes: NodeType[]) => string | number;
    id(id: (node: NodeType, index: number, nodes: NodeType[]) => string | number): this;
    distance(): number | ((link: LinkType, index: number, links: LinkType[]) => number);
    distance(distance: number | ((link: LinkType, index: number, links: LinkType[]) => number)): this;
    strength(): number | ((link: LinkType, index: number, links: LinkType[]) => number);
    strength(strength: number | ((link: LinkType, index: number, links: LinkType[]) => number)): this;
    iterations(): number;
    iterations(iterations: number): this;
  }

  export interface ForceManyBody<NodeType extends SimulationNode = SimulationNode> extends Force<NodeType> {
    strength(): number | ((node: NodeType, index: number, nodes: NodeType[]) => number);
    strength(strength: number | ((node: NodeType, index: number, nodes: NodeType[]) => number)): this;
    theta(): number;
    theta(theta: number): this;
    distanceMin(): number;
    distanceMin(distance: number): this;
    distanceMax(): number;
    distanceMax(distance: number): this;
  }

  export interface ForceCenter<NodeType extends SimulationNode = SimulationNode> extends Force<NodeType> {
    x(): number;
    x(x: number): this;
    y(): number;
    y(y: number): this;
    z(): number;
    z(z: number): this;
    strength(): number;
    strength(strength: number): this;
  }

  export interface ForceCollide<NodeType extends SimulationNode = SimulationNode> extends Force<NodeType> {
    radius(): number | ((node: NodeType, index: number, nodes: NodeType[]) => number);
    radius(radius: number | ((node: NodeType, index: number, nodes: NodeType[]) => number)): this;
    strength(): number;
    strength(strength: number): this;
    iterations(): number;
    iterations(iterations: number): this;
  }

  export interface ForceX<NodeType extends SimulationNode = SimulationNode> extends Force<NodeType> {
    strength(): number | ((node: NodeType, index: number, nodes: NodeType[]) => number);
    strength(strength: number | ((node: NodeType, index: number, nodes: NodeType[]) => number)): this;
    x(): number | ((node: NodeType, index: number, nodes: NodeType[]) => number);
    x(x: number | ((node: NodeType, index: number, nodes: NodeType[]) => number)): this;
  }

  export interface ForceY<NodeType extends SimulationNode = SimulationNode> extends Force<NodeType> {
    strength(): number | ((node: NodeType, index: number, nodes: NodeType[]) => number);
    strength(strength: number | ((node: NodeType, index: number, nodes: NodeType[]) => number)): this;
    y(): number | ((node: NodeType, index: number, nodes: NodeType[]) => number);
    y(y: number | ((node: NodeType, index: number, nodes: NodeType[]) => number)): this;
  }

  export interface ForceZ<NodeType extends SimulationNode = SimulationNode> extends Force<NodeType> {
    strength(): number | ((node: NodeType, index: number, nodes: NodeType[]) => number);
    strength(strength: number | ((node: NodeType, index: number, nodes: NodeType[]) => number)): this;
    z(): number | ((node: NodeType, index: number, nodes: NodeType[]) => number);
    z(z: number | ((node: NodeType, index: number, nodes: NodeType[]) => number)): this;
  }

  export function forceSimulation<NodeType extends SimulationNode = SimulationNode>(
    nodes?: NodeType[]
  ): Simulation<NodeType>;

  export function forceLink<
    NodeType extends SimulationNode = SimulationNode,
    LinkType extends SimulationLink<NodeType> = SimulationLink<NodeType>
  >(links?: LinkType[]): ForceLink<NodeType, LinkType>;

  export function forceManyBody<NodeType extends SimulationNode = SimulationNode>(): ForceManyBody<NodeType>;

  export function forceCenter<NodeType extends SimulationNode = SimulationNode>(
    x?: number,
    y?: number,
    z?: number
  ): ForceCenter<NodeType>;

  export function forceCollide<NodeType extends SimulationNode = SimulationNode>(
    radius?: number | ((node: NodeType, index: number, nodes: NodeType[]) => number)
  ): ForceCollide<NodeType>;

  export function forceX<NodeType extends SimulationNode = SimulationNode>(
    x?: number | ((node: NodeType, index: number, nodes: NodeType[]) => number)
  ): ForceX<NodeType>;

  export function forceY<NodeType extends SimulationNode = SimulationNode>(
    y?: number | ((node: NodeType, index: number, nodes: NodeType[]) => number)
  ): ForceY<NodeType>;

  export function forceZ<NodeType extends SimulationNode = SimulationNode>(
    z?: number | ((node: NodeType, index: number, nodes: NodeType[]) => number)
  ): ForceZ<NodeType>;
}
