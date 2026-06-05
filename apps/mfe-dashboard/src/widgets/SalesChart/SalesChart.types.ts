import type { SalesRange } from '../../api/dashboardClient.types';

export interface SalesChartProps {
  readonly range: SalesRange;
  readonly onRangeChange: (range: SalesRange) => void;
}
