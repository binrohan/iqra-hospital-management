var Controller = new function () {
    var that = this, options, formModel = {}, windowModel, formInputs;
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var model = { Id: options.model.Id, Barcode: formModel.Barcode };
            Global.CallServer('/ProductArea/Product/BarcodeChange', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    options.onSaveSuccess(formModel, formInputs);
                    options.model.Code = model.Barcode;
                    cancel();
                } else {
                    if (response.Id == -4 && response.Msg) {
                        alert(response.Msg);
                    } else {
                        alert('Server Errors.');
                    }
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
    function show(model) {
        formModel.Barcode = model.Code;
        formModel.Name = model.Name;
        windowModel.Show();
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
            Global.LoadTemplate('/Content/IqraPharmacy/ProductArea/Templates/BarcodeChangeController.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    }
    this.Events = new function () {
        var isBind = false;
        this.Bind = function (model) {
            if (!isBind) {
                model = model || {};
                isBind = true;
                formInputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(cancel);
                Global.Click(windowModel.View.find('.btn_save'), save);
            }
        };
    };
};

