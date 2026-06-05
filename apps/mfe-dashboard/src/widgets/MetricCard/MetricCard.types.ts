export interface MetricCardProps {
  readonly title: string;
  readonly value: number | string;
  readonly trend?: number;
  readonly formatter?: (value: number | string) => string;
}
