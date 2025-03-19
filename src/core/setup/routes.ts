/**
 * Configuration related to Next.js and others routes setup and handling
 *
 * @author Gregorio Alvarez <galvarez@cbpi.com.mx>
 *
 */

/**
 *
 * - - - - -  How to add a new route
 *
 * 1. Add the alias on "RouteAlias" type below (on corresponding group: Pages, Internal API, Backend)
 * Note there is a convention on names based on group.
 *
 * 2. Map the established alias with its corresponding route in "routes" object below
 *
 * 3. Now you can use your route with the getRoute() helper
 */

// The backend base URLs are obtained from environment variables
export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

if (!BACKEND_BASE_URL) {
  console.critical("Backend URL basepath is not set in env variables");
  throw new Error("Backend URL basepath is not set in env variables");
}

/**
 * Unique alias of each route
 */
// export type RouteAlias =
//   // Pages
//   | 'index'
//   | 'login'
//   | 'register-general-data'
//   | 'register-contact'
//   | 'register-classification'
//   | 'register-password'
//   | 'register-enterprise-type-selector'
//   | 'register-chain-general-data'
//   | 'register-chain-main-contact'
//   | 'register-chain-classification'
//   | 'register-organization-general-data'
//   | 'register-organization-main-contact'
//   | 'register-organization-classification'
//   | 'register-v2-user-password'
//   | 'auth-v2-email-validation'
//   | 'auth-user-validation'
//   | 'auth-welcome'
//   | 'dashboard-home'
//   | 'dashboard-initial-registration-home'
//   | 'dashboard-forms-my-organization-data'
//   | 'dashboard-home-internal-admin'
//   | 'dashboard-home-external-admin'
//   | 'dashboard-home-external-admin-preview'
//   | 'dashboard-internal-admin-organizations'
//   | 'dashboard-strategies-admin'
//   | 'dashboard-my-strategies-external'
//   | 'dashboard-charts-samples'
//   | 'forms-open-by-id'
//   | 'forms-new-by-slug'
//   | 'forms-edit-by-fillout-id'
//   | 'strategy-details-by-id'
//   | 'strategy-by-id-mitigation-measures-control-panel'
//   | 'auth-reset-password'
//   | 'auth-reset-password-form'
//   | 'auth-reset-password-success'
//   | 'chain-management'
//   | 'chain-home-dashboard'
//   | 'register-chain-classification-non-naics'
//   | 'forms-view-by-fillout-id'
//   | 'forms-v2-new-by-slug'
//   | 'forms-v2-add-year-by-slug'
//   | 'forms-v2-edit-by-fillout-id'
//   | 'chain-register-organization'
//   | 'chain-register-organization-general-data'
//   | 'chain-register-organization-main-contact'
//   | 'chain-register-organization-classification'
//   | 'chain-register-organization-password'
//   | 'chain-register-organization-email-validation'
//   | 'chain-registration-dashboard'
//   | 'chain-join-organization-validation'
//   | 'chain-join-organization-confirmation'
//   | 'chain-edit'
//   | 'organization-by-id-details'
//   | 'organization-by-id-edit'
//   | 'branch-by-id-details'
//   | 'branch-by-id-edit'
//   | 'parameters-strategy-by-id-dashboard'
//   | 'parameters-organization-by-id-dashboard'

//   // API
//   | 'api-get-countries'
//   | 'api-get-states'
//   | 'api-get-cities'
//   | 'api-get-municipalities'
//   | 'api-get-scian-sectors'
//   | 'api-get-scian-subsectors'
//   | 'api-get-scian-branches'
//   | 'api-get-scian-subbranches'
//   | 'api-get-scian-classes'
//   | 'api-users-register'
//   | 'api-users-confirm-code'
//   | 'api-auth-verification-code-confirmation'
//   | 'api-users-resend-confirmation-code'
//   | 'api-user-email-validation'
//   | 'api-user-email-address-validation'
//   | 'api-auth-login'
//   | 'api-auth-logout'
//   | 'api-auth-request-password-reset'
//   | 'api-auth-verification-code-send'
//   | 'api-forms-get-all-templates'
//   | 'api-forms-submit-answers'
//   | 'api-forms-progress-by-user-id'
//   | 'api-internal-app-build-info'
//   | 'api-forms-submit-files-csv'
//   | 'api-forms-submit-files-json'
//   | 'api-forms-submit-files-upload'
//   | 'api-forms-by-fillout-id-delete'
//   | 'api-get-all-strategies-table'
//   | 'api-get-all-strategies-performance'
//   | 'api-get-all-strategies-status-graph-polar'
//   | 'api-get-all-strategies-comparative-graph-horizontal-bars'
//   | 'api-get-all-strategies-status-by-year-graph-bars'
//   | 'api-get-all-strategies-ghg-mitigations-graph-area'
//   | 'api-all-strategies-search'
//   | 'api-get-organizations-overview'
//   | 'api-organizations-general-table'
//   | 'api-organization-by-id-consumption-factors'
//   | 'api-organization-by-id-strategies-costs'
//   | 'api-organization-by-id-financial-impact-area-graph'
//   | 'api-organization-by-id-baseline-bars-graph'
//   | 'api-organization-by-id-baseyear-emissions-doughnut-graph'
//   | 'api-organization-by-id-strategies-baseline-years'
//   | 'api-organization-by-id-energy-consumption-horizontal-bars-graph'
//   | 'api-organization-by-id-projected-baseline-emissions-stacked-graph'
//   | 'api-organization-by-id-get-info'
//   | 'api-organization-by-id-get-branches'
//   | 'api-get-all-organizations-status-graph'
//   | 'api-organization-by-id-users-activity-doughnut-graph'
//   | 'api-organization-by-id-users-activity-table'
//   | 'api-organization-name-validation'
//   | 'api-users-activity-log'
//   | 'api-get-strategies-graph'
//   | 'api-get-users-activity-graph'
//   | 'api-get-home-cards-data'
//   | 'api-auth-get-user'
//   | 'api-pipelines-run-by-dag-id'
//   | 'api-strategy-by-id-scope-mitigations-bars-graph'
//   | 'api-strategy-by-id-costs-bars-graph'
//   | 'api-strategy-by-id-financial-costs'
//   | 'api-strategy-by-id-ghg-estimated-mitigations-area-graph'
//   | 'api-strategy-by-id-general-details'
//   | 'api-strategy-by-id-baseline-years'
//   | 'api-strategy-by-id-mitigation-measures-bars-graph'
//   | 'api-strategy-by-id-financial-impact-area-graph'
//   | 'api-strategy-by-id-baseline-emissions-doughnut-graph'
//   | 'api-strategy-by-id-total-ghg-emissions-stacked-graph'
//   | 'api-strategy-by-id-mitigations-bars-graphs'
//   | 'api-strategy-by-id-energy-consumption-horizontal-bars-graph'
//   | 'api-strategy-by-id-fractioned-ghg-emissions-stacked-graph'
//   | 'api-strategy-by-id-my-baseline-bars-graph'
//   | 'api-create-strategy'
//   | 'api-strategy-by-id-enable-disable'
//   | 'api-strategy-by-id-expire'
//   | 'api-strategy-by-id-delete'
//   | 'api-strategy-by-id-edit'
//   | 'api-strategy-by-id-mitigation-measure-assets'
//   | 'api-strategy-by-id-mitigation-measure-my-baseline-idle-stacked-graph'
//   | 'api-strategy-by-id-mitigation-measure-my-baseline-representation-stacked-graph'
//   | 'api-strategy-by-id-mitigation-measure-my-baseline-differential-stacked-graph'
//   | 'api-strategy-by-id-mitigation-measure-scope1-asset-consumption-details'
//   | 'api-strategy-by-id-mitigation-measure-current-measures'
//   | 'api-forms-final-confirmation-by-user-id'
//   | 'api-strategy-by-id-mitigation-measure-assets-scope2-consumption-details'
//   | 'api-strategy-by-id-mitigation-calculation-s1-driving-techniques'
//   | 'api-strategy-by-id-mitigation-measures-calculation-s1-assets-replacement'
//   | 'api-strategy-by-id-mitigation-measures-calculation-s2-ems'
//   | 'api-strategy-by-id-mitigation-measures-calculations-s2-office-equipment-upgrade'
//   | 'api-strategy-by-id-mitigation-measures-calculation-s2-zero-carbon-electricity'
//   | 'api-strategy-by-id-mitigation-measure-edit'
//   | 'api-strategy-by-id-mitigation-measure-remake'
//   | 'api-strategy-by-id-mitigation-measure-delete'
//   | 'api-strategy-by-id-mitigation-measure-create'
//   | 'api-strategy-by-id-mitigation-measure-by-id-info'
//   | 'api-strategy-by-id-mitigation-measure-scope1-asset-replacement-options'
//   | 'api-chain-name-validation'
//   | 'api-user-create'
//   | 'api-organization-create'
//   | 'api-chain-create'
//   | 'api-chain-by-id-strategies-table'
//   | 'api-chain-by-id-strategies-search'
//   | 'api-chain-by-id-organizations-search'
//   | 'api-chain-by-id-organizations-table'
//   | 'api-chain-by-id-top-emissions-bars-graph'
//   | 'api-form-table-import'
//   | 'api-form-table-download-file'
//   | 'api-get-user-by-id'
//   | 'api-auth-reset-password'
//   | 'api-chain-by-id-invite-users'
//   | 'api-example'
//   | 'api-pipeline-v2-run'
//   | 'api-pipeline-v2-by-dag-id-status-by-run-id'
//   | 'api-strategy-by-id-mitigation-measure-discard-drafts'
//   | 'api-forms-v2-progress-by-user-id-filled-years'
//   | 'api-forms-by-fillout-id-edit-submit-answers'
//   | 'api-forms-by-fillout-id-submit-files-csv'
//   | 'api-forms-by-fillout-id-submit-files-json'
//   | 'api-forms-by-fillout-id-submit-files-upload'
//   | 'api-forms-user-by-id-progress-check'
//   | 'api-chain-by-id-invite-new-org-assigned-user'
//   | 'api-chain-by-id-invite-existing-organization'
//   | 'api-chain-by-id-create-organization'
//   | 'api-chain-by-id-registered-organizations-status'
//   | 'api-chain-by-id-details'
//   | 'api-chain-by-id-organization-join'
//   | 'api-chain-org-invitation-by-id-status'
//   | 'api-chain-org-invitation-by-id-delete'
//   | 'api-chain-by-id-registration-confirm'
//   | 'api-chain-by-id-edit'
//   | 'api-chain-by-id-delete'
//   | 'api-chain-by-id-enable-disable'
//   | 'api-chain-by-id-baseline-bars-graph'
//   | 'api-chain-by-id-ghg-emissions-bars-graph'
//   | 'api-chain-by-id-users-activity-doughnut'
//   | 'api-chain-by-id-users-activity-table'
//   | 'api-chain-by-id-financial-impact-area'
//   | 'api-chain-by-id-financial-costs'
//   | 'api-chain-by-id-consumption-emissions-horizontal-bars-graph'
//   | 'api-organization-by-id-branches-table'
//   | 'api-organization-by-id-branches-search'
//   | 'api-organization-by-id-delete'
//   | 'api-organization-by-id-enable-disable'
//   | 'api-organization-by-id-edit'
//   | 'api-branch-create'
//   | 'api-forms-organization-by-id-progress'
//   | 'api-organization-by-id-strategies-table'
//   | 'api-organization-by-id-strategies-search'
//   | 'api-branch-by-id-details'
//   | 'api-branch-by-id-baseline-emissions-bars-graph'
//   | 'api-branch-by-id-edit'
//   | 'api-branch-by-id-enable-disable'
//   | 'api-branch-by-id-delete'
//   | 'api-branch-by-id-assets'
//   | 'api-organization-by-id-fuels-energies'
//   | 'api-organization-by-id-emissions-by-energy-multiple-bars-graph'
//   | 'api-organization-by-id-consumption-by-energy-bars-graph'
//   | 'api-parameters-entity-params-info'
//   | 'api-parameters-entity-energy-sources'
//   | 'api-parameters-entity-assets'
//   | 'api-parameters-entity-energy-sources-create'
//   | 'api-parameters-entity-energy-sources-by-id-update'
//   | 'api-parameters-entity-energy-sources-by-id-delete'
//   | 'api-parameters-entity-assets-create'
//   | 'api-parameters-entity-assets-by-id-delete'
//   | 'api-parameters-entity-assets-by-id-update'
//   | 'api-strategy-by-id-scope-2-mitigations-bars-graph'
//   | 'api-strategy-by-id-consumption-by-energy-bars-graph'
//   | 'api-strategy-by-id-fuels-energies'
//   | 'api-strategy-by-id-emissions-by-energy-bars-graph'

//   // Backend API
//   | 'backend-get-countries'
//   | 'backend-get-states'
//   | 'backend-get-cities'
//   | 'backend-get-municipalities'
//   | 'backend-get-scian-sector'
//   | 'backend-get-scian-subsectors'
//   | 'backend-get-scian-branches'
//   | 'backend-get-scian-subbranches'
//   | 'backend-get-scian-classes'
//   | 'backend-users-register'
//   | 'backend-login'
//   | 'backend-get-user-by-id'
//   | 'backend-get-form-content-by-template-id'
//   | 'backend-get-form-content-by-slug'
//   | 'backend-get-form-content-by-fillout-id'
//   | 'backend-forms-by-fillout-id-delete'
//   | 'backend-get-form-templates-by-lang'
//   | 'backend-get-form-table-download-file'
//   | 'backend-user-confirm-code'
//   | 'backend-user-resend-confirmation-code'
//   | 'backend-user-email-check'
//   | 'backend-user-verification-code-send'
//   | 'backend-user-verification-code-confirmation'
//   | 'backend-forms-submit-answers'
//   | 'backend-user-progress-by-id'
//   | 'backend-about-version'
//   | 'backend-forms-submit-files'
//   | 'backend-forms-table-import'
//   | 'backend-get-organizations-table'
//   | 'backend-get-all-organizations-status-graph'
//   | 'backend-get-organization-by-id-categorized-energy-horizontal-bars-graph'
//   | 'backend-get-organization-by-id-baseline-emissions-bars-graph'
//   | 'backend-get-organization-by-users-activity-log-table'
//   | 'backend-get-all-organizations'
//   | 'backend-get-all-organizations-table'
//   | 'backend-organization-by-id-get-all-branches'
//   | 'backend-organization-by-id-all-strategies-costs'
//   | 'backend-organization-by-id-info'
//   | 'backend-users-activity-log'
//   | 'backend-get-strategies-graph'
//   | 'backend-get-all-strategies-status-polar-graph'
//   | 'backend-get-all-strategies-ghg-mitigation-area-graph'
//   | 'backend-get-all-strategies-table'
//   | 'backend-get-all-strategies-search'
//   | 'backend-get-all-strategies-performance'
//   | 'backend-get-all-strategies-comparative-horizontal-bars-graph'
//   | 'backend-get-all-strategies-status-by-year-bars-graph'
//   | 'backend-create-strategy'
//   | 'backend-get-users-activity-graph'
//   | 'backend-get-home-cards-data'
//   | 'backend-pipelines-run-by-dag-id'
//   | 'backend-forms-final-confirmation-by-user-id'
//   | 'backend-organization-by-id-baseyear-emissions-doughnut-graph'
//   | 'backend-organization-by-id-financial-impact-area-graph'
//   | 'backend-organization-by-id-projected-baseline-emissions-stacked-graph'
//   | 'backend-organization-by-id-users-activity-doughnut-graph'
//   | 'backend-organization-by-id-strategies-baseline-years'
//   | 'backend-strategy-by-id-baseline-emissions-doughnut-graph'
//   | 'backend-strategy-by-id-costs-bars-graph'
//   | 'backend-strategy-by-id-energy-consumption-horizontal-bars-graph'
//   | 'backend-strategy-by-id-financial-impact-area-graph'
//   | 'backend-strategy-by-id-fractioned-ghg-emissions-stacked-graph'
//   | 'backend-strategy-by-id-ghg-estimated-mitigations-area-graph'
//   | 'backend-strategy-by-id-mitigation-measures-bars-graph'
//   | 'backend-strategy-by-id-scope-mitigations-bars-graph'
//   | 'backend-strategy-by-id-baseline-years'
//   | 'backend-strategy-by-id-general-details'
//   | 'backend-strategy-by-id-financial-costs'
//   | 'backend-strategy-by-id-mitigation-measure-assets-scope2-consumption-details'
//   | 'backend-strategy-by-id-mitigation-calculation-s1-driving-techniques'
//   | 'backend-strategy-by-id-mitigation-measure-my-baseline-idle-stacked-graph'
//   | 'backend-strategy-by-id-mitigation-measure-edit'
//   | 'backend-strategy-by-id-mitigation-measure-create'
//   | 'backend-strategy-by-id-actions-enable-disable'
//   | 'backend-strategy-by-id-actions-expire'
//   | 'backend-strategy-by-id-actions-delete'
//   | 'backend-strategy-by-id-actions-edit'
//   | 'backend-chain-name-check'
//   | 'backend-organization-name-check'
//   | 'backend-user-register'
//   | 'backend-organization-create'
//   | 'backend-chain-create'
//   | 'backend-strategy-by-id-mitigation-bars-graph'
//   | 'backend-strategy-by-id-baseline-emissions-bars-graph'
//   | 'backend-strategy-by-id-total-ghg-emissions-stacked-graph'
//   | 'backend-strategy-by-id-mitigation-measure-current-measures'
//   | 'backend-strategy-by-id-mitigation-measure-assets'
//   | 'backend-strategy-by-id-mitigation-measure-by-id-info'
//   | 'backend-strategy-by-id-mitigation-measure-scope1-asset-consumption-details'
//   | 'backend-strategy-by-id-mitigation-measure-assets-scope2-consumption-details'
//   | 'backend-strategy-by-id-mitigation-measures-calculation-s1-assets-replacement'
//   | 'backend-strategy-by-id-mitigation-measures-calculation-s2-ems'
//   | 'backend-strategy-by-id-mitigation-measures-calculations-s2-office-equipment-upgrade'
//   | 'backend-strategy-by-id-mitigation-measures-calculation-s2-zero-carbon-electricity'
//   | 'backend-strategy-by-id-mitigation-measure-my-baseline-representation-stacked-graph'
//   | 'backend-strategy-by-id-mitigation-measure-my-baseline-differential-stacked-graph'
//   | 'backend-strategy-by-id-mitigation-measure-scope1-asset-replacement-options'
//   | 'backend-strategy-by-id-mitigation-measure-delete'
//   | 'backend-strategy-by-id-mitigation-measure-remake'
//   | 'backend-auth-request-password-reset'
//   | 'backend-auth-reset-password'
//   | 'backend-chain-by-id-invite-users'
//   | 'backend-pipeline-v2-run'
//   | 'backend-pipeline-v2-by-dag-id-status-by-run-id'
//   | 'backend-strategy-by-id-mitigation-measure-discard-drafts'
//   | 'backend-get-form-template-by-slug'
//   | 'backend-user-by-id-form-years-progress'
//   | 'backend-forms-by-fillout-id-edit-submit-answers'
//   | 'backend-forms-by-fillout-id-edit-submit-files'
//   | 'backend-forms-user-by-id-progress-check'
//   | 'backend-chain-by-id-invite-new-org-assigned-user'
//   | 'backend-chain-by-id-invite-existing-organization'
//   | 'backend-chain-by-id-create-organization'
//   | 'backend-chain-by-id-registered-organizations-status'
//   | 'backend-chain-by-id-details'
//   | 'backend-chain-by-id-organization-join'
//   | 'backend-chain-org-invitation-by-id-status'
//   | 'backend-chain-org-invitation-by-id-delete'
//   | 'backend-chain-by-id-registration-confirm'
//   | 'backend-chain-by-id-edit'
//   | 'backend-chain-by-id-delete'
//   | 'backend-chain-by-id-enable-disable'
//   | 'backend-chain-by-id-top-emissions-bars-graph'
//   | 'backend-chain-by-id-strategies-search'
//   | 'backend-chain-by-id-strategies-table'
//   | 'backend-chain-by-id-organizations-search'
//   | 'backend-chain-by-id-organizations-table'
//   | 'backend-chain-by-id-baseline-bars-graph'
//   | 'backend-chain-by-id-ghg-emissions-bars-graph'
//   | 'backend-chain-by-id-users-activity-doughnut'
//   | 'backend-chain-by-id-users-activity-table'
//   | 'backend-chain-by-id-financial-impact-area'
//   | 'backend-chain-by-id-financial-costs'
//   | 'backend-chain-by-id-consumption-emissions-horizontal-bars-graph'
//   | 'backend-organization-by-id-branches-table'
//   | 'backend-organization-by-id-branches-search'
//   | 'backend-organization-by-id-delete'
//   | 'backend-organization-by-id-enable-disable'
//   | 'backend-organization-by-id-edit'
//   | 'backend-branch-create'
//   | 'backend-forms-organization-by-id-progress'
//   | 'backend-organization-by-id-strategies-table'
//   | 'backend-organization-by-id-strategies-search'
//   | 'backend-branch-by-id-details'
//   | 'backend-branch-by-id-baseline-emissions-bars-graph'
//   | 'backend-branch-by-id-edit'
//   | 'backend-branch-by-id-enable-disable'
//   | 'backend-branch-by-id-delete'
//   | 'backend-branch-by-id-assets'
//   | 'backend-organization-by-id-fuels-energies'
//   | 'backend-organization-by-id-emissions-by-energy-multiple-bars-graph'
//   | 'backend-organization-by-id-consumption-by-energy-bars-graph'
//   | 'backend-parameters-entity-by-id-summary'
//   | 'backend-parameters-entity-energy-sources'
//   | 'backend-parameters-entity-assets'
//   | 'backend-parameters-entity-energy-source-by-id'
//   | 'backend-parameters-domain-energy-sources-all'
//   | 'backend-parameters-entity-energy-source-by-id-delete'
//   | 'backend-parameters-domain-assets-all'
//   | 'backend-parameters-entity-assets-by-id-delete'
//   | 'backend-parameters-entity-energy-source-by-id-edit'
//   | 'backend-parameters-entity-asset-by-id-edit'
//   | 'backend-strategy-by-id-scope-2-mitigations-bars-graph'
//   | 'backend-strategy-by-id-consumption-by-energy-bars-graph'
//   | 'backend-strategy-by-id-fuels-energies'
//   | 'backend-strategy-by-id-emissions-by-energy-bars-graph'

// /**
//  * NextJS and other routes
//  */
// export const routes: Record<RouteAlias, string> = {
//   /**
//    * Pages
//    */
//   index: '/',
//   // Auth
//   login: '/auth/login',
//   'register-general-data': '/register/general-data',
//   'register-contact': '/register/contact',
//   'register-classification': '/register/classification',
//   'register-password': '/register/password',
//   'auth-user-validation': '/auth/user-validation',
//   'auth-welcome': '/auth/welcome',
//   'auth-reset-password': '/auth/reset-password/v1',
//   'auth-reset-password-form': '/auth/reset-password/v1/form',
//   'auth-reset-password-success': '/auth/reset-password/v1/success',
//   // Auth v2
//   'register-enterprise-type-selector': '/auth/registration/v2/enterprise-type',
//   'register-chain-general-data': '/auth/registration/v2/chain/general-data',
//   'register-chain-main-contact': '/auth/registration/v2/chain/main-contact',
//   'register-chain-classification': '/auth/registration/v2/chain/classification',
//   'register-organization-general-data':
//     '/auth/registration/v2/organization/general-data',
//   'register-organization-main-contact':
//     '/auth/registration/v2/organization/contact',
//   'register-organization-classification':
//     '/auth/registration/v2/organization/classification',
//   'register-v2-user-password': '/auth/registration/v2/password',
//   'auth-v2-email-validation': '/auth/registration/v2/email-validation',
//   'register-chain-classification-non-naics':
//     '/auth/registration/v2/chain/classification/non-naics',
//   // Dashboard
//   'dashboard-home': '/dashboard/home',
//   'dashboard-initial-registration-home':
//     '/dashboard/admin/e/initial-registration/home',
//   'dashboard-forms-my-organization-data':
//     '/dashboard/admin/e/forms/my-organization-data',
//   'dashboard-home-internal-admin': '/dashboard/admin/i/home',
//   'dashboard-home-external-admin': '/dashboard/admin/e/home',
//   'dashboard-home-external-admin-preview': '/dashboard/admin/e/home/preview',
//   'dashboard-charts-samples': '/dashboard/charts',
//   'dashboard-internal-admin-organizations': '/dashboard/admin/i/organizations',
//   'dashboard-strategies-admin': '/dashboard/admin/i/strategies',
//   'dashboard-my-strategies-external': '/dashboard/admin/e/my-strategies',
//   // Forms
//   'forms-open-by-id': '/forms/:template_id',
//   'forms-new-by-slug': '/forms/s/:form_slug',
//   'forms-edit-by-fillout-id': '/forms/fid/:fillout_id/edit',
//   'forms-view-by-fillout-id': '/forms/fid/:fillout_id/view',
//   // Forms v2
//   'forms-v2-new-by-slug': '/forms/v2/s/:form_slug/fill',
//   'forms-v2-add-year-by-slug': '/forms/v2/s/:form_slug/add-year',
//   'forms-v2-edit-by-fillout-id': '/forms/v2/fid/:fillout_id/edit',
//   // Strategies
//   'strategy-details-by-id': '/strategies/:strategy_id/details',
//   'strategy-by-id-mitigation-measures-control-panel':
//     '/strategies/:strategy_id/mitigation-measures/control-panel',
//   // Chain Businesses
//   'chain-management': '/dashboard/chain-business/management',
//   'chain-home-dashboard': '/dashboard/chain-business/home',
//   'chain-registration-dashboard':
//     '/dashboard/chain-business/registration-dashboard',
//   'chain-edit': '/dashboard/chain-business/edit',
//   // Chain organization requests (create/join)
//   'chain-join-organization-validation':
//     '/auth/requests/chain/organization/join',
//   'chain-join-organization-confirmation':
//     '/auth/requests/chain/organization/join/confirmation',
//   'chain-register-organization': '/auth/requests/chain/organization/create',
//   'chain-register-organization-general-data':
//     '/auth/requests/chain/organization/create/general-data',
//   'chain-register-organization-main-contact':
//     '/auth/requests/chain/organization/create/contact',
//   'chain-register-organization-classification':
//     '/auth/requests/chain/organization/create/classification',
//   'chain-register-organization-password':
//     '/auth/requests/chain/organization/create/password',
//   'chain-register-organization-email-validation':
//     '/auth/requests/chain/organization/create/email-validation',
//   // Organizations
//   'organization-by-id-details': '/organizations/:organization_id/details',
//   'organization-by-id-edit': '/organizations/:organization_id/edit',
//   // Branches
//   'branch-by-id-details': '/branches/:branch_id/details',
//   'branch-by-id-edit': '/branches/:branch_id/edit',
//   // Parameters
//   'parameters-strategy-by-id-dashboard': '/parameters/s/:strategy_id/dashboard',
//   'parameters-organization-by-id-dashboard':
//     '/parameters/o/:organization_id/dashboard',

//   /**
//    * Next.js API
//    */
//   // Geodata
//   'api-get-countries': '/api/geodata/countries',
//   'api-get-states': '/api/geodata/countries/:cid/states',
//   'api-get-cities': '/api/geodata/states/:sid/cities',
//   'api-get-municipalities': '/api/geodata/states/:sid/municipalities',
//   // SCIAN
//   'api-get-scian-sectors': '/api/scian/sector',
//   'api-get-scian-subsectors': '/api/scian/sector/:sector_id/subsector',
//   'api-get-scian-branches': '/api/scian/branch',
//   'api-get-scian-subbranches': '/api/scian/subbranch',
//   'api-get-scian-classes': '/api/scian/class',
//   // Users
//   'api-users-register': '/api/users/register',
//   'api-users-confirm-code': '/api/users/confirm',
//   'api-users-resend-confirmation-code': '/api/users/resend_confirmation',
//   'api-users-activity-log': '/api/users/activity/log',
//   'api-get-users-activity-graph': '/api/users/graphs/users-activity-doughnut',
//   'api-user-email-validation': '/api/users/verification-code',
//   'api-user-email-address-validation': '/api/users/validations/email/:email',
//   'api-user-create': '/api/users/create',
//   'api-get-user-by-id': '/api/users/:user_id',
//   // Auth
//   'api-auth-login': '/api/auth/login',
//   'api-auth-logout': '/api/auth/logout',
//   'api-auth-get-user': '/api/auth/user',
//   'api-auth-verification-code-send': '/api/auth/verification-code/send',
//   'api-auth-verification-code-confirmation':
//     '/api/auth/verification-code/confirm',
//   'api-auth-request-password-reset': '/api/auth/request-password-reset',
//   'api-auth-reset-password': '/api/auth/reset-password',

//   // Forms
//   'api-forms-get-all-templates': '/api/forms/templates',
//   'api-forms-submit-answers': '/api/forms/submit/answers',
//   'api-forms-progress-by-user-id': '/api/forms/progress/:user_id',
//   'api-forms-submit-files-csv': '/api/forms/submit/files/content/csv',
//   'api-forms-submit-files-json': '/api/forms/submit/files/content/json',
//   'api-forms-submit-files-upload': '/api/forms/submit/files/upload',
//   'api-forms-by-fillout-id-delete': '/api/forms/fid/:fillout_id/delete',
//   'api-form-table-import': '/api/forms/table/import',
//   'api-forms-final-confirmation-by-user-id': '/api/forms/confirm/:user_id',
//   'api-form-table-download-file': '/api/forms/table/download/:file_name',
//   'api-forms-v2-progress-by-user-id-filled-years':
//     '/api/forms/progress/s/:slug/u/:user_id/filled-years',
//   'api-forms-by-fillout-id-edit-submit-answers':
//     '/api/forms/fid/:fillout_id/edit/submit/answers',
//   'api-forms-by-fillout-id-submit-files-csv':
//     '/api/forms/fid/:fillout_id/edit/submit/files/content/csv',
//   'api-forms-by-fillout-id-submit-files-json':
//     '/api/forms/fid/:fillout_id/edit/submit/files/content/json',
//   'api-forms-by-fillout-id-submit-files-upload':
//     '/api/forms/fid/:fillout_id/edit/submit/files/upload',
//   'api-forms-user-by-id-progress-check':
//     '/api/forms/user/:user_id/progress/check',
//   'api-forms-organization-by-id-progress':
//     '/api/forms/progress/o/:organization_id',

//   // Internal
//   'api-internal-app-build-info': '/api/internal/app-build',
//   // Strategies
//   'api-get-strategies-graph': '/api/strategies/graphics',
//   'api-get-all-strategies-table': '/api/strategies/general/table',
//   'api-get-all-strategies-performance': '/api/strategies/general/performance',
//   'api-get-all-strategies-status-graph-polar':
//     '/api/strategies/general/graph/status-polar',
//   'api-get-all-strategies-comparative-graph-horizontal-bars':
//     '/api/strategies/general/graph/horizontal-bars-comparative',
//   'api-get-all-strategies-status-by-year-graph-bars':
//     '/api/strategies/general/graph/bars-status-by-year',
//   'api-get-all-strategies-ghg-mitigations-graph-area':
//     '/api/strategies/general/graph/ghg-mitigations-area',
//   'api-all-strategies-search': '/api/strategies/general/search',
//   'api-strategy-by-id-scope-mitigations-bars-graph':
//     '/api/strategies/:strategy_id/graphs/scope-1-mitigations-bars',
//   'api-strategy-by-id-costs-bars-graph':
//     '/api/strategies/:strategy_id/graphs/capex-opex-costs-bars',
//   'api-strategy-by-id-financial-costs':
//     '/api/strategies/:strategy_id/financial-costs',
//   'api-strategy-by-id-ghg-estimated-mitigations-area-graph':
//     '/api/strategies/:strategy_id/graphs/ghg-mitigations-area',
//   'api-strategy-by-id-general-details': '/api/strategies/:strategy_id/details',
//   'api-strategy-by-id-baseline-years':
//     '/api/strategies/:strategy_id/baseline-years',
//   'api-strategy-by-id-financial-impact-area-graph':
//     '/api/strategies/:strategy_id/graphs/financial-impact-area',
//   'api-strategy-by-id-baseline-emissions-doughnut-graph':
//     '/api/strategies/:strategy_id/graphs/baseline-emissions-doughnut',
//   'api-strategy-by-id-mitigation-measures-bars-graph':
//     '/api/strategies/:strategy_id/graphs/savings-mitigation-measures-multiple-bars',
//   'api-strategy-by-id-total-ghg-emissions-stacked-graph':
//     '/api/strategies/:strategy_id/graphs/total-ghg-emissions-stacked-bars',
//   'api-strategy-by-id-mitigations-bars-graphs':
//     '/api/strategies/:strategy_id/graphs/mitigations-bars',
//   'api-strategy-by-id-energy-consumption-horizontal-bars-graph':
//     '/api/strategies/:strategy_id/graphs/energy-consumption-horizontal-bars',
//   'api-strategy-by-id-fractioned-ghg-emissions-stacked-graph':
//     '/api/strategies/:strategy_id/graphs/fractioned-ghg-emissions-multiple',
//   'api-strategy-by-id-my-baseline-bars-graph':
//     '/api/strategies/:strategy_id/graphs/baseline-emissions-bars/:consumption_type',
//   'api-create-strategy': '/api/strategies/create',
//   'api-strategy-by-id-enable-disable':
//     '/api/strategies/:strategy_id/actions/enable-disable',
//   'api-strategy-by-id-expire': '/api/strategies/:strategy_id/actions/expire',
//   'api-strategy-by-id-delete': '/api/strategies/:strategy_id/actions/delete',
//   'api-strategy-by-id-edit': '/api/strategies/:strategy_id/actions/edit',
//   'api-strategy-by-id-mitigation-measure-edit':
//     '/api/strategies/:strategy_id/mitigation-measures/:mitigation_measures_id/actions/edit',
//   'api-strategy-by-id-mitigation-measure-by-id-info':
//     '/api/strategies/:strategy_id/mitigation-measures/:mitigation_measures_id/info',
//   'api-strategy-by-id-scope-2-mitigations-bars-graph':
//     '/api/strategies/:strategy_id/graphs/scope-2-mitigations-bars',
//   'api-strategy-by-id-consumption-by-energy-bars-graph':
//     '/api/strategies/:strategy_id/graphs/consumption-by-energy-bars',
//   'api-strategy-by-id-emissions-by-energy-bars-graph':
//     '/api/strategies/:strategy_id/graphs/emissions-by-energy-bars',
//   'api-strategy-by-id-fuels-energies':
//     '/api/strategies/:strategy_id/fuels-energies',
//   // Organizations
//   'api-get-organizations-overview': '/api/organizations/overview',
//   'api-organization-by-id-baseline-bars-graph':
//     '/api/organizations/:organization_id/graphs/baseline-emissions-bars/:frequency',
//   'api-organization-by-id-baseyear-emissions-doughnut-graph':
//     '/api/organizations/:organization_id/graphs/emissions-by-category-doughnut',
//   'api-organization-by-id-energy-consumption-horizontal-bars-graph':
//     '/api/organizations/:organization_id/graphs/horizontal-bars-graph-categorized-energy',
//   'api-get-all-organizations-status-graph':
//     '/api/organizations/general/graphs/organizations-status-polar',
//   'api-organization-by-id-consumption-factors':
//     '/api/organizations/:organization_id/consumption-factors',
//   'api-organization-by-id-strategies-costs':
//     '/api/organizations/:organization_id/strategies/general/strategies-costs',
//   'api-organization-by-id-financial-impact-area-graph':
//     '/api/organizations/:organization_id/graphs/financial-impact-area',
//   'api-organization-by-id-strategies-baseline-years':
//     '/api/organizations/:organization_id/strategies/general/baseline-years',
//   'api-organization-by-id-users-activity-doughnut-graph':
//     '/api/organizations/:organization_id/graphs/users-activity-doughnut-graph',
//   'api-organization-by-id-projected-baseline-emissions-stacked-graph':
//     '/api/organizations/:organization_id/graphs/projected-baseline-emissions-stacked-bars',
//   'api-organization-by-id-users-activity-table':
//     '/api/organizations/:organization_id/table/users-activity-log',
//   'api-organization-by-id-get-info': '/api/organizations/:organization_id/info',
//   'api-organization-by-id-get-branches':
//     '/api/organizations/:organization_id/branches',
//   'api-organizations-general-table': '/api/organizations/general/table',
//   'api-organization-name-validation':
//     '/api/organizations/validations/name/:organization_name',
//   'api-organization-create': '/api/organizations/create',
//   'api-organization-by-id-branches-table':
//     '/api/organizations/:organization_id/branches/table',
//   'api-organization-by-id-branches-search':
//     '/api/organizations/:organization_id/branches/search',
//   'api-organization-by-id-delete': '/api/organizations/:organization_id/delete',
//   'api-organization-by-id-enable-disable':
//     '/api/organizations/:organization_id/enable-disable',
//   'api-organization-by-id-edit': '/api/organizations/:organization_id/edit',
//   'api-organization-by-id-strategies-table':
//     '/api/organizations/:organization_id/strategies/table',
//   'api-organization-by-id-strategies-search':
//     '/api/organizations/:organization_id/strategies/search',
//   'api-organization-by-id-fuels-energies':
//     '/api/organizations/:organization_id/fuels-energies',
//   'api-organization-by-id-emissions-by-energy-multiple-bars-graph':
//     '/api/organizations/:organization_id/graphs/emissions-by-energy-multiple-bars',
//   'api-organization-by-id-consumption-by-energy-bars-graph':
//     '/api/organizations/:organization_id/graphs/consumption-by-energy-bars',

//   // Dashboards
//   'api-get-home-cards-data': '/api/dashboards/home-cards',
//   // Pipelines
//   'api-pipelines-run-by-dag-id': '/api/pipelines/run/:dag_id',
//   'api-pipeline-v2-run': `/api/pipelines/run`,
//   'api-pipeline-v2-by-dag-id-status-by-run-id': `/api/pipelines/dag/:dag_id/status/:dag_run_id`,
//   // Mitigation Measures
//   'api-strategy-by-id-mitigation-measure-assets':
//     '/api/strategies/:strategy_id/mitigation-measures/assets',
//   'api-strategy-by-id-mitigation-measure-my-baseline-idle-stacked-graph':
//     '/api/strategies/:strategy_id/mitigation-measures/graphs/baseline-stacked',
//   'api-strategy-by-id-mitigation-measure-my-baseline-representation-stacked-graph':
//     '/api/strategies/:strategy_id/mitigation-measures/graphs/baseline-stacked/s/representation',
//   'api-strategy-by-id-mitigation-measure-my-baseline-differential-stacked-graph':
//     '/api/strategies/:strategy_id/mitigation-measures/graphs/baseline-stacked/s/differential',
//   'api-strategy-by-id-mitigation-measure-assets-scope2-consumption-details':
//     '/api/strategies/:strategy_id/mitigation-measures/assets/scope-2/consumption-details',
//   'api-strategy-by-id-mitigation-calculation-s1-driving-techniques':
//     '/api/strategies/:strategy_id/mitigation-measures/calculation/s1/driving-techniques',
//   'api-strategy-by-id-mitigation-measure-scope1-asset-consumption-details':
//     '/api/strategies/:strategy_id/mitigation-measures/assets/scope-1/consumption-details',
//   'api-strategy-by-id-mitigation-measure-current-measures':
//     '/api/strategies/:strategy_id/mitigation-measures/current-measures',
//   'api-strategy-by-id-mitigation-measure-remake':
//     '/api/strategies/:strategy_id/mitigation-measures/:mitigation_measure_id/actions/remake',
//   'api-strategy-by-id-mitigation-measure-delete':
//     '/api/strategies/:strategy_id/mitigation-measures/:mitigation_measure_id/actions/delete',
//   'api-strategy-by-id-mitigation-measure-create':
//     '/api/strategies/:strategy_id/mitigation-measures/create',
//   'api-strategy-by-id-mitigation-measure-scope1-asset-replacement-options':
//     '/api/strategies/:strategy_id/mitigation-measures/assets/replacements/scope-1',
//   'api-strategy-by-id-mitigation-measures-calculation-s1-assets-replacement':
//     '/api/strategies/:strategy_id/mitigation-measures/calculation/s1/assets-replacement',
//   'api-strategy-by-id-mitigation-measures-calculation-s2-ems':
//     '/api/strategies/:strategy_id/mitigation-measures/calculation/s2/ems',
//   'api-strategy-by-id-mitigation-measures-calculations-s2-office-equipment-upgrade':
//     '/api/strategies/:strategy_id/mitigation-measures/calculation/s2/office-equipment-upgrade',
//   'api-strategy-by-id-mitigation-measures-calculation-s2-zero-carbon-electricity':
//     '/api/strategies/:strategy_id/mitigation-measures/calculation/s2/zero-carbon-electricity',
//   'api-strategy-by-id-mitigation-measure-discard-drafts':
//     '/api/strategies/:strategy_id/mitigation-measures/actions/discard-drafts',

//   // Chains
//   'api-chain-name-validation': '/api/chains/validations/name/:corporation_name',
//   'api-chain-create': '/api/chains/create',
//   'api-chain-by-id-strategies-table': '/api/chains/:chain_id/strategies/table',
//   'api-chain-by-id-strategies-search':
//     '/api/chains/:chain_id/strategies/search',
//   'api-chain-by-id-organizations-search':
//     '/api/chains/:chain_id/organizations/search',
//   'api-chain-by-id-organizations-table':
//     '/api/chains/:chain_id/organizations/table',
//   'api-chain-by-id-top-emissions-bars-graph':
//     '/api/chains/:chain_id/graphs/top-emissions-bars',
//   'api-chain-by-id-invite-users': '/api/chains/:chain_id/invite/users',
//   'api-chain-by-id-invite-new-org-assigned-user':
//     '/api/chains/:chain_id/invite/new-organization/user',
//   'api-chain-by-id-invite-existing-organization':
//     '/api/chains/:chain_id/invite/organization',
//   'api-chain-by-id-create-organization':
//     '/api/chains/:chain_id/organizations/create',
//   'api-chain-by-id-details': '/api/chains/:chain_id/details',
//   'api-chain-by-id-registered-organizations-status':
//     '/api/chains/:chain_id/organizations/registration-status',
//   'api-chain-by-id-organization-join':
//     '/api/chains/:chain_id/organizations/join',
//   'api-chain-by-id-registration-confirm':
//     '/api/chains/:chain_id/registration/confirm',
//   'api-chain-by-id-edit': '/api/chains/:chain_id/edit',
//   'api-chain-by-id-delete': '/api/chains/:chain_id/delete',
//   'api-chain-by-id-enable-disable': '/api/chains/:chain_id/enable-disable',
//   'api-chain-by-id-baseline-bars-graph':
//     '/api/chains/:chain_id/graphs/baseline-bars',
//   'api-chain-by-id-ghg-emissions-bars-graph':
//     '/api/chains/:chain_id/graphs/ghg-emissions-bars',
//   'api-chain-by-id-users-activity-doughnut':
//     '/api/chains/:chain_id/graphs/users-activity-doughnut',
//   'api-chain-by-id-users-activity-table':
//     '/api/chains/:chain_id/table/users-activity-log',
//   'api-chain-by-id-financial-impact-area':
//     '/api/chains/:chain_id/graphs/financial-impact-area',
//   'api-chain-by-id-financial-costs': '/api/chains/:chain_id/financial-costs',
//   'api-chain-by-id-consumption-emissions-horizontal-bars-graph':
//     '/api/chains/:chain_id/graphs/consumption-emissions-horizontal-bars',

//   // Chain invitations
//   'api-chain-org-invitation-by-id-status':
//     '/api/chains/invitations/:invitation_id/status',
//   'api-chain-org-invitation-by-id-delete':
//     '/api/chains/invitations/:invitation_id/delete',

//   // Branches
//   'api-branch-create': '/api/branches/create',
//   'api-branch-by-id-details': '/api/branches/:branch_id/details',
//   'api-branch-by-id-baseline-emissions-bars-graph':
//     '/api/branches/:branch_id/graphs/baseline-emissions-bars',
//   'api-branch-by-id-edit': '/api/branches/:branch_id/edit',
//   'api-branch-by-id-delete': '/api/branches/:branch_id/delete',
//   'api-branch-by-id-enable-disable': '/api/branches/:branch_id/enable-disable',
//   'api-branch-by-id-assets': '/api/branches/:branch_id/assets',

//   // Parameters
//   'api-parameters-entity-params-info': '/api/parameters/summary',
//   'api-parameters-entity-energy-sources': '/api/parameters/energy-sources',
//   'api-parameters-entity-assets': '/api/parameters/assets',
//   'api-parameters-entity-energy-sources-create':
//     '/api/parameters/energy-sources/create',
//   'api-parameters-entity-energy-sources-by-id-update':
//     '/api/parameters/energy-sources/:parameter_id/update',
//   'api-parameters-entity-energy-sources-by-id-delete':
//     '/api/parameters/energy-sources/:parameter_id/delete',
//   'api-parameters-entity-assets-create': '/api/parameters/assets/create',
//   'api-parameters-entity-assets-by-id-delete':
//     '/api/parameters/assets/:parameter_id/delete',
//   'api-parameters-entity-assets-by-id-update':
//     '/api/parameters/assets/:parameter_id/update',

//   // Misc
//   'api-example': '/api/example',

//   /**
//    * Backend API
//    */
//   // Geodata
//   'backend-get-countries': `${BACKEND_BASE_URL}/api/v1/geodata/countries`,
//   'backend-get-states': `${BACKEND_BASE_URL}/api/v1/geodata/states/:country_id`,
//   'backend-get-cities': `${BACKEND_BASE_URL}/api/v1/geodata/cities/:state_id`,
//   'backend-get-municipalities': `${BACKEND_BASE_URL}/api/v1/geodata/municipalities/:state_id`,
//   // SCIAN
//   'backend-get-scian-sector': `${BACKEND_BASE_URL}/api/v1/scian/sector`,
//   'backend-get-scian-subsectors': `${BACKEND_BASE_URL}/api/v1/scian/subsector`,
//   'backend-get-scian-branches': `${BACKEND_BASE_URL}/api/v1/scian/branch`,
//   'backend-get-scian-subbranches': `${BACKEND_BASE_URL}/api/v1/scian/sub-branch`,
//   'backend-get-scian-classes': `${BACKEND_BASE_URL}/api/v1/scian/class`,
//   // Users/Auth
//   'backend-login': `${BACKEND_BASE_URL}/api/v1/users/login`,
//   'backend-get-user-by-id': `${BACKEND_BASE_URL}/api/v1/users/:user_id`,
//   'backend-users-register': `${BACKEND_BASE_URL}/api/v1/users/register`,
//   'backend-user-confirm-code': `${BACKEND_BASE_URL}/api/v1/users/confirm`,
//   'backend-user-resend-confirmation-code': `${BACKEND_BASE_URL}/api/v1/users/resend_confirmation`,
//   'backend-user-progress-by-id': `${BACKEND_BASE_URL}/api/v1/users/progress/:user_id`,
//   'backend-users-activity-log': `${BACKEND_BASE_URL}/api/v1/users/general/table`,
//   'backend-get-users-activity-graph': `${BACKEND_BASE_URL}/api/v1/users/graphs/users-activity-doughnut`,
//   'backend-user-email-check': `${BACKEND_BASE_URL}/api/v1/users/validation/email/:email`,
//   'backend-user-verification-code-send': `${BACKEND_BASE_URL}/api/v1/users/auth/verification-code/send`,
//   'backend-user-verification-code-confirmation': `${BACKEND_BASE_URL}/api/v1/users/auth/verification-code/confirm`,
//   'backend-user-register': `${BACKEND_BASE_URL}/api/v1/users/register-user`,
//   'backend-auth-request-password-reset': `${BACKEND_BASE_URL}/api/v1/auth/request-password-reset`,
//   'backend-auth-reset-password': `${BACKEND_BASE_URL}/api/v1/auth/reset-password`,
//   'backend-user-by-id-form-years-progress': `${BACKEND_BASE_URL}/api/v1/users/progress/:slug/:lang/:user_id`,
//   // Forms
//   'backend-get-form-content-by-template-id': `${BACKEND_BASE_URL}/api/v1/form/template/:template_id`,
//   'backend-get-form-content-by-slug': `${BACKEND_BASE_URL}/api/v1/form/template/content/s/:slug_id`,
//   'backend-get-form-template-by-slug': `${BACKEND_BASE_URL}/api/v1/form/template/:slug_id`,
//   'backend-get-form-templates-by-lang': `${BACKEND_BASE_URL}/api/v1/form/templates/:lang`,
//   'backend-forms-submit-answers': `${BACKEND_BASE_URL}/api/v1/form/submit/answers`,
//   'backend-forms-submit-files': `${BACKEND_BASE_URL}/api/v1/form/submit/files`,
//   'backend-forms-table-import': `${BACKEND_BASE_URL}/api/v1/form/table/import`,
//   'backend-forms-final-confirmation-by-user-id': `${BACKEND_BASE_URL}/api/v1/form/confirm/:user_id`,
//   'backend-get-form-content-by-fillout-id': `${BACKEND_BASE_URL}/api/v1/form/fill-out/:fillout_id`,
//   'backend-forms-by-fillout-id-delete': `${BACKEND_BASE_URL}/api/v1/form/fill-out/one/:fillout_id`,
//   'backend-get-form-table-download-file': `${BACKEND_BASE_URL}/api/v1/form/table/download/:file_name`,
//   'backend-forms-by-fillout-id-edit-submit-answers': `${BACKEND_BASE_URL}/api/v1/form/fill-out/:fillout_id/edit/submit/answers`,
//   'backend-forms-by-fillout-id-edit-submit-files': `${BACKEND_BASE_URL}/api/v1/form/fill-out/:fillout_id/edit/submit/files`,
//   'backend-forms-user-by-id-progress-check': `${BACKEND_BASE_URL}/api/v1/form/user/:user_id/progress/check`,
//   'backend-forms-organization-by-id-progress': `${BACKEND_BASE_URL}/api/v1/form/progress/:organization_id`,
//   // About
//   'backend-about-version': `${BACKEND_BASE_URL}/api/v1/about/version`,
//   // Strategies
//   'backend-get-strategies-graph': `${BACKEND_BASE_URL}/api/v1/strategy/general/graph/temporal_name/:period`, // Corresponding to line_chart/:period
//   'backend-get-all-strategies-status-polar-graph': `${BACKEND_BASE_URL}/api/v1/strategy/general/graph/status-polar`,
//   'backend-get-all-strategies-ghg-mitigation-area-graph': `${BACKEND_BASE_URL}/api/v1/strategy/general/graph/ghg-mitigations-area/:frequency`,
//   'backend-get-all-strategies-table': `${BACKEND_BASE_URL}/api/v1/strategy/general/table`,
//   'backend-get-all-strategies-search': `${BACKEND_BASE_URL}/api/v1/strategy/general/search`,
//   'backend-get-all-strategies-performance': `${BACKEND_BASE_URL}/api/v1/strategy/general/performance`,
//   'backend-get-all-strategies-comparative-horizontal-bars-graph': `${BACKEND_BASE_URL}/api/v1/strategy/general/graph/horizontal-bars-comparative`,
//   'backend-get-all-strategies-status-by-year-bars-graph': `${BACKEND_BASE_URL}/api/v1/strategy/general/graph/bars-status-by-year`,
//   'backend-create-strategy': `${BACKEND_BASE_URL}/api/v1/strategy/create`,
//   'backend-strategy-by-id-baseline-emissions-doughnut-graph': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/graphs/baseline-emissions-doughnut`,
//   'backend-strategy-by-id-costs-bars-graph': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/graphs/capex-opex-costs-bars`,
//   'backend-strategy-by-id-energy-consumption-horizontal-bars-graph': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/graphs/energy-consumption-horizontal-bars`,
//   'backend-strategy-by-id-financial-impact-area-graph': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/graphs/financial-impact-area`,
//   'backend-strategy-by-id-fractioned-ghg-emissions-stacked-graph': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/graphs/fractioned-ghg-emissions-multiple`,
//   'backend-strategy-by-id-ghg-estimated-mitigations-area-graph': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/graphs/ghg-mitigations-area`,
//   'backend-strategy-by-id-scope-mitigations-bars-graph': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/graphs/scope-1-mitigations-bars`,
//   'backend-strategy-by-id-mitigation-bars-graph': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/graphs/mitigations-bars`,
//   'backend-strategy-by-id-baseline-years': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/baseline-years`,
//   'backend-strategy-by-id-general-details': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/details`,
//   'backend-strategy-by-id-financial-costs': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/financial-costs`,
//   'backend-strategy-by-id-baseline-emissions-bars-graph': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/graphs/baseline-emissions-bars/:consumption_type`,
//   'backend-strategy-by-id-total-ghg-emissions-stacked-graph': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/graphs/total-ghg-emissions-stacked-bars`,
//   'backend-strategy-by-id-mitigation-measure-current-measures': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/mitigation-measures/current-measures`,
//   'backend-strategy-by-id-actions-enable-disable': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/actions/enable-disable`,
//   'backend-strategy-by-id-actions-expire': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/actions/expire`,
//   'backend-strategy-by-id-actions-delete': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/actions/delete`,
//   'backend-strategy-by-id-actions-edit': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/actions/edit`,
//   'backend-strategy-by-id-scope-2-mitigations-bars-graph': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/graphs/scope-2-mitigations-bars`,

//   // Mitigation Measures
//   'backend-strategy-by-id-mitigation-measure-assets': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/mitigation-measures/assets`,
//   'backend-strategy-by-id-mitigation-measure-create': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/mitigation-measures/create`,
//   'backend-strategy-by-id-mitigation-measures-bars-graph': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/graphs/savings-mitigation-measures-multiple-bars`,
//   'backend-strategy-by-id-mitigation-measure-by-id-info': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/mitigation-measures/:mitigation_measures_id/info`,
//   'backend-strategy-by-id-mitigation-measure-scope1-asset-consumption-details': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/mitigation-measures/assets/scope-1/consumption-details`,
//   'backend-strategy-by-id-mitigation-measure-assets-scope2-consumption-details': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/mitigation-measures/assets/scope-2/consumption-details`,
//   'backend-strategy-by-id-mitigation-measures-calculation-s1-assets-replacement': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/mitigation-measures/calculation/s1/assets-replacement`,
//   'backend-strategy-by-id-mitigation-calculation-s1-driving-techniques': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/mitigation-measures/calculation/s1/driving-techniques`,
//   'backend-strategy-by-id-mitigation-measures-calculation-s2-ems': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/mitigation-measures/calculations/s2/ems`,
//   'backend-strategy-by-id-mitigation-measures-calculations-s2-office-equipment-upgrade': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/mitigation-measures/calculations/s2/office-equipment-upgrade`,
//   'backend-strategy-by-id-mitigation-measures-calculation-s2-zero-carbon-electricity': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/mitigation-measures/calculations/s2/zero-carbon-electricity`,
//   'backend-strategy-by-id-mitigation-measure-my-baseline-idle-stacked-graph': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/mitigation-measures/graphs/baseline-stacked`,
//   'backend-strategy-by-id-mitigation-measure-my-baseline-representation-stacked-graph': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/mitigation-measures/graphs/baseline-stacked/s/representation`,
//   'backend-strategy-by-id-mitigation-measure-my-baseline-differential-stacked-graph': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/mitigation-measures/graphs/baseline-stacked/s/differential`,
//   'backend-strategy-by-id-mitigation-measure-scope1-asset-replacement-options': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/mitigation-measures/assets/replacements/scope-1`,
//   'backend-strategy-by-id-mitigation-measure-edit': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/mitigation-measures/:mitigation_measure_id/actions/edit`,
//   'backend-strategy-by-id-mitigation-measure-delete': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/mitigation-measures/:mitigation_measure_id/actions/delete`,
//   'backend-strategy-by-id-mitigation-measure-remake': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/mitigation-measures/:mitigation_measure_id/actions/remake`,
//   'backend-strategy-by-id-mitigation-measure-discard-drafts': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/mitigation-measures/actions/discard-drafts`,
//   'backend-strategy-by-id-consumption-by-energy-bars-graph': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/graphs/consumption-by-energy-bars`,
//   'backend-strategy-by-id-fuels-energies': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/fuels-energies`,
//   'backend-strategy-by-id-emissions-by-energy-bars-graph': `${BACKEND_BASE_URL}/api/v1/strategy/:strategy_id/graphs/emissions-by-energy-bars`,

//   // Organizations
//   'backend-get-organizations-table': `${BACKEND_BASE_URL}/api/v1/organization/general/table`,
//   'backend-get-all-organizations-status-graph': `${BACKEND_BASE_URL}/api/v1/organization/state/graph`,
//   'backend-get-organization-by-id-categorized-energy-horizontal-bars-graph': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/graphs/horizontal-bars-graph-categorized-energy`,
//   'backend-get-organization-by-id-baseline-emissions-bars-graph': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/graphs/baseline-emissions-bars/:frequency`,
//   'backend-get-organization-by-users-activity-log-table': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/table/users-activity-log`,
//   'backend-get-all-organizations': `${BACKEND_BASE_URL}/api/v1/organization/all`, // DEPRECATED
//   'backend-get-all-organizations-table': `${BACKEND_BASE_URL}/api/v1/organization/general/table`,
//   'backend-organization-by-id-info': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/info`,
//   'backend-organization-by-id-get-all-branches': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/branches`,
//   'backend-organization-by-id-all-strategies-costs': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/strategies/general/strategies-costs`,
//   'backend-organization-by-id-baseyear-emissions-doughnut-graph': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/graphs/emissions-by-category-doughnut`,
//   'backend-organization-by-id-financial-impact-area-graph': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/graphs/financial-impact-area`,
//   'backend-organization-by-id-projected-baseline-emissions-stacked-graph': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/graphs/projected-baseline-emissions-stacked-bars`,
//   'backend-organization-by-id-users-activity-doughnut-graph': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/graphs/users-activity-doughnut`,
//   'backend-organization-by-id-strategies-baseline-years': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/strategies/general/baseline-years`,
//   'backend-organization-name-check': `${BACKEND_BASE_URL}/api/v1/organization/validation/name/:organization_name`,
//   'backend-organization-create': `${BACKEND_BASE_URL}/api/v1/organization/create/register`,
//   'backend-organization-by-id-branches-table': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/branches/table`,
//   'backend-organization-by-id-branches-search': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/branches/search`,
//   'backend-organization-by-id-delete': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/delete`,
//   'backend-organization-by-id-enable-disable': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/enable-disable`,
//   'backend-organization-by-id-edit': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/edit`,
//   'backend-organization-by-id-strategies-table': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/strategies/table`,
//   'backend-organization-by-id-strategies-search': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/strategies/search`,
//   'backend-organization-by-id-fuels-energies': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/fuels-energies`,
//   'backend-organization-by-id-emissions-by-energy-multiple-bars-graph': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/graphs/emissions-by-energy-multiple-bars`,
//   'backend-organization-by-id-consumption-by-energy-bars-graph': `${BACKEND_BASE_URL}/api/v1/organization/:organization_id/graphs/consumption-by-energy-bars`,

//   // Dashboards
//   'backend-get-home-cards-data': `${BACKEND_BASE_URL}/api/v1/organization/home/cards`,
//   // Pipelines
//   'backend-pipelines-run-by-dag-id': `${BACKEND_BASE_URL}/api/v1/pipeline/run/:dag_id`,
//   'backend-pipeline-v2-run': `${BACKEND_BASE_URL}/api/v1/pipeline/run`,
//   'backend-pipeline-v2-by-dag-id-status-by-run-id': `${BACKEND_BASE_URL}/api/v1/pipeline/dag/:dag_id/status/:dag_run_id`,

//   // Chains
//   'backend-chain-name-check': `${BACKEND_BASE_URL}/api/v1/chain/validation/name/:corporation_name`,
//   'backend-chain-create': `${BACKEND_BASE_URL}/api/v1/chain/create/register`,
//   'backend-chain-by-id-invite-users': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/invite/users`,
//   'backend-chain-by-id-invite-new-org-assigned-user': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/invite/new-organization/user`,
//   'backend-chain-by-id-invite-existing-organization': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/invite/organization`,
//   'backend-chain-by-id-create-organization': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/organization/create`,
//   'backend-chain-by-id-details': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/details`,
//   'backend-chain-by-id-registered-organizations-status': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/organizations/registration-status`,
//   'backend-chain-by-id-organization-join': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/organization/join`,
//   'backend-chain-by-id-registration-confirm': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/registration/confirm`,
//   'backend-chain-by-id-edit': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/edit`,
//   'backend-chain-by-id-delete': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/delete`,
//   'backend-chain-by-id-enable-disable': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/disable-enable`,
//   'backend-chain-by-id-top-emissions-bars-graph': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/graphs/top-emissions-bars-graph`,
//   'backend-chain-by-id-strategies-search': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/strategies/general/search`,
//   'backend-chain-by-id-strategies-table': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/strategies/general/table`,
//   'backend-chain-by-id-organizations-search': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/organizations/general/search`,
//   'backend-chain-by-id-organizations-table': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/organizations/general/table`,
//   'backend-chain-by-id-baseline-bars-graph': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/graphs/baseline-bars`,
//   'backend-chain-by-id-ghg-emissions-bars-graph': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/graphs/ghg-emissions-bars`,
//   'backend-chain-by-id-users-activity-doughnut': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/graphs/users-activity-doughnut`,
//   'backend-chain-by-id-users-activity-table': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/table/users-activity-log`,
//   'backend-chain-by-id-financial-impact-area': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/graphs/financial-impact-area`,
//   'backend-chain-by-id-financial-costs': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/financial-costs`,
//   'backend-chain-by-id-consumption-emissions-horizontal-bars-graph': `${BACKEND_BASE_URL}/api/v1/chain/:chain_id/graphs/consumption-emissions-horizontal-bars`,

//   // Chains invitations
//   'backend-chain-org-invitation-by-id-status': `${BACKEND_BASE_URL}/api/v1/chain/organization/invitation/:invitation_id`,
//   'backend-chain-org-invitation-by-id-delete': `${BACKEND_BASE_URL}/api/v1/chain/organization/invitation/:invitation_id/delete`,

//   // Branches
//   'backend-branch-create': `${BACKEND_BASE_URL}/api/v1/branch/create`,
//   'backend-branch-by-id-details': `${BACKEND_BASE_URL}/api/v1/branch/:branch_id/details`,
//   'backend-branch-by-id-baseline-emissions-bars-graph': `${BACKEND_BASE_URL}/api/v1/branch/:branch_id/graphs/baseline-emissions-bars`,
//   'backend-branch-by-id-edit': `${BACKEND_BASE_URL}/api/v1/branch/:branch_id/edit`,
//   'backend-branch-by-id-delete': `${BACKEND_BASE_URL}/api/v1/branch/:branch_id/delete`,
//   'backend-branch-by-id-enable-disable': `${BACKEND_BASE_URL}/api/v1/branch/:branch_id/enable-disable`,
//   'backend-branch-by-id-assets': `${BACKEND_BASE_URL}/api/v1/branch/:branch_id/assets`,

//   // Parameters
//   'backend-parameters-entity-by-id-summary': `${BACKEND_SECONDARY_BASE_URL}/parameter/summary/:domain_id`,
//   'backend-parameters-entity-energy-sources': `${BACKEND_SECONDARY_BASE_URL}/parameter/energy`,
//   'backend-parameters-domain-energy-sources-all': `${BACKEND_SECONDARY_BASE_URL}/parameter/energy/all/:id_domain`,
//   'backend-parameters-entity-assets': `${BACKEND_SECONDARY_BASE_URL}/parameter/asset`,
//   'backend-parameters-entity-energy-source-by-id': `${BACKEND_SECONDARY_BASE_URL}/parameter/energy/:parameter_id`,
//   'backend-parameters-entity-energy-source-by-id-delete': `${BACKEND_SECONDARY_BASE_URL}/parameter/energy/:parameter_id`,
//   'backend-parameters-domain-assets-all': `${BACKEND_SECONDARY_BASE_URL}/parameter/asset/all/:id_domain`,
//   'backend-parameters-entity-assets-by-id-delete': `${BACKEND_SECONDARY_BASE_URL}/parameter/asset/:parameter_id`, // PMT-9
//   'backend-parameters-entity-energy-source-by-id-edit': `${BACKEND_SECONDARY_BASE_URL}/parameter/energy/:parameter_id`,
//   'backend-parameters-entity-asset-by-id-edit': `${BACKEND_SECONDARY_BASE_URL}/parameter/asset/:parameter_id`, // PMT-8
// }
