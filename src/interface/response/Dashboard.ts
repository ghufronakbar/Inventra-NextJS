export interface Dashboard {
  count: CountIncomeOutcomeGroup;
  groupByCategory: GroupByCategory;
  countProductByCategory: CountProductByCategory[];
  chart: ChartData;
}

export interface CountIncomeOutcomeGroup {
  annually: CountIncomeOutcome;
  monthly: CountIncomeOutcome;
}

// BENTO GRID 1 2
export interface CountIncomeOutcome {
  income: number;
  outcome: number;
}

export const initCountIncomeOutcome: CountIncomeOutcome = {
  income: 0,
  outcome: 0,
};

export interface GroupByCategory {
  inTransaction: DetailTransaction[];
  outTransaction: DetailTransaction[];
}

// BENTO GRID 3 4 (BAR CHART)
export interface DetailTransaction {
  id: string;
  name: string;
  countTransaction: number;
  amountTransaction: number;
  totalTransaction: number;
}

// BENTO GRID 5 (PIE CHART)
export interface CountProductByCategory {
  id: string;
  name: string;
  _count: CountProduct;
}

export interface CountProduct {
  products: number;
}

// BENTO GRID 6
export interface ChartData {
  inTransaction: DetailChart[];
  outTransaction: DetailChart[];
}

export const initChartData: ChartData = {
  inTransaction: [],
  outTransaction: [],
};

export interface DetailChart {
  date: string;
  monthName: string;
  amount: number;
  total: number;
}
