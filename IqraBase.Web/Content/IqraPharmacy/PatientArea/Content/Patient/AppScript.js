(function () {
    var that = this, gridModel, windowModel, inputs, formModel;
    var maxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function onSubmit(model, data, formModel) {
        if (data) {
            model.Id = data.Id
        }
        model.DateOfBirth = (formModel.DateOfBirth || '01/01/2500') + ' 23:59';
    };
    function onDatePickerChanged(date, model) {
        model = model || formModel;
        if (date) {
            var currentDate = new Date();
            var value = currentDate.getDate() - date.getDate(), flg = 0;
            if (value < 0) {
                model.Day = (value + maxDays[date.getMonth()]);
                flg = -1;
            } else {
                model.Day = value;
            }
            value = currentDate.getMonth() - date.getMonth() + flg; flg = 0;
            if (value < 0) {
                model.Month = (value + 12);
                flg = -1;
            } else {
                model.Month = value;
            }
            model.Year = currentDate.getFullYear() - date.getFullYear() + flg;
        } else {
            model.Year = 0;
            model.Month = 0;
            model.Day = 0;
        }
    };
    function onAgeChanged() {
        var date = new Date();
        date.setDate(date.getDate() - parseInt(formModel.Day || '0') || 0);
        date.setMonth(date.getMonth() - parseInt(formModel.Month || '0') || 0);
        date.setFullYear(date.getFullYear() - parseInt(formModel.Year || '0') || 0);
        formModel.DateOfBirth = date.format('dd/MM/yyyy');
    };
    function onViewCreated(wndModel, formInputs, dropDownList, IsNew, frmModel) {
        windowModel = wndModel;
        inputs = formInputs;
        formModel = frmModel;
        console.log([windowModel, inputs, formModel]);
        (['Day', 'Month', 'Year']).each(function () {
            $(inputs[this + '']).keyup(onAgeChanged).blur(onAgeChanged);
        });
        Global.DatePicker.Bind($(formInputs['DateOfBirth']), { format: 'dd/MM/yyyy', onchange: function (date) { onDatePickerChanged(date); } });
    };
    function onDataBinding(response) {
        var date;
        response.Data.Data.each(function () {
            date = this.DateOfBirth.getDate();
            if (date.getFullYear() == 2500) {
                this.Age = '';
                this.DateOfBirth = '';
                this.Year = '';
                this.Month = '';
                this.Day = '';
            } else {
                onDatePickerChanged(date, this);
                this.Age =this.Year+ 'Y '+this.Month+'M '+this.Day+'D';
            }
            this.DateOfBirth = date.format('dd/MM/yyyy');
        });
    };

    function onDetails(model) {
        Global.Add({
            name: 'PatientDetails',
            url: '/Content/IqraPharmacy/PatientArea/Content/Patient/OnPatientDetails.js',
            PatientId: model.Id,
            model:model
        });
    };
    Global.List.Bind({
        Name: 'Patient',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Code', filter: true, add: false, selected: false, click: onDetails },
                { field: 'Name', filter: true, position: 1, click: onDetails },
                { field: 'Gender', filter: true, add: false, selected: false },
                { field: 'BloodGroup', title: 'Blood', filter: true, position: 5, add: false, },
                { field: 'Mobile', filter: true, position: 5 },
                { field: 'AlternativeMobile', title: 'Alternative Mobile', filter: true, add: false, selected: false },
                { field: 'Email', filter: true, position: 5, add: false, selected: false },
                { field: 'Age', add: false },
                { field: 'BedNumber', title: 'Bed', filter: true, position: 8 },
                { field: 'BedName', title: 'Bed-Type', filter: true, position: 8, selected: false },
                { field: 'LastDateOfAdmission', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'LastDateOfRealese', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'LastDateOfAppointment', dateFormat: 'dd/MM/yyyy hh:mm' },
                //{ field: 'Address', filter: true, required: false, position: 20, Add: false, selected: false },
                { field: 'Remarks', filter: true, required: false, position: 20, Add: false, selected: false },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', add: false },
                { field: 'Creator', required: false, filter: true, add: false, selected: false }
            ],
            url: '/PatientArea/PharmacyPatient/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Patients ' },
            onDataBinding: onDataBinding
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit:false,
        remove: false
    });
})();
