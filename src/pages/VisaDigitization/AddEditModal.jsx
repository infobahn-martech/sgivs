import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as XLSX from 'xlsx'
import CustomModal from '../../components/common/CustomModal';
import useAlertReducer from '../../stores/AlertReducer';
import useVisaDigitizationReducer from '../../stores/VisaDigitizationReducer';

const ACCEPTED = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

// Schema: only file is required
const fileSchema = z.object({
  file: z
    .any()
    .refine((v) => v instanceof FileList && v.length > 0, 'File is required')
    .refine(
      (v) => v?.[0]?.size <= 5 * 1024 * 1024,
      'File must be less than 5MB'
    )
    .refine(
      (v) =>
        ACCEPTED.includes(v?.[0]?.type) ||
        /\.(csv|xlsx|xls)$/i.test(v?.[0]?.name ?? ''),
      'Only CSV / Excel files allowed'
    ),
});

// ---- helpers -----------------------------------------------------------

const normalizeKey = (k) =>
  k?.toString().trim().toLowerCase().replace(/[\s-]+/g, '_');

const formatDate = (value) => {
  if (!value) return '';
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return value.toString().trim();
};

const mapRow = (row) => {
  const n = {};
  Object.keys(row).forEach((key) => {
    n[normalizeKey(key)] = row[key];
  });
  return {
    consprom_file_number: (n.consprom_file_number ?? '').toString().trim(),
    visa_number: (n.visa_number ?? '').toString().trim(),
    visa_issue_date: formatDate(n.visa_issue_date),
  };
};

const parseFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, {
          type: 'array',
          cellDates: true,
        });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        resolve(json.map(mapRow));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

export function AddEditModal({ showModal, closeModal, onRefreshVisaDigitization }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const { postData, isLoading } = useVisaDigitizationReducer((state) => state);

  // Reset on open/close or when switching edit/add
  useEffect(() => {
    if (!showModal) reset();
  }, [showModal, reset]);

  const onSubmit = async (values) => {
    const file = values?.file?.[0];
    if (!file) return;

    try {
      const rows = await parseFile(file);

      if (!rows.length) {
        const { error } = useAlertReducer.getState();
        error('The file has no rows to upload');
        return;
      }

      postData({ data: rows }, () => {
        onRefreshVisaDigitization?.();
        closeModal();
      });
    } catch (err) {
      console.error('Parse error:', err);   
      const { error } = useAlertReducer.getState();
      error('Could not read the file. Please check the format.');
    }
  };

  const renderHeader = () => (
    <>
      <h4 className="modal-title">Add Visa Digitization</h4>
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
        onClick={closeModal}
      />
    </>
  );

  const renderBody = () => (
    <div className="modal-body custom-scroll">
      <div className="row">
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="file" className="form-label">
              Upload CSV File <span className="text-danger">*</span>
            </label>
            <input
              type="file"
              id="file"
              className="form-control"
              {...register('file')}
            />
            {errors.file && (
              <span className="error">{errors.file.message}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFooter = () => (
    <div className="modal-footer bottom-btn-sec">
      <button type="button" className="btn btn-cancel" onClick={closeModal}>
        Cancel
      </button>
      <button
        type="submit"
        className="btn btn-submit"
        disabled={isLoading}
        onClick={handleSubmit(onSubmit)}
      >
        {isLoading ? 'Loading...' : 'Upload'}
      </button>
    </div>
  );

  return (
    <CustomModal
      className="modal fade category-mgmt-modal show"
      dialgName="modal-dialog-scrollable"
      show={!!showModal}
      closeModal={closeModal}
      body={renderBody()}
      header={renderHeader()}
      footer={renderFooter()}
      isLoading={false}
    />
  );
}
