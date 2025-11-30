export interface StrategyParameter {
  name: string;
  type: 'number' | 'boolean' | 'string';
  default: any;
  min?: number;
  max?: number;
  description: string;
}

export interface StrategyMetadata {
  id: string;
  name: string;
  description: string;
  parameters: StrategyParameter[];
  create: (params: any) => any;
}

export interface StrategyRegistry {
  [key: string]: StrategyMetadata;
}
