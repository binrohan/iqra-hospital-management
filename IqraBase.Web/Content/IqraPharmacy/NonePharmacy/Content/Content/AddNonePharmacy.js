var Controller = new function () {
    var that = this, options, formModel = {}, defaultSalary = 0, windowModel, formInputs, dropDownList = {};
    function getModel() {
        var model = Global.Copy({}, formModel);
        model.CreatedAt = model.UpdatedAt = undefined;
        model.GenericName = "Not Available";
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var model = getModel(), saveUrl = options.IsNew ? '/NonePharmacy/NonePharmacy/AddNew' : '/NonePharmacy/NonePharmacy/Update';
            Global.CallServer(saveUrl, function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    options.onSaveSuccess(formModel, formInputs);
                    cancel();
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                windowModel.Free();
                response.Id = -8;
                alert('Network Errors.');
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
        model = model || {};
        var newModel = {};
        for (var key in formModel) {
            formModel[key] = model[key] || '';
        }
        formModel.Id = model.Id;
        Global.Copy(formModel, model, true);
        dropDownList.Model = model;
        dropDownList.each(function () {
            if (this.data && this.val) {
                this.val(model[this.Id]);
            } else {
                this.selectedValue = model[this.Id];
            }
        });
    };
    function loadDetails() {
        //windowModel.Wait('Please wait while loading data.......');
        //if (options.loadUser) {
        //    options.loadUser(populate);
        //} else {
        //    Global.CallServer('/EmployeeArea/Employee/Details/' + options.UserId, function (response) {
        //        if (!response.IsError) {
        //            if (!response.Data) {
        //                response.Id = -1;
        //                error.Load(response);
        //                return;
        //            }
        //            populate(response.Data);
        //        } else {

        //        }
        //    }, function (response) {
        //        response.Id = -8;
        //    }, {}, 'POST')
        //}
    };
    function onDropDownChange(data) {
        if (data) {
            formModel.IsDefaultSalary = true;
            formModel.Salary = defaultSalary = data.Salary;
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
        if (model) {
            populate(model);
            options.IsNew = false;
        } else {
            options.IsNew = true;
            populate();
        }
        console.log(model);
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
            Global.LoadTemplate('/Content/IqraPharmacy/NonePharmacy/Templates/Add.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    }
    this.Events = new function () {
        var isBind = false;
        function bindDropDown() {
            dropDownList = [
                { Id: 'CategoryId', url: '/Category/NonePharmacyDropDown', position: 3, Add: { sibling: 4 } },
                { Id: 'SalesUnitTypeId', url: '/UnitType/NonePharmacyDropDown', position: 14 },
                { Id: 'PurchaseUnitTypeId', url: '/UnitType/NonePharmacyDropDown', position: 14 },
                { Id: 'CounterId', url: '/ProductArea/Counter/NonePharmacyDropDown', position: 16 }
            ];
            dropDownList.each(function () {
                this.elm = $(formInputs[this.Id]);
                Global.DropDown.Bind(this);
            });
        }
        function bindAutoComplete() {
            var model = {
                Id: 'SuplierId',
                url: '/Suplier/DropDown',
                type: 'AutoComplete',
                position: 4,
                onDataBinding: function (response) {
                    response.Data.each(function () {
                        this.Name = this.text;
                    });
                },
                elm: $(formInputs['SuplierId']).empty()
            };
            dropDownList.push(model);
            Global.AutoComplete.Bind(model);
        }
        function onUnitSalePriceChange() {
            formModel.PUnitSalePrice = formModel.UnitSalePrice ? parseFloat(formModel.UnitSalePrice * parseFloat(formModel.UnitConversion || '0')) : 0;
        };
        function onPUnitSalePriceChange() {
            formModel.UnitSalePrice = formModel.PUnitSalePrice ? parseFloat(formModel.PUnitSalePrice / (parseFloat(formModel.UnitConversion || '1')) || 1) : 0;
        };
        function onUnitTradePriceChange() {
            formModel.PUnitTradePrice = formModel.UnitTradePrice ? parseFloat(formModel.UnitTradePrice * parseFloat(formModel.UnitConversion || '0')) : 0;
        };
        function onPUnitTradePriceChange() {
            formModel.UnitTradePrice = formModel.PUnitTradePrice ? parseFloat(formModel.PUnitTradePrice / (parseFloat(formModel.UnitConversion || '1')) || 1) : 0;
        };
        this.Bind = function (model) {
            if (!isBind) {
                model = model || {};
                isBind = true;
                formInputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(cancel);
                Global.Click(windowModel.View.find('.btn_save'), save);
                $(formInputs['IsDefaultSalary']).change(onSalaryTypeChanged);
                $(formInputs['UnitTradePrice']).keyup(onUnitTradePriceChange);
                $(formInputs['PUnitTradePrice']).keyup(onPUnitTradePriceChange);
                $(formInputs['UnitSalePrice']).keyup(onUnitSalePriceChange);
                $(formInputs['PUnitSalePrice']).keyup(onPUnitSalePriceChange);
                bindDropDown();
                bindAutoComplete();
            }
        };
    };
};

