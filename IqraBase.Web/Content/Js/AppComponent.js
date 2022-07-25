
(function () {
    var that = this;
    function onDetails(func,defaultId) {
        return function (opt) {
            opt = opt || { Id: defaultId || 'Id' };
            if (typeof (opt) == 'string') {
                opt = { Id: opt };
            }
            return function (...param) {
                param = param || [];
                func.apply(this, [opt].concat(param));
            };
        };
    };
    function autoComplete(func) {
        return function (opt) {
            Global.AutoComplete.Bind(func(opt));
        };
    };
    function onDoctorDetails(opt,data,grid) {
        Global.Add({
            DoctorId: data[opt.Id],
            name: 'DoctorDetails',
            url: '/Content/IqraHMS/DoctorsArea/Js/Doctor/DoctorDetails.js',
        });
    };
    function onServiceDetails(opt, data, grid) {
        Global.Add({
            ServiceId: data[opt.Id],
            name: 'ServiceDetails',
            url: '/Content/IqraHMS/ServiceArea/Js/HospitalService/ServiceDetails.js',
        });
    };
    function onInvestigationItemDetails(opt, data, grid) {
        Global.Add({
            model: data,
            name: 'InvestigationItemDetails',
            url: '/Content/IqraHMS/InvestigationArea/Js/InvestigationItem/OnDetails.js',
        });
    };
    function onCandidateReportTitleDetails(opt, data, grid) {
        console.log(['opt, data, grid', opt, data, grid]);
        Global.Add({
            TitleId: data[opt.Id],
            name: 'CandidateReportTitleDetails',
            url: '/Content/IqraHMS/CandidateReportArea/Js/CandidateReportTitle/CandidateReportTitleDetails.js',
        });
    }
    function onPatientDetails(opt, data, grid) {
        Global.Add({
            PatientId: data[opt.Id],
            name: 'PatientDetails',
            url: '/Content/IqraHMS/PatientArea/Js/Patient/PatientDetails.js',
        });
    };
    function onReferrerDetails(opt, data, grid) {
        Global.Add({
            ReferenceId: data[opt.Id],
            name: 'ReferenceDetails',
            url: '/Content/IqraHMS/ReferralArea/Js/Reference/ReferenceDetails.js',
        });
    };
    function onAdmissionDetails(opt, data, grid) {
        Global.Add({
            AdmissionId: data[opt.Id],
            name: 'AdmissionDetails',
            url: '/Content/IqraHMS/AdmissionArea/Js/Admission/onAdmissionDetails.js',
        });
    };
    function onBedDetails(opt, data, grid) {
        Global.Add({
            BedId: data[opt.Id],
            name: 'BedDetails',
            url: '/Content/IqraHMS/RoomArea/Js/Bed/OnBedDetails.js',
        });
    };
    function onUserDetails(opt, data, grid) {
        Global.Add({
            UserId: data[opt.Id],
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };

    function getCommissionTypeDataSource() {
        return [
            { text: 'No Commission', value: 'No Commission' },
            { text: 'Default Commission', value: 'Default Commission' },
            { text: 'Fixed', value: 'Fixed' },
            { text: 'Percentage(%)', value: 'Percentage(%)' }
        ];
    };
    this.Doctor = {
        Details: onDetails(onDoctorDetails),
        Columns: function (accessModel) {
            accessModel = accessModel || {};
            var column = [{ field: 'Name', title: 'Name', filter: true, width: 130, Click: accessModel.Details ? AppComponent.Doctor.Details() : none, position: 1, add: { sibling: 3 } },
            { field: 'EmployeeCode', title: 'Doctor Code', width: 100, add: false },
            { field: 'CAddress', title: 'Current Address', selected: false, position: 10, add: { type: 'textarea' }, required: false },
            { field: 'PAddress', title: 'Permanent Address', selected: false, position: 11, add: { type: 'textarea' }, required: false },
            { field: 'Department', title: 'Department', add: false },
            { field: 'Designation', title: 'Designation', add: false },
            { field: 'Fee', title: 'Fee', width: 50, add: false }];
            if (accessModel.Create) {
                column.push({ field: 'Group', title: 'Commission Group', add: false });
            }
            column = column.concat([
                { field: 'Phone', title: 'Phone', position: 4, filter: true },
                { field: 'BMDCNo', title: 'BMDCNo', filter: true, position: 3, add: { sibling: 3 } },
                { field: 'DoctorTitle', title: 'DoctorTitle', position: 6, filter: true, selected: false },
                { field: 'Email', title: 'Email', position: 5, filter: true, selected: false, required: false },
                { field: 'Gender', title: 'Gender', filter: true, selected: false, add: false },
                { field: 'ChamberAddress', title: 'Chamber Address', position: 7, width: 130 },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', selected: false, add: false },
                { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', selected: false, add: false },
                { field: 'Remarks', title: 'Remarks', position: 12, required: false, add: { sibling: 1, type: 'textarea' } },
                {
                    field: 'IsDeleted', title: 'Is Deleted?', selected: false, filter: {
                        Operation: 0,
                        DropDown: {
                            dataSource: [
                                { text: 'Select Type', value: '' },
                                { text: 'Active', value: '0' },
                                { text: 'Deleted', value: '1' }
                            ]
                        }
                    }, Operation: 0, add: false
                }
            ]);
            return column;
        },
        Add: function (opt, isAdd) {
            opt = opt || {};
            Global.Add(Global.Copy(opt,{
                name: isAdd ? 'Doctors' : 'Doctor',
                columns: AppComponent.Doctor.Columns({ Create:true}),
                saveChange: '/DoctorsArea/Doctor/Update',
                save: '/DoctorsArea/Doctor/Create',
                dropdownList: [
                    {
                        Id: 'Gender',
                        position: 2,
                        add: { sibling: 3 },
                        dataSource: [
                            { text: 'Male', value: 'Male' },
                            { text: 'Female', value: 'Female' },
                            { text: 'Other', value: 'Other' }
                        ]
                    }, {
                        Id: 'DepartmentId',
                        position: 3,
                        url: '/CommonArea/Department/AutoComplete',
                        add: { sibling: 3 },
                        type: 'AutoComplete'
                    }, {
                        Id: 'DesignationId',
                        position: 3,
                        url: '/CommonArea/Designation/DoctorAutoComplete',
                        add: { sibling: 3 },
                        type: 'AutoComplete'
                    }, {
                        Id: 'GroupId',
                        title: 'Commission Group',
                        position: 3,
                        url: '/CommissionArea/CommissionGroup/AutoComplete',
                        add: { sibling: 3 },
                        type: 'AutoComplete'
                    }
                ],
                additionalField: [
                    { field: 'UserName', title: 'User Name', position: 3.2, add: isAdd ? { type: 'input' } : false },
                    { field: 'Password', title: 'Password', position: 3.2, add: isAdd ? { type: 'password' } : false }
                ]
            },true));
        },
        AutoComplete: function (opt) {
            return Global.Copy(opt, {
                Id: opt.Id || 'ConsultantId',
                url: opt.url || '/DoctorsArea/Doctor/AutoComplete',
                create: AppComponent.Doctor.Add,
                Grid: {
                    url: '/DoctorsArea/Doctor/Get',
                    Columns: AppComponent.Doctor.Columns()
                }
            }, true);
        }
    };
    this.Doctor.AutoCompleteDone = autoComplete(this.Doctor.AutoComplete);
    this.Service = {
        Details: onDetails(onServiceDetails),
        Columns: function () {
            return [
                { field: 'Name', title: 'Name', position: 1 },
                { field: 'Charge', title: 'Charge', type: 2, position: 3, add: { datatype: 'float', } },
                { field: 'ServiceType', title: 'Service Type', add: false, position: 9 },
                { field: 'Unit', position: 2 },
                { field: 'MaxDiscount', title: 'Max-Discount', position: 4, add: { datatype: 'float', } },
                { field: 'DoctorCommissionType', title: 'Dr-Commission Type', add: false },
                { field: 'DoctorCommission', title: 'Dr-Commission', position: 6, add: { datatype: 'float' } },
                { field: 'ReferrerCommissionType', title: 'Re-Commission Type', add: false },
                { field: 'ReferrerCommission', title: 'Re-Commission', position: 8, add: { datatype: 'float' } },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', add: false, selected: false },
                { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', add: false, selected: false },
                { field: 'Remarks', title: 'Remarks', filter: true, required: false, add: { type: 'textarea', sibling: 1 } }

            ];
        },
        Add: function (opt) {
            return Global.Copy(opt, {
                name: 'HospitalServiceCreate',
                columns: AppComponent.Service.Columns(),
                save: '/ServiceArea/HospitalService/Create',
                saveChange: '/ServiceArea/HospitalService/Edit',
                dropdownList: [{
                    Id: 'ServiceType',
                    title: 'Service Type',
                    position: 9,
                    dataSource: [
                        { text: 'Hourly', value: 'Hourly' },
                        { text: 'Daily', value: 'Daily' },
                        { text: 'One Time', value: 'OneTime' },
                    ]
                }, {
                    position: 5,
                    Id: 'DoctorCommissionType',
                    title: 'Dr-Commission Type',
                    dataSource: getCommissionTypeDataSource()
                }, {
                    position: 7,
                    title: 'Re-Commission Type',
                    Id: 'ReferrerCommissionType',
                    dataSource: getCommissionTypeDataSource()
                }],
            }, true)
        },
        AddDone: function (opt) {
            Global.Add(AppComponent.Service.Add(opt));
        },
        AutoComplete: function (opt) {
            return Global.Copy(opt, {
                Id: opt.Id || 'ServiceId',
                url: opt.url || '/ServiceArea/HospitalService/AutoComplete',
                create: AppComponent.Service.AddDone,
                Grid: {
                    url: '/ServiceArea/HospitalService/Get',
                    Columns: AppComponent.Service.Columns()
                }
            }, true);
        }
    };
    this.Service.AutoCompleteDone = autoComplete(this.Service.AutoComplete);
    this.PatientService = {
        Columns: function () {
            return [
                { field: 'Service', click: onDetails(onServiceDetails)('ServiceId') },
                { field: 'Patient', click: onDetails(onPatientDetails)('PatientId')  },
                { field: 'Doctor', click: AppComponent.Doctor.Details('ConsultantId')  },
                { field: 'Referrer', click: onDetails(onReferrerDetails)('ReferredBy')  },
                { field: 'Admission', click: onDetails(onAdmissionDetails)('AdmissionId')  },
                { field: 'Status', },
                { field: 'Unit', title: 'Quantity', type: 2 },
                { field: 'Rate', type: 2 },
                { field: 'Amount', type: 2 },
                { field: 'Discount', type: 2, selected: false },
                { field: 'NetPayable', type: 2 },
                { field: 'MaxDiscount', type: 2, selected: false },
                { field: 'UnitType', title: 'Unit', selected: false },
                { field: 'StartAt', title: 'Start-At', dateFormat: 'dd mmm-yyyy hh:mm' },
                { field: 'EndAt', title: 'EndAt', dateFormat: 'dd mmm-yyyy hh:mm' },
                { field: 'DrCommission', title: 'Dr-Commission', selected: false },
                { field: 'ReCommission', title: 'Re-Commission', selected: false },
                { field: 'Remarks' }
            ];
        },
    };
    this.Patient = {
        Details: onDetails(onPatientDetails),
    };
    this.Referrer = {
        Details: onDetails(onReferrerDetails),
    };
    this.Admission = {
        Details: onDetails(onAdmissionDetails),
        Columns: function () {
            return [
                { field: 'AdmissionNo', title: 'Admission No.', Click: AppComponent.Admission.Details() },
                { field: 'Doctor', Click: AppComponent.Doctor.Details('ConsultantId') },
                { field: 'Reference', Click: AppComponent.Referrer.Details('ReferredBy') },
                { field: 'Patient', Click: AppComponent.Patient.Details('PatientId') },
                { field: 'Bed', Click: AppComponent.Bed.Details('BedId') },
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
                { field: 'Creator', filter: true },

            ]
        }
    };
    this.Bed = {
        Details: onDetails(onBedDetails),

    };
    this.CommissionSetting = {
        //Details: onDetails(onServiceDetails),
        Columns: function () {
            return [
                { field: 'Name', position: 1, add: { sibling: 3 } },
                { field: 'UsageArea', title: 'Usage Area', add: false },
                { field: 'MaxDiscount', title: 'Max-Discount', position: 3, add: { datatype: 'float', sibling: 3 } },
                { field: 'DoctorCommissionType', title: 'Dr-Commission Type', add: false },
                { field: 'DoctorCommission', title: 'Dr-Commission', position: 4, add: { datatype: 'float' } },
                { field: 'ReferrerCommissionType', title: 'Re-Commission Type', add: false },
                { field: 'ReferrerCommission', title: 'Re-Commission', position: 6, add: { datatype: 'float' } },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', add: false },
                { field: 'Creator', add: false },
                { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', add: false },
                { field: 'Remarks', title: 'Remarks', required: false, position: 8, add: { sibling: 1, type: 'textarea' } }
            ];
        },
        Add: function (opt) {

            return Global.Copy(opt, {
                name: 'CommissionSettingCreate',
                columns: AppComponent.CommissionSetting.Columns(),
                save: '/CommissionArea/CommissionSetting/Create',
                saveChange: '/CommissionArea/CommissionSetting/Edit',
                dropdownList: [{
                    Id: 'UsageArea',
                    title: 'Usage Area',
                    position: 2,
                    dataSource: [
                        { text: 'DefaultSetting', value: 'DefaultSetting' },
                        { text: 'All', value: 'All' },
                        { text: 'Bed', value: 'Bed' },
                        { text: 'Investigation', value: 'Investigation' },
                    ],
                    add: { sibling: 3 }
                }, {
                    position: 5,
                    Id: 'DoctorCommissionType',
                    title: 'Dr-Commission Type',
                    dataSource: getCommissionTypeDataSource()
                }, {
                    position: 7,
                    title: 'Re-Commission Type',
                    Id: 'ReferrerCommissionType',
                    dataSource: getCommissionTypeDataSource()
                }]
            }, true)
        },
        AddDone: function (opt) {
            Global.Add(AppComponent.CommissionSetting.Add(opt));
        },
        AutoComplete: function (opt, usageArea) {
            var page;
            if (opt.UsageArea || usageArea) {
                page = { "PageNumber": 1, "PageSize": 30, filter: [{ "field": "UsageArea", "value": opt.UsageArea || usageArea, Operation: 0 }] };
            }
            return Global.Copy(opt, {
                Id: opt.Id || 'CommissionSettingId',
                url: opt.url || '/CommissionArea/CommissionSetting/AutoComplete',
                create: AppComponent.CommissionSetting.AddDone,
                page: page,
                Type: 'AutoComplete',
                Grid: {
                    url: '/CommissionArea/CommissionSetting/Get',
                    Columns: AppComponent.CommissionSetting.Columns()
                }
            }, true);
        }
    };
    this.AccountReference = {
        DataSounce: function () {
            return [
                { text: 'Expense', value: 'Expense' },
                { text: 'Admission', value: 'Admission' },
                { text: 'Patient Investigation', value: 'PatientInvestigation' },
                { text: 'Suplier Payment', value: 'Suplier Payment' },
                { text: 'Id Card', value: 'Id Card' },
                { text: 'Patient Payment', value: 'Patient Payment' },
                { text: 'Salvage Value', value: 'Salvage Value' },
                { text: 'Salvage Value Received', value: 'Salvage Value Received' }
            ];
        },
        Columns: function () {
            return [
                { field: 'Account', add: false, },
                { field: 'Reference', add: false, filter: { DropDown: { dataSource: AppComponent.AccountReference.DataSounce() } } },
                { field: 'Position', add: { datatype: 'float', sibling: 3 }, },
                { field: 'IsDeletedAccount', title: 'Is Account Deleted', add: false },
                { field: 'Remarks', required: false, filter: true, add: { sibling: 1, type: 'textarea' } },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', add: false, },
                { field: 'Creator', filter: true, click: onDetails(onUserDetails, 'CreatedBy'), add: false, }
            ];
        },
        Add: function (opt,reference) {
            var data, list = [
                {
                    Id: 'AccountId',
                    url: '/AccountantArea/AppAccount/AutoComplete',
                    position: 1,
                    type: 'AutoComplete',
                    add: { sibling: 3 }
                }
            ];
            if (reference) {
                data = { Reference: reference };
            } else {
                list.push({
                    Id: 'Reference',
                    dataSource: AppComponent.AccountReference.DataSounce(),
                    position: 2,
                    add: { sibling: 3 }
                });
            }
            return Global.Copy(opt, {
                postData: data,
                name: 'AccountReferenceCreate',
                columns: AppComponent.AccountReference.Columns(),
                save: '/CommonArea/AccountReference/Create',
                saveChange: '/CommonArea/AccountReference/Edit',
                dropdownList: list
            }, true);
        },
        AddDone: function (opt, reference) {
            Global.Add(AppComponent.AccountReference.Add(opt, reference));
        },
        AutoComplete: function (opt, reference) {
            var ref = reference ? '?reference=' + reference : '';
            return Global.Copy(opt, {
                Id: opt.Id || 'AccountId',
                url: opt.url || '/CommonArea/AccountReference/AutoComplete' + ref,
                Create: function (opt) {
                    return AppComponent.AccountReference.AddDone(opt, reference);
                },
                Type: 'AutoComplete',
                Grid: {
                    url: '/CommonArea/AccountReference/Get',
                    Columns: AppComponent.AccountReference.Columns()
                }
            }, true);
        }
    };
    this.InvestigationItem = {
        Details: onDetails(onInvestigationItemDetails),
        Columns: function (isDrp) {
            return [
                {
                    field: 'Actions', filter: false, sorting: false, add: false, width:70, bound: function (td) {
                        td.html('<input type="checkbox" data-binding="IsSelected" />');
                        $(Global.Form.Bind(this, td)['IsSelected']).click((evt) => evt.stopPropagation());
                        td.click(() => { this.IsSelected = !this.IsSelected })//.find('input').click();
                    }
                },
                { field: 'Name', filter: true, click: AppComponent.InvestigationItem.Details(), position: 1, add: { sibling: isDrp? 3:2 } },//BatchNumber
                { field: 'Investigation', filter: true, add: false },//BatchNumber
                { field: 'Unit', filter: true, position: 1, required: false, add: { sibling: isDrp ? 3 : 2 } },
                { field: 'Refference', filter: true, required: false, position: 3, add: { type: 'textarea', sibling: 1 } },
                { field: 'Category', filter: true, add: false },
                { field: 'Group', filter: true, add: false },
                { field: 'Remarks', filter: true, required: false, position: 4, add: { type: 'textarea', sibling: 1 } },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', add: false, selected: false },
                { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', add: false, selected: false },
                { field: 'Creator', add: false, filter: true, click: onDetails(onUserDetails, 'CreatedBy') }
            ];
        },
        Add: function (opt) {
            var drp = [];
            if (opt.IsDRP) {
                drp = [{
                    Id: 'InvestigationId',
                    position: 2,
                    url: '/InvestigationArea/Investigation/AutoComplete',
                    Type: 'AutoComplete',
                    add: { sibling: 3 }
                }];
            }
            return Global.Copy(opt, {
                name: 'InvestigationItemCreate',
                columns: AppComponent.InvestigationItem.Columns(drp.length),
                save: '/InvestigationArea/InvestigationItem/Create',
                saveChange: '/InvestigationArea/InvestigationItem/Edit',
                dropdownList: drp,
            }, true)
        },
        AddDone: function (opt) {
            Global.Add(AppComponent.InvestigationItem.Add(opt));
        },
        AutoComplete: function (opt) {
            return Global.Copy(opt, {
                Id: opt.Id || 'InvestigationItemId',
                url: opt.url || '/InvestigationArea/Investigation/AutoComplete',
                create: AppComponent.InvestigationItem.AddDone,
                Grid: {
                    url: '/InvestigationArea/Investigation/Get',
                    Columns: AppComponent.InvestigationItem.Columns()
                }
            }, true);
        }
    };
    this.InvestigationItem.AutoCompleteDone = autoComplete(this.InvestigationItem.AutoComplete);

    this.CandidateReportTitle = {
        Details: onDetails(onCandidateReportTitleDetails),
        Columns: function () {
            return [
                { field: 'Name', title: 'Name', click: AppComponent.CandidateReportTitle.Details() },
                { field: 'Category', title: 'Category', add: false  },
                { field: 'Position', title: 'Position', add: { datatype: 'float'}, },
                { field: 'Remarks', filter: true, required: false, add: { type: 'textarea', sibling: 1 } },
                { field: 'IsDeleted', title: 'IsDeleted', add: false },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy hh:mm', add: false },
                { field: 'Creator', title: 'Creator', filter: true, add: false },
            ];
        },
        Add: function (opt) {
            var drp = [];
            return Global.Copy(opt, {
                name: 'CandidateReportTitleCreate',
                columns: AppComponent.CandidateReportTitle.Columns(),
                save: '/CandidateReportArea/CandidateReportTitle/Create',
                saveChange: '/CandidateReportArea/CandidateReportTitle/Edit',
                dropdownList: drp,
            }, true)
        },
        AddDone: function (opt) {
            Global.Add(AppComponent.CandidateReportTitle.Add(opt));
        },
        AutoComplete: function (opt) {
            return Global.Copy(opt, {
                Id: opt.Id || 'TitleId',
                url: opt.url || '/CandidateReportArea/CandidateReportTitle/AutoComplete',
                create: AppComponent.CandidateReportTitle.AddDone,
                Grid: {
                    url: '/CandidateReportArea/CandidateReportTitle/Get',
                    Columns: AppComponent.CandidateReportTitle.Columns()
                }
            }, true);
        }
    };
    this.CandidateReportTitle.AutoCompleteDone = autoComplete(this.CandidateReportTitle.AutoComplete);

    this.CandidateReportItem = {
        DataSounce: function () {
            return [
                { text: 'Investigation', value: 'Investigation' },
                { text: 'Text', value: 'Text' }
            ];
        },
        Details: onDetails(onInvestigationItemDetails),
        Columns: function () {
            return [
                { field: 'Investigation', title: 'Investigation', add: false },
                { field: 'Label', title: 'Label', required: false, },
                { field: 'Relation', title: 'Relation', add: false },
                { field: 'ReportTitle', title: 'Report Title', add: false },
                { field: 'Position', title: 'Position', add: { datatype: 'float' }, },
                { field: 'Remarks', filter: true, required: false, add: { type: 'textarea', sibling: 1 } },
                { field: 'IsDeleted', title: 'IsDeleted', add: false },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy hh:mm', add: false },
                { field: 'Creator', title: 'Creator', filter: true, add: false },
            ];
        },
        Add: function (opt) {
            var formInputs, dropDownList, windowModel, formModel;
            return Global.Copy(opt, {
                name: 'CandidateReportItemCreate',
                columns: AppComponent.CandidateReportItem.Columns(),
                save: '/CandidateReportArea/CandidateReportItem/Create',
                saveChange: '/CandidateReportArea/CandidateReportItem/Edit',
                onshow: (model, inputs, drp, IsNew, wModel, fModel) => {
                    formInputs = inputs;
                    dropDownList = drp;
                    windowModel = wModel;
                    formModel = fModel;
                    $(formInputs.RelativeId).closest('section').hide();
                    $(formInputs.Label).closest('section').hide();
                    if (formModel.Relation == 'Text') {
                        $(formInputs.Label).closest('section').show();
                    } else if (formModel.Relation == 'Investigation') {
                        $(formInputs.RelativeId).closest('section').show();
                    }
                },
                dropdownList: drp = [{
                    Id: 'Relation',
                    dataSource: AppComponent.CandidateReportItem.DataSounce(),
                    position: 2,
                    onChange: function (data) {
                        console.log(['Data', data]);
                        if (formInputs) {
                            if (data && data.value == 'Text') {
                                $(formInputs.RelativeId).closest('section').hide();
                                $(formInputs.Label).closest('section').show();
                            } else {
                                $(formInputs.RelativeId).closest('section').show();
                                $(formInputs.Label).closest('section').hide();
                            }
                        }
                    }
                },{
                    Id: 'RelativeId',
                    position: 2,
                    required: false,
                    url: '/InvestigationArea/Investigation/AutoComplete',
                    Type: 'AutoComplete',
                }],
            }, true)
        },
        AddDone: function (opt) {
            Global.Add(AppComponent.CandidateReportItem.Add(opt));
        }
    };
}).call(window.AppComponent = {});
// AppComponent.CandidateReportTitle.Columns

