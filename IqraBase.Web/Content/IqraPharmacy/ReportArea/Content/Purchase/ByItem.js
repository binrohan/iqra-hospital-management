
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, gridModel, formModel = {}, callerOptions,
        item = { "field": "ItemId", "value": "", Operation: 0 },
        page = { "filter": [item], "PageNumber": 1, "PageSize": 10 };
    function save() {

    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function setFilter() {
        var filter = [], p = callerOptions.page;
        p.filter = p.filter || [];
        (p.filter || []).each(function () {
            if (this.field == 'PurchaseFrom') {
                formModel.SaleFrom = this.value.substring(1, this.value.length - 1);
                page.filter.push(this);
            } else if (this.field == 'PurchaseTo') {
                formModel.SaleTo = this.value.substring(1, this.value.length - 1);
                page.filter.push(this);
            }
        });
        
        if (dprPeriod.val) {
            dprPeriod.val(callerOptions.Period);
        } else {
            gridModel.Period = callerOptions.Period;
        }
    };
    function onChange() {
        var filter = [], p = gridModel && gridModel.page || page;
        p.filter = p.filter || [];
        (p.filter || []).each(function () {
            if (this.field != 'PurchaseFrom' && this.field != 'PurchaseTo') {
                filter.push(this);
            }
        });
        if (formModel.SaleFrom) {
            filter.push({ field: 'PurchaseFrom', value: "'" + formModel.SaleFrom + "'", Operation: 2 });
        }
        if (formModel.SaleTo) {
            filter.push({ field: 'PurchaseTo', value: "'" + formModel.SaleTo + "'", Operation: 4 });
        }
        if (gridModel) {
            gridModel.page.filter = filter;
            gridModel.Reload();
        } else {
            page.filter = filter;
        }
    };
    function onPeriodChange(data) {
        var today = new Date(), fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()), today = new Date(fromDate);
        switch (data.value) {
            case 'Period':
                $(inputs['SaleFrom']).val('');
                $(inputs['SaleTo']).val('');
                return onChange();
            case 'Yesterday':
                fromDate.setDate(fromDate.getDate() - 1);
                today = new Date(fromDate);
                break;
            case 'ThisWeek':
                fromDate.setDate(fromDate.getDate() - fromDate.getDay());
                break;
            case 'LastWeek':
                today.setDate(fromDate.getDate() - fromDate.getDay());
                fromDate.setDate(fromDate.getDate() - 7);
                break;
            case 'ThisMonth':
                fromDate.setDate(1);
                break;
            case 'LastMonth':
                today.setDate(0);
                fromDate = new Date(fromDate);
                fromDate.setDate(1);
                break;
            case 'ThisYear':
                fromDate.setMonth(0);
                fromDate.setDate(1);
                break;
            case 'LastOneYear':
                fromDate.setFullYear(fromDate.getFullYear() - 1);
                break;
            case 'LastYear':
                today.setMonth(0);
                today.setDate(0);
                fromDate = new Date(today);
                fromDate.setMonth(0);
                fromDate.setDate(1);
                break;
        }
        formModel.SaleFrom = fromDate.format('yyyy/MM/dd') + ' 00:00';
        formModel.SaleTo = today.format('yyyy/MM/dd') + ' 23:59';
        onChange();
    };
    function setSummaryTemplate(view) {
        inputs = Global.Form.Bind(formModel, view.View);
        Global.DatePicker.Bind($(inputs['SaleFrom']), { format: 'yyyy/MM/dd hh:mm', onChange: onChange });
        Global.DatePicker.Bind($(inputs['SaleTo']), { format: 'yyyy/MM/dd hh:mm', onChange: onChange });
        dprPeriod = {
            Id: 'CounterId',
            dataSource: [{ text: 'Select Period', value: 'Period' },
                { text: 'Today', value: 'Today' },
                { text: 'Yesterday', value: 'Yesterday' }, { text: 'This Week', value: 'ThisWeek' },
                { text: 'Last Week', value: 'LastWeek' }, { text: 'This Month', value: 'ThisMonth' },
                { text: 'Last Month', value: 'LastMonth' }, { text: 'This Year', value: 'ThisYear' },
                { text: 'Last One Year', value: 'LastOneYear' }, { text: 'Last Year', value: 'LastYear' }],
            elm: $(inputs['Period']).empty(),
            change: onPeriodChange
        };
        Global.DropDown.Bind(dprPeriod);
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model;
        item.value = model.model.Id;
        page.filter = [item];
        if (windowModel) {
            windowModel.Show();
            setFilter();
            service.Grid.Bind();
            formModel.title = 'Purchase History for "' + model.model.Name + '"';
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ReportArea/Templates/PurchaseReport.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '98%' });
                setSummaryTemplate(windowModel);
                setFilter();
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.Grid.Bind();
                formModel.title = 'Purchase History for "' + model.model.Name + '"';
            }, noop);
        }
    };
    (function () {
        var userId;
        function bind() {
            if (!gridModel) {
                isBind = true;
                Global.Grid.Bind(getOptions());
            }
        }
        function onSubmit(formModel, data) {
            if (data) {
                formModel.Id = data.Id
            }
        };
        function onSelect(model) {

        }
        function rowBound(elm) {
            Global.Click(elm, onSelect, this);
        };
        function setSummary(response) {
            var model = response.Data.Total;
            model.TotalItem = model.Total.toMoney();
            model.UnitQuentity = model.UnitQuentity.toMoney();
            model.PayableAmount = model.TotalTradePrice.toMoney();
            model.TotalTradePrice = (model.TotalDiscount + model.TotalTradePrice).toMoney();
            model.TotalDiscount = model.TotalDiscount.toMoney();
            Global.Copy(formModel, response.Data.Total, true);
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.UnitQuentity = this.UnitQuentity.toMoney();
                this.PayableAmount = this.TotalTradePrice.toMoney();
                this.TotalTradePrice = (this.TotalDiscount + this.TotalTradePrice).toMoney();
                this.TotalDiscount = this.TotalDiscount.toMoney();
            });
            setSummary(response);
            response.Data.Total = response.Data.Total.Total;
        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#grid'),
                columns: [
                    { field: 'Name', title: 'TradeName', filter: true },
                    { field: 'Strength', filter: true },
                    { field: 'Category', filter: true },
                    { field: 'UnitQuentity', title: 'Purchase Quentity' },
                    { field: 'TotalTradePrice', title: 'Total Trade Price' },
                    { field: 'TotalDiscount', title: 'Total Discount' },
                    { field: 'PayableAmount', title: 'Payable Amount' },
                    { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' }
                ],
                url: '/ReportArea/PurchaseReport/ByItem',
                page: page,
                dataBinding: onDataBinding,
                Printable: {
                    Container: function () {
                        return windowModel.View.find('#print_container');
                    }
                },
                onComplete: function (model) {
                    gridModel = model;
                }
            };
            return opts;
        };
        this.Bind = function () {
            if (gridModel) {
                gridModel.Reload();
            } else {
                bind();
            }
        };
    }).call(service.Grid = {});
};