import React, { useState, useEffect } from 'react';
import calIcon from '../../assets/images/calend-icon.svg';
import CustomDateRange from './DateRangePicker';
import moment from 'moment';
import CommonSelect from './CommonSelect';
import useCounterReducer from '../../stores/CounterReducer';

const Filter = ({
  filterOptions,
  clearOptions,
  submitFilter,
  show,
  onCancel,
  savedFilters = {},
  isFilterApplied,
  ref
}) => {
  const getInitialFilters = () => {
    if (Object.keys(savedFilters).length) return savedFilters;

    return filterOptions?.reduce((acc, option) => {
      if (option.defaultValue) {
        acc[option.BE_keyName] = option.defaultValue.value;
      }
      return acc;
    }, {});
  };

  const [filters, setFilters] = useState(getInitialFilters());
  const [hasValidFilter, setHasValidFilter] = useState(false);

  const checkValidFilter = (filtersObj) => {
    return Object?.values(filtersObj)?.some(
      (val) =>
        (Array.isArray(val) && val.length > 0) ||
        (typeof val === 'string' && val.trim() !== '') ||
        typeof val === 'boolean' ||
        val instanceof Date ||
        val
    );
  };

  useEffect(() => {
    if (show) {
      setFilters(getInitialFilters());
    }
  }, [show]);

  useEffect(() => {
    setHasValidFilter(checkValidFilter(filters));
  }, [filters]);

  const handleInputChange = (fieldName, value, isDate = false) => {
    if (isDate) {
      value = moment(value).format('YYYY-MM-DD');
    }
    setFilters((prevFilters) => ({
      ...prevFilters,
      [fieldName]: value,
    }));
  };

  const handleFilterChange = (fieldName, value, fieldType) => {
    let updatedValue = value;

    if (fieldType === 'radio') {
      updatedValue = value === 'Yes'; // Convert "Yes" to true
    }

    setFilters((prev) => ({ ...prev, [fieldName]: updatedValue }));
  };

  const { clearSubCategoryData } = useCounterReducer((state) => state);

  const clearFilters = () => {
    const cleared = {};
    // clearCounterData();
    filterOptions.forEach((option) => {
      if (!option) return;

      if (option.fieldType === 'dateRangeCombined') {
        cleared[option.fromKey] = '';
        cleared[option.toKey] = '';
      } else if (option.fieldType === 'dateRange') {
        cleared[`${option.BE_keyName}_start`] = '';
        cleared[`${option.BE_keyName}_end`] = '';
      } else if (option.BE_keyName) {
        cleared[option.BE_keyName] = '';
      }
    });

    setFilters(cleared);
    clearOptions();
  };

  const cancelFilter = () => {
    onCancel();
    clearSubCategoryData();
    isFilterApplied && clearFilters();
  };

  return (
    <div
      className={`dropdown-menu dropdown-menu-end filter-dropdown ${show ? 'show' : ''
        }`}
      ref={ref}
    >
      <div className="drop-title">Filter By</div>
      <div className="drp-cont">
        {filterOptions
          ?.filter(
            (option) =>
              option &&
              option.fieldType &&
              (option.BE_keyName || option.fieldType === 'dateRangeCombined')
          )
          ?.map((option, idx) => (
            <div className="row" key={option.BE_keyName || idx}>
              <label className="col-sm-3 col-form-label">
                {option.fieldName}:
              </label>
              <div className="col-sm-9">
                {option.fieldType === 'search' && (
                  <input
                    type="text"
                    className="form-control"
                    placeholder={option.placeholder}
                    value={filters[option.BE_keyName] || ''}
                    onChange={(e) =>
                      handleInputChange(option.BE_keyName, e.target.value)
                    }
                  />
                )}

                {option.fieldType === 'select' && (
                  <CommonSelect
                    className="form-select form-control"
                    classNamePrefix="react-select"
                    options={option.Options}
                    value={
                      filters[option?.BE_keyName] || (option.isMulti ? [] : '')
                    }
                    noOptionsMessage={option.noOptionsMessage}
                    isMulti={option.isMulti}
                    isLoading={option.isLoading}
                    onChange={(selected) => {
                      if (option.callBack) {
                        option.callBack(selected?.value);
                      }
                      const value = option.isMulti
                        ? selected?.map((item) => item.value)
                        : selected?.value;
                      handleFilterChange(option.BE_keyName, value);
                    }}
                  />
                )}

                {option.fieldType === 'radio' && (
                  <div className="radio-wrps row">
                    <div className="col-sm-9 d-flex align-items-center">
                      {option.Options?.map((val) => (
                        <div className="form-check form-check-inline" key={val}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name={option.BE_keyName}
                            id={val}
                            value={val}
                            checked={
                              filters[option.BE_keyName] === (val === 'Yes')
                            }
                            onChange={() =>
                              handleFilterChange(
                                option.BE_keyName,
                                val,
                                'radio'
                              )
                            }
                          />
                          <label className="form-check-label" htmlFor={val}>
                            {val}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {option.fieldType === 'dateRange' && (
                  <div className="field-mask">
                    <CustomDateRange
                      key={
                        (filters[`${option.BE_keyName}_start`] || '') +
                        '_' +
                        (filters[`${option.BE_keyName}_end`] || '')
                      }
                      className="form-control w-100"
                      value={[
                        filters[`${option.BE_keyName}_start`]
                          ? new Date(filters[`${option.BE_keyName}_start`])
                          : null,
                        filters[`${option.BE_keyName}_end`]
                          ? new Date(filters[`${option.BE_keyName}_end`])
                          : null,
                      ]}
                      onChange={({ startDate, endDate }) =>
                        setFilters((prev) => ({
                          ...prev,
                          [`${option.BE_keyName}_start`]: startDate,
                          [`${option.BE_keyName}_end`]: endDate,
                        }))
                      }
                    />
                    <span className="calendar-icon">
                      <img src={calIcon} alt="calendar icon" />
                    </span>
                  </div>
                )}

                {option.fieldType === 'dateRangeCombined' && (
                  <div className="field-mask">
                    <CustomDateRange
                      key={
                        (filters[option.fromKey] || '') +
                        '_' +
                        (filters[option.toKey] || '')
                      }
                      className="form-control w-100"
                      value={[
                        filters[option.fromKey]
                          ? new Date(filters[option.fromKey])
                          : null,
                        filters[option.toKey]
                          ? new Date(filters[option.toKey])
                          : null,
                      ]}
                      onChange={({ startDate, endDate }) =>
                        setFilters((prev) => ({
                          ...prev,
                          [option.fromKey]: startDate,
                          [option.toKey]: endDate,
                        }))
                      }
                    />
                    <span className="calendar-icon">
                      <img src={calIcon} alt="calendar icon" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
      <div className="filter-ftr">
        <button className="btn clr" onClick={clearFilters}>
          Clear All Filters
        </button>
        <div className="grp-btn">
          <button className="btn btn-Cancel" onClick={cancelFilter}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={!hasValidFilter}
            onClick={() => {
              if (hasValidFilter) {
                submitFilter(filters);
              }
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
