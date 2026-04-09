import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import CustomSelect from '../../components/common/CustomSelect';
import useAuthReducer from '../../stores/AuthReducer'; // ✅ change to your store
import dummyIcon from '../../assets/images/Profile-PIC.png';

const USE_MOCK = true;

// ✅ Mock dropdown data
const mockCountries = [{ id: 'oman', name: 'Oman' }];

const mockMissions = [{ id: 'mission_1', name: 'Embassy of India, Muscat' }];

const mockCenters = [
    { id: 'barka', name: 'Barka' },
    { id: 'salalah', name: 'Salalah' },
    { id: 'muscat', name: 'Muscat' },
    { id: 'ibri', name: 'Ibri' },
    { id: 'ibra', name: 'Ibra' },
    { id: 'sohar', name: 'Sohar' },
];

const mockRoles = [
    { id: 'Supervisor', name: 'Supervisor' },
    { id: 'Submission Officer', name: 'Submission Officer' },
    { id: 'Biometric', name: 'Biometric' },
    { id: 'Accounts', name: 'Accounts' },
    { id: 'Receptionist', name: 'Receptionist' },
    { id: 'Cashier', name: 'Cashier' },
    { id: 'Call Center', name: 'Call Center' },
    { id: 'View Only', name: 'View Only' },
    { id: 'Country Head/ Manager', name: 'Country Head/ Manager' },
    { id: 'User - Back Office', name: 'User - Back Office' },
];

const mockDesignations = [
    { id: 'Country Manager', name: 'Country Manager' },
    { id: 'ICAC Manager', name: 'ICAC Manager' },
    { id: 'Counter Staff', name: 'Counter Staff' },
    { id: 'Premium Lounge Staff', name: 'Premium Lounge Staff' },
    { id: 'Back Office Staff', name: 'Back Office Staff' },
    { id: 'Messenger', name: 'Messenger' },
    { id: 'IT Department', name: 'IT Department' },
    { id: 'Director', name: 'Director' },
    { id: 'Whole time Director', name: 'Whole time Director' },
    { id: 'Chief Financial Officer', name: 'Chief Financial Officer' },
    { id: 'Receptionist', name: 'Receptionist' },
    { id: 'Call Center', name: 'Call Center' },
    { id: 'Embassy of India', name: 'Embassy of India' },
    { id: 'Consulate General of India', name: 'Consulate General of India' },
];

const mockCollectionTypes = [{ id: 'AFS Services', name: 'AFS Services' }];

const employeeSchema = z.object({
    countryId: z.string().nonempty('Country is required'),
    missionId: z.string().nonempty('Mission is required'),
    centerId: z.string().nonempty('Center is required'),
    roleId: z.string().nonempty('Role is required'),
    designationId: z.string().nonempty('Designation is required'),
    collectionTypeId: z.string().nonempty('Collection Type is required'),

    firstName: z.string().nonempty('First Name is required').max(30, 'Max 30 chars'),
    lastName: z.string().nonempty('Last Name is required').max(30, 'Max 30 chars'),

    contactNumber: z
        .string()
        .nonempty('Contact Number is required')
        .max(20, 'Max 20 chars'),

    email: z.string().nonempty('Email is required').email('Invalid email'),
    username: z.string().nonempty('Username is required').max(30, 'Max 30 chars'),
    password: z.string().min(6, 'Password must be at least 6 characters'),

    ipAllowed: z.string().optional(),
    ipBounded: z.boolean().optional(),

    // We'll validate image optionally (you can make required if needed)
    imageFile: z.any().optional(),
});

export default function EmployeeAddEditModal({
    showModal,
    closeModal,
    onRefreshEmployees,
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch,
        getValues,
    } = useForm({
        resolver: zodResolver(employeeSchema),
        mode: 'onSubmit',
        defaultValues: {
            countryId: '',
            missionId: '',
            centerId: '',
            roleId: '',
            designationId: '',
            collectionTypeId: '',

            firstName: '',
            lastName: '',
            contactNumber: '',
            email: '',
            username: '',
            password: '',

            ipAllowed: '',
            ipBounded: false,
            imageFile: null,
        },
    });

    // ✅ for preview
    const [imagePreview, setImagePreview] = useState('');

    // ✅ Change to your store methods
    const {
        postEmployee,
        patchEmployee,
        isLoading,

        getAllCountries,
        getAllMissions,
        getAllCenters,
        getAllRoles,
        getAllDesignations,
        getAllCollectionTypes,

        countries,
        missions,
        centers,
        roles,
        designations,
        collectionTypes,
    } = useAuthReducer((state) => state);

    // ✅ load dropdowns (API mode)
    useEffect(() => {
        if (!USE_MOCK) {
            getAllCountries?.();
            getAllMissions?.();
            getAllCenters?.();
            getAllRoles?.();
            getAllDesignations?.();
            getAllCollectionTypes?.();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ✅ Fill form for edit / clear for add
    useEffect(() => {
        if (!showModal?.id) {
            reset();
            setImagePreview('');
            return;
        }

        // Prefill (edit) - adjust keys based on your API
        setValue('countryId', String(showModal?.countryId || showModal?.country?.id || ''));
        setValue('missionId', String(showModal?.missionId || showModal?.mission?.id || ''));
        setValue('centerId', String(showModal?.centerId || showModal?.center?.id || ''));
        setValue('roleId', String(showModal?.roleId || showModal?.role?.id || ''));
        setValue('designationId', String(showModal?.designationId || showModal?.designation?.id || ''));
        setValue('collectionTypeId', String(showModal?.collectionTypeId || showModal?.collectionType?.id || ''));

        setValue('firstName', showModal?.firstName || '');
        setValue('lastName', showModal?.lastName || '');
        setValue('contactNumber', showModal?.contactNumber || '');
        setValue('email', showModal?.email || '');
        setValue('username', showModal?.username || '');
        setValue('password', ''); // keep empty in edit

        setValue('ipAllowed', showModal?.ipAllowed || '');
        setValue('ipBounded', !!showModal?.ipBounded);

        // optional: existing image url
        if (showModal?.imageUrl) setImagePreview(showModal.imageUrl);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showModal?.id, reset, setValue]);

    // ✅ options builders
    const toOptions = (arr) =>
        (arr || []).map((x) => ({ label: x.name, value: String(x.id) }));

    const countryOptions = useMemo(
        () => toOptions(USE_MOCK ? mockCountries : countries),
        [countries]
    );
    const missionOptions = useMemo(
        () => toOptions(USE_MOCK ? mockMissions : missions),
        [missions]
    );
    const centerOptions = useMemo(
        () => toOptions(USE_MOCK ? mockCenters : centers),
        [centers]
    );
    const roleOptions = useMemo(
        () => toOptions(USE_MOCK ? mockRoles : roles),
        [roles]
    );
    const designationOptions = useMemo(
        () => toOptions(USE_MOCK ? mockDesignations : designations),
        [designations]
    );
    const collectionTypeOptions = useMemo(
        () => toOptions(USE_MOCK ? mockCollectionTypes : collectionTypes),
        [collectionTypes]
    );

    // ✅ image change
    const onImageChange = (e) => {
        const file = e.target.files?.[0];
        setValue('imageFile', file || null);

        if (file) {
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        } else {
            setImagePreview('');
        }
    };

    // ✅ submit
    const onSubmit = (data) => {
        console.log("data",data)
        debugger
        const payload = {
            ...data,
            // you may need to send as FormData if imageFile is required to upload
        };

        if (USE_MOCK) {
            onRefreshEmployees?.();
            closeModal?.();
            return;
        }

        if (showModal?.id) {
            patchEmployee?.({ id: showModal.id, ...payload }, () => onRefreshEmployees?.());
        } else {
            postEmployee?.(payload, () => onRefreshEmployees?.());
        }
        closeModal?.();
    };

    const renderHeader = () => (
        <>
            <h4 className="modal-title">{showModal?.id ? 'Edit Employee' : 'Add Employee'}</h4>
            <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
        </>
    );

    const SelectField = ({ label, name, options, placeholder = 'Select' }) => {
        const val = watch(name);
        return (
            <div className="form-group forms-custom">
                <label className="label">
                    {label}
                    <span className="text-danger">*</span>
                </label>
                <CustomSelect
                    options={options}
                    value={options.find((o) => o.value === String(val || '')) || null}
                    onChange={(ev) => setValue(name, ev?.target?.value ?? '')}
                    placeholder={placeholder}
                    showIndicator={false}
                    className="form-select form-control"
                    name={name}
                />
                {errors?.[name]?.message && <span className="error">{errors[name].message}</span>}
            </div>
        );
    };

    const TextField = ({
        label,
        name,
        type = 'text',
        placeholder,
        maxLength,
        required = true,
    }) => (
        <div className="form-group forms-custom">
            <label className="label">
                {label}
                {required && <span className="text-danger">*</span>}
            </label>
            <input
                type={type}
                className="form-control"
                autoComplete="off"
                placeholder={placeholder}
                maxLength={maxLength}
                {...register(name)}
            />
            {errors?.[name]?.message && <span className="error">{errors[name].message}</span>}
        </div>
    );

    const renderBody = () => (
        <div className="modal-body employee-modal-body">
            {/* ✅ Round image upload (top center) */}
            <div className="employee-avatar-wrp">
                <div className="employee-avatar">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Employee" />
                    ) : (
                        <div className="employee-avatar-placeholder">
                            <img src={dummyIcon} alt="Employee" className="employee-avatar-placeholder-img" />
                        </div>
                    )}
                </div>

                <label className="employee-avatar-btn">
                    Upload Image
                    <input type="file" accept="image/*" onChange={onImageChange} />
                </label>

                {errors?.imageFile?.message && <span className="error">{errors.imageFile.message}</span>}
            </div>

            {/* ✅ 2 fields per row */}
            <div className="row">
                <div className="col-sm-6">
                    <SelectField label="Country" name="countryId" options={countryOptions} placeholder="Oman" />
                </div>
                <div className="col-sm-6">
                    <SelectField
                        label="Mission"
                        name="missionId"
                        options={missionOptions}
                        placeholder="Embassy of India, Muscat"
                    />
                </div>

                <div className="col-sm-6">
                    <SelectField label="Center" name="centerId" options={centerOptions} placeholder="Select Center" />
                </div>
                <div className="col-sm-6">
                    <SelectField label="Role" name="roleId" options={roleOptions} placeholder="Select Role" />
                </div>

                <div className="col-sm-6">
                    <SelectField
                        label="Designation"
                        name="designationId"
                        options={designationOptions}
                        placeholder="Select Designation"
                    />
                </div>
                <div className="col-sm-6">
                    <SelectField
                        label="Collection Type"
                        name="collectionTypeId"
                        options={collectionTypeOptions}
                        placeholder="AFS Services"
                    />
                </div>

                <div className="col-sm-6">
                    <TextField label="First Name" name="firstName" placeholder="Enter first name" maxLength={30} />
                </div>
                <div className="col-sm-6">
                    <TextField label="Last Name" name="lastName" placeholder="Enter last name" maxLength={30} />
                </div>

                <div className="col-sm-6">
                    <TextField
                        label="Contact Number"
                        name="contactNumber"
                        placeholder="Enter contact number"
                        maxLength={20}
                    />
                </div>
                <div className="col-sm-6">
                    <TextField label="Email Address" name="email" type="email" placeholder="Enter email address" />
                </div>

                <div className="col-sm-6">
                    <TextField label="Username" name="username" placeholder="Enter username" maxLength={30} />
                </div>
                <div className="col-sm-6">
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        placeholder={showModal?.id ? 'Set new password (optional)' : 'Enter password'}
                        required={!showModal?.id}
                    />
                </div>

                <div className="col-sm-6">
                    <div className="form-group forms-custom">
                        <label className="label">IP Allowed</label>
                        <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Enter allowed IPs (comma / new line separated)"
                            {...register('ipAllowed')}
                        />
                        {errors?.ipAllowed?.message && <span className="error">{errors.ipAllowed.message}</span>}
                    </div>
                </div>

                <div className="col-sm-6 d-flex align-items-end">
                    <div className="form-group forms-custom">
                        <label className="label d-block">IP Bounded</label>
                        <label className="checkbox-custom">
                            <input type="checkbox" {...register('ipBounded')} />
                            <span className="checkmark" />
                            Enable IP Bounded
                        </label>
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
                disabled={USE_MOCK ? false : isLoading}
                onClick={handleSubmit(onSubmit)}
            >
                {USE_MOCK ? 'Save' : isLoading ? 'Loading...' : 'Save'}
            </button>
        </div>
    );

    return (
        <>
            <CustomModal
                className="modal fade category-modal show employee-modal"
                dialgName="modal-dialog-scrollable"
                show={!!showModal}
                closeModal={closeModal}
                body={renderBody()}
                header={renderHeader()}
                footer={renderFooter()}
                isLoading={false}
            />
        </>
    );
}
