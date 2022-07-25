
var Controller = new function () {
    var windowModel, formModel = {}, inputs = {}, callerOptions;
    function getTime(str) {
        return Global.DateTime.GetObject(str, 'dd/MM/yyyy hh:mm').getTime();
    };
    function getModel() {
        var model = {
            PatientId: callerOptions.model.Id,
            PatientName: callerOptions.model.Name,
            From: formModel.From,
            To: formModel.To,
            DayCount: Math.ceil(((getTime(formModel.To) - getTime(formModel.From)) / 86400000)),
            Remarks: formModel.Remarks
        };
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait('Please Wait while saving data......');
            var model = getModel(),
                saveUrl = '/BillingArea/BedChargeInvoice/Create';
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
                alert('Network Errors.');
            }, model, 'POST');
        } else {
            alert('Validation Error.');
        }
    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function populate(model) {
        var patientModel = model[0][0],
            patientTransectionModel = model[1][0]

        for (var key in formModel) {
            if (typeof patientModel[key] != 'undefined') {
                formModel[key] = patientModel[key];
            }
        }
        if (patientTransectionModel.Balance < 0) {
            formModel.BillAmount = -patientTransectionModel.Balance;
            formModel.PaidAmount = 0;
        } else {
            formModel.BillAmount = 0;
            formModel.PaidAmount = patientTransectionModel.Balance;
        }

        console.log(['data', formModel, patientModel, patientTransectionModel]);

        currentDate = model[2][0].CurrentDate.getDate();
        patientModel.DateOfBirth = patientModel.DateOfBirth.getDate();
        patientModel.PatientAge = new Date(currentDate.getTime() - patientModel.DateOfBirth.getTime());
        patientModel.PatientAge.setFullYear(patientModel.PatientAge.getFullYear() - 1970);
        formModel.PatientAge = patientModel.PatientAge.getFullYear() + ' yrs ' + (patientModel.PatientAge.getMonth() + 1) + ' mnths ' + patientModel.PatientAge.getDate() + ' days ';
        
    };
    function load() {
        windowModel.Wait('Please wait while loading data');
        Global.CallServer('/TransectionArea/PatientTransection/GetBalance?Id=' + callerOptions.PatientId, function (response) {
            windowModel.Free();
            if (!response.IsError) {
                populate(response.Data);
            } else {
                Global.Error.Show(response, {});
            }
        }, function (response) {
            windowModel.Free();
            response.Id = -8;
            Global.Error.Show(response, {});
        }, null, 'Get');
    };
    //function setDropdown() {
    //    clearanceType = {
    //        dataSource: [
    //            { text: 'Bill Clearance', value: '1' },
    //            { text: 'Ward Clearance', value: '2' },
    //        ],
    //        selectedValue: 'Not Define'
    //    };
    //    clearanceType.elm = $(inputs['ClearanceType']);
    //    Global.DropDown.Bind(clearanceType);
    //};
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            load();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/BillingArea/Templates/BedChargeInvoice.html', function (response) {
                windowModel = Global.Window.Bind(response);
                inputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                //setDropdown();
                //load();
                load();
                windowModel.Show();
            }, noop);
        }
    };
};