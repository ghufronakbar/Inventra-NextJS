export interface Filter {
  search: string;
  dateStart?: string;
  dateEnd?: string;
  option?: string;
}

export const initFilter: Filter = {
  search: "",
};
