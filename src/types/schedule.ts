type DetailType = KindType[];

type KindType = {
  name: string;
  staffId: number;
};

export type ScheduleType = {
  id: Date
  date: Date
  detail: DetailType[]
}

export type Schedule = {
  startDate: Date
  endDate: Date
  schedules: ScheduleType[]
}

export type ScheduleToday = {
  detail: DetailType[]
  listMaxStaff: number[]
  id: number[]
}