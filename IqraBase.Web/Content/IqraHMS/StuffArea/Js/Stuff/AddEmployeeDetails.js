





var Controller = new function () {
    var windowModel, formModel = {}, inputs = {}, callerOptions;


    function getModel() {
        var model = {
            EmployeeId: callerOptions.EmployeeId,
            FatherName: formModel.FatherName,
            MotherName: formModel.MotherName
        };
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait('Please Wait while saving data......');
            var model = getModel(),
                saveUrl = '/StuffArea/EmployeeDetails/Create';
            //model.Id = none;
            Global.CallServer(saveUrl, function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    callerOptions.onSaveSuccess(formModel, inputs);
                    close();
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                windowModel.Free();
                //response.Id = -8;
                alert('Network Errors.');
            }, model, 'POST');
        } else {
            alert('Validation Error.');
        }
    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function populate() {
        if (callerOptions.model) {
            var model = callerOptions.model;
            //formModel.Name = model.Name;
            //formModel.Phone = model.Phone;
            //formModel.Email = model.Email;
        } else {
            for (var key in formModel) formModel[key] = '';
        }
        console.log(['callerOptions.model', callerOptions.model, formModel]);
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            populate();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/StuffArea/Templates/AddEmployeeDetails.html', function (response) {
                windowModel = Global.Window.Bind(response);
                inputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                populate();
                windowModel.Show();
            }, noop);
        }
    };
};