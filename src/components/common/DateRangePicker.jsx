import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangePicker = ({ className, onChange, value }) => {
  const [startDate, endDate] = value || [null, null];

  return (
    <DatePicker
      selected={startDate}
      onChange={(update) => {
        const [start, end] = update;
        onChange({ startDate: start, endDate: end });
      }}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      showYearDropdown
      showMonthDropdown
      showTwoColumnMonthYearPicker
      // portalId='root-portal'
      className={className}
      placeholderText="Select date range"
    />
  );
};

export default DateRangePicker;
