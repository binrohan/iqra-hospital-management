var Controller = new function () {
    var windowModel, inputs, formModel, callarOptions;
    function onSubmit(model, data, formModel) {
        for (var key in model) {
            model[key] = none;
        }
        model.Id = callarOptions.InvestigationId;
        if (callarOptions.model.Due > 0) {
            alert("Due must be 0.");
            return false;
        }
    };
    function onViewCreated(wndModel, formInputs, dropDownList, IsNew, frmModel) {
        windowModel = wndModel;
        inputs = formInputs;
        formModel = frmModel;
        (['Code', 'Name', 'Gender', 'Mobile', 'NetBill', 'PaidAmount', 'Due']).each(function () {
            $(inputs[this + '']).prop('disabled', true);
        });
    };
    function show(model) {
        Global.Add({
            model: model,
            name: 'MakeDelivered',
            title:'Make Delivered',
            saveChange: '/InvestigationArea/PatientInvestigation/MakeDelivered',
            columns: [
                { field: 'Code', title: 'Patient-Code' },
                { field: 'Name', title: 'Patient-Name' },
                { field: 'Gender', title: 'Gender' },
                { field: 'Mobile', title: 'Mobile' },
                { field: 'NetBill', title: 'Net-Bill' },
                //{ field: 'PaidAmount', title: 'Paid-Amount' },
                { field: 'Due', title: 'Due' },
                { field: 'Remarks', required: false, add: { type: 'textarea', sibling: 1 } }
            ],
            onSubmit: onSubmit,
            onSaveSuccess: function (response) {
                callarOptions.onSaveSuccess(response);
            },
            onViewCreated: onViewCreated
        });
    };
    function load() {
        Global.CallServer('/InvestigationArea/PatientInvestigationList/CheckDetails?Id=' + callarOptions.InvestigationId, function (response) {
            if (!response.IsError) {
                var data = response.Data,
                    patientModel = data[0][0],
                    investigationModel = data[1][0];
                data = {
                    Code: patientModel.Code,
                    Name: patientModel.Name,
                    Gender: patientModel.Gender,
                    Mobile: patientModel.Mobile,
                    NetBill: investigationModel.DiscountedAmount,
                    AlreadyPaid: investigationModel.PaidAmount,
                    PayAmount: investigationModel.DueAmount,
                    Due: investigationModel.DueAmount
                };
                callarOptions.model = data;
                show(data);
                if (callarOptions.model.Due > 0) {
                    alert("Due must be 0.");
                }
            } else {
                Global.Error.Show(response, {});
            }
        }, function (response) {
            response.Id = -8;
            Global.Error.Show(response, {});
        }, null, 'Get');
    };
    this.Show = function (model) {
        callarOptions = model;
        load();
    };
};