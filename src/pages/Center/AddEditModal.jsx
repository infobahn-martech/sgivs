import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import useCenterReducer from '../../stores/CenterReducer';

const centerSchema = z.object({
  center_name: z
    .string()
    .trim()
    .min(1, 'Center Name is required')
    .max(100, 'Center name must be 100 characters or less'),
  country_id: z
    .union([z.string(), z.number()])
    .refine((val) => val !== '' && val != null, 'Country is required'),
  mission_id: z
    .union([z.string(), z.number()])
    .refine((val) => val !== '' && val != null, 'Mission is required'),
});

export function AddEditModal({ showModal, closeModal, onRefreshCenter }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(centerSchema),
    defaultValues: {
      center_name: '',
      country_id: '',
      mission_id: '',
    },
  });

  const countryId = watch('country_id');

  const {
    postData,
    patchData,
    isLoading,
    countryList,
    missionList,
    isLoadingCountries,
    isLoadingMissions,
    getCountries,
    getMissionsByCountry,
  } = useCenterReducer((state) => state);

  // Load countries on mount
  useEffect(() => {
    getCountries();
  }, []);

  const prevCountryIdRef = useRef(undefined);

  // When country changes: fetch missions for that country; clear mission only when user changes country
  useEffect(() => {
    if (countryId) {
      getMissionsByCountry(countryId);
    } else {
      useCenterReducer.setState({ missionList: [] });
    }
    const isInitialPrefill = showModal?.center_id && (prevCountryIdRef.current === '' || prevCountryIdRef.current === undefined);
    if (prevCountryIdRef.current !== undefined && prevCountryIdRef.current !== countryId && !isInitialPrefill) {
      setValue('mission_id', '');
    }
    prevCountryIdRef.current = countryId;
  }, [countryId]);

  // Prefill form when editing
  useEffect(() => {
    if (showModal?.center_id) {
      setValue('center_name', showModal?.center_name || '');
      setValue('country_id', showModal?.country_id ?? '');
      setValue('mission_id', showModal?.mission_id ?? '');
      if (showModal?.country_id) {
        getMissionsByCountry(showModal.country_id);
      }
    } else {
      reset();
    }
  }, [showModal?.center_id]);

  // Re-apply country_id when countryList loads (edit mode) - countries load async
  useEffect(() => {
    if (showModal?.center_id && showModal?.country_id != null && countryList?.length > 0) {
      const match = countryList.find((c) => c.country_id == showModal.country_id);
      setValue('country_id', match ? match.country_id : showModal.country_id);
    }
  }, [showModal?.center_id, showModal?.country_id, countryList]);

  // Re-apply mission_id when missionList loads (edit mode) - missions load async
  useEffect(() => {
    if (showModal?.center_id && showModal?.mission_id != null && missionList?.length > 0) {
      const match = missionList.find((m) => m.mission_id == showModal.mission_id);
      setValue('mission_id', match ? match.mission_id : showModal.mission_id);
    }
  }, [showModal?.center_id, showModal?.mission_id, missionList]);

  const onSubmit = (data) => {
    const onSuccess = () => {
      onRefreshCenter();
      closeModal();
    };
    if (showModal?.center_id) {
      patchData(
        {
          center_id: showModal.center_id,
          country_id: data.country_id || showModal?.country_id,
          mission_id: data.mission_id || showModal?.mission_id,
          center_name: data.center_name || showModal?.center_name,
        },
        onSuccess
      );
    } else {
      postData(
        {
          country_id: data.country_id,
          mission_id: data.mission_id,
          center_name: data.center_name,
        },
        onSuccess
      );
    }
  };

  const renderHeader = () => (
    <>
      <h4 className="modal-title">
        {showModal?.center_id ? 'Edit Center' : 'Add Center'}
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
              <label htmlFor="center_name" className="form-label">
                Center Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="center_name"
                className="form-control"
                autoComplete="off"
                maxLength={100}
                {...register('center_name')}
              />
              {errors.center_name && (
                <span className="error">{errors.center_name.message}</span>
              )}
            </div>
          </div>
          <div className="col-12">
            <div className="form-group">
              <label htmlFor="country_id" className="form-label">
                Country <span className="text-danger">*</span>
              </label>
              <select
                id="country_id"
                className="form-control form-select"
                {...register('country_id')}
                disabled={isLoadingCountries}
              >
                <option value="">Select Country</option>
                {countryList.map((item) => (
                  <option key={item.country_id} value={item.country_id}>
                    {item.country_name}
                  </option>
                ))}
              </select>
              {errors.country_id && (
                <span className="error">{errors.country_id.message}</span>
              )}
            </div>
          </div>
          <div className="col-12">
            <div className="form-group">
              <label htmlFor="mission_id" className="form-label">
                Mission <span className="text-danger">*</span>
              </label>
              <select
                id="mission_id"
                className="form-control form-select"
                {...register('mission_id')}
                disabled={!countryId || isLoadingMissions}
              >
                <option value="">Select Mission</option>
                {missionList.map((item) => (
                  <option key={item.mission_id} value={item.mission_id}>
                    {item.mission_name}
                  </option>
                ))}
              </select>
              {errors.mission_id && (
                <span className="error">{errors.mission_id.message}</span>
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
