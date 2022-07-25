var Controller = new function () {
    var that = this, windowModel, formModel = {}, callarOptions = {}, service = {}, formInputs, acntDpr;
    function getModel() {
        var model = {
            AccountGroupId:formModel.AccountGroupId,
            ParentId:callarOptions.model.Id
        };
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            var model = getModel();
            windowModel.Wait();
            Global.CallServer('/AccountantArea/BalanceSheetSettingItem/Create', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    cancel();
                    callarOptions.OnSuccess();
                } else {
                    Global.Error.Show(response, '/AccountantArea/BalanceSheetSettingItem/Create');
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
    function getAccountDpr(id, dataurl, filter, func) {
        var flt = filter ? [filter] : [];
        filter = filter || {};
        filter.value = '00000000-0000-0000-0000-000000000000';

        var model = {
            elm: $(formInputs[id]),
            url: dataurl,
            change: func,
            page: { "PageNumber": 1, "PageSize": 20, filter: flt }
        };
        Global.AutoComplete.Bind(model);
        return model
    }
    function getDropdown() {
        var gropFlt={ field: 'CategoryId' };
        getAccountDpr('CategoryId', '/AccountantArea/AccountGroupCategory/AutoComplete', none, function (data) {
            if (data && data.Id) {
                gropFlt.value = data.Id;
            } else {
                gropFlt.value = '00000000-0000-0000-0000-000000000000';
            }
            acntDpr.Reload();
        });
        acntDpr = getAccountDpr('AccountGroupId', '/AccountantArea/AccountGroup/AutoCompleteForReport', gropFlt, function (data) {

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
        getDropdown();
        show();
    };
    this.Show = function (opts) {
        callarOptions = opts;
        formModel.Date = '';
        if (windowModel) {
            show();
            acntDpr.Reload();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/AccountantArea/Templates/BalanceSheetSettingItem/Add.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    };
};
