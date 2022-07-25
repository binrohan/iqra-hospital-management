var Controller = new function () {
    var that = this, options, formModel = {}, defaultSalary = 0, windowModel, formInputs, dropDownList = {}, oldTitle = document.title;
    function getModel() {
        var model = Global.Copy({}, formModel);
        model.Discount = formModel.Discount || 0;
        model.PurchaseDiscount = formModel.PurchaseDiscount || 0;
        model.Vat = formModel.Vat || 0;
        model.Discount = formModel.Discount || 0;
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var model = getModel();
            Global.CallServer('/PharmacyItem/AddNew' , function (response) {
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
        document.title = oldTitle;
        windowModel.Hide(function () {
        });
    };
    function populateByKey(model, key,appKey) {
        var vat = model[key] / 100;
        formModel['SUnit' + key] = vat * model[appKey]||'';
        formModel['PUnit' + key] = vat * parseFloat(formModel.PUnitTradePrice || '0')||'';
    };
    function populate(model) {

        model = model || { Vat: '', PurchaseDiscount: '' };
        for (var key in formModel) {
            if (typeof (model[key]) !== typeof (none))
                formModel[key] = model[key];
        }
        for (var key in formModel) {
            if (typeof (model[key]) !== typeof (none)) formModel[key] = model[key];
        }
        formModel.Id = model.Id;
        if (model.Vat !== model.PurchaseDiscount) {
            formModel.UnitTradePrice = model.UnitTradePrice = model.UnitTradePrice * 100 / (100 + model.Vat - model.PurchaseDiscount);
        }
        formModel.PUnitSalePrice = model.UnitConversion * model.UnitSalePrice||'';
        formModel.PUnitTradePrice = model.UnitConversion * model.UnitTradePrice||'';
        populateByKey(model, 'Vat', 'UnitTradePrice');
        populateByKey(model, 'MaxSaleDiscount', 'UnitSalePrice');
        populateByKey(model, 'Discount', 'UnitSalePrice');
        populateByKey(model, 'PurchaseDiscount', 'UnitTradePrice');
        console.log(formModel);
        dropDownList.each(function () {
            if (this.data && this.val) {
                this.val(model[this.Id]);
            } else {
                this.selectedValue = model[this.Id];
            }
        });
    };
    function loadDetails() {
        windowModel.Wait('Please wait while loading data......');
        Global.CallServer('/ProductArea/Product/Details?Id=' + options.model.Id, function (response) {
            windowModel.Free();
            var data = response.Data;
            data.PUnitSalePrice = data.UnitConversion * data.UnitSalePrice;
            data.PUnitTradePrice = data.UnitConversion * data.UnitTradePrice;
            populate(response.Data);
        }, function (response) {
        }, null, 'GET', null, false);
    };
    function show(model) {
        windowModel.Show();
        populate();
        model && loadDetails();
        oldTitle = document.title;
        document.title = formModel.Title = 'Edit Pharmacy Item';
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
            Global.LoadTemplate('/Content/IqraPharmacy/Pharmacy/Templates/Add.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    }
    this.Events = new function () {
        var isBind = false;
        function bindDropDown() {
            dropDownList = [
                { Id: 'SalesUnitTypeId', url: '/UnitType/PharmacyDropDown'},
                { Id: 'PurchaseUnitTypeId', url: '/UnitType/PharmacyDropDown' },
                { Id: 'CounterId', url: '/ProductArea/Counter/PharmacyDropDown' }
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
            model = {
                Id: 'CategoryId',
                url: '/Category/PharmacyDropDown',
                type: 'AutoComplete',
                position: 4,
                onDataBinding: function (response) {
                    response.Data.each(function () {
                        this.Name = this.text;
                    });
                },
                elm: $(formInputs['CategoryId']).empty()
            };
            dropDownList.push(model);
            Global.AutoComplete.Bind(model);
        };
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
        function onUnitConversionChange() {
            var conversion = parseFloat(formModel.UnitConversion || '0');
            formModel.PUnitTradePrice = parseFloat(formModel.UnitTradePrice || '0') * conversion;
            formModel.PUnitSalePrice = parseFloat(formModel.UnitSalePrice || '0') * conversion;
        };

        function onMainChange(name, unitKey) {
            if (formModel[name]) {
                var vat = parseFloat(formModel[name]) / 100;
                formModel['SUnit' + name] = vat * parseFloat(formModel[unitKey] || '0');
                formModel['PUnit' + name] = vat * parseFloat(formModel['P'+unitKey] || '0');
            } else {
                formModel['SUnit' + name] = 0;
                formModel['PUnit' + name] = 0;
            }
        };
        function onSUnitChange(name, unitKey) {
            if (formModel['SUnit' + name]) {
                var vat = parseFloat(formModel['SUnit' + name]) / parseFloat(formModel[unitKey] || '0');
                formModel[name] = vat * 100;
                formModel['PUnit' + name] = vat * parseFloat(formModel['P' + unitKey] || '0');
            } else {
                formModel[name] = 0;
                formModel['PUnit' + name] = 0;
            }
        };
        function onPUnitChange(name, unitKey) {
            if (formModel['PUnit' + name]) {
                var vat = parseFloat(formModel['PUnit' + name]) / parseFloat(formModel['P' + unitKey] || '0');
                formModel[name] = vat * 100;
                formModel['SUnit' + name] = vat * parseFloat(formModel[unitKey] || '0');
            } else {
                formModel['SUnit' + name] = 0;
                formModel[name] = 0;
            }
        };

        function onBindKeyUp(elm, func, key,unitKey) {
            elm.keyup(function () {
                func.call(this, key, unitKey);
            });
        };
        function onSetKeyUp(key, unitKey) {
            onBindKeyUp($(formInputs[key]), onMainChange, key, unitKey);
            onBindKeyUp($(formInputs['SUnit' + key]), onSUnitChange, key, unitKey);
            onBindKeyUp($(formInputs['PUnit' + key]), onPUnitChange, key, unitKey);
        };
        this.Bind = function (model) {
            if (!isBind) {
                model = model || {};
                isBind = true;
                formInputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(cancel);
                Global.Click(windowModel.View.find('.btn_save'), save);
                $(formInputs['UnitTradePrice']).keyup(onUnitTradePriceChange);
                $(formInputs['PUnitTradePrice']).keyup(onPUnitTradePriceChange);
                $(formInputs['UnitSalePrice']).keyup(onUnitSalePriceChange);
                $(formInputs['PUnitSalePrice']).keyup(onPUnitSalePriceChange);
                $(formInputs['UnitConversion']).keyup(onUnitConversionChange);

                onSetKeyUp('MaxSaleDiscount', 'UnitSalePrice');
                onSetKeyUp('Vat', 'UnitTradePrice');
                onSetKeyUp('PurchaseDiscount', 'UnitTradePrice');
                onSetKeyUp('Discount', 'UnitSalePrice');

                bindDropDown();
                bindAutoComplete();
            }
        };
    };
};

