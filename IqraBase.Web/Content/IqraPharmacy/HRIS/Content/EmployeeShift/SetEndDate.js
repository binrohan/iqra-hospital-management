
var Controller = new function () {
    var that = this, options, formModel = {}, windowModel;
    function getModel() {
        var model = { To: formModel.To, Id: options.model.Id };
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var model = getModel();
            Global.CallServer('/HRIS/EmployeeShift/SetEnd', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    windowModel.Free();
                    options.onSaveSuccess(formModel);
                    cancel();
                } else if (response.Id == -30) {
                        alert('Weekend not found.');
                } else if (response.Id == -40) {
                    alert("This weekend end date is already backdated.");
                } else if (response.Id == -50) {
                    alert("To Date can't be less than current date.");
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
        Global.Form.Bind(formModel, windowModel.View);
        windowModel.View.find('.btn_cancel').click(cancel);
        Global.Click(windowModel.View.find('.btn_save'), save);
        formModel.Title = 'Set End Date ';
        show(options.model);
    };
    this.Show = function (opts) {
        options = opts;
        if (windowModel) {
            show(options.model);
        } else {
            Global.Add({
                model: {
                    columns: [
                        { field: 'To', dateFormat: 'dd/MM/yyyy', },
                    ],
                },
                url: IqraConfig.Url.Js.AddFormController,
                onSuccess: function (template) {
                    createWindow(template);
                }
            });
        }
    };
};

