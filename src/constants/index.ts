class Consts {
    static get KIND(): { [key: string]: number } {
        return {
            'Morning': 0,
            'Afternoon': 1,
            'Evening': 2,
            'Night': 3
        }
    }

    static get DAY(): { [key: string]: number } {
        return {
            'Monday': 0,
            'Tuesday': 1,
            'Wednesday': 2,
            'Thursday': 3,
            'Friday': 4,
            'Saturday': 5,
            'Sunday': 6,
        }
    }

    static get KIND_OPTIONS() {
        return [
            {
                value: 0,
                label: 'Morning',
            },
            {
                value: 1,
                label: 'Afternoon',
            },
            {
                value: 2,
                label: 'Evening',
            },
            {
                value: 3,
                label: 'Night',
            },
        ]
    }

    static get DAY_OPTIONS() {
        return [
            {
                value: 0,
                label: 'Monday',
            },
            {
                value: 1,
                label: 'Tuesday',
            },
            {
                value: 2,
                label: 'Wednesday',
            },
            {
                value: 3,
                label: 'Thursday',
            },
            {
                value: 4,
                label: 'Friday',
            },
            {
                value: 5,
                label: 'Saturday',
            },
            {
                value: 6,
                label: 'Sunday',
            },
        ]
    }
}

export default Consts