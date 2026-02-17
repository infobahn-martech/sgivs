import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Spinner } from 'react-bootstrap';

import '../../assets/scss/modal.scss';

import { headerConfig } from '../../config/config';
import filterImg from '../../assets/images/sort.svg';
import exportIcon from '../../assets/images/export-excel.svg';
import upload from '../../assets/images/upload-excel.svg';
import Upload__icon from '../../assets/images/Upload__icon.svg';
import addIcon from '../../assets/images/add-icon.svg';
import searchIcon from '../../assets/images/blue-search-icon.svg';
import CustomModal from './CustomModal';
import Filter from './Filter';
import BulkUpload from './BulkUpload';
import EZIcon from '../../assets/images/dashboard-5.svg';

const CommonHeader = ({
  exportExcel,
  uploadExcel,
  onExcelUpload,
  addButton,
  hideRightSide = false,
  onSearch,
  uploadTitle = '',
  exportLoading,
  hideFilter,
  filterOptions,
  submitFilter,
  clearOptions,
  uploadLoading,
  type = '',
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [openUpload, setOpenUpload] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [savedFilters, setSavedFilters] = useState({});
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  // const [showFilterModal, setShowFilterModal] = useState(false);

  const filterRef = useRef(null);
  const filterContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        !event.target.closest('.react-select__menu') &&
        !event.target.closest('.react-select__clear-indicator') &&
        !filterContainerRef.current.contains(event.target)
      ) {
        setShowFilterModal(false);
      }
    };

    if (showFilterModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterModal]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    onSearch(value); // Pass value to parent component after delay
  };
  useEffect(() => {
    if (!uploadLoading && openUpload) {
      setOpenUpload(false);
    }
  }, [uploadLoading]);

  const location = useLocation();

  const currentPath = location.pathname;

  const headerInfo = headerConfig?.find(
    (item) =>
      currentPath === item.path ||
      (currentPath !== '/' &&
        currentPath?.startsWith(item.path) &&
        item.path !== '/')
  ) ||
    headerConfig.find((item) => currentPath?.startsWith(item.path)) || {
    title: 'Page Not Found',
    icon: EZIcon,
  };

  const renderAddButton = (type) => {
    switch (type) {
      case 'link':
        return (
          <Link to={addButton.path} className="btn add">
            <img src={addIcon} alt="" className="img" />{' '}
            <span>{addButton?.name}</span>
          </Link>
        );
      case 'button':
        return (
          <a type="button" className="btn add" onClick={addButton?.action}>
            <img src={addIcon} alt="" className="img" />{' '}
            <span>{addButton?.name}</span>
          </a>
        );
      default:
        return (
          <button
            type="button"
            className="btn export"
            onClick={addButton.action}
          >
            <img src={addIcon} alt="" className="img" /> {addButton?.name}
          </button>
        );
    }
  };

  const handleSubmitFilter = (filters) => {
    setSavedFilters(filters); // Persist applied filters
    setIsFilterApplied(true);
    setShowFilterModal(false); // Close modal
    console.log('first2222');
    submitFilter(filters); // existing logic
  };

  const handleClearOptions = () => {
    setSavedFilters({}); // Clear applied filters
    setIsFilterApplied(false);
    clearOptions(); // existing logic
  };

  return (
    <>
      <div className="table-header-wrap">
        {headerInfo.path !== '/' ? (
          <div className="left-wrap">
            <div className="icon-title">
              <img src={headerInfo?.icon} alt="" className="img" />
              <span>{headerInfo?.title}</span>
            </div>
          </div>
        ) : (
          <div className="cta-info-blk p-0">
            <div className="board-info">
              <div className="icon-blk">
                <img src={headerInfo?.icon} alt="" />
              </div>
              <span className="txt">{headerInfo?.title}</span>
            </div>
          </div>
        )}
        {!hideRightSide && (
          <div className="right-wrap">
            <div className="search-wrap">
              <input
                type="text"
                className="txt"
                placeholder="Search"
                value={searchInput}
                onChange={handleSearchChange}
              />
              <button className="btn">
                <img src={searchIcon} alt="" />
              </button>
            </div>
            {!hideFilter && (
              <div className="filter-wrap dropdown" ref={filterContainerRef}>
                <a
                  className="dropdown-toggle h-100 align-items-center "
                  role="button"
                  onClick={() => setShowFilterModal((prev) => !prev)}
                >
                  <span>
                    Filter{' '}
                    {isFilterApplied && (
                      <small className="text-danger dots">●</small>
                    )}
                  </span>
                  <img src={filterImg} alt="" className="img" />
                </a>
                {showFilterModal && (
                  <Filter
                    clearOptions={handleClearOptions}
                    filterOptions={filterOptions}
                    submitFilter={handleSubmitFilter}
                    savedFilters={savedFilters}
                    isFilterApplied={isFilterApplied}
                    onCancel={() => setShowFilterModal(false)}
                    show={showFilterModal}
                    ref={filterRef}
                  />
                )}
              </div>
            )}

            <div className="button-wrap">
              {exportExcel && (
                <button
                  type="button"
                  className="btn export"
                  onClick={exportExcel}
                  disabled={exportLoading}
                >
                  {!exportLoading && (
                    <img src={exportIcon} alt="" className="img" />
                  )}
                  <span>
                    {exportLoading ? (
                      <Spinner
                        size="sm"
                        as="span"
                        animation="border"
                        variant="light"
                        aria-hidden="true"
                        className="custom-spinner"
                      />
                    ) : (
                      'Export as Excel'
                    )}
                  </span>
                </button>
              )}

              {uploadExcel && (
                <>
                  {/* <input
                    type="file"
                    ref={fileInputRef}
                    accept=".xlsx, .xls"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  /> */}
                  <button
                    type="button"
                    className="btn upload"
                    onClick={() => setOpenUpload(true)}
                  >
                    <img src={upload} alt="" className="img" />{' '}
                    <span>Upload Excel</span>
                  </button>
                </>
              )}
              {addButton && renderAddButton(addButton?.type)}
            </div>
          </div>
        )}
      </div>

      {openUpload && (
        <BulkUpload
          show={openUpload}
          onClose={() => setOpenUpload(false)}
          uploadTitle={uploadTitle}
          onExcelUpload={onExcelUpload}
          type={type}
          uploadLoading={uploadLoading}
        />
      )}
    </>
  );
};

export default CommonHeader;
