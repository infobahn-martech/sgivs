import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomModal from '../../components/common/CustomModal';
import CustomSelect from '../../components/common/CustomSelect';
import useUserReducer from '../../stores/UserReducer';
import useRoleReducer from '../../stores/RoleReducer';
import useDesignationReducer from '../../stores/DesignationReducer';
import useCollectionTypeReducer from '../../stores/CollectionTypeReducer';
import dummyIcon from '../../assets/images/Profile-PIC.png';

const employeeSchema = z.object({
    country_id: z.string().nonempty('Country is required'),
    mission_id: z.string().nonempty('Mission is required'),
    center_id: z.string().nonempty('Center is required'),
    employee_role_id: z.string().nonempty('Role is required'),
    employee_designation_id: z.string().nonempty('Designation is required'),
    collection_type_id: z.string().nonempty('Collection Type is required'),

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
    //imageFile: z.any().optional(),
});

export default function EmployeeAddEditModal({ showModal, closeModal, onRefreshEmployees }) {
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
            country_id: '', mission_id: '', center_id: '', employee_role_id: '', employee_designation_id: '', collection_type_id: '',
            firstName: '', lastName: '', contactNumber: '', email: '', username: '', password: '',
            ipAllowed: '', ipBounded: false, //imageFile: null,
        },
    });

    // ✅ for preview
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // ✅ Change to your store methods
    const {
        postData, patchData, isLoading,
        countryList, missionList, centerList,
        isLoadingCountries, isLoadingMissions, isLoadingCenters,
        getCountries, getMissionsByCountry, getCentersByMission,
        getEmployeeById, employeeData
    } = useUserReducer((state) => state);

    // Load countries on mount
    useEffect(() => {
        getCountries();
    }, []);

    const selectedCountryId = watch('country_id');


    const selectedMissionId = watch('mission_id');

    const selectedCenterId = watch('center_id');


    // Role API
    const { getData, roleData, isLoadingRole } = useRoleReducer((state) => state);
    const selectedRoleId = watch('employee_role_id');
    useEffect(() => {
        getData();
    }, [getData]);

    // Designation API
    const { getData: getDesignationData, designationData, isLoadingDesignation } = useDesignationReducer((state) => state);
    const selectedDesignationId = watch('employee_designation_id');
    useEffect(() => {
        getDesignationData();
    }, [getDesignationData]);

    // Collection Type API
    const { getData: getCollectionTypeData, collectionTypeData, isLoadingCollectionType } = useCollectionTypeReducer((state) => state);
    const selectedCollectionTypeId = watch('collection_type_id');
    useEffect(() => {
        getCollectionTypeData();
    }, [getCollectionTypeData]);

    useEffect(() => {
        if (!showModal?.employee_id) return;

        getEmployeeById(showModal.employee_id);
    }, [showModal?.employee_id]);

    // ✅ Fill form for edit / clear for add
    // useEffect(() => {
    //     if (!showModal?.employee_id) {
    //         reset();
    //         setImagePreview('');
    //         return;
    //     }

    //     // Prefill (edit) - adjust keys based on your API
    //     setValue('country_id', String(showModal?.country_id || ''));
    //     setValue('mission_id', String(showModal?.mission_id || ''));
    //     setValue('center_id', String(showModal?.center_id || ''));
    //     setValue('employee_role_id', String(showModal?.employee_role_id || ''));
    //     setValue('employee_designation_id', String(showModal?.employee_designation_id || ''));
    //     setValue('collection_type_id', String(showModal?.collection_type_id || ''));

    //     setValue('firstName', showModal?.firstName || '');
    //     setValue('lastName', showModal?.lastName || '');
    //     setValue('contactNumber', showModal?.contactNumber || '');
    //     setValue('email', showModal?.email || '');
    //     setValue('username', showModal?.username || '');
    //     setValue('password', ''); // keep empty in edit

    //     setValue('ipAllowed', showModal?.ipAllowed || '');
    //     setValue('ipBounded', !!showModal?.ipBounded);

    //     // optional: existing image url
    //     if (showModal?.imageUrl) setImagePreview(showModal.imageUrl);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [showModal?.id, reset, setValue]);
    useEffect(() => {
        if (!showModal?.employee_id || !employeeData) return;

        const countryId = String(employeeData.country_id || '');
        const missionId = String(employeeData.mission_id || '');

        reset({
            country_id: String(employeeData.country_id || ''),
            mission_id: String(employeeData.mission_id || ''),
            center_id: String(employeeData.center_id || ''),

            employee_role_id: String(employeeData.role_id || ''),
            employee_designation_id: String(employeeData.designation_id || ''),
            collection_type_id: String(employeeData.collection_type_id || ''),

            firstName: employeeData.first_name || '',
            lastName: employeeData.last_name || '',
            contactNumber: employeeData.contact_no || '',
            email: employeeData.email_address || '',
            username: employeeData.username || '',
            password: '',

            ipAllowed: employeeData.ip_allowed || '',
            ipBounded: employeeData.ip_bounded === "1",
        });

        setImagePreview(employeeData.image || '');
        setImageFile(null);

        // 🔥 CRITICAL: load dependent dropdowns
        if (countryId) {
            getMissionsByCountry(countryId);
        }

        if (missionId) {
            getCentersByMission(missionId);
        }
    }, [employeeData, reset]);

    // ✅ options builders
    const countryOptions = useMemo(
        () => (countryList || []).map(x => ({
            label: x.country_name,
            value: String(x.country_id),
        })),
        [countryList]
    );

    const missionOptions = useMemo(
        () => (missionList || []).map(x => ({
            label: x.mission_name,
            value: String(x.mission_id),
        })),
        [missionList]
    );

    const centerOptions = useMemo(() => {
        return centerList.map(x => ({
            label: x.center_name,
            value: String(x.center_id),
        }));
    }, [centerList]);

    const roleOptions = useMemo(
        () =>
            (roleData || []).map((x) => ({
                label: x.employee_role,
                value: String(x.employee_role_id),
            })),
        [roleData]
    );

    const designationOptions = useMemo(() => {
        const list = designationData?.data || [];

        return list.map((x) => ({
            label: x.employee_designation,
            value: String(x.employee_designation_id),
        }));
    }, [designationData]);

    const collectionTypeOptions = useMemo(() => {
        const collData = collectionTypeData || [];

        return collData.map((x) => ({
            label: x.collection_type,
            value: String(x.collection_type_id),
        }));
    }, [collectionTypeData]);

    // ✅ image change
    const onImageChange = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImageFile(null);
        }
    };

//       const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setProfileImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setProfileImagePreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };


    // ✅ submit
    const onSubmit = (data) => {
        const formData = new FormData();

        formData.append('country_id', data.country_id);
        formData.append('mission_id', data.mission_id);
        formData.append('center_id', data.center_id);

        formData.append('role_id', data.employee_role_id);
        formData.append('designation_id', data.employee_designation_id);
        formData.append('collection_type_id', data.collection_type_id);

        formData.append('first_name', data.firstName);
        formData.append('last_name', data.lastName);
        formData.append('contact_no', data.contactNumber);
        formData.append('email_address', data.email);
        formData.append('username', data.username);

        if (data.password) {
            formData.append('password', data.password);
        }

        if (imageFile instanceof File) {
            formData.append("image", imageFile);
        }

        formData.append('ip_bounded', data.ipBounded ? 1 : 0);
        formData.append('ip_allowed', data.ipAllowed || "");

        formData.append('counter_id', 3);
        formData.append('status', 1);

        const onSuccess = () => {
            onRefreshEmployees?.();
            closeModal?.();
        };

        if (showModal?.employee_id) {
            formData.append('employee_id', showModal.employee_id);
            patchData(formData, onSuccess);
        } else {
            postData(formData, onSuccess);
        }
    };

    const renderHeader = () => (
        <>
            <h4 className="modal-title">{showModal?.employee_id ? 'Edit Employee' : 'Add Employee'}</h4>
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
                    <div className="form-group forms-custom">
                        <label htmlFor="country_id" className="label">
                            Country<span className="text-danger">*</span>
                        </label>
                        <CustomSelect options={countryOptions}
                            value={
                                countryOptions.find((opt) => opt.value === String(selectedCountryId || '')) || null
                            }
                            onChange={(selected) => {
                                const value = selected?.target?.value || '';
                                setValue('country_id', value, { shouldDirty: true, shouldValidate: true, shouldTouch: true });

                                setValue('mission_id', '');
                                setValue('center_id', '');

                                if (value) {
                                    getMissionsByCountry(value);
                                }
                            }}
                            placeholder={isLoadingCountries ? 'Loading countries...' : 'Select Country'}
                            isDisabled={isLoadingCountries}
                            showIndicator={false}
                            className="form-select form-control"
                        />
                        {errors?.country_id?.message && <span className="error">{errors?.country_id?.message}</span>}
                    </div>
                </div>

                <div className="col-sm-6">
                    <div className="form-group forms-custom">
                        <label htmlFor="mission_id" className="label">
                            Mission<span className="text-danger">*</span>
                        </label>
                        <CustomSelect options={missionOptions}
                            value={
                                missionOptions.find((opt) => opt.value === String(selectedMissionId || '')) || null
                            }
                            onChange={(selected) => {
                                const value = selected?.target?.value || '';
                                setValue('mission_id', value || '', { shouldDirty: true, shouldValidate: true, shouldTouch: true });

                                setValue('center_id', '');

                                if (value) {
                                    getCentersByMission(value);
                                }
                            }}
                            placeholder={isLoadingMissions ? 'Loading mission...' : 'Select Mission'}
                            isDisabled={isLoadingMissions}
                            showIndicator={false}
                            className="form-select form-control"
                        />
                        {errors?.mission_id?.message && <span className="error">{errors?.mission_id?.message}</span>}
                    </div>
                </div>

                <div className="col-sm-6">
                    <div className="form-group forms-custom">
                        <label htmlFor="center_id" className="label">
                            Center<span className="text-danger">*</span>
                        </label>
                        <CustomSelect options={centerOptions}
                            value={
                                centerOptions.find((opt) => opt.value === String(selectedCenterId || '')) || null
                            }
                            onChange={(selected) => {
                                const value = selected?.target?.value || '';
                                setValue('center_id', value, { shouldDirty: true, shouldValidate: true, shouldTouch: true });
                            }}
                            placeholder={isLoadingCenters ? 'Loading centers...' : 'Select Center'}
                            isDisabled={isLoadingCenters}
                            showIndicator={false}
                            className="form-select form-control"
                        />
                        {errors?.center_id?.message && <span className="error">{errors?.center_id?.message}</span>}
                    </div>
                </div>

                <div className="col-sm-6">
                    <div className="form-group forms-custom">
                        <label htmlFor="employee_role_id" className="label">
                            Role<span className="text-danger">*</span>
                        </label>
                        <CustomSelect options={roleOptions}
                            value={
                                roleOptions.find((opt) => opt.value === String(selectedRoleId || '')) || null
                            }
                            onChange={(selected) => {
                                const value = selected?.target?.value || '';
                                setValue('employee_role_id', value, { shouldDirty: true, shouldValidate: true, shouldTouch: true });
                            }}
                            placeholder={isLoadingRole ? 'Loading role...' : 'Select Role'}
                            isDisabled={isLoadingRole}
                            showIndicator={false}
                            className="form-select form-control"
                        />
                        {errors?.employee_role_id?.message && <span className="error">{errors?.employee_role_id?.message}</span>}
                    </div>
                </div>

                <div className="col-sm-6">
                    <div className="form-group forms-custom">
                        <label htmlFor="employee_designation_id" className="label">
                            Designation<span className="text-danger">*</span>
                        </label>
                        <CustomSelect options={designationOptions}
                            value={
                                designationOptions.find((opt) => opt.value === String(selectedDesignationId || '')) || null
                            }
                            onChange={(selected) => {
                                const value = selected?.target?.value || '';
                                setValue('employee_designation_id', value, { shouldDirty: true, shouldValidate: true, shouldTouch: true });
                            }}
                            placeholder={isLoadingDesignation ? 'Loading designation...' : 'Select Designation'}
                            isDisabled={isLoadingDesignation}
                            showIndicator={false}
                            className="form-select form-control"
                        />
                        {errors?.employee_designation_id?.message && <span className="error">{errors?.employee_designation_id?.message}</span>}
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group forms-custom">
                        <label htmlFor="collection_type_id" className="label">
                            Collection Type<span className="text-danger">*</span>
                        </label>
                        <CustomSelect options={collectionTypeOptions}
                            value={
                                collectionTypeOptions.find((opt) => opt.value === String(selectedCollectionTypeId || '')) || null
                            }
                            onChange={(selected) => {
                                const value = selected?.target?.value || '';
                                setValue('collection_type_id', value, { shouldDirty: true, shouldValidate: true, shouldTouch: true });
                            }}
                            placeholder={isLoadingCollectionType ? 'Loading collection type...' : 'Select Collection Type'}
                            isDisabled={isLoadingCollectionType}
                            showIndicator={false}
                            className="form-select form-control"
                        />
                        {errors?.collection_type_id?.message && <span className="error">{errors?.collection_type_id?.message}</span>}
                    </div>
                </div>

                <div className="col-sm-6">
                    <TextField label="First Name" name="firstName" placeholder="Enter first name" maxLength={30} />
                </div>
                <div className="col-sm-6">
                    <TextField label="Last Name" name="lastName" placeholder="Enter last name" maxLength={30} />
                </div>

                <div className="col-sm-6">
                    <TextField label="Contact Number" name="contactNumber" placeholder="Enter contact number" maxLength={20} />
                </div>
                <div className="col-sm-6">
                    <TextField label="Email Address" name="email" type="email" placeholder="Enter email address" />
                </div>

                <div className="col-sm-6">
                    <TextField label="Username" name="username" placeholder="Enter username" maxLength={30} />
                </div>
                <div className="col-sm-6">
                    <TextField label="Password" name="password" type="password" placeholder={showModal?.employee_id ? 'Set new password (optional)' : 'Enter password'} required={!showModal?.employee_id} />
                </div>

                <div className="col-sm-6">
                    <div className="form-group forms-custom">
                        <label className="label">IP Allowed</label>
                        <textarea className="form-control" rows={3} placeholder="Enter allowed IPs (comma / new line separated)" {...register('ipAllowed')} />
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
                disabled={isLoading}
                onClick={handleSubmit(onSubmit)}
            >
                {isLoading ? 'Loading...' : 'Save'}
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
