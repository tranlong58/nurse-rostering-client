import { Column } from '@/types'

class TableColumns {
    static get STAFF_COLUMNS(): Column[] {
        return [
            {
                name: 'id',
                label: 'ID',
                width: '30%'
            },
            {
                name: 'name',
                label: 'Name',
                width: '30%'
            },
            {
                name: 'blank',
                label: 'Action',
                width: '40%',
            }
        ]
    }

    static get SHIFT_COLUMNS(): Column[] {
        return [
            {
                name: 'id',
                label: 'ID',
                width: '20%'
            },
            {
                name: 'day',
                label: 'Day',
                width: '20%'
            },
            {
                name: 'kind',
                label: 'Kind',
                width: '20%'
            },
            {
                name: 'numberOfStaff',
                label: 'Number of staff',
                width: '20%'
            },
            {
                name: 'blank',
                label: 'Action',
                width: '20%',
            }
        ]
    }

    static get SCHEDULE_COLUMNS(): Column[] {
        return [
            {
                name: 'date',
                label: 'Date',
                width: '20%'
            },
            {
                name: 'detail',
                label: 'Detail',
                width: '80%'
            }
        ]
    }

    static get SCHEDULE_TODAY_COLUMNS(): Column[] {
        return [
            {
                name: 'kind',
                label: 'Kind',
                width: '20%'
            },
            {
                name: 'staff',
                label: 'Staff',
                width: '60%'
            },
            {
                name: 'total',
                label: 'Total',
                width: '20%'
            },
        ]
    }

    static get HISTORY_COLUMNS(): Column[] {
        return [
            {
                name: 'id',
                label: 'ID',
                width: '20%'
            },
            {
                name: 'start',
                label: 'Start date',
                width: '30%'
            },
            {
                name: 'end',
                label: 'End date',
                width: '30%'
            },
            {
                name: 'blank',
                label: 'Action',
                width: '20%'
            }
        ]
    }

    static get STATISTIC_COLUMNS(): Column[] {
        return [
            {
                name: 'staff',
                label: 'Staff',
                width: '30%'
            },
            {
                name: 'completed',
                label: 'Completed',
                width: '35%'
            },
            {
                name: 'total',
                label: 'Total',
                width: '35%'
            },
        ]
    }
}

export default TableColumns