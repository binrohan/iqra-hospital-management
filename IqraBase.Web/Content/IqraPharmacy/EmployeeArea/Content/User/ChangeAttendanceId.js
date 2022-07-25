
var Controller = new function () {
    var that = this, options, formModel = {}, windowModel, formInputs;
    function getModel() {
        var model = { attendanceId: formModel.attendanceId };
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var model = getModel();
            Global.CallServer('/EmployeeArea/Employee/UpdateAttendanceId', function (response) {
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
        windowModel = Global.Window.Bind(template);
        that.Events.Bind(options.model);
        show(options.model);
    };
    this.Show = function (opts) {
        options = opts;
        if (windowModel) {
            show(options.model);
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/EmployeeArea/Templates/ChangeAttendanceId.html', function (response) {
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

