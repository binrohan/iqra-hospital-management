
(function () {
    var accessModel = {}, filterModel = { field: 'PatientType', value: patientType,Operation:0}, that = this, gridModel;
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
            click: onAppointmentCreate,
            html: '<a style="margin-right:8px;" class="icon_container" title="Add An Appointment"><span class="glyphicon glyphicon-plus-sign"></span></a>'
        });
        patientType == 'Out Patient' && buttons.push({
            click: onRoomAllocateCreate,
            html: '<a style="margin-right:8px;" class="icon_container" title="Add Room Allocation"><span class="glyphicon glyphicon-open"></span></a>'
        });
        return buttons;
    };

    Global.List.Bind({
        Name: 'Patient',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Code', title: 'Code', width: 135, Click:  onDetails },
                { field: 'Name', title: 'Name', filter: true, width: 150 },
                { field: 'Gender', title: 'Gender', filter: true, width: 70 },
                { field: 'BloodGroup', title: 'BG', filter: true, width: 45 },
                { field: 'Mobile', title: 'Mobile', filter: true, width: 120 },
                { field: 'AlternativeMobile', title: 'Alternative Mobile', filter: true, width: 120 },
                { field: 'LastDateOfAdmission', title: 'Addmission Date', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'LastDateOfRealese', title: 'Release Date', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'LastDateOfAppointment', title: 'Appointment Date', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'PatientType', title: 'Patient Type', width: 110 },
                { field: 'CAddress', title: 'Current Address', sorting: false, required: false, add: { type: 'textarea' } },
                { field: 'PAddress', title: 'Permanent Address', sorting: false, required: false, add: { type: 'textarea' } },

            ],
            Actions: getButton(),
            url: '/PatientArea/Patient/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Patients ', filter: [filterModel] },
            onDataBinding: onDataBinding,
            rowBound: rowBound,
            Action: { width: 95 },
        }, onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit: false,
        remove: false,
    });
})();;


