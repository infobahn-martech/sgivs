import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import CustomModal from '../../components/common/CustomModal';
import useDesignationReducer from '../../stores/DesignationReducer';
import CustomSelect from './Select';
import useRoleRudcer from '../../stores/RoleReducer';

const schema = z.object({
  employee_designation: z
    .string()
    .nonempty('Designation is required')
    .max(20, 'Designation must be 20 characters or less'),
  employee_role_id: z.string().nonempty('Role is required'),
});

export function AddEditModal({ showModal, closeModal, onRefreshDesignation }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      employee_designation: '',
      employee_role_id: '',
    },
  });

  const { postData, patchData, isLoading } = useDesignationReducer((state) => state);

  // ✅ Role list API
  const { getData, roleData, isLoadingRole } = useRoleRudcer((state) => state);

  const selectedRoleId = watch('employee_role_id');

  // ✅ Load roles dynamically
  useEffect(() => {
    getData();
  }, [getData]);

  // ✅ Convert API roles to select options
  // API role object:
  // { employee_role_id: "3", employee_role: "TEST" }
  const roleOptions = useMemo(() => {
    return (roleData || []).map((item) => ({
      label: item?.employee_role,
      value: String(item?.employee_role_id),
    }));
  }, [roleData]);

  // ✅ Fill form for edit / clear for add
  useEffect(() => {
    if (showModal?.employee_designation_id) {
      // name key might be "name" or "designation_name" depending on your API
      setValue('employee_designation', showModal?.employee_designation || showModal?.designation_name || '', {
        shouldDirty: true,
        shouldValidate: true,
      });

      // role id could be in different keys depending on your list API
      // try these common ones safely
      setValue('employee_role_id', String(showModal?.employee_role_id || ''), {
        shouldDirty: true,
        shouldValidate: true,
      });
    } else {
      reset({ employee_designation: '', employee_role_id: '' });
    }
  }, [showModal, reset, setValue]);

  const onSubmit = (data) => {
    // If your backend expects employee_role_id instead of roleId, map here.
    // ✅ Change this if needed:
    const payload = {
      ...data,
      // employee_role_id: data.roleId, // <-- uncomment if API expects this
    };

    if (showModal?.employee_designation_id) {
      patchData({ employee_designation_id: showModal.employee_designation_id, ...payload }, () => {
        onRefreshDesignation?.();
        closeModal?.();
      });
    } else {
      postData(payload, () => {
        onRefreshDesignation?.();
        closeModal?.();
      });
    }
  };

  const renderHeader = () => (
    <>
      <h4 className="modal-title">
        {showModal?.employee_designation_id ? 'Edit Designation' : 'Add Designation'}
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
    <div className="modal-body">
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label htmlFor="employee_role_id" className="form-label">
              Select Role <span className="text-danger">*</span>
            </label>
            <CustomSelect
              options={roleOptions}
              value={
                roleOptions.find((opt) => opt.value === String(selectedRoleId || '')) ||
                null
              }
              onChange={(selected) => {
                setValue('employee_role_id', selected?.value || '', {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              placeholder={isLoadingRole ? 'Loading roles...' : 'Select Role'}
              isDisabled={isLoadingRole}
              showIndicator={false}
              className="form-select form-control"
            />
            {errors.employee_role_id && <span className="error">{errors.employee_role_id.message}</span>}
          </div>
        </div>

        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label htmlFor="employee_designation" className="form-label">
              Designation Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="employee_designation"
              className="form-control"
              autoComplete="off"
              placeholder="Enter designation name"
              {...register('employee_designation')}
            />
            {errors.employee_designation && <span className="error">{errors.employee_designation.message}</span>}
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
        type="button"
        className="btn btn-submit"
        disabled={isLoading}
        onClick={handleSubmit(onSubmit)}
      >
        {isLoading ? 'Loading...' : 'Save'}
      </button>
    </div>
  );

  return (
    <CustomModal
      className="modal fade category-modal show"
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