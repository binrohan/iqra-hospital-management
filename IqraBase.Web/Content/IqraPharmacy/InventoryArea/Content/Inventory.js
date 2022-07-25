

(function () {
    var gridModel, userId, selfService = {},dataSource=[], selectedDate = new Date(), formModel = {};
    selectedDate = new Date(selectedDate.setDate(selectedDate.getDate() - 1));
    function save(model, itemId, stock) {
        if (stock > -1) {
            Global.Wait();
            Global.CallServer('/ProductArea/Product/StockChange', function (response) {
                Global.Free();
                if (!response.IsError) {
                    model.TotalQuentity =model.TotalStock = stock;
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
        if (this.InventoryId) {
            setDisabled($(elm.find('td')[10]), $('<input disabled="" type="checkbox" checked="checked">'), this);
        } else {
            $(td[4]).html(up($('<input value="' + this.MinStockToAlert + '" class="form-control" type="text" style="width: calc(100% - 26px);" autocomplete="off">'), onSaveMinStack, this));
            $(td[5]).html(up($('<input value="' + this.TotalStock + '" class="form-control" type="text" style="width: calc(100% - 26px);" autocomplete="off">'), onEnter, this));
            onSelectionChanged($(elm.find('td')[10]), $('<input data-binding="IsSelected" type="checkbox"' + (this.IsSelected ? ' checked="checked"' : '') + '>'), this);
        }
        this.FormModel = {};
        Global.Form.Bind(this.FormModel, elm);

    };
    function setColor(model, td) {
        if (model.IsSelected) {
            td.addClass('selected');
        } else {
            td.removeClass('selected');
        }
    };
    function onSelectionChanged(td, elm, model) {
        model.Checkbox = elm;
        td.html(elm).closest('tr').click(function () {
            model.FormModel.IsSelected=model.IsSelected = !model.IsSelected;
            setColor(model, td);
        });
        elm.change(function () {
            model.FormModel.IsSelected = model.IsSelected = elm.is(':checked');
            setColor(model, td);
        }).click(function (e) {
            e.stopPropagation();
        });
        return elm;
    };
    function setDisabled(td, elm, model) {
        model.Checkbox = elm;
        td.html(elm).addClass('disabled');
        return elm;
    };
    function up(elm, func, option) {
        elm.keyup(function (e) {
            option.FormModel.IsSelected = option.IsSelected = true;
            setColor(option, option.Checkbox.closest('td'));
            func.call(this, option, e, parseFloat(this.value || '0'));
        }).focus(function () { $(this).select(); }).click(function (e) {
            e.stopPropagation();
        });
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
            this.OrginalStock = this.TotalStock;
        });
        dataSource = response.Data.Data;
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
    function onChange(date) {
        if (date) {
            selectedDate = date;
        } if (gridModel) {
            gridModel.Reload();
        }
    };
    $('#date').val(selectedDate.format('dd/MM/yyyy'));
    Global.DatePicker.Bind($('#date'), { format: 'dd/MM/yyyy', onChange: onChange });
    Global.List.Bind({
        Name: 'ItemInventory',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', title: 'Trade Name', filter: true, click: onItemDetails },
                { field: 'Strength', filter: true },
                { field: 'Category', filter: true },
                { field: 'Suplier', filter: true },
                { field: 'MinStockToAlert', title: 'MinStock', autobind: false },
                { field: 'TotalStock', title: 'Stock Qnt', autobind: false },
                { field: 'UnitConversion', title: 'Pack Size' },
                { field: 'SoldQuentity', title: 'Sold Qnt' },
                { field: 'PayableTradePrice', title: 'TP Price' },
                { field: 'PayableSalePrice', title: 'MRP Price' }
            ],
            url: function () { return '/InventoryArea/Inventory/ItemInventoryData?Date=' + selectedDate.format('yyyy/MM/dd') },
            page: { "PageNumber": 1, "PageSize": 10 },
            onDataBinding: onDataBinding,
            rowBound: rowBound,
            Action: { width: 60 },
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit: false,
        remove: false

    });
    (function () {
        function getData() {
            var data = [], errData = [], itemChanged = 0;
            dataSource.each(function () {
                if (this.InventoryId) {
                    return;
                } else if (!this.IsSelected) {
                    errData.push(this);
                } else {
                    data.push({
                        ItemId: this.Id,
                        Stock: this.TotalStock,
                        StockChanged: this.TotalStock - this.OrginalStock,
                        HasChanged: this.OrginalStock != this.TotalStock
                    });
                    if (this.OrginalStock != this.TotalStock) {
                        itemChanged++;
                    }
                }
            });
            return { Data: data, ErrData: errData, ChangedItemCount: itemChanged };
        };
        $('#btn_Save').click(function () {
            var model = getData();
            if (model.Data.length < 1) {
                alert('You have to select atlest one row.');
            } else if (model.ErrData.length > 0) {
                alert('Some Rows is not selected in this page.');
            } else {
                Global.Wait('Please Wait while saving data......');
                Global.Uploader.upload({
                    data: { ItemCount: model.Data.length, ChangedItemCount: model.ChangedItemCount, Page: JSON.stringify(gridModel.page), Items: model.Data },
                    url: '/InventoryArea/Inventory/SetInvetory',
                    onProgress: function (data) {
                    },
                    onComplete: function (response) {
                        Global.Free();
                        if (!response.IsError) {
                            gridModel.page.PageNumber++;
                            gridModel.Reload();
                        }
                        else
                            Global.Error.Show(response);
                    },
                    onError: function () {
                        Global.Free();
                        response.Id = -8;
                        Global.Error.Show(response, { user: '' })
                    }
                });
            }
        });
    })();
})();