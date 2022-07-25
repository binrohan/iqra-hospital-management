var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, formModel = {}, inputs, gridModel, callerOptions,
        page = { 'PageNumber': 1, 'PageSize': 10, filter: [] };

    function save() {

    }
    function close() {
        windowModel && windowModel.Hide();
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
                $(inputs['SaleFrom']).val( '');
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
        Global.DropDown.Bind({
            Id: 'CounterId',
            dataSource: [{ text: 'Select Period', value: 'Period' },
                { text: 'Today', value: 'Today' },
                { text: 'Yesterday', value: 'Yesterday' }, { text: 'This Week', value: 'ThisWeek' },
                { text: 'Last Week', value: 'LastWeek' }, { text: 'This Month', value: 'ThisMonth' },
                { text: 'Last Month', value: 'LastMonth' }, { text: 'This Year', value: 'ThisYear' },
                { text: 'Last One Year', value: 'LastOneYear' }, { text: 'Last Year', value: 'LastYear' }],
            elm: $(inputs['Period']).empty(),
            change: onPeriodChange
        });
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model
        page.filter = callerOptions.filter || [];
        console.log(page);
        if (windowModel) {
            windowModel.Show();
            service.Grid.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ReportArea/Templates/PurchaseReport.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                setSummaryTemplate(windowModel);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.Grid.Bind();
            }, noop);
        }
    };
    (function () {
        var typeId;
        function bind() {
            if (!gridModel) {
                isBind = true;
                typeId = callerOptions.Type;
                Global.Grid.Bind(getOptions());
            }
        }
        function onSubmit(formModel, data) {
            if (data) {
                formModel.Id = data.Id
            }
        };
        function onSelect(model) {
            !callerOptions.IsSummary&& Global.Add({
                model: model,
                page: gridModel.page,
                Period: formModel.Period,
                name: 'PurchaseReportByCounter',
                url: '/Content/IqraPharmacy/ReportArea/Content/Purchase/ByCounter.js',
            });
        };
        function rowBound(elm) {
            Global.Click(elm, onSelect, this);
        };
        function setSummary(response) {
            var model = response.Data.Total;
            model.Stock = (model.UnitQuentity - model.UnitQuentitySold).toMoney();
            model.StockPrice = (model.TotalTradePrice - model.TotalSoldPrice).toMoney();
            model.TotalSoldPrice = model.TotalSoldPrice.toMoney();
            model.TotalTradePrice = model.TotalTradePrice.toMoney();
            model.UnitQuentity = model.UnitQuentity.toMoney();
            Global.Copy(formModel, response.Data.Total, true);
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.Stock = (this.UnitQuentity - this.UnitQuentitySold).toMoney();
                this.UnitQuentity = this.UnitQuentity.toMoney();
                this.UnitQuentitySold = this.UnitQuentitySold.toMoney();
                this.TotalSoldPrice = this.TotalSoldPrice.toMoney();
                this.TotalTradePrice = this.TotalTradePrice.toMoney();
            });
            setSummary(response);
            response.Data.Total = response.Data.Total.Total;
        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#grid'),
                columns: [
                    { field: 'Name', filter: true },
                    { field: 'UnitQuentity', title: 'PurchaseQuentity' },
                    { field: 'UnitQuentitySold', title: 'SoldQuentity' },
                    { field: 'Stock', title: 'Stock',sorting:false },
                    { field: 'TotalTradePrice' },
                    { field: 'TotalSoldPrice' }
                ],
                url: '/ReportArea/PurchaseReport/ReportBaseData',
                page: page,
                dataBinding: onDataBinding,
                rowBound: rowBound,
                onComplete: function (model) {
                    gridModel = model;
                },
                Printable: false
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