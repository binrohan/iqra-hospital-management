var Controller = new function () {
    var that = this,windowModel , formModel = {}, callarOptions = {}, service = {}, formInputs;
    function getModel() {
        var model = {};
        for (var key in formInputs) {
            model[key] = formModel[key];
        }
        model.Rate = model.Rate || 0;
        model.DepreciationLife = model.DepreciationLife || 0;
        model.DepreciationRateType = formModel.IsDepreciationRate ? 0 : 1;
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            var model = getModel();
            windowModel.Wait();
            Global.CallServer('/AccountantArea/FixedAssetType/Create', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    cancel();
                    callarOptions.OnSuccess();
                } else {
                    Global.Error.Show(response, '/ItemSalesArea/DailySale/Create');
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
    function getAccountDpr(id, func) {
        var model = {
            elm: $(formInputs[id]),
            url: '/AccountantArea/AppAccount/AutoComplete',
            onChange: func
        };
        Global.AutoComplete.Bind(model);
        return model
    }
    function getDpr(id,data, func) {
        var model={
            elm: $(formInputs[id]),
            dataSource: data
        }
        Global.DropDown.Bind(model);
        return model
    };
    function getDropdown() {

        getAccountDpr('AssetAccountId');
        getAccountDpr('AccumulatedDepreciationAccountId');
        getAccountDpr('DepreciationExpenseAccountId');

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


    };
    function show() {
        windowModel.Show();
    };
    function createWindow(template) {
        windowModel = Global.Window.Bind(template, { width: '98%' });
        formInputs = Global.Form.Bind(formModel, windowModel.View);
        windowModel.View.find('.btn_cancel').click(cancel);
        Global.Click(windowModel.View.find('.btn_save'), save);
        getDropdown();
        show();
    };
    this.Show = function (opts) {
        callarOptions = opts;
        formModel.Date = '';
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/AccountantArea/Templates/FixedAssetType/AddInOut.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    };
};

