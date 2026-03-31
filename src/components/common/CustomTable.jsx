import React, { useEffect, useState } from 'react';

import prevIcon from '../../assets/images/arrow-left.svg';
import nextIcon from '../../assets/images/arrow-right.svg';
import sortUp from '../../assets/images/up.svg';
import sortDown from '../../assets/images/down.svg';
import CustomLoader from './CustomLoader';
import NoTableData from './NoTableData';

export default function CustomTable({
  data = [],
  columns = [],
  tableClasses = '',
  mainclasses = '',
  pagination: { currentPage, limit = 10 },
  onPageChange,
  onSortChange,
  reffer,
  dashboard,
  count,
  isLoading,
  setLimit,
  showLoader,
  onView,
  onRowClick,
  wrapClasses = '',
}) {
  const [tempCount, setTempCount] = useState(0);
  useEffect(() => {
    if (!isLoading) {
      setTempCount(count || 0);
    }
  }, [count, isLoading]);

  const totalPages = () => (tempCount ? Math.ceil(tempCount / limit) : 0);

  const renderPagination = () => {
    const onPrevClicked = () => {
      if (currentPage === 1) {
        return;
      }
      onPageChange(currentPage - 1);
    };
    const onNextClicked = () => {
      if (currentPage === totalPages()) {
        return;
      }
      onPageChange(currentPage + 1);
    };
    const onPageNumberClick = (index) => {
      if (currentPage === index) {
        return;
      }
      onPageChange(index);
    };
    const numbersToShow = () => {
      const pageNumbers = [];
      for (let index = 1; index <= totalPages(); index += 1) {
        const condition =
          index === 1 ||
          index === totalPages() ||
          Math.abs(currentPage - index) < 3 ||
          index === currentPage;
        if (condition) pageNumbers.push(index);
      }
      return pageNumbers;
    };

    return (
      <div className="table-footer-wrap">
        <div className="left-wrap">
          <div className="page-show">
            <span>Show</span>
            <div className="select">
              <select value={limit} onChange={(e) => setLimit(e.target.value)}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <span>Entries</span>
          </div>
        </div>
        <div className="right-wrap">
          <div className="pagination">
            <ul className="listing">
              <li
                onClick={onPrevClicked}
                className={`cursor-pointer ${currentPage === 1 ? 'cursor-not' : ''
                  }`}
              >
                <img src={prevIcon} alt="Previous" />
              </li>
              {numbersToShow()?.map((num) => (
                <React.Fragment key={`pg${num}`}>
                  {num > 1 && !numbersToShow().includes(num - 1) && (
                    <li className="link-dots"> ... </li>
                  )}
                  <li onClick={() => onPageNumberClick(num)}>
                    <a
                      className={`cursor-pointer ${num === currentPage ? 'active' : ''
                        }`}
                    >
                      {num}
                    </a>
                  </li>
                </React.Fragment>
              ))}
              <li
                onClick={onNextClicked}
                className={`cursor-pointer ${currentPage === totalPages() ? 'cursor-not' : ''
                  }`}
              >
                <img src={nextIcon} alt="Next" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <div className={`table-body-wrap ${mainclasses}`} ref={reffer}>
        <div className={`table-wrap ${wrapClasses}`}>
          <table className={`${tableClasses} table ${!data?.length && 'h-100' || ''}`}>
            {data?.length > 0 && (
              <thead>
                <tr>
                  {columns?.map(
                    ({ name, titleClasses = '', thProps, sort, selector }) => (
                      <th
                        scope="col"
                        className={titleClasses}
                        key={`head${name}`}
                        {...thProps}
                        onClick={() => sort && onSortChange(selector)}
                      >
                        {sort ? (
                          <div className="sort-wrap cursor-pointer">
                            {name}
                            <div className="sort">
                              <img src={sortUp} alt="Sort Ascending" />
                              <img src={sortDown} alt="Sort Descending" />
                            </div>
                          </div>
                        ) : (
                          name
                        )}
                      </th>
                    )
                  )}
                </tr>
              </thead>
            )}
            {showLoader && <CustomLoader columns={columns} limit={limit} />}
            {isLoading ? (
              <CustomLoader columns={columns} limit={limit} />
            ) : !data?.length ? (
              <NoTableData columns={columns} />
            ) : (
              !showLoader && (
                <tbody>
                  {data.length || dashboard
                    ? data?.map((row, index) => (
                      <tr
                        key={row.id}
                        onClick={() => onRowClick?.(row)}
                        className="cursor-pointer"
                      >
                        {columns?.map(
                          (
                            {
                              selector,
                              cell,
                              colClassName = '',
                              contentClass = '',
                              notView,
                            },
                            idx
                          ) =>
                            cell ? (
                              <td
                                className={`${colClassName}${!notView && onView ? ' cursor-pointer' : ''
                                  }`}
                                key={`cell${selector + idx}`}
                                onClick={() => {
                                  if (notView || !onView) return;
                                  onView(row);
                                }}
                              >
                                <div className={` ${contentClass}`}>
                                  {cell(row, index) || '-'}
                                </div>
                              </td>
                            ) : (
                              <td
                                className={`${colClassName}${!notView && onView ? ' cursor-pointer' : ''
                                  }`}
                                key={`cell${selector}`}
                                onClick={() => {
                                  if (notView || !onView) return;
                                  onView(row);
                                }}
                              >
                                {row[selector] || '-'}
                              </td>
                            )
                        )}
                      </tr>
                    ))
                    : !isLoading && null}
                </tbody>
              )
            )}
          </table>
        </div>
      </div>
      {/* {(totalPages() > 1 && renderPagination()) || null} */}
      {renderPagination()}
    </>
  );
}
