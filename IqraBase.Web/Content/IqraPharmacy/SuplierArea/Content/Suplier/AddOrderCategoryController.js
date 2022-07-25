var Controller = new function () {
    var that = this, options, formModel = {}, windowModel, formInputs, drp = {};
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var model = { SuplierId: options.model.Id, CategoriId: formModel.CategoriId };
            Global.CallServer('/SuplierArea/Suplier/SetOrderCategory', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    options.model.OrderCategory = formModel.OrderCategory;
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
            Global.LoadTemplate('/Content/IqraPharmacy/SuplierArea/Templates/OrderCategory.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    }
    this.Events = new function () {
        var isBind = false;
        function bindDrp() {
            drp = {
                elm: $(formInputs['CategoriId']),
                url: '/SuplierArea/SuplierOrderCategory/AutoComplete',
                change: function (data) {
                    if (data) {
                        formModel.OrderCategory = data.Name;
                    }
                }
            };
            Global.AutoComplete.Bind(drp);
        }
        this.Bind = function (model) {
            if (!isBind) {
                model = model || {};
                isBind = true;
                formInputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(cancel);
                Global.Click(windowModel.View.find('.btn_save'), save);
                bindDrp();
            }
        };
    };
};