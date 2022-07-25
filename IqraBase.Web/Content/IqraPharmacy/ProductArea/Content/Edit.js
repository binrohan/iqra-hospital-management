var Controller = new function (none) {
    var that = this, options, formModel = {}, defaultSalary = 0, windowModel, formInputs, dropDownList = {},
        oldTitle = document.title, urls = ['/Pharmacy/PharmacyItem/', '/NonePharmacy/NonePharmacy/'], titles = ['Add ', 'Edit ', 'Duplicate '], saveUrls = [];

    function getUrl() {
        return urls[options.ItemType] + (options.Type === 1 ? 'Update' : 'AddNew');
    };
    function getModel() {
        var model = {};
        model.Id = formModel.Id;
        model.Name = formModel.Name;
        model.GenericName = formModel.GenericName;
        model.Code = formModel.Code;
        model.Strength = formModel.Strength;
        model.CategoryId = formModel.CategoryId;
        model.CounterId = formModel.CounterId;
        model.SuplierId = formModel.SuplierId;
        model.SalesUnitTypeId = formModel.SalesUnitTypeId;
        model.PurchaseUnitTypeId = formModel.PurchaseUnitTypeId;
        model.UnitConversion = formModel.UnitConversion;
        model.UnitSalePrice = formModel.UnitSalePrice;
        model.UnitTradePrice = formModel.UnitTradePrice; 
        model.UnitPurchasePrice = formModel.UnitTradePrice;
        model.MinStockToAlert = formModel.MinStockToAlert;
        model.SoldDaysForParchaseRequired = formModel.SoldDaysForParchaseRequired;
        model.Vat = formModel.Vat || 0;
        model.Discount = formModel.Discount || 0;
        model.PurchaseDiscount = formModel.PurchaseDiscount || 0;
        model.MaxSaleDiscount = formModel.MaxSaleDiscount || 0;
        model.PurchaseVat = formModel.PurchaseVat || 0;
        return model;
    };
    function setConversion(model, formInputs) {
        Global.Add({
            model: model,
            formInputs: formInputs,
            options: options.model,
            windowModel: windowModel,
            saveToServer:saveToServer,
            name: 'Conversion',
            url: '/Content/IqraPharmacy/ProductArea/Content/AddConversion.js',
        });
    };
    function save() {
        if (formModel.IsValid) {
            var model = getModel();
            if (options.Type === 1 &&(options.model.SalesUnitTypeId != model.SalesUnitTypeId)) {
                setConversion(model,formInputs);
                return;
            }
            model.UnitChangeConversion = 1;
            windowModel.Wait();
            saveToServer(model);
        } else {
            alert('Validation Errors.');
        }
        return false;
    };
    function saveToServer(model, func) {
        Global.CallServer(getUrl(), function (response) {
            windowModel.Free();
            if (!response.IsError) {
                options.onSaveSuccess(formModel, formInputs);
                func && func();
                cancel();
            } else {
                Global.Error.Show(response, {});
            }
        }, function (response) {
            windowModel.Free();
            response.Id = -8;
            alert('Network Errors.');
        }, model, 'POST');
    }
    function cancel() {
        document.title = oldTitle;
        windowModel.Hide(function () {
        });
    };
    function populateByKey(model, key, appKey) {
        var vat = model[key] .div( 100);
        formModel['SUnit' + key] = vat .mlt( model[appKey]);
        formModel['PUnit' + key] = vat .mlt( parseFloat(formModel['P'+appKey] || '0'));
    };
    function getDefaultModel() {
        var model = {};
        for (var key in formInputs) {
            if (formInputs[key].dataset.type == "string") {
                model[key] = '';
            } else {
                model[key] = 0;
            }
        }
        console.log(model);
        return model;
    };
    function populate(model) {
        model = Global.Copy({}, model || getDefaultModel());
        var newModel = {};
        model.UnitTradePrice = model.UnitPurchasePrice||0;
        for (var key in formModel) {
            if (typeof (model[key]) !== typeof (none)) formModel[key] = model[key];
        }
        formModel.Id = model.Id;
        //if (model.Vat !== model.PurchaseDiscount) {
        //    formModel.UnitTradePrice = model.UnitTradePrice = model.UnitTradePrice .mlt(100).div(100 + model.Vat - model.PurchaseDiscount);
        //}

        formModel.PUnitSalePrice = model.UnitConversion.mlt( model.UnitSalePrice);
        formModel.PUnitTradePrice = model.UnitConversion.mlt( model.UnitTradePrice);
        populateByKey(model, 'Vat', 'UnitSalePrice');
        populateByKey(model, 'MaxSaleDiscount', 'UnitSalePrice');
        populateByKey(model, 'Discount', 'UnitSalePrice');
        populateByKey(model, 'PurchaseDiscount', 'UnitTradePrice');
        populateByKey(model, 'PurchaseVat', 'UnitTradePrice');
        dropDownList.Model = model;
        dropDownList.each(function () {
            if (this.data && this.val) {
                this.val(model[this.Id]);
            } else {
                this.selectedValue = model[this.Id];
            }
        });
    };
    function show(model) {
        windowModel.Show();
        if (options.Type > 0) {
            populate(model);
        } else {
            populate();
        }
        oldTitle = document.title;
        document.title=formModel.Title = titles[options.Type] + typeName;
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
            Global.LoadTemplate(template, function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    }
    this.Events = new function () {
        var isBind = false, selfService = {};
        function bindDropDown() {
            dropDownList = [
                { Id: 'SalesUnitTypeId', url: untUrl, position: 14 },
                { Id: 'PurchaseUnitTypeId', url: untUrl, position: 14 },
                //{ Id: 'CounterId', url: cntrUrl, position: 16 }
            ];
            dropDownList.each(function () {
                this.elm = $(formInputs[this.Id]);
                Global.AutoComplete.Bind(this);
            });
        }
        function bindAutoComplete() {
            var model = {
                Id: 'SuplierId',
                url: '/SuplierArea/Suplier/AutoCompleteWithCounter',
                type: 'AutoComplete',
                position: 4,
                onDataBinding: function (response) {
                    //response.Data.each(function () {
                    //    this.Name = this.text;
                    //});
                },
                elm: $(formInputs['SuplierId']).empty(),
                change: function (data) {
                    if (data) {
                        formModel.CounterId = data.CounterId;
                        console.log(formModel);
                    }
                }
            };
            dropDownList.push(model);
            Global.AutoComplete.Bind(model);
            model = {
                Id: 'CategoryId',
                url: ctgUrl,
                type: 'AutoComplete',
                position: 4,
                onDataBinding: function (response) {
                    //response.Data.each(function () {
                    //    this.Name = this.text;
                    //});
                },
                elm: $(formInputs['CategoryId']).empty()
            };
            dropDownList.push(model);
            Global.AutoComplete.Bind(model);
        };
        function onUnitSalePriceChange() {
            formModel.PUnitSalePrice = formModel.UnitSalePrice ? parseFloat(formModel.UnitSalePrice || '0').mlt(parseFloat(formModel.UnitConversion || '0')) : 0;
            onMainChange('Vat', 'UnitSalePrice');
            onMainChange('MaxSaleDiscount', 'UnitSalePrice');
            onMainChange('Discount', 'UnitSalePrice');
        };
        function onPUnitSalePriceChange() {
            var value = parseFloat(formModel.UnitConversion || '0');
            if (value && formModel.PUnitSalePrice) {
                formModel.UnitSalePrice = parseFloat(formModel.PUnitSalePrice || '0').div(value);
            }
            else {
                formModel.UnitSalePrice = 0;
            }
            onMainChange('Vat', 'UnitSalePrice');
            onMainChange('MaxSaleDiscount', 'UnitSalePrice');
            onMainChange('Discount', 'UnitSalePrice');
        };
        function onUnitTradePriceChange() {
            formModel.PUnitTradePrice = formModel.UnitTradePrice ? parseFloat(formModel.UnitTradePrice ||'0').mlt(parseFloat(formModel.UnitConversion || '0')) : 0;
            onMainChange('PurchaseVat', 'UnitTradePrice');
            onMainChange('PurchaseDiscount', 'UnitTradePrice');
        };
        function onPUnitTradePriceChange() {
            var value = parseFloat(formModel.UnitConversion || '0');
            if (value && formModel.PUnitTradePrice) {
                formModel.UnitTradePrice = parseFloat(formModel.PUnitTradePrice || '0').div(value);
            }
            else {
                formModel.UnitTradePrice = 0;
            }
            onMainChange('PurchaseVat', 'UnitTradePrice');
            onMainChange('PurchaseDiscount', 'UnitTradePrice');
        };
        function onUnitConversionChange() {
            var conversion = parseFloat(formModel.UnitConversion || '0');
            formModel.PUnitTradePrice = parseFloat(formModel.UnitTradePrice || '0') .mlt( conversion);
            formModel.PUnitSalePrice = parseFloat(formModel.UnitSalePrice || '0') .mlt( conversion);
            //if (formModel.CounterId === '06ce70b3-39f1-4b28-b5bb-2e1fa9926f33') {
            //    formModel.Vat = 17.4;
            //}
            onMainChange('Vat', 'UnitSalePrice');
            onMainChange('MaxSaleDiscount', 'UnitSalePrice');
            onMainChange('Discount', 'UnitSalePrice');
            onMainChange('PurchaseVat', 'UnitTradePrice');
            onMainChange('PurchaseDiscount', 'UnitTradePrice');
        };
        
        function onMainChange(name, unitKey) {
            if (formModel[name]) {
                var vat = parseFloat(formModel[name]) / 100;
                formModel['SUnit' + name] = vat .mlt( parseFloat(formModel[unitKey] || '0'));
                formModel['PUnit' + name] = vat .mlt( parseFloat(formModel['P' + unitKey] || '0'));
            } else {
                formModel['SUnit' + name] = 0;
                formModel['PUnit' + name] = 0;
            }
        };
        function onSUnitChange(name, unitKey) {
            var value = parseFloat(formModel[unitKey] || '0');
            if (value&&formModel['SUnit' + name]) {
                var vat = parseFloat(formModel['SUnit' + name]).div(value);
                formModel[name] = vat .mlt( 100);
                formModel['PUnit' + name] = vat .mlt( parseFloat(formModel['P' + unitKey] || '0'));
            } else {
                formModel[name] = 0;
                formModel['PUnit' + name] = 0;
            }
        };
        function onPUnitChange(name, unitKey) {
            var value = parseFloat(formModel['P' + unitKey] || '0');
            if (value&&formModel['PUnit' + name]) {
                var vat = parseFloat(formModel['PUnit' + name]).div(value);
                formModel[name] = vat .mlt( 100);
                formModel['SUnit' + name] = vat.mlt(parseFloat(formModel[unitKey] || '0'));
                //console.log([vat, formModel]);
            } else {
                formModel['SUnit' + name] = 0;
                formModel[name] = 0;
            }
        };

        function onBindKeyUp(elm, func, key, unitKey) {
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
                onSetKeyUp('Discount', 'UnitSalePrice');
                onSetKeyUp('Vat', 'UnitSalePrice');
                onSetKeyUp('PurchaseVat', 'UnitTradePrice');
                onSetKeyUp('PurchaseDiscount', 'UnitTradePrice');

                bindDropDown();
                bindAutoComplete();
            }
        };
    };
};

