
var Controller = new function () {
    var windowModel, formModel = {}, inputs = {}, callerOptions;
    function printRelease(id) {
        Global.Add({
            type: 'Release',
            PatientId: callerOptions.model.Id,
            PatientName: callerOptions.model.Name,
            PatientCondition: formModel.PatientCondition,
            Remarks: formModel.Remarks,
            name: 'ReleasePrintPreview',
            url: '/Content/IqraHMS/BillingArea/Js/Release/PrintRelease.js',
        });
    };
    function getModel() {
        var model = {
            PatientId: callerOptions.model.Id,
            PatientName: callerOptions.model.Name,
            PatientCondition: formModel.PatientCondition,
            Remarks: formModel.Remarks
        };
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait('Please Wait while saving data......');
            var model = getModel(),
                saveUrl = '/AdmissionArea/Release/Create';
            Global.CallServer(saveUrl, function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    callerOptions.onSaveSuccess(formModel, inputs);
                    close();
                    printRelease(response.Id);
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                windowModel.Free();
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
            formModel.Name = model.Name;
            formModel.Mobile = model.Mobile;
            formModel.Email = model.Email;
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
            Global.LoadTemplate('/Content/IqraHMS/PatientArea/Templates/Release.html', function (response) {
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