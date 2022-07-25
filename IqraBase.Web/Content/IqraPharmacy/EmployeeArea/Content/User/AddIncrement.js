var Controller = new function () {
    var that = this, options, formModel = {},defaultSalary=0, windowModel, formInputs, drp = {};
    function getModel() {
        var model = {};
        model.DesignationId = formModel.DesignationId;
        model.CurrentSalary = formModel.CurrentSalary;
        model.EmployeeId = options.UserId;
        model.Remarks = formModel.Remarks;
        model.IsDefaultSalary = formModel.IsDefaultSalary;
        model.Salary = formModel.Salary;
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var model = getModel();
            Global.CallServer('/Increment/AddNew', function (response) {
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
    function loadDetails() {
        windowModel.Wait('Please wait while loading data.......');
        if (options.loadUser) {
            options.loadUser(populate);
        } else {
            Global.CallServer('/EmployeeArea/Employee/Details/' + options.UserId, function (response) {
                if (!response.IsError) {
                    if (!response.Data) {
                        response.Id = -1;
                        error.Load(response);
                        return;
                    }
                    populate(response.Data);
                } else {

                }
            }, function (response) {
                response.Id = -8;
            }, {}, 'POST')
        }
    };
    function onDropDownChange(data) {
        if (data) {
            formModel.IsDefaultSalary = true;
            formModel.Salary =defaultSalary= data.Salary;
            onSalaryTypeChanged();
        }
    };
    function onSalaryTypeChanged() {
        if (formModel.IsDefaultSalary) {
            $(formInputs['Salary']).prop('disabled', true);
            formModel.Salary = defaultSalary;
        } else {
            $(formInputs['Salary']).prop('disabled', false);
        }
    }
    function show(model) {
        windowModel.Show();
        loadDetails();
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
            Global.LoadTemplate('/Content/IqraPharmacy/EmployeeArea/Templates/AddIncrement.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    }
    this.Events = new function () {
        var isBind = false;
        function bindDropDown() {
            drp = { elm: $(formInputs['DesignationId']), Id: 'DesignationId', url: '/Designation/DropDownList', change: onDropDownChange };
            Global.DropDown.Bind(drp);
        }
        this.Bind = function (model) {
            if (!isBind) {
                model = model || {};
                isBind = true;
                formInputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(cancel);
                Global.Submit(windowModel.View.find('form'), save);
                $(formInputs['IsDefaultSalary']).change(onSalaryTypeChanged);
                bindDropDown();
            }
        };
    };
};

