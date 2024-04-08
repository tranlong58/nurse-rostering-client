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
}

export default TableColumns