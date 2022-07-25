
var Controller = new function () {
    var windowModel, formModel = {}, inputs = {}, callerOptions;
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait('Please Wait while saving data......');
            var model = Global.Copy({}, formModel, true);
            //model.Something = 'dfasdasd';
            Global.CallServer('/DoctorsArea/Doctor/Create', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    callerOptions.onSaveSuccess(formModel, inputs);
                    close();
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                windowModel.Free();
                //response.Id = -8;
                alert('Network Errors.');
            }, model, 'POST');
        } else {
            alert('Validation Error.');
        }
    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function populate() {
        if (callerOptions.model) {

        } else {
            for (var key in formModel) formModel[key] = '';
        }
    };
    function setDropdown() {
        var employee = {
            elm: $(inputs['EmployeeTypeId']),
            url: '/CommonArea/EmployeeType/AutoComplete',
            change: function (data) {
                console.log(data);
            }
        }, filterModel = { field: 'EmployeeTypeId', Operation: 0, value: doctorTypeId },
        designation = {
            elm: $(inputs['DesignationId']),
            url: '/CommonArea/Designation/DoctorAutoComplete',
            page: { 'PageNumber': 1, 'PageSize': 500, filter: [filterModel]  },
        }, department = {
            elm: $(inputs['DepartmentId']),
            url: '/CommonArea/Department/AutoComplete'
        },gender = {
            elm: $(inputs['Gender']),
            dataSource: [
                { text: 'Male', value: 'Male' },
                { text: 'Female', value: 'Female' },
                { text: 'Other', value: 'Other' }
            ]
        };
        Global.AutoComplete.Bind(employee);
        Global.AutoComplete.Bind(designation);
        Global.AutoComplete.Bind(department);
        Global.DropDown.Bind(gender);
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            populate();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/DoctorsArea/Templates/AddDoctor.html', function (response) {
                windowModel = Global.Window.Bind(response);
                inputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                setDropdown();
                populate();
                windowModel.Show();
            }, noop);
        }
    };
};