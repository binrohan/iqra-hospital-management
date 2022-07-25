//PatientArea/Patient/Registrtion

var Controller = new function () {
    var windowModel, inputs, formModel, callarOptions;

    function printInvoice() {
        Global.Add({
            type: 'New',
            PatientInvestigationId: callarOptions.InvestigationId,
            name: 'InvoicePrintPreview',
            url: '/Content/IqraHMS/BillingArea/Js/InvestigationInvoice/PrintInvestigationInvoice.js',
        });
    };
    function onSubmit(model, data, formModel) {
        //for (var key in model) {
        //    model[key] = none;
        //}
        model.RelationId = callarOptions.InvestigationId;
        model.PaidAmount = formModel.PayAmount;
        model.AccountId = formModel.AccountId;
        model.Remarks = formModel.Remarks;
        model.ActivityId = window.ActivityId;

    };
    function onDueChanged(date) {
        console.log(callarOptions.model);
        var pay = parseFloat(inputs['Due'].value || '0') || 0;
        if (pay < 0) {
            formModel.Due = 0;
            alert("Due Amount can't be less then 0");
        } else if (pay > callarOptions.model.PayAmount) {
            formModel.Due = 0;
            alert("Due Amount can't be greater then " + callarOptions.model.PayAmount.toMoney() + '.');
        } else {
            formModel.PayAmount = callarOptions.model.PayAmount - pay;
        }
    };
    function onPayAmountChanged() {
        console.log(callarOptions.model);
        var pay = parseFloat(inputs['PayAmount'].value || '0') || 0;
        if (pay <= 0) {
            formModel.PayAmount = callarOptions.model.PayAmount;
            alert('Pay Amount must be greater then 0.');
        } else if (pay > callarOptions.model.PayAmount) {
            formModel.PayAmount = callarOptions.model.PayAmount;
            alert("Pay Amount can't be greater then " + callarOptions.model.PayAmount.toMoney()+'.');
        } else {
            formModel.Due = callarOptions.model.PayAmount - pay;
        }
    };
    function onViewCreated(wndModel, formInputs, dropDownList, IsNew, frmModel) {
        windowModel = wndModel;
        inputs = formInputs;
        formModel = frmModel;
        (['Code', 'Name', 'Gender', 'Mobile', 'NetBill', 'AlreadyPaid']).each(function () {
            $(inputs[this + '']).prop('disabled', true);
        });
        $(inputs['PayAmount']).keyup(onPayAmountChanged).blur(onPayAmountChanged);
        $(inputs['Due']).keyup(onDueChanged).blur(onDueChanged);
    };
    function show(model) {
        Global.Add({
            model:model,
            name: 'DuePayment',
            title:'Due Payment',
            saveChange: '/InvestigationArea/PatientInvestigation/DuePayment',
            columns: [
                { field: 'Code', title: 'Patient-Code', position: 1},
                { field: 'Name', title: 'Patient-Name', position:2 },
                { field: 'Gender', title: 'Gender', position: 3},
                { field: 'Mobile', title: 'Mobile', position: 4},
                { field: 'NetBill', title: 'Net-Bill', position: 5},
                { field: 'AlreadyPaid', title: 'Already-Paid', position: 6},
                { field: 'PayAmount', title: 'Pay-Amount', add: { dataType: 'float' }, position:7  },
                { field: 'Due', title: 'Due', add: { dataType: 'float|null' }, position:8  },
                { field: 'Remarks', required: false, add: { type: 'textarea', sibling: 1 }, position: 11}
            ],
            onSubmit: onSubmit,
            dropdownList: [AppComponent.AccountReference.AutoComplete({
                Id: 'AccountId',
                position:10
            }, 'DuePayment')],
            onSaveSuccess: function (response) {
                console.log(['printInvoice(id)', model]);
                printInvoice();
                callarOptions.onSaveSuccess(response);
            },
            onViewCreated: onViewCreated
        });
    };
    function load() {
        Global.CallServer('/InvestigationArea/PatientInvestigation/CheckDetails?Id=' + callarOptions.InvestigationId, function (response) {
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
                        Due: 0
                    };
                    callarOptions.model = data;
                    show(data);;
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