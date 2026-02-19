import { createHashRouter } from 'react-router-dom';

import App from '../App';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';

import Page404 from '../components/common/Page404';
import Layout from '../components/common/Layout';
import Login from '../pages/Auth/Loader';
import InventoryManagement from '../pages/InventoryManagement/Loader';
import Messages from '../pages/Messages/Loader';
import Settings from '../pages/Settings/Loader';
import Dashboard from '../pages/Dashboard/Loader';
import UserManagement from '../pages/userManagement';
import ForgotPassword from '../pages/ForgotPassword/Loader';
import InventoryForm from '../pages/InventoryManagement/InventoryForm';
import Profile from '../pages/Profile/Loader';
import ResetPassword from '../pages/ResetPassword/Loader';
import InventoryView from '../pages/InventoryManagement/InventoryView';
import LoanManagement from '../pages/LoanManagement';
import Center from '../pages/Center/Loader';
import CounterManagement from '../pages/Counter/Loader';
import RoleManagement from '../pages/Role/Loader';
import DesignationManagement from '../pages/Designation/Loader';
import AppointmentTypeManagement from '../pages/AppointmentType/Loader';
import CollectionTypeManagement from '../pages/CollectionType/Loader';
import ApplicationModeManagement from '../pages/ApplicationMode/Loader';
import ApplicationTypeManagement from '../pages/ApplicationType/Loader';
import CourierTypeManagement from '../pages/CourierType/Loader';
import ServiceManagement from '../pages/Service/Loader';
import VisaDurationManagement from '../pages/VisaDuration/Loader';
import VisaEntryManagement from '../pages/VisaEntry/Loader';
import VisaServiceManagement from '../pages/VisaServices/Loader';
import OptionalServices from '../pages/OptionalServices/Loader';
import AppointmentSettings from '../pages/AppointmentSettings/Loader';
import PassportApplications from '../pages/PassportApplications/Loader';
import DeleteApplication from '../pages/DeleteApplication/Loader';
import OutScan from '../pages/OutScan/Loader';
import InScan from '../pages/InScan/Loader';
import OTM from '../pages/OTM';
import IFM from '../pages/IFM';
import OTS from '../pages/OTS';
import CounterDelivery from '../pages/CounterDelivery';
import VisaOTC from '../pages/VisaOTC';
import PassportTracking from '../pages/PassportTracking';
import VisaApplications from '../pages/VisaApplications';
import VisaDeleteApplication from '../pages/VisaDeleteApplication';
import VisaInScan from '../pages/VisaInScan';
import VisaOTM from '../pages/VisaOTM';
import VisaIFM from '../pages/VisaIFM';
import VisaOTS from '../pages/VisaOTS';
import VisaCounterDelivery from '../pages/VisaCounterDelivery';
import OTC from '../pages/OTC';
import VisaTracking from '../pages/VisaTracking';
import VisaDigitization from '../pages/VisaDigitization';
import ReferenceNumber from '../pages/ReferenceNumber';
import OCIApplications from '../pages/OCIApplications';
import OCIDeleteApplication from '../pages/OCIDeleteApplication';
import OCIInScan from '../pages/OCInScan';
import OCIOTM from '../pages/OCIOTM';
import OCIIFM from '../pages/OCIIFM';
import OCIOTS from '../pages/OCIOTS';
import OCICounterDelivery from '../pages/OCICounterDelivery';
import OCIOTC from '../pages/OCIOTC';
import OCITracking from '../pages/OCITracking';
import AttestationApplications from '../pages/AttestationApplications';
import AttestationDeleteApplication from '../pages/AttestationDeleteApplication';
import AttestationInScan from '../pages/AttestationInScan';
import AttestationOTM from '../pages/AttestationOTM';
import AttestationIFM from '../pages/AttestationIFM';
import AttestationOTS from '../pages/AttestationOTS';
import AttestationCounterDelivery from '../pages/AttestationCounterDelivery';
import AttestationOTC from '../pages/AttestationOTC';
import AttestationTracking from '../pages/AttestationTracking';
import EliteDelivery from '../pages/EliteDelivery';
import ChargeAndRefunds from '../pages/ChargeAndRefunds';
import ReturnFromMission from '../pages/ReturnFromMission';
import ReturnToMission from '../pages/ReturnToMission';
import DailyCashCollection from '../pages/DailyCashCollection';
import PassportVasApplications from '../pages/PassportVasApplications';
import VisaVasApplications from '../pages/VisaVasApplications';
import AttestationVasApplications from '../pages/AttestationVasApplications';
import OCIVasApplications from '../pages/OCIVasApplications';
import AFSManager from '../pages/AFSManager';
import DailyAFSReport from '../pages/DailyAFSReport';
import ICACAppointments from '../pages/ICACAppointments';
import ICACApptSettings from '../pages/ICACApptSettings';
import BookAppointment from '../pages/BookAppointment';
import OptionalServiceType from '../pages/OptionalServiceType/Loader';
const router = createHashRouter([
  {
    element: <App />,
    errorElement: <Page404 />,
    children: [
      {
        element: <PublicRoutes />,
        children: [
          { path: '/login', element: <Login /> },
          { path: '/forgot-password', element: <ForgotPassword /> },
          { path: '/reset-password/:id', element: <ResetPassword /> },
        ],
      },
      {
        element: <PrivateRoutes />,
        children: [
          {
            element: <Layout />,
            children: [
              { path: '/', element: <Dashboard /> },

              {
                path: '/inventory-management',
                element: <InventoryManagement />,
              },
              { path: '/inventory-management/add', element: <InventoryForm /> },
              {
                path: '/inventory-management/edit/:id',
                element: <InventoryForm />,
              },
              {
                path: '/inventory-management/view/:id',
                element: <InventoryView />,
              },

              { path: '/loan-management', element: <LoanManagement /> },

              { path: '/messages', element: <Messages /> },
              { path: '/settings', element: <Settings /> },

              { path: '/employee-management', element: <UserManagement /> },
              { path: '/profile', element: <Profile /> },

              { path: '/center', element: <Center /> },
              { path: '/counter-management', element: <CounterManagement /> },
              { path: '/role-management', element: <RoleManagement /> },
              { path: '/designation-management', element: <DesignationManagement /> },
              { path: '/appointment-type-management', element: <AppointmentTypeManagement /> },
              { path: '/collection-type-management', element: <CollectionTypeManagement /> },
              { path: '/application-mode-management', element: <ApplicationModeManagement /> },
              { path: '/application-type-management', element: <ApplicationTypeManagement /> },
              { path: '/courier-type-management', element: <CourierTypeManagement /> },
              { path: '/service-management', element: <ServiceManagement /> },
              { path: '/visa-duration-management', element: <VisaDurationManagement /> },
              { path: '/visa-entry-management', element: <VisaEntryManagement /> },
              { path: '/visa-service-management', element: <VisaServiceManagement /> },
              { path: '/optional-services', element: <OptionalServices /> },
              { path: '/optional-service-type', element: <OptionalServiceType /> },
              { path: '/appointment-settings', element: <AppointmentSettings /> },
              { path: '/passport-applications', element: <PassportApplications /> },
              { path: '/delete-application', element: <DeleteApplication /> },
              { path: '/outscan', element: <OutScan /> },
              { path: '/inscan', element: <InScan /> },
              { path: '/outscan-to-mission', element: <OTM /> },
              { path: '/inscan-from-mission', element: <IFM /> },
              { path: '/outscan-to-spoke', element: <OTS /> },
              { path: '/counter-delivery', element: <CounterDelivery /> },
              { path: '/outscan-to-courier', element: <OTC /> },
              { path: '/passport-tracking', element: <PassportTracking /> },
              { path: '/visa-applications', element: <VisaApplications /> },
              { path: '/visa-delete-application', element: <VisaDeleteApplication /> },
              { path: '/visa-inscan-hub', element: <VisaInScan /> },
              { path: '/visa-outscan-to-mission', element: <VisaOTM /> },
              { path: '/visa-inscan-from-mission', element: <VisaIFM /> },
              { path: '/visa-outscan-to-spoke', element: <VisaOTS /> },
              { path: '/visa-counter-delivery', element: <VisaCounterDelivery /> },
              { path: '/visa-outscan-to-courier', element: <VisaOTC /> },
              { path: '/visa-tracking', element: <VisaTracking /> },
              { path: '/visa-digitization', element: <VisaDigitization /> },
              { path: '/get-reference-numbers', element: <ReferenceNumber /> },
              { path: '/oci-applications', element: <OCIApplications /> },
              { path: '/oci-delete-application', element: <OCIDeleteApplication /> },
              { path: '/oci-inscan', element: <OCIInScan /> },
              { path: '/oci-outscan-to-mission', element: <OCIOTM /> },
              { path: '/oci-inscan-from-mission', element: <OCIIFM /> },
              { path: '/oci-outscan-to-spoke', element: <OCIOTS /> },
              { path: '/oci-counter-delivery', element: <OCICounterDelivery /> },
              { path: '/oci-outscan-to-courier', element: <OCIOTC /> },
              { path: '/oci-tracking', element: <OCITracking /> },
              { path: '/attestation-applications', element: <AttestationApplications /> },
              { path: '/attestation-delete-application', element: <AttestationDeleteApplication /> },
              { path: '/attestation-in-scan', element: <AttestationInScan /> },
              { path: '/attestation-outscan-to-mission', element: <AttestationOTM /> },
              { path: '/attestation-inscan-from-mission', element: <AttestationIFM /> },
              { path: '/attestation-outscan-to-spoke', element: <AttestationOTS /> },
              { path: '/attestation-counter-delivery', element: <AttestationCounterDelivery /> },
              { path: '/attestation-outscan-to-courier', element: <AttestationOTC /> },
              { path: '/attestation-tracking', element: <AttestationTracking /> },
              { path: '/elite-delivery', element: <EliteDelivery /> },
              { path: '/charge-and-refunds', element: <ChargeAndRefunds /> },
              { path: '/return-from-mission', element: <ReturnFromMission /> },
              { path: '/return-to-mission', element: <ReturnToMission /> },
              { path: '/daily-cash-collection', element: <DailyCashCollection /> },
              { path: '/passport-vas-applications', element: <PassportVasApplications /> },
              { path: '/visa-vas-applications', element: <VisaVasApplications /> },
              { path: '/attestation-vas-applications', element: <AttestationVasApplications /> },
              { path: '/oci-vas-applications', element: <OCIVasApplications /> },
              { path: '/afs-manager', element: <AFSManager /> },
              { path: '/daily-afs-report', element: <DailyAFSReport /> },
              { path: '/icac-appointments', element: <ICACAppointments /> },
              { path: '/icac-appt-settings', element: <ICACApptSettings /> },
              { path: '/book-appointment', element: <BookAppointment /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
