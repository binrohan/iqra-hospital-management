var Controller = new function () {
    var callarOptions, filter = { "field": "ReferredBy", "value": "", Operation: 0 };
    function onAdmissionDetails(model) {
        Global.Add({
            AdmissionId: model.Id,
            name: 'AdmissionDetails',
            url: '/Content/IqraHMS/AdmissionArea/Js/Admission/onAdmissionDetails.js',
        });
    };
    function onDoctorDetails(model) {
        Global.Add({
            DoctorId: model.ConsultantId,
            name: 'DoctorDetails',
            url: '/Content/IqraHMS/DoctorsArea/Js/Doctor/DoctorDetails.js',
        });
    };
    function onPatientDetails(model) {
        Global.Add({
            PatientId: model.PatientId,
            name: 'PatientDetails',
            url: '/Content/IqraHMS/PatientArea/Js/Patient/PatientDetails.js',
        });
    };
    function OnBedDetails(model) {
        Global.Add({
            BedId: model.BedId,
            name: 'BedDetails',
            url: '/Content/IqraHMS/RoomArea/Js/Bed/OnBedDetails.js',
        });
    };
    this.Show = function (model) {
        callarOptions = model;
        filter.value = model.ReferenceId;
        Global.Add({
            title: 'Reference Details',
            selected: 1,
            Tabs: [
                {
                    title: 'Basic Info',
                    Columns: [
                        { field: 'Name', title: 'Name'},
                        { field: 'Mobile', title: 'Mobile'},
                        { field: 'Email', title: 'Email' },
                        { field: 'Gender', title: 'Gender' },
                        { field: 'Remarks', title: 'Remarks'},
                        { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy hh:mm' },
                        { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy hh:mm' },
                    ],
                    DetailsUrl: function () {
                        return '/ReferralArea/Reference?Id=' + model.ReferenceId;
                    }
                },
                {
                    title: 'Admissions',
                    Grid: [{
                        Header: 'Admissions',
                        filter: [filter],
                        Url: '/AdmissionArea/Admission/Get',
                        ondatabinding: function (response) {

                        },
                        Summary: {
                            Container: function (container) {
                                return container.find('.filter_container');
                            },
                            Items: [
                                { field: 'AdmissionCharge', title: 'Fees', type: 2 },
                                { field: 'Advance', type: 2 }
                            ]
                        },
                        Columns: [
                            { field: 'AdmissionNo', title: 'Admission No.', Click: onAdmissionDetails },
                            { field: 'Doctor', Click: onDoctorDetails },
                            { field: 'Reference' },
                            { field: 'Patient', Click: onPatientDetails },
                            { field: 'Bed', Click: OnBedDetails },
                            { field: 'Disease', },
                            { field: 'Status', },
                            { field: 'Date', title: 'Admitted-At', dateFormat: 'dd/mmm-yyyy hh:mm' },
                            { field: 'DischargeDate', title: 'Discharge-At', dateFormat: 'dd/mmm-yyyy hh:mm' },
                            { field: 'AdmissionStatus', title: 'Admission Status', selected: false },
                            { field: 'CurrentStatus', title: 'Current Status', selected: false },
                            { field: 'DischargeStatus', title: 'Discharge Status', selected: false },
                            { field: 'Profession', selected: false },
                            { field: 'FatherName', title: 'FatherName', selected: false },
                            { field: 'MotherName', title: 'MotherName', selected: false },
                            { field: 'Gender', },
                            { field: 'DateOfBirth', title: 'DOB', dateFormat: 'dd/mmm-yyyy', selected: false },
                            { field: 'EmergencyContactNameOne', title: 'Contact Name-1', selected: false },
                            { field: 'EmergencyContactNumberOne', title: 'Contact-1' },
                            { field: 'EmergencyContactNameTwo', title: 'Contact Name-2', selected: false },
                            { field: 'EmergencyContactNumberTwo', title: 'Contact-2' },
                            { field: 'PresentAddress', title: 'Present Address', selected: false },
                            { field: 'PermanentAddress', title: 'Permanent Address', selected: false },
                            { field: 'AdmissionCharge', title: 'Fees', type: 2 },
                            { field: 'Advance', type: 2 },
                            { field: 'Account' },
                            { field: 'Remarks', },
                            { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                            { field: 'Creator' },
                        ]
                    }],
                }
            ],
            name: 'OnLoanStructureDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js',
        });
    };
};
