
var Controller = new function () {
    var service = {}, windowModel, callerOptions, formModel = {}, model = {},
        from = { field: 'CreatedAt', value: "", Operation: 2 },
        to = { field: 'CreatedAt', value: "", Operation: 3 },filter=[];
    function close() {
        windowModel && windowModel.Hide();
    };
    function getFilter() {
        console.log(callerOptions);
        if (callerOptions.name == 'DailyDetails') {
            var date = Global.DateTime.GetObject(callerOptions.model.CreatedAt, 'yyyy/MM/dd');
            from.value = date.format("'yyyy-MM-dd 00:00'");
            date.setDate(date.getDate() + 1);
            to.value = date.format("'yyyy-MM-dd 00:00'");
            filter = [from, to];
        } else if (callerOptions.name == 'Monthly') {
            var date = Global.DateTime.GetObject(callerOptions.model.CreatedAt+'/01', 'yyyy/MM/dd');
            from.value = date.format("'yyyy-MM-dd 00:00'");
            date.setDate(date.getDate() + 1);
            to.value = date.format("'yyyy-MM-dd 00:00'");
            callerOptions.filter.each(function () {
                if (this.field == 'CreatedAt') {
                    if (this.Operation == 2) {
                        from = from < this.value ? this.value : from;
                    } else if (this.Operation == 3) {
                        to = to > this.value ? this.value : to;
                    }
                }
            });
            filter = [from, to];
        }

        return filter;
    };
    function show() {
        
        windowModel.Show();
        service.Grid.Bind();
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ProductArea/Templates/DailyDueDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                callerOptions.setTemplate(windowModel.View.find('#summary_container'));
                Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                show();
                service.Grid.Set();
            }, noop);
        }
    };
    (function () {
        var gridModel, date;
        function onPaymentAdd(model) {
            Global.Add({
                model: model,
                filter: gridModel.page.filter,
                url: '/Content/IqraPharmacy/ExpenseArea/Content/SuplierPayment/AddSuplierPayment.js',
                onSaveSuccess: function (response) {
                    gridModel.Reload();
                    callerOptions && callerOptions.onSaveSuccess && callerOptions.onSaveSuccess(response)

                }
            });
        };
        function getItems(){
            var items=[
                    callerOptions.service.SuplierWise.Get(formModel),
                    callerOptions.service.CounterWise.Get(formModel),
                    callerOptions.service.VoucherWise.Get(formModel),
            ],filter=getFilter();
            items.each(function () {
                this.bound = noop;
                this.filter = filter;
            });
            return items;
        };
        this.Set = function () {
            //model.container
            model = {
                container: windowModel.View.find('#daily_due_details'),
                Base: {
                    Url: '/SuplierArea/Suplier/',
                },
                items: getItems()
            };
            Global.Tabs(model);
            model.items[2].set(model.items[2]);
        };
        this.Bind = function () {
            if (model.gridModel) {
                model.gridModel.page.filter = getFilter();
                model.gridModel.Reload();
            }
        }
    }).call(service.Grid = {});
};