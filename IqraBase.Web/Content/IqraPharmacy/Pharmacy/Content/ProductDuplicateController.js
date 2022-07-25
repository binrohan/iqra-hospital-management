
var Controller = new function (none) {
    var service = {}, windowModel, formModel = {}, callerOptions, formInputs = {};
    function getData() {

        var model = Global.Copy({}, formModel,true);
        return model;
    };
    function save() {
        var model = getData();
        if (formModel.IsValid) {
            windowModel.Wait('Please Wait while saving data......');
            Global.Uploader.upload({
                data: model,
                url:callerOptions.saveUrl?callerOptions.saveUrl: '/Pharmacy/PharmacyItem/AddNew',
                onProgress: function (data) {

                },
                onComplete: function (response) {
                    windowModel.Free();
                    if (!response.IsError) {
                        callerOptions.onSaveSuccess();
                        close();
                    } else if (response.Id === -4) {
                        //alert('This email is already registered.');
                    }
                    else
                        Global.Error.Show(response);
                },
                onError: function () {
                    windowModel.Free();
                    response.Id = -8;
                    Global.Error.Show(response, { user: '' })
                }
            });
        }
    };
    function populate(model) {
        console.log(model);
        for (var key in formModel) {
            if (model[key]) formModel[key] = model[key];
        }
        service.DropDown.SetValue(model);
    };
    function close() {
        windowModel && windowModel.Hide();
    };
    function show() {
        console.log(callerOptions);
        windowModel.Show();
        service.Loader.Load();
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ProductArea/Templates/ProductDuplicate.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '99%' });
                formInputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                Global.Submit(windowModel.View.find('form'), save);
                show();
                service.DropDown.Bind(formInputs);
            }, noop);
        }
    };
    (function () {
        var dpr = [
                { Id: 'CategoryId', url: '/Category/AutoComplete' },
                { Id: 'SalesUnitTypeId', url: '/UnitType/AutoComplete' },
                { Id: 'PurchaseUnitTypeId', url: '/UnitType/AutoComplete' },
                { Id: 'SuplierId', url: '/Suplier/AutoComplete', type: 'AutoComplete' },
                { Id: 'CounterId', url: '/ProductArea/Counter/AutoComplete' }
        ];
        this.Bind = function (inputs) {
            dpr.each(function () {
                this.val = noop;
                this.elm = $(inputs[this.Id]);
                Global.AutoComplete.Bind(this);
            });
        }
        this.SetValue = function (model) {
            dpr.each(function () {
                model[this.Id]&&this.val(model[this.Id]);
            });
        }
    }).call(service.DropDown = {});
    (function () {
        this.Load = function (orderInfoId) {
            windowModel.Wait('Please wait while loading data......');
            Global.CallServer('/ProductArea/Product/Details?Id=' + callerOptions.model.Id, function (response) {
                windowModel.Free();
                populate(response.Data);
            }, function (response) {
            }, null, 'GET', null, false);
        }
    }).call(service.Loader = {});
};