
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, formModel = {}, gridModel, callerOptions, dprPeriod, splrDpr = {},
        slpFilter = { field: 'CounterId', Operation: 0 },
        categoryFilter = { field: 'SuplierOrderCategoryId', Operation: 0, value: '00000000-0000-0000-0000-000000000000' },
        page = { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Items ', filter: [slpFilter] };
    function save() {

    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function refresh() {
        gridModel && gridModel.Reload();
    };
    function setFilter() {
        var filter = [], p = callerOptions.page;
        p.filter = p.filter || [];
        (p.filter || []).each(function () {
            if (this.field == 'PurchaseFrom') {
                formModel.SaleFrom = this.value.substring(1, this.value.length-1);
                filter.push(this);
            } else if (this.field == 'PurchaseTo') {
                formModel.SaleTo = this.value.substring(1, this.value.length - 1);
                filter.push(this);
            }
        });
        filter.push({ field: 'CounterId', value: callerOptions.model.Id,Operation:0 });
        if (gridModel) {
            gridModel.page.filter = filter;
        } else {
            page.filter = filter;
        }
        if (dprPeriod.val) {
            dprPeriod.val(callerOptions.Period);
        } else {
            gridModel.Period=callerOptions.Period;
        }
    };
    function setSuplierDpr(inputs) {
        splrDpr = {
            elm: $(inputs['SuplierOrderCategoryId']),
            url: '/SuplierArea/SuplierOrderCategory/AutoComplete',
            change: function (data) {
                console.log(page.filter);
                page.filter = page.filter.where("itm=>itm.field!='SuplierOrderCategoryId'");
                console.log(page.filter);
                if (data && data.Id != '00000000-0000-0000-0000-000000000000') {
                    categoryFilter.value = data.Id;
                    page.filter.push(categoryFilter);
                }
                gridModel.Reload();
            }
        };
        Global.AutoComplete.Bind(splrDpr);
    };
    function setSummaryTemplate(view) {
        view.View.find('#print_container').prepend('<div style="max-width: 120px; float: left; padding: 25px 10px 0px 0px;"><input data-binding="SuplierOrderCategoryId" class="form-control" style="margin: 2px 0px;"  type="text" /></div>');
        inputs = Global.Form.Bind(formModel, view.View);
        setSuplierDpr(inputs);
    };

    this.Show = function (model) {
        selected = {};
        callerOptions = model
        slpFilter.value = model.model.Id;
        if (windowModel) {
            windowModel.Show();
            service.Grid.Bind();
            formModel.title = 'Required Items By Counter "' + callerOptions.model.Counter+'"';
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ReportArea/Templates/RequiredItemReport.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                setSummaryTemplate(windowModel);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.View.find('.btn_refresh').click(refresh);
                windowModel.Show();
                service.Grid.Bind();
                formModel.title = 'Required Items By Counter "' + callerOptions.model.Counter + '"';
            }, noop);
        }
    };
    (function () {
        var  counterId;
        function bind() {
            if (!gridModel) {
                isBind = true;
                counterId = callerOptions.model.Id;
                Global.Grid.Bind(getOptions());
            }
        }
        function onSubmit(formModel, data) {
            if (data) {
                formModel.Id = data.Id
            }
        };
        function onSelect(model) {
            console.log(callerOptions);
            Global.Add({
                CounterId: callerOptions.model.Id,
                Type: callerOptions.Type,
                SuplierId:model.Id,
                model: model,
                name: 'PurchaseReportBySuplier',
                url: '/Content/IqraPharmacy/ReportArea/Content/RequiredItem/BySuplier.js',
            });
        }
        function rowBound(elm) {
            Global.Click(elm, onSelect, this);
        };
        function setSummary(response) {
            var model = response.Data.Total;
            model.RequiredQuantity = model.RequiredQuantity.toMoney();
            model.PayableAmount = model.TradePrice.toMoney();
            model.TradePrice = (model.TotalDiscount + model.TradePrice).toMoney();
            model.TotalDiscount = model.TotalDiscount.toMoney();
            Global.Copy(formModel, response.Data.Total, true);
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.RequiredQuantity = this.RequiredQuantity.toMoney();
                this.PayableAmount = this.TradePrice.toMoney();
                this.TradePrice = (this.TotalDiscount + this.TradePrice).toMoney();
                this.TotalDiscount = this.TotalDiscount.toMoney();
            });
            setSummary(response);
            response.Data.Total = response.Data.Total.Total;
        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#grid'),
                columns: [
                    { field: 'Suplier', filter: true },
                    { field: 'RequiredQuantity', title: 'Required Quantity' },
                    { field: 'TradePrice', title: 'Trade Price' },
                    { field: 'TotalDiscount', title: 'Discount' },
                    { field: 'PayableAmount', title: 'Payable Amount' }
                ],
                url: '/ReportArea/RequiredItem/ByCounter',
                page: page,
                dataBinding: onDataBinding,
                rowBound: rowBound,
                onComplete: function (model) {
                    gridModel = model;
                },
                Printable: {
                    Container: function () {
                        return windowModel.View.find('#print_container');
                    }
                }
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (callerOptions.model.Id != counterId) {
                gridModel.Reload();
            }
            counterId = callerOptions.model.Id;
        };
    }).call(service.Grid = {});
};