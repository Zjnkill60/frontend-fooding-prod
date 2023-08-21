import React from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker, Select, Space } from 'antd';
dayjs.extend(customParseFormat);

const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
};

const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day');
};
const disabledDateTime = () => ({
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
});



const CalendarOrder = (prop) => {
    const { setValueSelectTime, setValueCalendar } = prop
    const handleChange = (value) => {
        setValueSelectTime(value)
        console.log(`selected ${value}`);
    };

    const onChangeDate = (date, value) => {
        setValueCalendar(value)
    }
    return (
        <div style={{ margin: '20px 0 0 35px' }}>
            <Space>
                <DatePicker

                    onChange={onChangeDate}
                    placeholder='Chọn thời gian'
                    locale='vi'
                    format="YYYY-MM-DD "
                    disabledDate={disabledDate}
                    disabledTime={disabledDateTime}

                />

                <Select
                    placeholder="Chọn giờ "
                    style={{
                        width: 150,
                    }}
                    onChange={handleChange}
                    options={[
                        {
                            value: 'Sáng (8h-12h)',
                            label: 'Sáng (8h-12h)',
                        },
                        {
                            value: 'Chiều (15h-20h)',
                            label: 'Chiều (15h-20h)',
                        }

                    ]}
                />
            </Space>


        </div>
    )
}
export default CalendarOrder