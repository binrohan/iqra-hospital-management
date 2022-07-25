var Controller = new function () {
    var that = this, windowModel, formModel = {}, callarOptions = {}, service = {}, formInputs,amount;
    function getModel() {
        var model = {};
        for (var key in formInputs) {
            model[key] = formModel[key];
        }
        ['Rate', 'Subtotal', 'TotalTax', 'Total', 'Tax'].each(function () {
            model[this] = formModel[this] || 0;
        });
        model.Amount = formModel.PurchasePrice || 0;
        model.DepreciationLife = model.DepreciationLife || 0;
        model.DepreciationRateType = formModel.IsDepreciationRate ? 0 : 1;
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            var model = getModel();
            windowModel.Wait();
            Global.CallServer('/AccountantArea/FixedAsset/Addnew', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    cancel();
                    callarOptions.OnSuccess();
                } else {
                    Global.Error.Show(response, '/AccountantArea/FixedAsset/Addnew');
                }
            }, function (response) {
                windowModel.Free();
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
    function getDpr(id, data, func) {
        var model = {
            elm: $(formInputs[id]),
            dataSource: data,
            change: func
        }
        Global.DropDown.Bind(model);
        return model
    };
    function onKeyUp() {
        var amnt = parseFloat(formModel.PurchasePrice || '0') || 0;
        if (amnt != amount) {
            amount = amnt;
            onChange();
        }
    };
    function onChange() {
        var amount = parseFloat(formModel.PurchasePrice||'0')||0,
            tax = parseFloat(formModel.Tax || '0') || 0,
            taxType = parseFloat(formModel.TaxType || '0') || 0;
        console.log([amount, tax, taxType]);
        if (taxType == 0) {
            formModel.Subtotal = amount;
            formModel.TotalTax = 0;
            formModel.Total = amount;
        } else if (taxType == 1) {
            formModel.Subtotal = amount;
            formModel.TotalTax = tax.mlt(amount).div(100 + tax).toFloat();
            formModel.Total = amount;
        } else if (taxType == 2) {
            tax = tax .mlt( amount) .div( 100) ;
            formModel.Subtotal = amount;
            formModel.TotalTax = tax;
            formModel.Total = amount + tax;
        }
    };
    function getDropdown() {
        Global.AutoComplete.Bind({
            elm: $(formInputs['TypeId']),
            url: '/AccountantArea/FixedAssetType/AutoComplete'
        });
        Global.AutoComplete.Bind({
            elm: $(formInputs['TaxRateId']),
            url: '/AccountantArea/TaxRate/AutoComplete',
            change: function (data) {
                if (data) {
                    formModel.Tax = data.Rate;
                } else {
                    formModel.Tax = 0;
                }
                onChange();
            }
        });
        getDpr('DepreciationMethod', [
                { value: '0', text: 'No Depreciation' },
                { value: 1, text: 'Straight Line' },
                { value: 2, text: 'Declining Balance' },
                { value: 3, text: 'Declining Balance (150%)' },
                { value: 4, text: 'Declining Balance (200%)' },
                { value: 5, text: 'Full Depreciation at Purchase' }
        ]);
        getDpr('AvaragingMethod', [
                { value: '0', text: 'Full Month' },
                { value: 1, text: 'Actual Days' }
        ]);
        getDpr('TaxType', [
                { value: '0', text: 'No Tax' },
                { value: 1, text: 'Tax Included' },
                { value: 2, text: 'Tax Excluded' }
        ], function (data) {
            onChange();
        });
    };
    function show() {
        windowModel.Show();
    };
    function createWindow(template) {
        windowModel = Global.Window.Bind(template, { width: '98%' });
        formInputs = Global.Form.Bind(formModel, windowModel.View);
        windowModel.View.find('.btn_cancel').click(cancel);
        Global.Click(windowModel.View.find('.btn_save'), save);
        $(formInputs['PurchasePrice']).keyup(onKeyUp);
        getDropdown();
        show();
    };
    this.Show = function (opts) {
        callarOptions = opts;
        formModel.Date = '';
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/AccountantArea/Templates/FixedAsset/Add.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    };
};

