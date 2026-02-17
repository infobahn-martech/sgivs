import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import CustomModal from '../../components/common/CustomModal';
import CustomSelect from '../../components/common/CustomSelect';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const USE_MOCK = true;

/** ✅ Date Range Picker (inline component for easy copy-paste) */
const DateRangePicker = ({ className, onChange, value }) => {
    const startDate = value?.startDate || null;
    const endDate = value?.endDate || null;

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
            portalId="root-portal"
            className={className}
            placeholderText="Select date range"
            dateFormat="yyyy-MM-dd"
            isClearable
        />
    );
};

/** ✅ MOCK OPTIONS */
const mockCountries = [
    { id: '1', name: 'UAE' },
    { id: '2', name: 'India' },
    { id: '3', name: 'USA' },
];

const mockMissions = [
    { id: '1', name: 'Abu Dhabi Mission' },
    { id: '2', name: 'Dubai Mission' },
];

const mockCenters = [
    { id: '1', name: 'Dubai Center' },
    { id: '2', name: 'Abu Dhabi Center' },
    { id: '3', name: 'Sharjah Center' },
    { id: '4', name: 'Ajman Center' },
];

const mockApplicationTypes = [
    { id: '1', name: 'New' },
    { id: '2', name: 'Renewal' },
];

const mockAppointmentTypes = [
    { id: '1', name: 'Normal' },
    { id: '2', name: 'Urgent' },
];

const mockOffDays = [
    { id: 'SAT', name: 'Saturday' },
    { id: 'SUN', name: 'Sunday' },
    { id: 'MON', name: 'Monday' },
    { id: 'TUE', name: 'Tuesday' },
    { id: 'WED', name: 'Wednesday' },
    { id: 'THU', name: 'Thursday' },
    { id: 'FRI', name: 'Friday' },
];

const mockSlotPeriods = [
    { id: '10', name: '10 Minutes' },
    { id: '15', name: '15 Minutes' },
    { id: '20', name: '20 Minutes' },
    { id: '30', name: '30 Minutes' },
];

const mockSlotCapacity = [
    { id: '1', name: '1' },
    { id: '2', name: '2' },
    { id: '3', name: '3' },
    { id: '5', name: '5' },
    { id: '10', name: '10' },
];

const mockMaxSlots = [
    { id: '10', name: '10' },
    { id: '20', name: '20' },
    { id: '30', name: '30' },
    { id: '50', name: '50' },
    { id: '100', name: '100' },
];

/** ✅ Lunch Break options (single select) */
const mockLunchBreak = [
    { id: '0', name: 'No Lunch Break' },
    { id: '30', name: '30 Minutes' },
    { id: '45', name: '45 Minutes' },
    { id: '60', name: '60 Minutes' },
];

/** ✅ Date-range schema helper */
const dateRangeSchema = z.object({
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
});

const formSchema = z.object({
    countryId: z.string().nonempty('Country is required'),
    missionId: z.string().nonempty('Mission is required'),
    centerId: z.string().nonempty('Center is required'),
    applicationTypeId: z.string().nonempty('Application Type is required'),
    appointmentTypeId: z.string().nonempty('Appointment Type is required'),

    offDays: z.array(z.string()).optional(),

    startTime: z.string().nonempty('Start time is required'),
    endTime: z.string().nonempty('End time is required'),

    lunchBreak: z.string().optional(), // '0' | '30' | '45' | '60'

    slotPeriod: z.string().nonempty('Slot period is required'),
    slotCapacity: z.string().nonempty('Slot capacity is required'),
    maxSlots: z.string().nonempty('Max slots is required'),

    bookingAllowFrom: z.string().nonempty('Booking allow from is required'),
    bookingAllowTill: z.string().nonempty('Booking allow till is required'),

    /** ✅ NEW: date range picker values */
    blockedDates: dateRangeSchema.optional(),
    releaseDates: dateRangeSchema.optional(),
    slotFullDates: dateRangeSchema.optional(),
});

export default function AddEditAppointmentSettingsModal({
    showModal,
    closeModal,
    onRefreshAppointmentSettings,
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch,
        control,
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            countryId: '',
            missionId: '',
            centerId: '',
            applicationTypeId: '',
            appointmentTypeId: '',
            offDays: [],

            startTime: '',
            endTime: '',

            lunchBreak: '0',

            slotPeriod: '',
            slotCapacity: '',
            maxSlots: '',

            bookingAllowFrom: '',
            bookingAllowTill: '',

            blockedDates: { startDate: null, endDate: null },
            releaseDates: { startDate: null, endDate: null },
            slotFullDates: { startDate: null, endDate: null },
        },
    });

    // ✅ Fill form for edit / clear for add (MOCK)
    useEffect(() => {
        if (showModal?.id) {
            // Map edit values here (example):
            // setValue('countryId', String(showModal.countryId || ''));
            // setValue('lunchBreak', String(showModal.lunchBreak ?? '0'));
            // setValue('blockedDates', { startDate: new Date(showModal.blockedStart), endDate: new Date(showModal.blockedEnd) });
        } else {
            reset();
        }
    }, [showModal?.id, reset, setValue, showModal]);

    /** ✅ OPTIONS MAPPING */
    const countryOptions = useMemo(
        () => (USE_MOCK ? mockCountries : []).map((x) => ({ label: x.name, value: String(x.id) })),
        []
    );

    const missionOptions = useMemo(
        () => (USE_MOCK ? mockMissions : []).map((x) => ({ label: x.name, value: String(x.id) })),
        []
    );

    const centerOptions = useMemo(
        () => (USE_MOCK ? mockCenters : []).map((x) => ({ label: x.name, value: String(x.id) })),
        []
    );

    const applicationTypeOptions = useMemo(
        () =>
            (USE_MOCK ? mockApplicationTypes : []).map((x) => ({
                label: x.name,
                value: String(x.id),
            })),
        []
    );

    const appointmentTypeOptions = useMemo(
        () =>
            (USE_MOCK ? mockAppointmentTypes : []).map((x) => ({
                label: x.name,
                value: String(x.id),
            })),
        []
    );

    const offDaysOptions = useMemo(
        () => (USE_MOCK ? mockOffDays : []).map((x) => ({ label: x.name, value: String(x.id) })),
        []
    );

    const slotPeriodOptions = useMemo(
        () => (USE_MOCK ? mockSlotPeriods : []).map((x) => ({ label: x.name, value: String(x.id) })),
        []
    );

    const slotCapacityOptions = useMemo(
        () => (USE_MOCK ? mockSlotCapacity : []).map((x) => ({ label: x.name, value: String(x.id) })),
        []
    );

    const maxSlotsOptions = useMemo(
        () => (USE_MOCK ? mockMaxSlots : []).map((x) => ({ label: x.name, value: String(x.id) })),
        []
    );

    const lunchBreakOptions = useMemo(
        () => (USE_MOCK ? mockLunchBreak : []).map((x) => ({ label: x.name, value: String(x.id) })),
        []
    );

    /** ✅ Helper: convert Date -> yyyy-mm-dd */
    const toYMD = (date) => {
        if (!date) return null;
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    // ✅ Submit (MOCK)
    const onSubmit = (data) => {
        const payload = {
            ...data,
            blockedDates: {
                startDate: toYMD(data.blockedDates?.startDate),
                endDate: toYMD(data.blockedDates?.endDate),
            },
            releaseDates: {
                startDate: toYMD(data.releaseDates?.startDate),
                endDate: toYMD(data.releaseDates?.endDate),
            },
            slotFullDates: {
                startDate: toYMD(data.slotFullDates?.startDate),
                endDate: toYMD(data.slotFullDates?.endDate),
            },
        };

        if (USE_MOCK) {
            // console.log('Appointment Settings Payload:', payload);
            onRefreshAppointmentSettings?.();
            closeModal?.();
            return;
        }

        // API mode: call post/patch with payload
        closeModal?.();
    };

    const renderHeader = () => (
        <>
            <h4 className="modal-title">
                {showModal?.id ? 'Edit Appointment Settings' : 'Add Appointment Settings'}
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
            <div className="row g-3">
                {/* Country */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Country<span className="text-danger">*</span>
                        </label>
                        <CustomSelect
                            options={countryOptions}
                            value={countryOptions.find((o) => o.value === watch('countryId')) || null}
                            onChange={(selected) =>
                                setValue('countryId', selected?.value || '', { shouldValidate: true })
                            }
                            placeholder="Select Country"
                            className="form-control"
                        />
                        {errors.countryId && <span className="error">{errors.countryId.message}</span>}
                    </div>
                </div>

                {/* Mission */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Mission<span className="text-danger">*</span>
                        </label>
                        <CustomSelect
                            options={missionOptions}
                            value={missionOptions.find((o) => o.value === watch('missionId')) || null}
                            onChange={(selected) =>
                                setValue('missionId', selected?.value || '', { shouldValidate: true })
                            }
                            placeholder="Select Mission"
                            className="form-control"
                        />
                        {errors.missionId && <span className="error">{errors.missionId.message}</span>}
                    </div>
                </div>

                {/* Center */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Center<span className="text-danger">*</span>
                        </label>
                        <CustomSelect
                            options={centerOptions}
                            value={centerOptions.find((o) => o.value === watch('centerId')) || null}
                            onChange={(selected) =>
                                setValue('centerId', selected?.value || '', { shouldValidate: true })
                            }
                            placeholder="Select Center"
                            className="form-control"
                        />
                        {errors.centerId && <span className="error">{errors.centerId.message}</span>}
                    </div>
                </div>

                {/* Application Type */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Application Type<span className="text-danger">*</span>
                        </label>
                        <CustomSelect
                            options={applicationTypeOptions}
                            value={
                                applicationTypeOptions.find((o) => o.value === watch('applicationTypeId')) || null
                            }
                            onChange={(selected) =>
                                setValue('applicationTypeId', selected?.value || '', { shouldValidate: true })
                            }
                            placeholder="Select Application Type"
                            className="form-control"
                        />
                        {errors.applicationTypeId && (
                            <span className="error">{errors.applicationTypeId.message}</span>
                        )}
                    </div>
                </div>

                {/* Appointment Type */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Appointment Type<span className="text-danger">*</span>
                        </label>
                        <CustomSelect
                            options={appointmentTypeOptions}
                            value={
                                appointmentTypeOptions.find((o) => o.value === watch('appointmentTypeId')) || null
                            }
                            onChange={(selected) =>
                                setValue('appointmentTypeId', selected?.value || '', { shouldValidate: true })
                            }
                            placeholder="Select Appointment Type"
                            className="form-control"
                        />
                        {errors.appointmentTypeId && (
                            <span className="error">{errors.appointmentTypeId.message}</span>
                        )}
                    </div>
                </div>

                {/* Off days (multi select) */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">Off days</label>
                        <Controller
                            control={control}
                            name="offDays"
                            render={({ field }) => (
                                <CustomSelect
                                    options={offDaysOptions}
                                    isMulti
                                    value={offDaysOptions.filter((o) => (field.value || []).includes(o.value))}
                                    onChange={(selected) => field.onChange((selected || []).map((s) => s.value))}
                                    placeholder="Select Off days"
                                    className="form-control"
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Start Time */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Start time<span className="text-danger">*</span>
                        </label>
                        <input type="time" className="form-control" {...register('startTime')} />
                        {errors.startTime && <span className="error">{errors.startTime.message}</span>}
                    </div>
                </div>

                {/* End Time */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            End time<span className="text-danger">*</span>
                        </label>
                        <input type="time" className="form-control" {...register('endTime')} />
                        {errors.endTime && <span className="error">{errors.endTime.message}</span>}
                    </div>
                </div>

                {/* Lunch break (single select) */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">Lunch break</label>
                        <CustomSelect
                            options={lunchBreakOptions}
                            value={lunchBreakOptions.find((o) => o.value === watch('lunchBreak')) || null}
                            onChange={(selected) =>
                                setValue('lunchBreak', selected?.value || '0', { shouldValidate: true })
                            }
                            placeholder="Select Lunch break"
                            className="form-control"
                        />
                        {errors.lunchBreak && <span className="error">{errors.lunchBreak.message}</span>}
                    </div>
                </div>

                {/* Slot Period */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Slot period<span className="text-danger">*</span>
                        </label>
                        <CustomSelect
                            options={slotPeriodOptions}
                            value={slotPeriodOptions.find((o) => o.value === watch('slotPeriod')) || null}
                            onChange={(selected) =>
                                setValue('slotPeriod', selected?.value || '', { shouldValidate: true })
                            }
                            placeholder="Select Slot period"
                            className="form-control"
                        />
                        {errors.slotPeriod && <span className="error">{errors.slotPeriod.message}</span>}
                    </div>
                </div>

                {/* Slot Capacity */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Slot capacity<span className="text-danger">*</span>
                        </label>
                        <CustomSelect
                            options={slotCapacityOptions}
                            value={slotCapacityOptions.find((o) => o.value === watch('slotCapacity')) || null}
                            onChange={(selected) =>
                                setValue('slotCapacity', selected?.value || '', { shouldValidate: true })
                            }
                            placeholder="Select Slot capacity"
                            className="form-control"
                        />
                        {errors.slotCapacity && <span className="error">{errors.slotCapacity.message}</span>}
                    </div>
                </div>

                {/* Max Slots */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Max slots<span className="text-danger">*</span>
                        </label>
                        <CustomSelect
                            options={maxSlotsOptions}
                            value={maxSlotsOptions.find((o) => o.value === watch('maxSlots')) || null}
                            onChange={(selected) =>
                                setValue('maxSlots', selected?.value || '', { shouldValidate: true })
                            }
                            placeholder="Select Max slots"
                            className="form-control"
                        />
                        {errors.maxSlots && <span className="error">{errors.maxSlots.message}</span>}
                    </div>
                </div>

                {/* Booking Allow From */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Booking allow from<span className="text-danger">*</span>
                        </label>
                        <input type="date" className="form-control" {...register('bookingAllowFrom')} />
                        {errors.bookingAllowFrom && (
                            <span className="error">{errors.bookingAllowFrom.message}</span>
                        )}
                    </div>
                </div>

                {/* Booking Allow Till */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">
                            Booking allow till<span className="text-danger">*</span>
                        </label>
                        <input type="date" className="form-control" {...register('bookingAllowTill')} />
                        {errors.bookingAllowTill && (
                            <span className="error">{errors.bookingAllowTill.message}</span>
                        )}
                    </div>
                </div>

                {/* ✅ Blocked Dates (DateRangePicker) */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">Blocked dates</label>
                        <Controller
                            control={control}
                            name="blockedDates"
                            render={({ field }) => (
                                <DateRangePicker className="form-control" value={field.value} onChange={field.onChange} />
                            )}
                        />
                    </div>
                </div>

                {/* ✅ Release Dates (DateRangePicker) */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">Release dates</label>
                        <Controller
                            control={control}
                            name="releaseDates"
                            render={({ field }) => (
                                <DateRangePicker className="form-control" value={field.value} onChange={field.onChange} />
                            )}
                        />
                    </div>
                </div>

                {/* ✅ Slot Full Dates (DateRangePicker) */}
                <div className="col-lg-4 col-md-6">
                    <div className="form-group forms-custom">
                        <label className="label">Slot full dates</label>
                        <Controller
                            control={control}
                            name="slotFullDates"
                            render={({ field }) => (
                                <DateRangePicker className="form-control" value={field.value} onChange={field.onChange} />
                            )}
                        />
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
            <button type="button" className="btn btn-submit" onClick={handleSubmit(onSubmit)}>
                Save
            </button>
        </div>
    );

    return (
        <CustomModal
            className="modal fade category-modal appointment-settings-modal show"
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
