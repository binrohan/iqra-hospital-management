
var Controller = new function () {
    var that = this, options, formModel = {}, windowModel, formInputs;
    function getModel() {
        var model = {};
        model.OldPassword = formModel.OldPassword;
        model.NewPassword = formModel.NewPassword;
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            if (formModel.NewPassword != formModel.ConfirmPassword)
            {
                alert('NewPassword and ConfirmPassword does not match.');
                return;
            }
            windowModel.Wait();
            var model = getModel();
            Global.CallServer('/EmployeeArea/Employee/ChangePassword', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    windowModel.Free();
                    //options.onSaveSuccess(formModel, formInputs);
                    cancel();
                } else {
                    if (response.Msg) alert(response.Msg);
                    else
                        alert('Internal server errors.');
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
        windowModel.Show();
    }
    function createWindow(template) {
        windowModel = Global.Window.Bind(template, {width:400});
        that.Events.Bind(options.model);
        show(options.model);
    };
    this.Show = function (opts) {
        options = opts;
        if (windowModel) {
            show(options.model);
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/EmployeeArea/Templates/ChangePassword.html', function (response) {
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

