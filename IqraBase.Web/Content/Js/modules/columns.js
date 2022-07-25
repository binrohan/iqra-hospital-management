export const commonColumns = [
    { field: 'Creator', title: 'Creator', add: false },
    { field: 'CreatedAt', title: 'Creation Date', add: false, dateFormat: 'dd mmm yyyy', },
    { field: 'Remarks', title: 'Remarks', Width: '255px', add: { sibling: 1 } },
    { field: 'Updator', title: 'Updator', add: false },
    { field: 'UpdatedAt',  title: 'Last Updated', add: false, dateFormat: 'dd mmm yyyy', }
];

export const otServiceColumns = [
    { field: 'Name', filter: true, Width: '255px', add: {sibling: 1} },
    { field: 'Price', filter: true, add: {datatype: 'float' }, type: 2},
    { field: 'Unit', filter: true },
    ...commonColumns
];

export const surgeryColumns = [
    { field: 'Code', filter: true, add: false },
    { field: 'Name', filter: true, Width: '255px' },
    { field: 'Price', filter: true, add:{dataType: 'float' }, type: 2},
    ...commonColumns
];

export const operationColums = [
    { field: 'Name', title: 'Surgery Name', filter: true, Width: '255px', add: false },
    { field: 'Status', filter: true, add: false},
    { field: 'TotalPayment', title: 'Payable', add: false, type: 2, filter: true},
    { field: 'PaiedAmount', title: 'Paied Amount', add: false, type: 2, filter: true},
    { field: 'PreServiceStartedAt', title: 'Pre Service Starting Date', add: {sibling: 3}, dateFormat: 'dd mmm yyyy' },
    { field: 'OperationStartedAt', title: 'Operation Date Time', add: {sibling: 3}, dateFormat: 'dd mmm yyyy' },
    { field: 'PostServiceStartedAt', title: 'Post Service Started At', add: {sibling: 3}, dateFormat: 'dd mmm yyyy' },
    { field: 'FinishedAt', title: 'Operation Completed', add: false },
    ...commonColumns
];

export const operationPaymentColumns = [
    { field: 'PatientName', title: 'Patient Name' },
    { field: 'Name', title: 'Surgery Name' },
    { field: 'TotalPayment', title: 'Patient Name', add: {sibling: 3} },
    { field: 'PaiedAmount', title: 'PaiedA mount', add: {sibling: 3} },
    { field: 'Payment Left', title: 'Payment Left', add: {sibling: 3} },
    { field: 'Amount', title: 'Payment Left'},
    { field: 'PaymentBy', title: 'Payment By'},
    { field: 'Remarks', title: 'Remarks', add: {sibling: 1} }
];

export const statusChangeColumns = [
    { field: 'Status', title: 'Current Status' },
    { field: 'Remarks', title: 'Remarks', add: {sibling: 1} },
];

export const surgonColumns = [
    { field: 'SurgonName', title: 'SurgonName' },
    { field: 'SurgeryName', title: 'Surgery Name' },
    { field: 'Charge', title: 'Charge' },
    ...commonColumns
];