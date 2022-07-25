var Controller = new function () {
    var that = this,windowModel , formModel = {}, callarOptions = {}, service = {}, formInputs;
    function getModel() {
        var model = {};
        model.Name = formModel.Name;
        model.Description = formModel.Description;
        model.ComponentId = [formModel.TaxComponentId];
        model.Rate = formModel.Rate || 0;
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            var model = getModel();
            windowModel.Wait();
            Global.CallServer('/AccountantArea/TaxRate/Create', function (response) {
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
    function getDropdown() {
        Global.AutoComplete.Bind({
            elm: $(formInputs['TaxComponentId']),
            url: '/AccountantArea/TaxComponent/AutoComplete',
            change: function (data) {
                console.log([data, formModel]);
                formModel.Rate = data.Rate;
            }
        });
    };
    function show() {
        windowModel.Show();
    };
    function createWindow(template) {
        windowModel = Global.Window.Bind(template, { width: '95%' });
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
            Global.LoadTemplate('/Content/IqraPharmacy/AccountantArea/Templates/TaxRate/Add.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    };
};

