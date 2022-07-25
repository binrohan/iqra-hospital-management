

(function () {
    var gridModel, userId, selfService = {}, selectedDate = new Date();
    selectedDate = new Date(selectedDate.setDate(selectedDate.getDate() - 1));
    function save(model, itemId, stock) {
        if (stock > -1) {
            Global.Wait();
            Global.CallServer('/ProductArea/Product/StockChange', function (response) {
                Global.Free();
                if (!response.IsError) {
                    model.TotalQuentity = stock;
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                Global.Free();
                response.Id = -8;
                alert('Network Errors.');
            }, { itemId: itemId, stock: stock }, 'POST');
        } else {
            alert('Validation Errors.');
        }
        return false;
    }
    function saveMinStack(model, itemId, minStock) {
        if (minStock >= 0) {
            Global.Wait();
            Global.CallServer('/ProductArea/Product/MinstockChange', function (response) {
                Global.Free();
                if (!response.IsError) {
                    model.MinStockToAlert = minStock;
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                Global.Free();
                response.Id = -8;
                alert('Network Errors.');
            }, { Id: itemId, minStock: minStock }, 'POST');
        } else {
            alert('Validation Errors.');
        }
        return false;
    }
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onSelect(model) {

    }
    function onEnter(option, e, stock) {
        if (e.keyCode === 13) {
            save(option, option.Id, stock);
        }
    };
    function onEnter(option, e, stock) {
        if (e.keyCode === 13) {
            save(option, option.Id, stock);
        }
    };
    function onSaveMinStack(option, e, stock) {
        if (e.keyCode === 13) {
            saveMinStack(option, option.Id, stock);
        }
    };
    function rowBound(elm) {
        var td = elm.find('td'), index = 1;
        if (this.TotalTradePriceValue > 0 && (this.TotalSalePriceValue - this.TotalTradePriceValue) * 100 / this.TotalTradePriceValue < 10) {
            elm.css({ 'background-color': 'rgb(153, 85, 85)', 'color': 'rgb(238, 238, 238)' });
            //alert(this.Id);
        }
        $(td[4]).html(up($('<input value="' + this.MinStockToAlert + '" class="form-control" type="text" style="width: calc(100% - 26px);" autocomplete="off">'), onSaveMinStack, this));
        $(td[5]).html(up($('<input value="' + this.TotalStock + '" class="form-control" type="text" style="width: calc(100% - 26px);" autocomplete="off">'), onEnter, this));
    };
    function up(elm, func, option) {
        elm.keyup(function (e) {
            func.call(this, option, e, parseFloat(this.value || '0'));
        }).focus(function () { $(this).select(); });
        return elm;
    }
    function setSummary(response) {
        var model = response.Data.Total;
        model.TotalQuentity = (model.TotalQuentity || 0).toMoney();
        model.TotalTradePrice = (model.TotalTradePrice || 0).toMoney();
        model.TotalSalePrice = (model.TotalSalePrice || 0).toMoney();

        Global.Copy(formModel, response.Data.Total, true);
    };
    function onDataBinding(response) {
        response.Data.Data.each(function () {
            this.PayableTradePrice = this.PayableTradePrice.toFloat();
            this.PayableSalePrice = this.PayableSalePrice.toFloat();
        });
        //setSummary(response);
        //response.Data.Total = response.Data.Total.Total;
    };
    function onActivate(model) {
        Global.Controller.Call({
            url: IqraConfig.Url.Js.WarningController,
            functionName: 'Show',
            options: {
                name: 'DeActivate Item',
                msg: 'Are you sure you want to DeActivate this item?',
                save: '/ProductArea/Product/DeActivate?Id=' + model.Id,
                data: { Id: model.Id },
                onsavesuccess: function () {
                    gridModel.Reload();
                }, onerror: function (response) {

                },
            }
        });
    };
    function onItemDetails(model) {
        Global.Add({
            ItemId: model.Id,
            name: 'ProductDetails',
            url: '/Content/IqraPharmacy/ProductArea/Content/ProductDetails.js',
        });
    };
    Global.List.Bind({
        Name: 'ItemSales',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', title: 'Trade Name', filter: true, click: onItemDetails },
                { field: 'Strength', filter: true },
                { field: 'Category', filter: true },
                { field: 'Suplier', filter: true },
                { field: 'MinStockToAlert', title: 'MinStock', autobind: false },
                { field: 'TotalQuentity', title: 'Stock Qnt', autobind: false },
                { field: 'UnitConversion', title: 'Pack Size' },
                { field: 'SoldQuentity', title: 'Sold Qnt' },
                { field: 'PayableTradePrice', title: 'TP Price' },
                { field: 'PayableSalePrice', title: 'MRP Price' }
            ],
            url: function () { return '/InventoryArea/Inventory/ItemSaleData?Date=' + selectedDate.format('yyyy/MM/dd') },
            page: { "PageNumber": 1, "PageSize": 10 },
            onDataBinding: onDataBinding,
            rowBound: rowBound,
            Action: { width: 60 },
            //Actions: [{
            //    click: onActivate,
            //    html: '<a style="margin-right:8px;" class="icon_container" title="DeActivate"><span class="fa fa-times"></span></a>'
            //}]
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit: false,
        remove: false

    });
})();