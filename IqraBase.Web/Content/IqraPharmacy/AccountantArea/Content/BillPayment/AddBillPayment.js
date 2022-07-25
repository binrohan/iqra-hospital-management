var Controller = new function () {
    var that = this, windowModel, formModel = {}, callarOptions = {}, service = {}, formInputs;
    function getModel() {
        var model = { BillId: callarOptions.BillId };
        for (var key in formInputs) {
            model[key] = formModel[key];
        }
        return model;
    };
    function save() {
        if (formModel.IsValid) {
            var model = getModel();
            windowModel.Wait();
            Global.CallServer('/AccountantArea/BillPayment/Addnew', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    cancel();
                    callarOptions.OnSuccess();
                } else {
                    Global.Error.Show(response, '/AccountantArea/BillPayment/Addnew');
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
    function loadDetails() {
        if (callarOptions.model && callarOptions.model.DueAmount == 0) {
            alert('This bill has no due amount.');
            cancel(); 
            return;
        } else if (callarOptions.model && callarOptions.model.DueAmount) {
            formModel.PaidAmount = callarOptions.model.DueAmount;
            formModel.DueAmount = 0;
            return;
        }
        windowModel.Wait();
        callarOptions.model = callarOptions.model || {};
        Global.CallServer('/AccountantArea/Bill/Details?Id=' + callarOptions.BillId, function (response) {
            windowModel.Free();
            if (!response.IsError) {
                if (response.Data.DueAmount == 0)
                {
                    alert('This bill has no due amount.');
                    cancel();
                }
                callarOptions.model.DueAmount = response.Data.DueAmount;
                formModel.PaidAmount = response.Data.DueAmount;
                formModel.DueAmount = 0;
            } else {
                callarOptions.model.DueAmount = 0;
                alert('Errors while loading data.');
            }
        }, function (response) {
            callarOptions.model.DueAmount = 0;
            windowModel.Free();
            response.Id = -8;
            alert('Errors while loading data.');
        }, null, 'Get');
    };
    function getDropdown() {
        Global.AutoComplete.Bind({
            elm: $(formInputs['PaidFromAccountId']),
            url: function () { return '/AccountantArea/AppAccount/AutoCompleteByCategory?code=1'; },
            onChange: function (data) {

            }
        });
    };
    function show() {
        windowModel.Show();
        loadDetails();
    };
    function createWindow(template) {
        windowModel = Global.Window.Bind(template, { width: '95%' });
        formInputs = Global.Form.Bind(formModel, windowModel.View);
        windowModel.View.find('.btn_cancel').click(cancel);
        Global.Click(windowModel.View.find('.btn_save'), save);
        service.Event.Bind();
        getDropdown();
        show();
    };
    this.Show = function (opts) {
        callarOptions = opts;
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/AccountantArea/Templates/BillPayment/AddBillPayment.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    };
    (function () {
        //callarOptions.model.DueAmount
        function selectAll() {
            $(this).select();
        };
        function onDueChange() {
            var value = parseFloat(formModel.DueAmount || '0') || 0;
            if (value > callarOptions.model.DueAmount) {
                formModel.DueAmount = callarOptions.model.DueAmount - 1;
                formModel.PaidAmount = 1;
                alert("Due Amount(" + value + ") can't be equal or greater than Bill Due Amount(" + callarOptions.model.DueAmount + ").");
                console.log([formModel.DueAmount, formModel.PaidAmount]);
            } else {
                formModel.PaidAmount = (callarOptions.model.DueAmount - value);
            }
        }
        function onPaidChange() {
            var value = parseFloat(formModel.PaidAmount || '0') || 0;
            if (value > callarOptions.model.DueAmount) {
                console.log([formModel.DueAmount, formModel.PaidAmount]);
                formModel.PaidAmount = callarOptions.model.DueAmount;
                formModel.DueAmount = 0;
                alert("Paid Amount(" + value + ") can't be greater than Bill Due Amount(" + callarOptions.model.DueAmount + ").");
            } else {
                formModel.DueAmount = (callarOptions.model.DueAmount-value);
            }
        }
        this.Bind = function () {
            $(formInputs['PaidAmount']).focus(selectAll).keyup(onPaidChange).blur(onPaidChange);
            $(formInputs['DueAmount']).focus(selectAll).keyup(onDueChange).blur(onDueChange);
        }
    }).call(service.Event = {});
};

