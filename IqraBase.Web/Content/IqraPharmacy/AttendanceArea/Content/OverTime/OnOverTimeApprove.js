var Controller = new function () {
    var that = this, callerOptions, formModel = {}, windowModel;
    function getModel() {
        var model = { Id: callerOptions .model.Id};
        model.duration = parseInt(formModel.Hour || '0') * 60 + parseInt(formModel.Minutes || '0');
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var model = getModel();
            Global.CallServer('/AttendanceArea/OverTime/onApprove', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    callerOptions.onSaveSuccess();
                    cancel();
                } else {
                    alert('Errors.');;
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
    function show() {
        formModel.Hour = parseInt(callerOptions.model.Duration / 60);
        formModel.Minutes = parseInt(callerOptions.model.Duration % 60);
        windowModel.Show();
    }
    function createWindow(template) {
        windowModel = Global.Window.Bind(template);
        Global.Form.Bind(formModel, windowModel.View);
        windowModel.View.find('.btn_cancel').click(cancel);
        Global.Click(windowModel.View.find('.btn_save'), save);
        show(callerOptions.model);
    };
    this.Show = function (opts) {
        callerOptions = opts;
        if (windowModel) {
            show(callerOptions.model);
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/AttendanceArea/Templates/OnOverTimeApprove.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    }
};

