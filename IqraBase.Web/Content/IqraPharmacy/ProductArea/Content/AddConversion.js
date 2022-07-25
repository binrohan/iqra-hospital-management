var Controller = new function (none) {
    var that = this, options, formModel = {}, dbModel = {}, defaultSalary = 0, windowModel, formInputs, dropDownList = {}, oldTitle = document.title;
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
        model.MinStockToAlert = formModel.MinStockToAlert;
        model.SoldDaysForParchaseRequired = formModel.SoldDaysForParchaseRequired;
        model.Vat = formModel.Vat || 0;
        model.Discount = formModel.Discount || 0;
        model.PurchaseDiscount = formModel.PurchaseDiscount || 0;
        model.MaxSaleDiscount = formModel.MaxSaleDiscount || 0;
        return model;
    };
    function save() {
        var conversion=parseFloat(formModel.UnitConversion);
        if (conversion) {
            options.model.UnitChangeConversion = conversion;
            options.saveToServer(options.model);
            cancel();
        } else {
            alert('Old Unit to new unit must be greater than 0.')
        }
        return false;
    };
    function cancel() {
        document.title = oldTitle;
        windowModel.Hide(function () {
        });
    };
    function populate(model) {

        formModel.Title = 'Unit Changes';
        formModel.NewSalesUnitType = $(options.formInputs['SalesUnitTypeId']).data('dropdown').GetText();
        formModel.OldSalesUnitType = ''
        formModel.UnitConversion = 1;
        formModel.OldUnitStock = ''
        formModel.NewUnitStock = ''
    };
    function loadData() {
        windowModel.Wait();
        Global.CallServer('/ProductArea/Product/GetStock?Id=' + options.model.Id + '&unitId=' + options.options.SalesUnitTypeId, function (response) {
            windowModel.Free();
            if (!response.IsError) {
                if (!response.Data.Stock) {
                    options.model.UnitChangeConversion = 1;
                    options.saveToServer(options.model);
                    cancel();
                    return;
                }
                console.log(response.Data);
                formModel.NewUnitStock=dbModel.NewUnitStock = response.Data.Stock;
                formModel.OldUnitStock = dbModel.OldUnitStock = response.Data.Stock;
                formModel.OldSalesUnitType = dbModel.OldSalesUnitType = response.Data.UnitType;
            } else {
                alert('Internal Server Errors.');
            }
        }, function (response) {
            windowModel.Free();
            response.Id = -8;
            alert('Network Errors.');
        }, null, 'Get');
    };
    function show(model) {
        windowModel.Show();
        populate(model);
        loadData();
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
            Global.LoadTemplate('/Content/IqraPharmacy/ProductArea/Templates/AddConversion.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    }
    this.Events = new function () {
        var isBind = false, selfService = {};
        function onUnitConversionChange() {
            var conversion = parseFloat(formModel['UnitConversion'])||0;

            formModel.NewUnitStock = dbModel.NewUnitStock * conversion;
        };

        this.Bind = function (model) {
            if (!isBind) {
                model = model || {};
                isBind = true;
                formInputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(cancel);
                Global.Click(windowModel.View.find('.btn_save'), save);
                $(formInputs['UnitConversion']).keyup(onUnitConversionChange);
            }
        };
    };
};

