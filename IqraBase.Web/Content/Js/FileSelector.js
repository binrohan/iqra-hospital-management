



var Controller = new function () {
    var windowModel, formModel = {}, inputs = {}, callerOptions;
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait('Please Wait while saving data......');
            var model = {
                SuplierId: formModel.SuplierId,
                PurchaseId: formModel.Id,
                PaidAmount: formModel.PaidAmount,
                PurchaseAmount: formModel.PurchaseAmount,
                VoucherNo: formModel.VoucherNo
            };
            Global.Uploader.upload({
                data: model,
                url: '/ExpenseArea/SuplierPayment/AddNew',
                onProgress: function (data) {

                },
                onComplete: function (response) {
                    windowModel.Free();
                    if (!response.IsError) {
                        callerOptions.onSaveSuccess(response, formModel);
                        close();
                    } else if (response.Id === -4) {
                        //alert('This email is already registered.');
                    }
                    else
                        Global.Error.Show(response);
                },
                onError: function () {
                    windowModel.Free();
                    response.Id = -8;
                    Global.Error.Show(response, { user: '' })
                }
            });
        }
    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function populate() {
        Global.Copy(formModel, callerOptions.model, true);
        formModel.Due = formModel.PaidAmount = callerOptions.model.TradePrice - callerOptions.model.PaidAmount;
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            populate();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ExpenseArea/Templates/AddSuplierPayment.html', function (response) {
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