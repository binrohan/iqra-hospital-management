﻿var Controller=AddEmployeeLeave = new function () {
    var that = this, options, formModel = {}, defaultSalary = 0, windowModel, formInputs, drp = {}, dates = [],
        startDate,endDate;
    function getModel() {
        var model = {};
        model.CategoryId = formModel.CategoryId;
        model.FromDate = formModel.FromDate;
        model.ToDate = formModel.ToDate;
        model.Application = formModel.Application;
        model.LeaveItems = dates;
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var model = getModel();
            Global.CallServer('/HRIS/Leave/AddNew', function (response) {
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
    function setDate() {
        dates = [];
        if (endDate && startDate) {
            var date = new Date(startDate),leaveItem;
            for (; date < endDate;) {
                leaveItem = { StartAt: date.format('dd/MM/yyyy hh:mm') };
                date = Global.DateTime.GetObject(date.format('dd/MM/yyyy'), 'dd/MM/yyyy');
                date.setDate(date.getDate() + 1);
                if (date > endDate) {
                    date = endDate;
                }
                leaveItem.EndAt = date.format('dd/MM/yyyy hh:mm');
                dates.push(leaveItem)
            }
        }
    }
    this.OnStartDateChanged = function (date) {
        startDate = date;
        setDate();
    };
    this.OnEndDateChanged = function (date) {
        endDate = date;
        setDate();
    };
    this.Show = function (opts) {
        options = opts;
        if (windowModel) {
            show(options.model);
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/HRIS/Templates/AddEmployeeLeave.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    }
    this.Events = new function () {
        var isBind = false;
        function bindDropDown() {
            drp = { elm: $(formInputs['CategoryId']), Id: 'CategoryId', url: '/EmployeeArea/LeaveCategory/AutoComplete', change: onDropDownChange };
            Global.AutoComplete.Bind(drp);
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

