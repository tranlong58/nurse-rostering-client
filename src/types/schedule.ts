type DetailType = KindType[];

type KindType = {
  name: string;
  staffId: number;
};

export type Schedule = {
    id: Date
    date: Date
    detail: DetailType[]
}