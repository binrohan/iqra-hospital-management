
(function () {
    //var filters = typeof window.ItemType == 'undefined' ? [] : [{ field: 'itemsaleinfotype', value: 0, Operation: 0 }];
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDetails(model) {
        Global.Add({
            name: 'SaleInfo',
            url: '/Content/IqraPharmacy/ItemSalesArea/Content/SaleDetails.js',
            SaleInfoId: model.Id
        });
    };
    function onSuplierDetails(model) {
        Global.Add({
            name: 'SaleInfo',
            url: '/Content/IqraPharmacy/ItemSalesArea/Content/SaleDetails.js',
            SaleInfoId: model.Id
        });
    };
    function onCounterDetails(model) {
        Global.Add({
            name: 'SaleInfo',
            url: '/Content/IqraPharmacy/ItemSalesArea/Content/SaleDetails.js',
            SaleInfoId: model.Id
        });
    };
    function onDataBinding(data) {
        var totalPrice = 0, totalDiscount = 0, totalTradePrice = 0;
        data.Data.Data.each(function () {
            totalPrice += this.SalePrice;
            totalDiscount += this.Discount;
            totalTradePrice += this.TradePrice;
        });
        formModel.TotalPrice = 'SalePrice : ' + totalPrice;
        formModel.TotalDiscount = 'Discount : ' + totalDiscount;
        formModel.TotalTradePrice = 'TradePrice : ' + totalTradePrice;
        formModel.TradePrice = data.Data.Total.TradePrice;
        formModel.SalePrice = data.Data.Total.SalePrice;
        formModel.Discount = data.Data.Total.Discount;
        data.Data.Total = data.Data.Total.Total;
    };
    function onRequest(model) {
        (model.filter || []).each(function () {
            //if (this.field == 'VoucherNo') {
            //    this.field = 'Voucher'
            //}
        });
    }
    function getColumn(){
        var cols = [];
        [
                        { field: 'Name', filter: true, click: onDetails },
                        { field: 'Day', dateFormat: 'dd/MM/yyyy' },
                        { field: 'SalePrice' },
                        { field: 'TradePrice' },
                        { field: 'Discount' }
        ].each(function (i) {
            cols.push(this);
            if (i === newColumnsPosition) {
                newColumns.each(function () {
                    cols.push(this);
                });
            }
        });
        return cols;
    };
    function getByGridColumn() {
        var cols = [
            byGridColumn,
            { field: 'ItemCount' },
            { field: 'SalePrice' },
            { field: 'TradePrice' },
            { field: 'Discount' }
        ];
        return cols;
    };
    var that = this, gridModel,byGrid, formModel = {}, service = {};
    Global.List.Bind({
        Name: 'Designation',
        Grid: {
            elm: $('#grid'),
            columns: getColumn(),
            url: dataUrl,
            page: { 'PageNumber': 1, filter: filter, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} ItemSales ' },
            onDataBinding: onDataBinding,
            onRequest: onRequest,
            Action: { width: 70 },
            Actions: [{
                click: onDetails,
                html: '<span class="icon_container" ><span class="glyphicon glyphicon-open"></span></span>'
            }]
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: false,
        remove: false,
        edit: false
    });
    if (byDataUrl) {
        Global.List.Bind({
            Name: 'ByGrid',
            Grid: {
                elm: $('#by_grid'),
                columns: getByGridColumn(),
                url: byDataUrl,
                page: { 'PageNumber': 1, filter: filter, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} ItemSales ' },
                onRequest: onRequest,
                Action: { width: 70 },
                Actions: [{
                    click: onDetails,
                    html: '<span class="icon_container" ><span class="glyphicon glyphicon-open"></span></span>'
                }]
            }, onComplete: function (model) {
                byGrid = model;
            }, Add: false,
            remove: false,
            edit: false
        });
    }
    Global.Form.Bind(formModel, $('#sale_summary_container'));
    (function () {
        var inputs = Global.Form.Bind(formModel, $('#filter_container')), type,
            typeFilter = [false,
                { field: 'IsPharmacy', value: 1, Operation: 0 },
            { field: 'IsPharmacy', value: 0, Operation: 0 }];
        function onChange() {
            if (!gridModel) return;
            var filter = [],byFilter=[];
            gridModel.page.filter = gridModel.page.filter || [];
            (gridModel.page.filter || []).each(function () {
                if (this.field != 'SaleFrom' && this.field != 'SaleTo' && this.field != 'IsPharmacy') {
                    filter.push(this);
                }
            });
            if (formModel.SaleFrom) {
                filter.push({ field: 'SaleFrom', value: "'" + formModel.SaleFrom + "'", Operation: 2 });
                byFilter.push({ field: 'SaleFrom', value: "'" + formModel.SaleFrom + "'", Operation: 2 });
            }
            if (formModel.SaleTo) {
                filter.push({ field: 'SaleTo', value: "'" + formModel.SaleTo + "'", Operation: 4 });
                byFilter.push({ field: 'SaleTo', value: "'" + formModel.SaleTo + "'", Operation: 4 });
            }
            if (type) {
                filter.push(type);
                byFilter.push(type);
            }
            gridModel.page.filter = filter;
            gridModel.Reload();
            if (byGrid) {
                byGrid.page.filter = byFilter;
                byGrid.Reload();
            }
        };

        Global.DatePicker.Bind($(inputs['SaleFrom']), { format: 'yyyy/MM/dd HH:mm', onChange: onChange });
        Global.DatePicker.Bind($(inputs['SaleTo']), { format: 'yyyy/MM/dd HH:mm', onChange: onChange });
        function onPeriodChange(data) {
            console.log(data);
            var today = new Date(), fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()), today = new Date(fromDate);
            switch (data.value) {
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
        Global.DropDown.Bind({
            Id: 'SuplierId',
            dataSource: [{ text: 'Today', value: 'Today' },
                { text: 'Yesterday', value: 'Yesterday' }, { text: 'This Week', value: 'ThisWeek' },
                { text: 'Last Week', value: 'LastWeek' }, { text: 'This Month', value: 'ThisMonth' },
                { text: 'Last Month', value: 'LastMonth' }, { text: 'This Year', value: 'ThisYear' },
                { text: 'Last One Year', value: 'LastOneYear' }, { text: 'Last Year', value: 'LastYear' }],
            elm: $(inputs['Period']).empty(),
            change: onPeriodChange
        });
        var selectedTypes = ['All', 'Pharmacy', 'NonePharmacy'], selectedType = 'All';
        $('#type_container a').click(function () {
            if (selectedType === selectedTypes[this.dataset.type]) return;
            selectedType = selectedTypes[this.dataset.type];
            $(this).closest('#type_container').find('.selected').removeClass('selected');
            $(this).addClass('selected');
            type = typeFilter[this.dataset.type];
            var filter = [];
            (gridModel.page.filter || []).each(function () {
                if (this.field != 'IsPharmacy') {
                    filter.push(this);
                }
            });
            if (type) {
                filter.push(type);
            }
            gridModel.page.filter = filter;
            gridModel.Reload();
            if (byGrid) {
                filter = [];
                (byGrid.page.filter || []).each(function () {
                    if (this.field != 'IsPharmacy') {
                        filter.push(this);
                    }
                });
                if (type) {
                    filter.push(type);
                }
                byGrid.page.filter = filter;
                byGrid.Reload();
            }
        });
    }).call(service.Filter = {});
})();
