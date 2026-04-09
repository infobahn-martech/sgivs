import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import useRoleRudcer from '../../stores/RoleReducer';

const roleSchema = z.object({
  employee_role: z
    .string()
    .trim()
    .min(1, 'Employee role is required')
    .max(20, 'Employee role must be 20 characters or less'),
});

export function AddEditModal({ showModal, closeModal, onRefreshRole }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      employee_role: '',
    },
  });

  const { postData, patchData, isLoading } = useRoleRudcer(
    (state) => state
  );

  // Prefill form when editing
  useEffect(() => {
    if (showModal?.employee_role_id) {
      setValue('employee_role', showModal?.employee_role || '');
    } else {
      reset();
    }
  }, [showModal?.employee_role_id]);

  const onSubmit = (data) => {
    debugger
    const onSuccess = () => {
      onRefreshRole();
      closeModal();
    };
    if (showModal?.employee_role_id) {
      patchData({ employee_role_id: showModal?.employee_role_id, employee_role: data?.employee_role }, onSuccess);
    } else {
      postData({ employee_role: data.employee_role }, onSuccess);
    }
  };

  const renderHeader = () => (
    <>
      <h4 className="modal-title">
        {showModal?.employee_role_id ? 'Edit Role' : 'Add Role'}
      </h4>
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
    <>
      <div className="modal-body custom-scroll">
        <div className="row">
          <div className="col-12">
            <div className="form-group">
              <label htmlFor="employee_role" className="form-label">
                Employee Role<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="employee_role"
                className="form-control"
                autoComplete="off"
                {...register('employee_role')}
              />
              {errors.employee_role && (
                <span className="error">{errors.employee_role.message}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderFooter = () => (
    <>
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
          {isLoading ? 'Loading...' : 'Save'}
        </button>
      </div>
    </>
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
