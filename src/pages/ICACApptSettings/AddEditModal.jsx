import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import useICACApptSettingsReducer from '../../stores/ICACApptSettingsReducer';
import useUserReducer from '../../stores/UserReducer';
import useAppointmentTypeReducer from '../../stores/AppointmentTypeReducer';
import CustomSelect from './Select';

// ── Static options ────────────────────────────────────────────────────────────

const applicationTypeOptions = [
  { label: 'Passport', value: '1' },
  { label: 'Visa', value: '2' },
  { label: 'OCI', value: '3' },
  { label: 'Consular', value: '4' },
];

const lunchBreakOptions = [
  { label: '13:00 - 14:00', value: '13:00:00-14:00:00' },
  { label: '12:30 - 13:30', value: '12:30:00-13:30:00' },
];

const slotPeriodOptions = [
  { label: '10 Minutes', value: '10' },
  { label: '15 Minutes', value: '15' },
  { label: '30 Minutes', value: '30' },
  { label: '1 Hour', value: '60' },
];

const WEEK_DAYS = [
  { label: 'Sun', value: '0' },
  { label: 'Mon', value: '1' },
  { label: 'Tue', value: '2' },
  { label: 'Wed', value: '3' },
  { label: 'Thu', value: '4' },
  { label: 'Fri', value: '5' },
  { label: 'Sat', value: '6' },
];

// Generate half-hour time options 07:00 to 23:00
const generateTimeOptions = () => {
  const options = [];
  for (let h = 7; h <= 23; h++) {
    ['00', '30'].forEach((m) => {
      if (h === 23 && m === '30') return;
      const label = `${String(h).padStart(2, '0')}:${m}`;
      options.push({ label, value: `${label}:00` }); // HH:MM:00 to match API
    });
  }
  return options;
};

const timeOptions = generateTimeOptions();


const nameSchema = z.object({
  countryId: z.string().nonempty('Country is required'),
  missionId: z.string().nonempty('Mission is required'),
  centerId: z.string().nonempty('Center is required'),
  applicationTypeId: z.string().nonempty('Application Type is required'),
  appointmentTypeId: z.string().nonempty('Appointment Type is required'),
  startTime: z.string().nonempty('Start Time is required'),
  endTime: z.string().nonempty('End Time is required'),
  lunchBreak: z.string().nonempty('Lunch Break is required'),
  slotPeriod: z.string().nonempty('Slot Period is required'),
  slotCapacity: z.string().nonempty('Slot Capacity is required'),
  maxSlots: z.string().nonempty('Max Slots is required'),
  allowFromDate: z.string().nonempty('Booking Allow From is required'),
  allowTillDate: z.string().nonempty('Booking Allow Till is required'),
});

export function AddEditModal({ showModal, closeModal, onRefreshICACApptSettings }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      countryId: '',
      missionId: '',
      centerId: '',
      applicationTypeId: '',
      appointmentTypeId: '',
      startTime: '',
      endTime: '',
      lunchBreak: '',
      slotPeriod: '',
      slotCapacity: '',
      maxSlots: '',
      allowFromDate: '',
      allowTillDate: '',
    },
  });

  // Off days managed outside RHF — built to comma string on submit
  const [selectedOffDays, setSelectedOffDays] = useState([]);

  const { postData, patchData, isLoading } = useICACApptSettingsReducer((state) => state);

  const {
    countryList, isLoadingCountries, getCountries,
    missionList, isLoadingMissions, getMissionsByCountry,
    centerList, isLoadingCenters, getCentersByMission,
  } = useUserReducer((state) => state);

  const {
    appointmentTypeData,
    isLoadingGet: isLoadingApptTypes,
    getData: getAppointmentTypes,
  } = useAppointmentTypeReducer((state) => state);

  const selectedCountryId = watch('countryId');
  const selectedMissionId = watch('missionId');
  const selectedCenterId = watch('centerId');
  const selectedApplicationTypeId = watch('applicationTypeId');
  const selectedAppointmentTypeId = watch('appointmentTypeId');
  const selectedStartTime = watch('startTime');
  const selectedEndTime = watch('endTime');
  const selectedLunchBreak = watch('lunchBreak');
  const selectedSlotPeriod = watch('slotPeriod');

  // ── 1. Load countries on mount ──────────────────────────────────────────────
  useEffect(() => {
    getCountries();
    getAppointmentTypes();
  }, []);

  // ── 2. Country change → reset mission + center, fetch missions ──────────────
  useEffect(() => {
    setValue('missionId', '');
    setValue('centerId', '');
    if (!selectedCountryId) return;
    getMissionsByCountry(selectedCountryId);
  }, [selectedCountryId]);

  // ── 3. Mission change → reset center, fetch centers ────────────────────────
  useEffect(() => {
    setValue('centerId', '');
    if (!selectedMissionId) return;
    getCentersByMission(selectedMissionId);
  }, [selectedMissionId]);

  // ── 4. Edit prefill (wire up once you have the row shape) ───────────────────
  useEffect(() => {
    if (!showModal?.id) {
      reset();
    }
    // TODO: prefill for edit — add here once row shape is confirmed
  }, [showModal?.id]);

  // ── Off days toggle ───────────────────────────────────────────────────────
  const toggleOffDay = (val) => {
    setSelectedOffDays((prev) =>
      prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val]
    );
  };

  // ── Options ─────────────────────────────────────────────────────────────────
  const countryOptions = useMemo(() =>
    (countryList || []).map((c) => ({ label: c.country_name, value: String(c.country_id) })),
    [countryList]
  );

  const missionOptions = useMemo(() =>
    selectedCountryId
      ? (missionList || []).map((m) => ({ label: m.mission_name, value: String(m.mission_id) }))
      : [],
    [missionList, selectedCountryId]
  );

  const centerOptions = useMemo(() =>
    selectedMissionId
      ? (centerList || []).map((c) => ({ label: c.center_name, value: String(c.center_id) }))
      : [],
    [centerList, selectedMissionId]
  );

  const appointmentTypeOptions = useMemo(() =>
    (appointmentTypeData?.data || appointmentTypeData || []).map((a) => ({
      label: a.appointment_type,
      value: String(a.appointment_type_id),
    })),
    [appointmentTypeData]
  );

  // ── Submit ───────────────────────────────────────────────────────────────────
  const onSubmit = (data) => {
    const [lunchStart, lunchEnd] = data.lunchBreak.split('-');

    const payload = {
      center_id: Number(data.centerId),
      appointment_type_id: Number(data.appointmentTypeId),
      start_time: data.startTime,
      end_time: data.endTime,
      lunch_start: lunchStart,  // "13:00:00"
      lunch_end: lunchEnd,    // "14:00:00"
      slot_period: Number(data.slotPeriod),
      applicants_per_slot: Number(data.slotCapacity),
      max_slots: Number(data.maxSlots),
      allow_from_date: data.allowFromDate,
      allow_till_date: data.allowTillDate,
      weekly_off_days: selectedOffDays.sort((a, b) => Number(a) - Number(b)).join(','),
      status: 1,
    };

    // Payload shape TBD — will wire up after confirming with you
    if (showModal?.id) {
      patchData({ id: showModal.id, ...payload }, () => {
        onRefreshICACApptSettings?.();
        closeModal?.();
      });
    } else {
      postData(payload, () => {
        onRefreshICACApptSettings?.();
        closeModal?.();
      });
    }
  };

  const renderHeader = () => (
    <>
      <h4 className="modal-title">
        {showModal?.id ? 'Edit ICAC Appintment Settings' : 'Add ICAC Appintment Settings'}
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
        {/* Country */}
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label className="form-label">
              Country <span className="text-danger">*</span>
            </label>
            <CustomSelect
              options={countryOptions}
              value={countryOptions.find((o) => o.value === selectedCountryId) || null}
              onChange={(selected) => setValue('countryId', selected?.value || '',
                {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                }
              )}
              placeholder={isLoadingCountries ? 'Loading...' : 'Select Country'}
              showIndicator={false}
              className="form-select form-control"
            />
            {errors.countryId && (
              <span className="error">{errors.countryId.message}</span>
            )}
          </div>
        </div>

        {/* Mission */}
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label className="form-label">
              Mission <span className="text-danger">*</span>
            </label>
            <CustomSelect
              options={missionOptions}
              value={missionOptions.find((o) => o.value === selectedMissionId) || null}
              onChange={(selected) => setValue('missionId', selected?.value || '',
                {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                }
              )}
              placeholder={
                !selectedCountryId
                  ? 'Select Country'
                  : isLoadingMissions
                    ? 'Loading...'
                    : 'Select Mission'
              }
              showIndicator={false}
              className="form-select form-control"
            />
            {errors.missionId && (
              <span className="error">{errors.missionId.message}</span>
            )}
          </div>
        </div>

        {/* Center */}
        <div className="col-sm-4">
          <div className="form-group forms-custom">
            <label className="form-label">
              Center <span className="text-danger">*</span>
            </label>
            <CustomSelect
              options={centerOptions}
              value={centerOptions.find((o) => o.value === selectedCenterId) || null}
              onChange={(selected) => setValue('centerId', selected?.value || '',
                {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                }
              )}
              placeholder={
                !selectedMissionId
                  ? 'Select Mission'
                  : isLoadingCenters
                    ? 'Loading...'
                    : 'Select Center'
              }
              showIndicator={false}
              className="form-select form-control"
            />
            {errors.centerId && (
              <span className="error">{errors.centerId.message}</span>
            )}
          </div>
        </div>

        {/* Application Type */}
        <div className="col-sm-4">
          <div className="form-group forms-custom">
            <label className="form-label">
              Application Type <span className="text-danger">*</span>
            </label>
            <CustomSelect
              options={applicationTypeOptions}
              value={applicationTypeOptions.find((o) => o.value === selectedApplicationTypeId) || null}
              onChange={(selected) => setValue('applicationTypeId', selected?.value || '',
                {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                }
              )}
              placeholder='Select Application Type'
              showIndicator={false}
              className="form-select form-control"
            />
            {errors.applicationTypeId && (
              <span className="error">{errors.applicationTypeId.message}</span>
            )}
          </div>
        </div>

        {/* Appointment Type */}
        <div className="col-sm-4">
          <div className="form-group forms-custom">
            <label className="form-label">
              Appointment Type <span className="text-danger">*</span>
            </label>
            <CustomSelect
              options={appointmentTypeOptions}
              value={appointmentTypeOptions.find((o) => o.value === selectedAppointmentTypeId) || null}
              onChange={(selected) => setValue('appointmentTypeId', selected?.value || '',
                {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                }
              )}
              placeholder={isLoadingApptTypes ? 'Loading...' : 'Select Appointment Type'}
              showIndicator={false}
              className="form-select form-control"
            />
            {errors.appointmentTypeId && (
              <span className="error">{errors.appointmentTypeId.message}</span>
            )}
          </div>
        </div>

        {/* Start Time */}
        <div className="col-sm-4">
          <div className="form-group forms-custom">
            <label className="form-label">Start Time <span className="text-danger">*</span></label>
            <CustomSelect
              options={timeOptions}
              value={timeOptions.find((o) => o.value === selectedStartTime) || null}
              onChange={(selected) => setValue('startTime', selected?.value || '',
                {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                }
              )}
              placeholder="Select Start Time"
              showIndicator={false}
              className="form-select form-control"
            />
            {errors.startTime && <span className="error">{errors.startTime.message}</span>}
          </div>
        </div>

        {/* End Time */}
        <div className="col-sm-4">
          <div className="form-group forms-custom">
            <label className="form-label">End Time <span className="text-danger">*</span></label>
            <CustomSelect
              options={timeOptions}
              value={timeOptions.find((o) => o.value === selectedEndTime) || null}
              onChange={(selected) => setValue('endTime', selected?.value || '',
                {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                }
              )}
              placeholder="Select End Time"
              showIndicator={false}
              className="form-select form-control"
            />
            {errors.endTime && <span className="error">{errors.endTime.message}</span>}
          </div>
        </div>

        {/* Lunch Break */}
        <div className="col-sm-4">
          <div className="form-group forms-custom">
            <label className="form-label">Lunch Break <span className="text-danger">*</span></label>
            <CustomSelect
              options={lunchBreakOptions}
              value={lunchBreakOptions.find((o) => o.value === selectedLunchBreak) || null}
              onChange={(selected) => setValue('lunchBreak', selected?.value || '',
                {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                }
              )}
              placeholder="Select Lunch Break"
              showIndicator={false}
              className="form-select form-control"
            />
            {errors.lunchBreak && <span className="error">{errors.lunchBreak.message}</span>}
          </div>
        </div>

        {/* Slot Period */}
        <div className="col-sm-4">
          <div className="form-group forms-custom">
            <label className="form-label">Slot Period <span className="text-danger">*</span></label>
            <CustomSelect
              options={slotPeriodOptions}
              value={slotPeriodOptions.find((o) => o.value === selectedSlotPeriod) || null}
              onChange={(selected) => setValue('slotPeriod', selected?.value || '',
                {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                }
              )}
              placeholder="Select Slot Period"
              showIndicator={false}
              className="form-select form-control"
            />
            {errors.slotPeriod && <span className="error">{errors.slotPeriod.message}</span>}
          </div>
        </div>

        {/* Slot Capacity */}
        <div className="col-sm-4">
          <div className="form-group forms-custom">
            <label className="form-label">Slot Capacity <span className="text-danger">*</span></label>
            <input
              type="number"
              min="1"
              className="form-control"
              placeholder="Enter slot capacity"
              {...register('slotCapacity')}
            />
            {errors.slotCapacity && <span className="error">{errors.slotCapacity.message}</span>}
          </div>
        </div>

        {/* Max Slots */}
        <div className="col-sm-4">
          <div className="form-group forms-custom">
            <label className="form-label">Max Slots <span className="text-danger">*</span></label>
            <input
              type="number"
              min="1"
              className="form-control"
              placeholder="Enter max slots"
              {...register('maxSlots')}
            />
            {errors.maxSlots && <span className="error">{errors.maxSlots.message}</span>}
          </div>
        </div>

        {/* Booking Allow From */}
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label className="form-label">Booking Allow From <span className="text-danger">*</span></label>
            <input
              type="date"
              className="form-control"
              {...register('allowFromDate')}
            />
            {errors.allowFromDate && <span className="error">{errors.allowFromDate.message}</span>}
          </div>
        </div>

        {/* Booking Allow Till */}
        <div className="col-sm-6">
          <div className="form-group forms-custom">
            <label className="form-label">Booking Allow Till <span className="text-danger">*</span></label>
            <input
              type="date"
              className="form-control"
              {...register('allowTillDate')}
            />
            {errors.allowTillDate && <span className="error">{errors.allowTillDate.message}</span>}
          </div>
        </div>

        {/* Weekly Off Days — full width */}
        <div className="col-sm-12">
          <div className="form-group forms-custom">
            <label className="form-label">Weekly Off Days</label>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '6px' }}>
              {WEEK_DAYS.map((day) => (
                <label
                  key={day.value}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'normal' }}
                >
                  <input
                    type="checkbox"
                    checked={selectedOffDays.includes(day.value)}
                    onChange={() => toggleOffDay(day.value)}
                  />
                  {day.label}
                </label>
              ))}
            </div>
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
