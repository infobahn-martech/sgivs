/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import Select, { components } from 'react-select';
import { Tooltip } from 'react-tooltip';

function CustomSelect({
  showIndicator,
  options = [],
  className,
  classNamePrefix,
  value,
  onChange,
  placeholder = 'Select...',
  isLoading,
  maxheight,
  position = 'auto',
  ...rest
}) {
  const { isMulti } = { ...rest };

  // Handle change and pass correct value to parent
  const handleChange = (selectedOption) => {
    onChange(isMulti ? selectedOption?.map((opt) => opt) : selectedOption);
  };

  // Custom Option component with tooltip for truncated labels
  const CustomOption = (props) => {
    const { data } = props;
    const labelRef = useRef(null);
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
      if (labelRef.current) {
        setIsTruncated(
          labelRef.current.offsetWidth < labelRef.current.scrollWidth
        );
      }
    }, [data.label]);

    return (
      <components.Option {...props}>
        <div
          ref={labelRef}
          data-tooltip-id={`tooltip-${data.value}`}
          data-tooltip-content={isTruncated ? data.label : ''}
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {data.label}
        </div>
        {isTruncated && <Tooltip id={`tooltip-${data.value}`} place="top" />}
      </components.Option>
    );
  };

  return (
    <Select
      menuPlacement={position}
      maxMenuHeight={maxheight}
      isLoading={isLoading}
      classNamePrefix={classNamePrefix}
      value={value}
      onChange={handleChange}
      className={`${className} ${
        isMulti ? 'multiple-select' : ''
      } react-select-container p-1`}
      placeholder={placeholder}
      options={options}
      isClearable
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 })
      }}
      menuPortalTarget={document.body}
      components={{
        ...(!showIndicator && {
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }),
        Option: CustomOption,
      }}
      {...rest}
    />
  );
}

export default CustomSelect;
