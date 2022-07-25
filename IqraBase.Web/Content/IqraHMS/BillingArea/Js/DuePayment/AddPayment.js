var Controller = new function () {
    var windowModel, formModel = {}, inputs = {}, callerOptions, service = { model: {} }, gridModel, serverModel = {};
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait('Please Wait while saving data......');
            var model = {
                PatientId: callerOptions.PatientId,
                PaidAmount: formModel.PaidAmount,
                AccountId: formModel.AccountId,
                Remarks: formModel.Description,
                Date: formModel.Date || new Date().format('dd/MM/yyyy HH:mm'),
                ActivityId: window.ActivityId
            };
            Global.CallServer('/BillingArea/DuePayment/Add', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    callerOptions.onSaveSuccess(response, formModel);
                    close();
                } else if (response.Id === -4) {
                    //alert('This email is already registered.');
                }
                else
                    Global.Error.Show(response);
            }, function (response) {
                windowModel.Free();
                response.Id = -8;
                Global.Error.Show(response, { user: '' })
            }, model, 'POST');
        }
    };
    function close() {
        windowModel && windowModel.Hide();
    };
    function populate() {
        formModel.Due = formModel.PaidAmount = serverModel.DueAmount = service.model.Due = callerOptions.DueAmount;
        formModel.StillDue = 0;
        //console.log(['formModel', model, formModel]);
    };

    function setSummary() {
        var amount = 0;
        gridModel && gridModel.dataSource.each(function () {
            this.Amount = this.Amount || 0;
            amount += this.Amount;
        });
        if (formModel.PaidAmount != amount) {
            formModel.OutText = 'Total is out by';
            formModel.TotalOut = (formModel.PaidAmount - amount).toMoney();
        } else {
            formModel.OutText = '';
            formModel.TotalOut = '';
        }
    };
    this.Show = function (model) {
        callerOptions = model;
        formModel.Id = none;
        if (windowModel) {
            windowModel.Show();
            populate();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/BillingArea/Templates/AddPayment.html', function (response) {
                windowModel = Global.Window.Bind(response);
                inputs = Global.Form.Bind(formModel, windowModel.View);
                service.Events.Bind(inputs);
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                windowModel.Show();
                populate();
            }, noop);
        }
    };
    (function () {
        function onPaidAmountChange() {
            var amount = (parseFloat(formModel.PaidAmount || '0') || 0);
            //if (amount > serverModel.DueAmount)
                //formModel.PaidAmount = amount = serverModel.DueAmount;
            formModel.StillDue = serverModel.DueAmount - amount;
        };
        function onStillDueChange() {
            var amount = (parseFloat(formModel.StillDue || '0') || 0);
            //if (amount > serverModel.DueAmount)
            //    formModel.StillDue = amount = serverModel.DueAmount;
            formModel.PaidAmount = serverModel.DueAmount - amount;
        };
        this.Bind = function (inputs) {
            $(inputs['PaidAmount']).keyup(onPaidAmountChange).blur(onPaidAmountChange);
            $(inputs['StillDue']).keyup(onStillDueChange).blur(onStillDueChange);
            Global.AutoComplete.Bind({
                url: '/CommonArea/AccountReference/AutoComplete?reference=Patient Payment',
                elm: $(inputs['AccountId']).empty()
            });
        };
    }).call(service.Events = {});
};
