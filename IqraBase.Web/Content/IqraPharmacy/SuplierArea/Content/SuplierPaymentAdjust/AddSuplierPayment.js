
var Controller = new function () {
    var windowModel, formModel = {}, inputs = {}, callerOptions, service = { model: {} };
    function setFilter(model) {
        callerOptions.filter.each(function () {
            if (this.field == 'CreatedAt') {
                console.log([this,Global.DateTime.GetObject(this.value.replace(/\'/g,""), "yyyy/MM/dd HH:mm"),Global.DateTime.GetObject]);

                if (this.Operation == 2) {
                    model.From = Global.DateTime.GetObject(this.value.replace(/\'/g, ""), "yyyy/MM/dd HH:mm").format('dd/MM/yyyy hh:mm');
                } else if (this.Operation == 3) {
                    model.To = Global.DateTime.GetObject(this.value.replace(/\'/g, ""), "yyyy/MM/dd HH:mm").format('dd/MM/yyyy hh:mm');
                }
            }
        });
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait('Please Wait while saving data......');
            var model = {
                SuplierId: formModel.SuplierId,
                PurchaseId: formModel.Id || '00000000-0000-0000-0000-000000000000',
                PaidAmount: formModel.PaidAmount,
                PurchaseAmount: formModel.PurchaseAmount,
                VoucherNo: formModel.VoucherNo,
                Description: formModel.Description
            };
            setFilter(model);
            Global.CallServer('/ExpenseArea/SuplierPayment/AddNew', function (response) {
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
    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function populate() {
        Global.Copy(formModel, callerOptions.model, true);
        formModel.Due = formModel.PaidAmount = service.model.Due = (callerOptions.model.TradePrice - callerOptions.model.PaidAmount).toFloat();
        formModel.StillDue = 0;
    };
    this.Show = function (model) {
        callerOptions = model;
        formModel.Id = none;
        console.log([model, formModel]);
        if (windowModel) {
            windowModel.Show();
            populate();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ExpenseArea/Templates/AddSuplierPayment.html', function (response) {
                windowModel = Global.Window.Bind(response);
                inputs = Global.Form.Bind(formModel, windowModel.View);
                service.Events.Bind(inputs);
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                populate();
                windowModel.Show();
            }, noop);
        }
    };
    (function () {

        function onPaidAmountChange() {
            var amount = (parseFloat(formModel.PaidAmount || '0') || 0);
            if (amount > service.model.Due)
                formModel.PaidAmount = amount = service.model.Due;
            formModel.StillDue = service.model.Due - amount;
        };
        function onStillDueChange() {
            var amount = (parseFloat(formModel.StillDue || '0') || 0);
            if (amount > service.model.Due)
                formModel.StillDue = amount = service.model.Due;
            formModel.PaidAmount = service.model.Due - amount;
        };
        this.Bind = function (inputs) {
            $(inputs['PaidAmount']).keyup(onPaidAmountChange).blur(onPaidAmountChange);
            $(inputs['StillDue']).keyup(onStillDueChange).blur(onStillDueChange);
        };
    }).call(service.Events = {});
};
