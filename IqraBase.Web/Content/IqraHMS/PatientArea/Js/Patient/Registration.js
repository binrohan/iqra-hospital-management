//PatientArea/Patient/Registrtion

var Controller = new function () {
    var windowModel, inputs, formModel;
    var maxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function onSubmit(model, data, formModel) {
        model.DateOfBirth = formModel.DateOfBirth + ' 00:00';
    };
    function onDatePickerChanged(date) {
        if (date) {
            var currentDate = new Date();
            var value = currentDate.getDate() - date.getDate(), flg = 0;
            if (value < 0) {
                formModel.Day = (value + maxDays[date.getMonth()]);
                flg = -1;
            } else {
                formModel.Day = value;
            }
            value = currentDate.getMonth() - date.getMonth() + flg; flg = 0;
            if (value < 0) {
                formModel.Month = (value + 12);
                flg = -1;
            } else {
                formModel.Month = value;
            }
            formModel.Year = currentDate.getFullYear() - date.getFullYear() + flg;
        } else {
            formModel.Year = 0;
            formModel.Month = 0;
            formModel.Day = 0;
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
        Global.DatePicker.Bind($(formInputs['DateOfBirth']), { format: 'dd/MM/yyyy', onchange: onDatePickerChanged });
    };
    this.Show = function (model) {
        Global.Add({
            name: 'PatientRegistration',
            save: '/PatientArea/Patient/Registrtion',
            columns: [
                { field: 'Name', position: 1, add: { sibling: 3 } },
                { field: 'FatherName', title: 'Father Name', position: 4,add: { sibling: 3 } },
                { field: 'MotherName', title: 'Mother Name', position: 5,add: { sibling: 3 } },
                { field: 'DateOfBirth', required: false, title: 'Date Of Birth', position: 7, add: { sibling: 2 } },
                { field: 'Year', position: 8, required: false, add: { sibling: 6, dataType: 'int|null' } },
                { field: 'Month', position: 9, required: false, add: { sibling: 6, dataType: 'int|null' } },
                { field: 'Day', position: 10, required: false, add: { sibling: 6, dataType: 'int|null' } },
                { field: 'Mobile', position: 11, add: { sibling: 3 } },
                { field: 'AlternativeMobile', title: 'Alternative Mobile', position: 12, required: false, add: { sibling: 3 } },
                { field: 'Email', position: 13, required: false, add: { sibling: 3 } },
                { field: 'CAddress', title: 'Current Address', sorting: false, position: 14, required: false, add: { type: 'textarea' } },
                { field: 'PAddress', title: 'Permanent Address', sorting: false, position: 15, required: false, add: { type: 'textarea' } }
            ],
            onSubmit: onSubmit,
            dropdownList: [
                {
                    Id: 'Gender',
                    position: 2,
                    dataSource: [
                        { text: 'Male', value: 'Male' },
                        { text: 'Female', value: 'Female' },
                        { text: 'Other', value: 'Other' }
                    ],
                    Add: { sibling: 3 }
                }, {
                    Id: 'BloodGroup',
                    position: 3,
                    dataSource: [
                        { text: 'A+', value: 'A+' },
                        { text: 'A-', value: 'A-' },
                        { text: 'B+', value: 'B+' },
                        { text: 'B-', value: 'B-' },
                        { text: 'AB+', value: 'AB+' },
                        { text: 'AB-', value: 'AB-' },
                        { text: 'O+', value: 'O+' },
                        { text: 'O-', value: 'O-' },
                    ],
                    required: false,
                    Add: { sibling: 3 }
                }, {
                    Id: 'ProfessionId',
                    position: 6,
                    type: 'AutoComplete',
                    url: '/CommonArea/Profession/AutoComplete',
                    Add: { sibling: 3 }
                }],
            onSaveSuccess: function (response) {
                model.onSaveSuccess(response);
            },
            onViewCreated: onViewCreated
        });
    };
};