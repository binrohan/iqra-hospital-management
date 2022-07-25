
(function () {
    var accessModel = {}, that = this, gridModel;
    (function () {
        setData(patientAccessList, 'Patient');
    })()
    function setData(accessList,name) {
        accessModel[name] = {};
        if (accessList.IsError) {

        } else {
            accessList.Data.each(function () {
                this.each(function () {
                    accessModel[name][this + ''] = true;
                });
            });
        }
        return accessModel;
    };
    function onRegistration() {
        Global.Add({
            name: 'onNewRegistration',
            url: '/Content/IqraHMS/PatientArea/Js/Patient/Registration.js',
            onSaveSuccess: function () {
                alert('Registration Successfully');
                gridModel.Reload();
            }
        });
    };
    // onAppointmentCreate is for new patient apoointment with password
    function onAdd(model) {

        Global.Add({
            model: model,
            name: 'AddPatient',
            url: '/Content/IqraHMS/PatientArea/Js/Patient/AddPatient.js',
            onSaveSuccess: function (response) {
                alert('Appointed Successfully.\n Your Serial No. is ' + response.Data);
                gridModel.Reload();
            }
        });
    };
    // onAppointmentCreate is for existing patient apoointment without password
    function onAppointmentCreate(model) {

        Global.Add({
            model: model,
            name: 'AddPatient',
            url: '/Content/IqraHMS/PatientArea/Js/Patient/PatientAppointmentCreate.js',
            onSaveSuccess: function (response) {
                alert('Appointed Successfully.\n Your Serial No. is ' + response.Data);
                gridModel.Reload();
            }
        });
    };
   

    function onDetails(model) {
        Global.Add({
            PatientId: model.Id,
            name: 'PatientDetails',
            url: '/Content/IqraHMS/PatientArea/Js/Patient/PatientDetails.js',
        });
    };

    // onRoomAllocateCreate is for existing patient room aloocation without password
    function onRoomAllocateCreate(model) {
        console.log([model])
        if (model && model.PatientType == DefinedString.PatientType.InPatient) {
            alert('This patient is already admitted.');
            return;
        }
        Global.Add({
            model: model,
            name: 'AddRoomAllocation',
            url: '/Content/IqraHMS/PatientArea/Js/Patient/AddRoomAllocationCreate.js',
            onSaveSuccess: function () {
                alert('Admitted Successfully');
                gridModel.Reload();
            }
        });
    };
    // onRoomAllocateCreate is for new patient room aloocation with password
    function onRoomAllocation(model) {
        if (model && model.PatientType == DefinedString.PatientType.InPatient) {
            alert('This patient is already admitted.');
            return;
        }
        Global.Add({
            model: model,
            name: 'AddRoomAllocation',
            url: '/Content/IqraHMS/PatientArea/Js/Patient/AddRoomAllocation.js',
            onSaveSuccess: function () {
                alert('Admitted Successfully');
                gridModel.Reload();
            }
        });
    };

    // Investigation is for existing patient
    function onInvestigationCreate(model) {
        Global.Add({
            model: model,
            name: 'AddInvestigation',
            url: '/Content/IqraHMS/PatientArea/Js/Patient/AddInvestigationCreate.js',
            onSaveSuccess: function () {
                alert('Created Successfully');
                gridModel.Reload();
            }
        });
    };

    // Release is for releasing patient
    function onRelease(model) {
        if (model && model.PatientType == DefinedString.PatientHistoryType.Released) {
            alert('This patient is already Released.');
            return;
        }
        Global.Add({
            model: model,
            name: 'AddRelease',
            url: '/Content/IqraHMS/PatientArea/Js/Patient/Release.js',
            onSaveSuccess: function () {
                alert('Released Successfully');
                gridModel.Reload();
            }
        });
    };

    // Patient Bill Clear
    function onClearance(model) {
        if (model && model.PatientType == DefinedString.PatientType.OutPatient) {
            alert('This patient is OutPatient.');
            return;
        }
        Global.Add({
            model: model,
            name: 'AddBillClearance',
            PatientId: model.Id,
            url: '/Content/IqraHMS/BillingArea/Js/BillClearance/BillClearance.js',
            onSaveSuccess: function () {
                alert('Clearance Successfull');
                gridModel.Reload();
            }
        });
    };

    // Patient Bill Clear
    function onWardClearance(model) {
        if (model && model.PatientType == DefinedString.PatientType.OutPatient) {
            alert('This patient is OutPatient.');
            return;
        }
        Global.Add({
            model: model,
            name: 'AddWardClearance',
            PatientId: model.Id,
            url: '/Content/IqraHMS/BillingArea/Js/BedChargeInvoice/BedChargeInvoice.js',
            onSaveSuccess: function () {
                alert('Clearance Successfull');
                gridModel.Reload();
            }
        });
    };

    function onOtherClearance(model) {
        if (model && model.PatientType == DefinedString.PatientType.OutPatient) {
            alert('This patient is OutPatient.');
            return;
        }
        Global.Add({
            model: model,
            name: 'AddOtherClearance',
            PatientId: model.Id,
            url: '/Content/IqraHMS/BillingArea/Js/BedChargeInvoice/OtherChargeInvoice.js',
            onSaveSuccess: function () {
                alert('Clearance Successfull');
                gridModel.Reload();
            }
        });
    };


    function onPatientTransection(model) {
        if (model && model.PatientType == DefinedString.PatientType.OutPatient) {
            alert('This patient is OutPatient.');
            return;
        }
        Global.Add({
            model: model,
            name: 'AddPatientTransection',
            PatientId: model.Id,
            url: '/Content/IqraHMS/PatientArea/Js/Patient/DischargeBill.js',
            onSaveSuccess: function () {
                alert('Clearance Successfull');
                gridModel.Reload();
            }
        });
    };

    function onRePrintPatientTransection(model) {
        if (model && model.PatientType == DefinedString.PatientType.OutPatient) {
            alert('This patient is OutPatient.');
            return;
        }
        Global.Add({
            name: 'RePrintPatientTransection',
            PatientId: model.Id,
            //Type: 'DischargePrint',
            url: '/Content/IqraHMS/BillingArea/Js/PatientTransection/RePrintDischargeBill.js'
        });
    };

    function onCreatorDetails(model) {
        onUserDetails(model.CreatedBy);
    }
    function onUpdatorDetails(model) {
        onUserDetails(model.UpdatedBy);
    }
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    function onDataBinding(data) {

    };

    function getButton() {

        var buttons = [];
        buttons.push({
            click: onPatientTransection,
            html: '<a style="margin-right:8px;" class="icon_container" title="PatientTransection"><span class="glyphicon glyphicon-plus"></span></a>'
        });
        buttons.push({
            click: onRePrintPatientTransection,
            html: '<a style="margin-right:8px;" class="icon_container" title="Re-Print Discharge Bill"><span class="glyphicon glyphicon-open"></span></a>'
        });
        return buttons;
    };

    Global.List.Bind({
        Name: 'Patient',
        Grid: {
            elm: $('#grid'),
            columns: [

                { field: 'Code', title: 'Code', width: 135, Click: accessModel.Patient.Details ? onDetails:none },
                { field: 'Name', title: 'Name', filter: true, width: 150 },
                { field: 'Gender', title: 'Gender', filter: true, width: 70 },
                { field: 'BloodGroup', title: 'BG', filter: true, width: 45 },
                { field: 'Mobile', title: 'Mobile', filter: true, width: 120 },
                { field: 'AlternativeMobile', title: 'Alternative Mobile', filter: true, width: 120 },
                { field: 'CAddress', title: 'Current Address', sorting: false, filter: true, width: 120 },
                { field: 'PAddress', title: 'Permanent Address', sorting: false, filter: true, width: 120 },
                { field: 'LastDateOfAdmission', title: 'Addmission Date', dateFormat: 'dd/MM/yyyy hh:mm'},
                { field: 'LastDateOfRealese', title: 'Release Date', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'LastDateOfAppointment', title: 'Appointment Date', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'PatientType', title: 'Patient Type', width: 110 },
                //{ field: 'PassWord', title: 'PassWord', position: 6, filter: true, add: { type: 'password' } },

            ],
            Actions: getButton(),
            url: '/PatientArea/Patient/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Patients ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound,
            Action: { width: 95 },
        }, onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit: false,
        remove: accessModel.Patient.Delete ? { save: '/PatientArea/Patient/Delete' } : false,
        additionalField: [
            { field: 'PassWord', title: 'PassWord', position: 6, filter: true, Add: { type: 'password' } },
        ]
    });
    (function () {
        accessModel.Patient.Registrtion ?
            Global.Click($('#btn_registration'), onRegistration) :
            $('#btn_registration').remove();

        Global.Click($('#btn_add_new'), onAdd);
        Global.Click($('#btn_add_room_allocation'), onRoomAllocation);
    })();
})();;
