/// <reference path="AppScripts.js" />

(function () {
    var that = this, gridModel;
    function onAdd(model) {
        Global.Add({
            model: model,
            name: 'AddDoctor',
            url: '/Content/IqraHMS/DoctorsArea/Js/Doctor/AddDoctor.js',
            onSaveSuccess: function () {
                gridModel.Reload();
            }
        });
    };
    function onDetails(model) {
        Global.Add({
            PatientId: model.PatientId,
            name: 'PatientDetails',
            url: '/Content/IqraHMS/PatientArea/Js/Patient/PatientDetails.js',
        });
    };
    function onPrescription(model) {
        Global.Add({
            PatientId: model.PatientId,
            model: model,
            name: 'Prescription',
            url: '/Content/IqraHMS/PrescriptionArea/Js/Prescription/AddPrescription.js',
            onSaveSuccess: function () {
                gridModel.Reload();
            }
        });
    };
    function onUserDetails(userId) {
        Global.Add({
            UserId: userId,
            name: 'UserDetails',
            url: '/Areas/EmployeeArea/Content/User/UserDetails.js',
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
    Global.List.Bind({
        Name: 'Doctor',
        Grid: {
            elm: $('#grid'),
            columns: [
                    { field: 'Code', title: 'Code', Click: onDetails },
                    { field: 'Patient', title: 'Name', filter: true, width: 150, Click: onDetails },
                    { field: 'Gender', title: 'Gender', filter: true },
                    { field: 'BloodGroup', title: 'BG', filter: true},
                    { field: 'Mobile', title: 'Mobile', filter: true},
                    { field: 'PatientType', title: 'Patient Type', filter: true },
            ],
            periodic: {
                type:'Today',
                container: '.button_container',
                format: 'yyyy-MM-dd HH:mm'
            },
            Actions: [{
                click: onPrescription,
                html: '<a style="margin-right:8px;" class="icon_container" title="Add Prescription"><span class="glyphicon glyphicon-open"></span></a>'
            }],
            url: '/DoctorsArea/AppointmentTime/GetByDoctor',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Doctors ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound,
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: false, Edit: false,
        remove: { save: '/DoctorsArea/Doctor/Delete' }
    });
    (function () {
        Global.Click($('#btn_add_new'), onAdd);
    })();
})();;
