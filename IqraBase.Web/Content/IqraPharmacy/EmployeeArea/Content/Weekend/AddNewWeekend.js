var Controller = new function () {
    var that = this, options, formModel = {}, defaultSalary = 0, windowModel, formInputs, drp = {}, dayOfweek = {};
    function getModel() {
        var model = {};
        model.EmployeeId = formModel.EmployeeId;
        model.From = formModel.From;
        model.To = formModel.To;
        model.DayOfWeek = formModel.DayOfWeek;
        model.Remarks = formModel.Remarks;
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var model = getModel();
            Global.CallServer('/EmployeeArea/Weekend/AddNew', function (response) {
                if (!response.IsError) {
                    windowModel.Free();
                    options.onSaveSuccess(formModel, formInputs);
                    cancel();
                } else {
                    error.Save(response, saveUrl);
                }
            }, function (response) {
                response.Id = -8;
                alert('Errors.');
            }, model, 'POST');
        } else {
            alert('Validation Errors.');
        }
        return false;
    };
    function cancel() {
        windowModel.Hide(function () {
        });
    };
    function populate(model) {
        windowModel.Free();
        for (var key in formModel) {
            formModel[key] = model[key] || '';
        }
        if (drp.val) {
            drp.val(model.DesignationId);
        } else {
            drp.selectedValue = model.DesignationId;
        }
        if (model.OwnSalary) {
            formModel.IsDefaultSalary = false;
            formModel.Salary = model.OwnSalary;
            $(formInputs['Salary']).prop('disabled', false);
        } else {
            formModel.Salary = model.DesignationSalary;
            $(formInputs['Salary']).prop('disabled', true);
            formModel.IsDefaultSalary = true;
        }
        formModel.CurrentSalary = formModel.Salary;
    };
    function onDropDownChange(data) {
        if (data) {
           
        }
    };
    function show(model) {
        windowModel.Show();
    }
    function createWindow(template) {
        windowModel = Global.Window.Bind(template);
        that.Events.Bind(options.model);
        show(options.model);
    };
    this.Show = function (opts) {
        options = opts;
        if (windowModel) {
            show(options.model);
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/EmployeeArea/Templates/Weekend/AddNewWeekend.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    }
    this.Events = new function () {
        var isBind = false;
        function bindDropDown() {
            drp = { elm: $(formInputs['EmployeeId']), Id: 'EmployeeId', url: '/EmployeeArea/Employee/AutoComplete', change: onDropDownChange };
            Global.AutoComplete.Bind(drp);
            dayOfweek = {
                elm: $(formInputs['DayOfWeek']),
                Id: 'DayOfWeek',
                dataSource: [
                    { text: 'Sunday', value: 0 },
                    { text: 'Monday', value: 1 },
                    { text: 'Tuesday', value: 2 },
                    { text: 'Wednesday', value: 3 },
                    { text: 'Thursday', value: 4 },
                    { text: 'Friday', value: 5 },
                    { text: 'Saturday', value: 6 }
                ]
            };
            Global.DropDown.Bind(dayOfweek);
        }
        this.Bind = function (model) {
            if (!isBind) {
                model = model || {};
                isBind = true;
                formInputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(cancel);
                Global.Submit(windowModel.View.find('form'), save);
                bindDropDown();
            }
        };
    };
};

