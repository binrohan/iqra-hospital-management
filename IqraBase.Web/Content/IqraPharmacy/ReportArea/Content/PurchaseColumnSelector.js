
(function () {
    function onDataBinding(data) {
        var totalPrice = 0, totalDiscount = 0
        data.Data.Data.each(function () {
            totalPrice += this.SalePrice;
            totalDiscount += this.Discount;
        });
        formModel.TotalPrice = 'TotalPrice : ' + totalPrice;
        formModel.TotalDiscount = 'TotalDiscount : ' + totalDiscount;
    };
    function onRequest(model) {
        model.Columns = service.Selector.GetIndex();
        (model.filter || []).each(function () {
            //if (this.field == 'VoucherNo') {
            //    this.field = 'Voucher'
            //}
        });
    };
    var that = this, gridModel, formModel = {}, service = {},gridContainer= $('#grid_container');
    function setGrid() {
        gridContainer.html('<div id="grid"></div>');
        Global.List.Bind({
            Name: 'Designation',
            Grid: {
                elm: gridContainer.find('#grid'),
                columns: service.Selector.GetColumns(),
                url: '/ReportArea/ColumnSelector/PurchaseData',
                page: { 'PageNumber': 1, filter: filter, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} ItemSales ' },
                onDataBinding: onDataBinding,
                onRequest: onRequest,
                Action: { width: 60 },
                Actions: [],
                Printable: false,
                selector:false
            },
            onComplete: function (model) {
                gridModel = model;
            },
            Add: false,
            remove: false,
            edit: false
        });
    };
    Global.Form.Bind(formModel, $('#sale_summary_container'));
    (function () {
        var inputs = Global.Form.Bind(formModel, $('#filter_container'));
        function onChange() {
            var newfilter = [];
            if (gridModel) {
                gridModel.page.filter = gridModel.page.filter || [];
                (gridModel.page.filter || []).each(function () {
                    if (this.field != 'PurchaseFrom' && this.field != 'PurchaseTo') {
                        newfilter.push(this);
                    }
                });
            } else {
                newfilter = filter
            }
            
            if (formModel.SaleFrom) {
                newfilter.push({ field: 'PurchaseFrom', value: "'" + formModel.SaleFrom + "'", Operation: 2 });
            }
            if (formModel.SaleTo) {
                newfilter.push({ field: 'PurchaseTo', value: "'" + formModel.SaleTo + "'", Operation: 4 });
            }
            if (gridModel) {
                gridModel.page.filter = newfilter;
                gridModel.Reload();
            }
        };
        Global.DatePicker.Bind($(inputs['SaleFrom']), { format: 'yyyy/MM/dd hh:mm', onChange: onChange });
        Global.DatePicker.Bind($(inputs['SaleTo']), { format: 'yyyy/MM/dd hh:mm', onChange: onChange });
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

        //
        function removeAll() {
            var newFilter = [];
            gridModel.page.filter.each(function () {
                this.field !== 'Typeid' && newFilter.push(this);
            });
            gridModel.page.filter = newFilter;
        }
        function setAll() {
            removeAll();
            gridModel.Reload();
        }
        function setPharmacy() {
            removeAll();
            gridModel.page.filter.push({ "field": "Typeid", "value": PharmacyTypeId, Operation: 0 });
            gridModel.Reload();
        }
        function setNonePharmacy() {
            removeAll();
            gridModel.page.filter.push({ "field": "Typeid", "value": NonePharmacyTypeId, Operation: 0 });
            gridModel.Reload();
        }
        $('#type_container a').click(function () {
            switch (this.dataset.type) {
                case '0':
                    setAll();
                    break;
                case '1':
                    setPharmacy();
                    break;
                case '2':
                    setNonePharmacy();
                    break;
            }
            $(this).closest('small').find('.selected').removeClass('selected');
            $(this).addClass('selected');
        });
    }).call(service.Filter = {});
    (function () {
        var columns = [], selectorContainer = $('#selector_container'),selectedColumns=[];
        function setOnchange(elm,func,model) {
            elm.change(function () {
                func(model);
            });
        };
        function setColumnView() {
            columns.each(function () {
                var elm = $('<label style="margin-right: 15px;"><input type="checkbox" data-binding="selected" /> ' + (this.title || this.field) + ' </label>');
                Global.Form.Bind(this, elm);
                setOnchange(elm, onColumnChange, this);
                selectorContainer.append(elm);
                this.selected && selectedColumns.push(this);
            });
        };
        function onColumnChange(model) {
            var newColumns = [];
            selectedColumns.each(function () {
                if (this.Id != model.Id) {
                    newColumns.push(this);
                }
            });
            selectedColumns = newColumns;
            if (model.selected) {
                selectedColumns.push(model);
            }
            setGrid();
        };
        function setColumns() {
            columns = [
                { field: 'VoucherNo', title: 'VoucherNo', filter: true, Id: 1,selected:true },
                { field: 'Name', title: 'TradeName', filter: true, Id: 2 },
                { field: 'GenericName', title: 'GenericName', filter: true, Id: 3 },
                { field: 'Strength', title: 'Strength', filter: true, Id: 4 },
                { field: 'Suplier', title: 'Suplier', filter: true, Id: 5, selected: true },
                { field: 'Counter', title: 'Counter', filter: true, Id: 6, selected: true },
                { field: 'TotalTradePrice', title: 'TotalTradePrice', type: 2, Id: 7, selected: true },
                { field: 'UnitTradePrice', title: 'UnitTradePrice', Id: 8, type: 2 },
                { field: 'UnitQuentity', title: 'UnitQuentity', Id: 9, type: 2, },
                { field: 'ItemCount', title: 'ItemCount', Id: 10, type: 2, selected: true, },
                { field: 'MarginDiscount', title: 'MarginDiscount', Id: 11, type: 2, selected: true },
                { field: 'ReduceAmount', title: 'ReduceAmount', Id: 12, type: 2,selected:true },
                { field: 'CreatedAt', title: 'Date', Id: 13, dateFormat: 'dd/MM/yyyy' },
                { field: 'Monthly', title: 'Monthly', Id: 14 },
                { field: 'Yearly', title: 'Yearly', Id: 15 }
            ];
            setColumnView();
            setGrid();
        };
        this.GetColumns = function () {
            return selectedColumns;
        };
        this.GetIndex = function () {
            var indexs = [];
            selectedColumns.each(function () {
                indexs.push(this.Id-1);
            });
            return indexs;
        };
        setColumns();
    }).call(service.Selector = {});
})();
