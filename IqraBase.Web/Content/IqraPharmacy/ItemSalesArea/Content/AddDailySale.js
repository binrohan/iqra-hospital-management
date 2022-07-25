var Controller = new function () {
    var that = this, dataModel = {}, formModel = {}, defaultSalary = 0, windowModel, formInputs, drp = {};
    function getModel() {
        var model = {};
        model.EmployeeId = formModel.EmployeeId;
        model.ActivateAt = formModel.ActivateAt;
        model.ActiveTo = formModel.ActiveTo;
        model.StartDayOfMonth = formModel.StartDayOfMonth;
        model.EndDayOfMonth = formModel.EndDayOfMonth;
        model.StartAt = formModel.StartAt;
        model.EndAt = formModel.EndAt;
        model.Remarks = formModel.Remarks;
        return formModel;
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var model = getModel();
            Global.CallServer('/ItemSalesArea/DailySale/OnCreate', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    cancel();
                    callarOptions.OnSuccess();
                } else {
                    Global.Error.Show(response, '/ItemSalesArea/DailySale/Create');
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
    function onChanged() {
        dataModel.CashInHand = parseFloat(formModel.CashInHand || '0');
        dataModel.CashInBank = parseFloat(formModel.CashInBank||'0');
        formModel.CashMismatch = dataModel.CashMismatch = (dataModel.SalePrice - dataModel.Discount - dataModel.ReturnAmount - dataModel.CashInHand - dataModel.CashInBank - dataModel.Due).toFloat();
    };
    function populate(list) {
        windowModel.Free();
        var model = dataModel = list[0][0];
        model.SalePrice = model.SalePrice || 0;
        model.Discount = model.Discount || 0;
        model.TradePrice = model.TradePrice || 0;
        model.PurchaseVAT = model.PurchaseVAT || 0;
        model.PurchasePrice = model.PurchasePrice || 0;
        model.PurchaseDiscount = model.PurchaseDiscount || 0;
        model.PurchaseDiscount = model.PurchaseDiscount || 0;
        list[1][0].ReturnAmount =dataModel.ReturnAmount= list[1][0].ReturnAmount || 0;
        model.SalePrice = model.SalePrice + model.Discount;
        formModel.SoldPrice = model.SalePrice.toFloat();
        formModel.Discount = model.Discount.toFloat();
        formModel.TradePrice = model.TradePrice.toFloat();
        formModel.PurchaseVAT = model.PurchaseVAT;
        formModel.PurchasePrice = model.PurchasePrice.toFloat();
        formModel.PurchaseDiscount = model.PurchaseDiscount.toFloat();
        formModel.ReturnAmount = (list[1][0].ReturnAmount || 0).toFloat();
        formModel.Due = dataModel.Due = (list[2][0].Due || 0).toFloat();

        formModel.From = Global.DateTime.GetObject(list[3][0].To.substring(0, 16), 'yyyy-MM-dd HH:mm').format('dd/MM/yyyy HH:mm');
        formModel.To = Global.DateTime.GetObject(list[4][0].CurrentDate.substring(0, 16), 'yyyy-MM-dd HH:mm').format('dd/MM/yyyy HH:mm');

    };
    function load() {
        var to = (formModel.To ? '?To=' + Global.DateTime.GetObject(formModel.To, 'dd/MM/yyyy HH:mm').format('yyyy-MM-dd HH:mm') : '');
        windowModel.Wait();
        console.log(['to',to]);
        Global.CallServer('/ItemSalesArea/DailySale/GetReport' + to, function (response) {
            windowModel.Free();
            if (!response.IsError) {
                populate(response.Data)

            } else {
                Global.Error.Show(response, '');
            }
        }, function (response) {
            windowModel.Free();
            response.Id = -8;
            alert(' Errors');
        }, null, 'Get');
    };
    function show() {
        windowModel.Show();
        load();
    }
    function createWindow(template) {
        windowModel = Global.Window.Bind(template);
        that.Events.Bind(options.model);
        show();
    };
    this.Show = function (opts) {
        options =callarOptions= opts;
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ItemSalesArea/Templates/AddDailySale.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    }
    this.Events = new function () {
        var isBind = false;
        this.Bind = function (model) {
            if (!isBind) {
                model = model || {};
                isBind = true;
                formInputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(cancel);
                Global.Submit(windowModel.View.find('form'), save);
                Global.DatePicker.Bind($(formInputs['To']), { format: 'dd/MM/yyyy HH:mm', onChange: load });
                $(formInputs['CashInHand']).keyup(onChanged);
                $(formInputs['CashInBank']).keyup(onChanged);
            }
        };
    };
};

