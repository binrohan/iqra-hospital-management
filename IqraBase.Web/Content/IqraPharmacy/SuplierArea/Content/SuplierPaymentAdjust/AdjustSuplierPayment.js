
var Controller = new function () {
    var windowModel, formModel = {}, inputs = {}, callerOptions, service = { model: {} };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait('Please Wait while saving data......');
            var model = {
                SuplierId: formModel.SuplierId,
                PurchaseId: formModel.Id || '00000000-0000-0000-0000-000000000000',
                PurchaseAmount: formModel.StillDue,
                Description: formModel.Description
            };
            Global.CallServer('/SuplierArea/SuplierPaymentAdjust/AddNew', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    callerOptions.onSaveSuccess(response, formModel);
                    close();
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
            //if (amount > service.model.Due)
            //    formModel.PaidAmount = amount = service.model.Due;
            formModel.StillDue = service.model.Due - amount;
        };
        function onStillDueChange() {
            var amount = (parseFloat(formModel.StillDue || '0') || 0);
            //if (amount > service.model.Due)
            //    formModel.StillDue = amount = service.model.Due;
            formModel.PaidAmount = service.model.Due - amount;
        };
        this.Bind = function (inputs) {
            $(inputs['PaidAmount']).keyup(onPaidAmountChange).blur(onPaidAmountChange);
            $(inputs['StillDue']).keyup(onStillDueChange).blur(onStillDueChange);
        };
    }).call(service.Events = {});
};
