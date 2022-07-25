
(function () {
    //var filters = typeof window.ItemType == 'undefined' ? [] : [{ field: 'itemsaleinfotype', value: 0, Operation: 0 }];
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };

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
    var that = this, gridModel, formModel = {}, service = {},gridContainer= $('#grid_container'),
        page={ 'PageNumber': 1, filter: filter, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Items ' };
    function setGrid() {
        gridContainer.html('<div id="grid"></div>');
        Global.List.Bind({
            Name: 'Designation',
            Grid: {
                elm: gridContainer.find('#grid'),
                columns: service.Selector.GetColumns(),
                url: '/ReportArea/ColumnSelector/ProductData',
                page: page,
                onDataBinding: onDataBinding,
                onRequest: onRequest,
                Action: { width: 60 },
                Actions: [],
                Printable:true
            }, onComplete: function (model) {
                gridModel = model;
            }, Add: false,
            remove: false,
            edit: false
        });
    };
    Global.Form.Bind(formModel, $('#sale_summary_container'));
    (function () {
        var inputs = Global.Form.Bind(formModel, $('#filter_container'));
        function removeAll() {
            var newFilter = [];
            page.filter.each(function () {
                this.field !== 'Typeid' && newFilter.push(this);
            });
            page.filter = newFilter;
        }
        function setAll() {
            removeAll();
            gridModel.Reload();
        }
        function setPharmacy() {
            removeAll();
            page.filter.push({ "field": "Typeid", "value": PharmacyTypeId, Operation: 0 });
            gridModel.Reload();
        }
        function setNonePharmacy() {
            removeAll();
            page.filter.push({ "field": "Typeid", "value": NonePharmacyTypeId, Operation:0 });
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
                { field: 'Name', title: 'Trade Name', filter: true, Id: 1 },
                { field: 'GenericName', title: 'GenericName', filter: true, Id: 2 },
                { field: 'Strength', title: 'Strength', filter: true, Id: 3 },
                { field: 'Suplier', title: 'Suplier', filter: true, Id: 4 },
                { field: 'Counter', title: 'Counter', filter: true, Id: 5 },
                { field: 'Category', title: 'Category', filter: true, Id: 6 },
                { field: 'Code', title: 'BarCode', filter: true, Id: 7 },
                { field: 'UnitSalePrice', title: 'UnitSalePrice', Id: 8},
                { field: 'UnitTradePrice', title: 'UnitTradePrice', Id: 9 },
                { field: 'TotalItem', title: 'TotalItem', Id: 10, selected: true },
                { field: 'TotalTradePrice', title: 'TotalTradePrice', Id: 11 },
                { field: 'TotalSalePrice', title: 'TotalSalePrice', Id: 12 }
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
