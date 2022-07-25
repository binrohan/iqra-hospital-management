var Controller = new function () {
    var that = this, options, formModel = {}, windowModel, formInputs,gridModel;
    function getModel() {
        var model = {
            EmployeeBonusId: options.model.Id,
            BonusStructureId: options.model.BonusStructureId,
            DesignationId: options.model.RelativeId,
            EmployeeId: options.model.RelativeId,
            RelationType: options.model.RelationType,
            AmountType: options.model.AmountType,
            Amount: options.model.Amount,
        };
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var model = getModel();
            Global.CallServer('/PayrollArea/EmployeeBonus/GenerateBonus', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    cancel();
                } else {
                    alert('Errors.');
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
        formInputs = Global.Form.Bind(formModel, windowModel.View);
        windowModel.View.find('.btn_cancel').click(cancel);
        Global.Click(windowModel.View.find('.btn_save'), save);
        that.Grid.Bind(options.model);
        show(options.model);
    };
    this.Show = function (opts) {
        options = opts;
        if (windowModel) {
            show(options.model);
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/PayrollArea/Templates/EmployeeBonus/OnGenerate.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    }
    this.Grid = new function () {
        var filter = { "field": "EmployeeId", "value": "00000000-0000-0000-0000-000000000000", Operation: 0 },
            page = { filter: [filter] };
        function setFilter() {
            page.filter = [filter];
            filter.value = options.model.RelativeId;
            if (options.model.RelationType == 0) {
                filter.field = 'EmployeeId';
            } else if (options.model.RelationType == 1) {
                filter.field = 'DesignationId';
            } else if (options.model.RelationType == 2) {
                page.filter = [];
            }
            return page;
        };
        function rowBound(elm) {
            
        };
        function getFixedAmount(model) {
            return options.model.Amount;
        };
        function getPercentageAmount(model) {
            return options.model.Amount.mlt(model.Salary).div(100);
        };
        function setData(list, dic) {
            var newList = [],index=1,
            summary = {
                TotalEmployee: 0,
                TotalSalary: 0,
                TotalBonus:0
            },
                func = options.AmountType == 0 ? getFixedAmount : getPercentageAmount;
            list.each(function () {
                if (!dic[this.Id]) {
                    newList.push(this);
                    this.SR = index++;
                    this.Bonus = func(this);
                    summary.TotalBonus += this.Bonus;
                    summary.TotalSalary += this.Salary;

                }
            });
            summary.TotalEmployee = newList.length;
            gridModel.dataSource = newList;
            gridModel.Reload();
            Global.Copy(formModel, summary, true);
        };
        function loadEmployee() {
            setFilter();
            Global.CallServer('/PayrollArea/EmployeeBonus/GetEmployee?bonusId=' + options.model.BonusStructureId, function (response) {
                if (!response.IsError) {
                    var dic = {};
                    response.Data[1].each(function () {
                        dic[this.RelativeId] = true;
                    });
                    setData(response.Data[0], dic);
                } else {
                    //error.Save(response, saveUrl);
                }
            }, function (response) {
                response.Id = -8;
                //error.Save(response, saveUrl);
            }, page, 'POST');
        };
        function bind() {
            Global.Grid.Bind({
                elm: windowModel.View.find('#bonus_container'),
                columns: [
                    { field: 'SR', sorting: false,width:70 },
                    { field: 'Employee',sorting:false },
                    { field: 'Salary', sorting: false, type: 2 },
                    { field: 'Bonus', sorting: false, type: 2 }
                ],
                dataSource: [],
                page: { 'PageNumber': 1, 'PageSize': 1000 },
                rowBound: rowBound,
                Printable: {
                    Container: function () {
                        return windowModel.View.find('.FooterFormMenu');
                    }
                },
                onComplete: function (model) {
                    gridModel = model;
                    loadEmployee();
                },
            });
        };
        this.Bind = function (model) {
            if (!gridModel) {
                bind();
            } else {
                loadEmployee();
            }
        };
    };
};

