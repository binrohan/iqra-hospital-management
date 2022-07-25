
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, formModel = {}, inputs = {}, gridModel, callerOptions, dprPeriod,
        filterModel = { field: 'MinStockToAlert', value: 'TotalStock', Operation: 2 },
        page = { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Items ', filter: [filterModel] };
    function getData() {
        var items = service.Grid.GetData();
        var model = {
            Type: callerOptions.Type,
            Items: items.List,
            SuplierId: callerOptions.model.Id,
            SuplierEmail: callerOptions.model.SuplierEmail,
            OrderedQuentity: items.List.length,
            TotalTradePrice: items.TotalPrice,
            TotalPayablePrice: items.TotalPayablePrice,
            TotalSalePrice: items.TotalSalePrice,
            TotalVat: items.TotalVat,
            TotalDiscount: items.TotalDiscount,
            IsValid: items.IsValid,
            msg: items.msg
        };
        if (items.TotalPrice > 0) {
            model.Vat = items.TotalVat.mlt(100).div(items.TotalPrice);
            model.Discount = items.TotalDiscount.mlt(100).div(items.TotalPrice);
        } else {
            model.Vat = 0;
            model.Discount = 0;
        }
        return { model: model, orginalList: items.orginalList };
    };
    function save() {
        var model = getData();
        if (model.model.IsValid) {
            Global.Add({
                html: windowModel.html,
                model: model.model,
                close: close,
                dataSource: model.orginalList,
                url: '/Content/IqraPharmacy/ReportArea/Content/RequiredItem/Preview.js',
            });
        } else if (model.model.msg) {
            alert(model.model.msg);
        } else {
            alert('Validation Errors');
        }
    };
    function close() {
        windowModel && windowModel.Hide();
    };
    function refresh() {
        gridModel && gridModel.Reload();;
    };
    function onSelectItem() {
        var opts = {
            name: 'PharmacyItem',
            url: '/Content/IqraPharmacy/ProductOrderArea/Content/ItemListController.js',
            SuplierId: callerOptions.SuplierId,
            ItemType: 0,
            onSaveSuccess: function (list) {
                var newList = [];
                list.each(function () {
                    newList.push(Global.Copy({}, this, true));
                });
                service.Grid.AddItems(newList);
            }
        };
        Global.Add(opts);
    };
    function setFilter() {
        var filter = [], p = callerOptions.page;
        p.filter = p.filter || [];
        (p.filter || []).each(function () {
            if (this.field == 'PurchaseFrom') {
                formModel.SaleFrom = this.value.substring(1, this.value.length - 1);
                filter.push(this);
            } else if (this.field == 'PurchaseTo') {
                formModel.SaleTo = this.value.substring(1, this.value.length - 1);
                filter.push(this);
            }
        });
        filter.push({ field: 'CounterId', value: callerOptions.model.Id, Operation: 0 });
        if (gridModel) {
            gridModel.page.filter = filter;
        } else {
            page.filter = filter;
        }
        if (dprPeriod.val) {
            dprPeriod.val(callerOptions.Period);
        } else {
            gridModel.Period = callerOptions.Period;
        }
    };
    function loadData(dataUrl, func) {
        load(dataUrl, gridModel.page, func);
    };
    function load(dataUrl,model,func) {
        Global.CallServer('/ReportArea/RequiredItem/BySuplierAvarageDays?days=' + dataUrl, function (response) {
            if (!response.IsError) {
                func(response);
            }
        }, function (response) {
            alert('Network error had occured.');
        }, model, 'POST')
    };
    function setSummaryTemplate(view) {
        inputs = Global.Form.Bind(formModel, view.View);
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model
        page.filter = [{ field: 'CounterId', value: model.CounterId, Operation: 0 }, { field: 'SuplierId', value: model.SuplierId, Operation: 0 }];
        if (!formModel.ShowAll) {
            page.filter.push(filterModel);
        }
        if (windowModel) {
            windowModel.Show();
            service.Grid.Bind();
            formModel.title = 'Required Items By Suplier "' + callerOptions.model.Suplier + '"';
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ReportArea/Templates/RequiredItemReportBySuplier.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                windowModel.html = response;
                setSummaryTemplate(windowModel);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.View.find('.btn_refresh').click(refresh);
                windowModel.View.find('.btn_add_item').click(onSelectItem).show();
                windowModel.View.find('.btn_save').click(save);
                windowModel.Show();
                service.Grid.Bind();
                formModel.title = 'Required Items By Suplier "' + callerOptions.model.Suplier + '"';
            }, noop);
        }
    };
    (function () {
        var counterId, selfService = {}, selected = {}, defaultData = {}, avgData = {}, anyDay = {};
        function bind() {
            if (!gridModel) {
                isBind = true;
                counterId = callerOptions.model.Id;
                Global.Grid.Bind(getOptions());
                selfService.Events.Bind();
            }
        };
        function up(elm, func, option) {
            elm.keyup(function () {
                func.call(this, option);
                option.IsSelected = true;
                option.Checkbox.prop('checked', true);
            }).focus(function () { $(this).select(); }).click(function (e) { e.stopPropagation(); return false;});
            return elm;
        };
        function getInput(attr, placeHolder, func, option) {
            return up($('<input required="" data-binding="' + attr + '" name="' + attr + '" class="form-control" type="text" style="width: calc(100% - 24px); margin: 2px 0px;" placeholder="' + placeHolder + '" autocomplete="off">'), func, option);
        };
        function rowBound(elm) {
            
            selfService.UnitQuentity.Set(elm.find('.required_quantity'), this);
            selfService.Unit.Set(elm.find('.unit_price'), this);
            selfService.Days.Set(elm.find('.days'), this);
            selfService.SoldQuentity.Set(elm.find('.sold_qnt'), this);
            onSelectionChanged($(elm.find('td')[0]), $('<input data-binding="IsSelected" type="checkbox"' + (this.IsSelected ? ' checked="checked"' : '') + '>'), this);


            Global.Form.Bind(this.FormModel, elm);
            for (var key in this.FormModel) { if (typeof (this[key]) != 'undefined') this.FormModel[key] = this[key]; }
        };
        function onSelectionChanged(td, elm, model) {
            model.Checkbox = elm;
            td.html(elm).closest('tr').click(function () {
                model.IsSelected = !model.IsSelected;
                elm.prop('checked', model.IsSelected);
            });
            elm.change(function () {
                model.IsSelected = elm.is(':checked');
            }).click(function (e) {
                e.stopPropagation();
            });
            return elm;
        };
        function setSummary(summary) {
            var model = {};
            model.RequiredQuantity = summary.Qunt;
            model.Items = summary.Items;
            model.PayableAmount = (summary.Total + summary.Vat - summary.Discount).toMoney();
            model.TradePrice = summary.Total.toMoney();
            model.TotalDiscount = summary.Discount.toMoney();
            model.TotalVat = summary.Vat.toMoney();
            Global.Copy(formModel, model, true);
        };
        function setSelectedSummary() {
            var data = {}, model = {
                SelectedItems: 0, SelectedSaleQuantity: 0,
                SelectedTradeQuantity: 0, SelectTradePrice: 0,
                Discount: 0, DiscountTotal: 0,
                Vat: 0, VatTotal: 0,
                PayableTP: 0, MRP: 0,
                Profit: 0, TotalProfit: 0,
            },amount,discount,vat;
            for (var key in selected) {
                data = selected[key];
                amount = data.RequiredQuantity.mlt(data.UnitTradePrice);
                discount = amount.mlt(data.PurchaseDiscount).div(100 - data.PurchaseDiscount);
                vat = amount.mlt(data.Vat).div(100 + data.Vat);

                model.SelectedSaleQuantity += data.RequiredQuantity;
                model.SelectedTradeQuantity += data.OrderedQuentity;
                model.SelectTradePrice += (amount + discount).toFloat();
                model.DiscountTotal += discount;
                model.VatTotal += vat;
                model.PayableTP += data.OrderedQuentity;
                model.SelectedTradeQuantity += data.OrderedQuentity;
                model.SelectedTradeQuantity += data.OrderedQuentity;
                model.SelectedTradeQuantity += data.OrderedQuentity;
            }
        };
        function onDetails(model) {
            Global.Add({
                ItemId: model.ItemId,
                name: 'ProductDetails',
                url: '/Content/IqraPharmacy/ProductArea/Content/ProductDetails.js',
            });
        };
        function onDataBound() {
            formModel.IsAnyDay && formModel.AnyDay && loadAvgData();
            formModel.IsAvarageDay && formModel.AvarageDay && loadAnyDayData();
        };
        function recalculateAmount(data,summary) {
            data.FormModel.OrderedQuentity = data.OrderedQuentity;
            data.FormModel.RequiredQuantity = data.RequiredQuantity = data.CalculatedQuentity = (data.OrderedQuentity * data.UnitConversion).toFloat();
            data.TradePrice = data.UnitTradePrice.mlt(data.RequiredQuantity).toFloat();
            data.TotalDiscount = data.TradePrice.mlt(data.PurchaseDiscount).div(100).toFloat();
            data.TotalVat = data.TradePrice.mlt(data.Vat).div(100).toFloat();
            data.PayableAmount = (data.TradePrice + data.TotalVat - data.TotalDiscount).toFloat();
            summary.Qunt += data.RequiredQuantity;
            summary.Total += data.TradePrice;
            summary.Discount += data.TotalDiscount;
            summary.Vat += data.TotalVat;
        };
        function recalculateSummary() {
            var data, summary = {
                Total: 0,
                Discount: 0,
                Items: 0,
                Qunt:0
            };
            for (var key in defaultData) {
                data = defaultData[key];
                //summary.Items += data.RequiredQuantity;
                summary.Total += data.TradePrice;
                summary.Discount += data.TotalDiscount;
                summary.Vat += data.TotalVat;
                summary.Qunt += data.RequiredQuantity;
                summary.Items++;
            }
            setSummary(summary);
            
        };
        function onDataBinding(response) {
            var prec = 0.999999999999 - parseFloat(formModel.Precetion || '0'),
                    summary = {
                        Total: 0,
                        Discount: 0,
                        Vat: 0,
                        Items: 0,
                        Qunt: 0
                    };

            defaultData = {};
            response.Data.Data.each(function () {
                this.FormModel = {};
                if (selected[this.ItemId]) {
                    this.RequiredQuantity = this.CalculatedQuentity = selected[this.ItemId].RequiredQuantity;
                    this.OrgOrderedQuentity = this.OrderedQuentity = selected[this.ItemId].OrderedQuentity;
                    this.IsSelected = selected[this.ItemId].IsSelected;
                } else {
                    this.OrgOrderedQuentity = this.OrderedQuentity = Math.floor((this.MinStockToAlert - this.TotalStock) / this.UnitConversion + prec).toFloat();
                    this.RequiredQuantity = this.CalculatedQuentity = (this.OrderedQuentity * this.UnitConversion).toFloat();
                }
                selected[this.ItemId] = this;
                
                this.UnitTradePrice = this.UnitPurchasePrice;
                recalculateAmount(this, summary);
                defaultData[this.ItemId] = this;
            });
            setSummary(summary);
            //response.Data.Total = response.Data.Total.Total;
        };
        function loadAvgData() {
            loadData(formModel.ConsedarDay, function (response) {
                avgData = {};
                var days = parseFloat(formModel.AvarageDay || '1');
                response.Data.each(function () {
                    avgData[this.ItemId] = this;
                    if (this.NumberOfDays > 0)
                        this.SoldQuentity = this.SoldQuentity.mlt(days).div(this.NumberOfDays).toFloat();
                    if (defaultData[this.ItemId] && defaultData[this.ItemId].FormModel) {
                        defaultData[this.ItemId].FormModel.AvgSold = this.SoldQuentity
                        defaultData[this.ItemId].FormModel.AvgDay = days;
                    }
                });
            });
        };
        function loadAnyDayData() {
            loadData(formModel.AnyDay, function (response) {
                anyDay = {};
                response.Data.each(function () {
                    anyDay[this.ItemId] = this;
                    if (defaultData[this.ItemId] && defaultData[this.ItemId].FormModel) {
                        defaultData[this.ItemId].FormModel.AnyDaySold = this.SoldQuentity
                        defaultData[this.ItemId].FormModel.AnyDay = formModel.AnyDay;
                    }
                });
            });
        };
        function onRequest() {

        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#grid'),
                columns: [
                    { field: 'Selection', sorting: false, title: 'Selection', width: 70 },
                    { field: 'Name', title: 'Trade Name', filter: true, click: onDetails },
                    { field: 'Category', filter: true },
                    { field: 'Strength', filter: true },
                    { field: 'SoldDaysForParchaseRequired', title: 'Days', className: 'days' },
                    { field: 'SoldQuentity', title: 'SoldQnty', className: 'sold_qnt' },
                    { field: 'TotalStock', title: 'Stock' },
                    { field: 'RequiredQuantity', title: 'Required Qnty', className: 'required_quantity', autobind: false },
                    { field: 'TradePrice', className: 'unit_price', title: 'Trade Price', autobind: false },
                    { field: 'TotalVat', title: 'Vat', sorting: false },
                    { field: 'TotalDiscount', title: 'Discount', sorting: false },
                    { field: 'PayableAmount', title: 'Payable Amount', sorting: false }
                ],
                url: function () {
                    return '/ReportArea/RequiredItem/BySuplier';
                },
                page: page,
                dataBinding: onDataBinding,
                dataBound:onDataBound,
                rowBound: rowBound,
                onRequest: onRequest,
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
            selected = {};
            bind();
            if (callerOptions.model.Id != counterId) {
                gridModel.Reload();
            }
            counterId = callerOptions.model.Id;
        };
        this.GetData = function () {
            var list = [], orginalList = [], isValid = true, msg = '', totalTPPrice = 0, totalMRPPrice = 0, totalDiscount = 0, totalVAT = 0;
            var response = gridModel.response || {};
            response.Data = response.Data || {};
            response.Data.Data = response.Data.Data || [];
            //console.log(response.Data.Data);
            response.Data.Data.each(function (i) {
                if (!this.IsSelected) return;
                orginalList.push(this);
                var totalPrice = this.RequiredQuantity.mlt(this.UnitTradePrice),
                     totalSPrice = this.RequiredQuantity.mlt(this.UnitSalePrice),
                    discount = totalPrice.mlt(this.PurchaseDiscount).div(100),
                vat = totalPrice.mlt(this.Vat).div(100);
                totalTPPrice += totalPrice;
                totalMRPPrice += totalSPrice;
                totalDiscount += discount;
                totalVAT += vat;
                list.push({
                    Name: this.Name,
                    Category: this.Category,
                    Strength: this.Strength,
                    ItemId: this.ItemId,
                    CalculatedDays: this.SoldDaysForParchaseRequired,
                    CalculatedQuentity: this.SoldQuentity,
                    OrderedQuentity: this.RequiredQuantity.div(this.UnitConversion),
                    UnitTradePrice: this.UnitTradePrice.mlt(this.UnitConversion),
                    UnitSalePrice: this.UnitSalePrice.mlt(this.UnitConversion),
                    UnitPurchasePrice: this.UnitPurchasePrice,
                    Vat: this.Vat,
                    Discount: this.PurchaseDiscount,
                    DefaultVat: 0,
                    DefaultDiscount: 0,
                    TotalTradePrice: totalPrice,
                    TotalSalePrice: totalSPrice,
                    PurchaseUnitTypeId: this.PurchaseUnitTypeId,
                    SalesUnitTypeId: this.SalesUnitTypeId,
                    UnitConversion: this.UnitConversion,
                    Position: i + 1
                });
                if (this.RequiredQuantity <= 0) {
                    isValid = false;
                    msg = 'Ordered Quentity must be greater than 0.'
                }
            });
            if (list.length < 1) {
                isValid = false;
                msg = 'Please select at least one item and the proceed'
            }
            return {
                List: list,
                IsValid: isValid,
                msg: msg,
                TotalPrice: totalTPPrice ,
                TotalPayablePrice: totalTPPrice + totalVAT - totalDiscount,
                TotalSalePrice: totalMRPPrice,
                TotalDiscount: totalDiscount,
                TotalVat: totalVAT,
                orginalList: orginalList
            };
        };
        this.AddItems = function (list) {
            var dataObj = {};
            var response = gridModel.response || {};
            response.Data = response.Data || {};
            response.Data.Data = response.Data.Data || [];
            response.Data.Data.each(function () {
                dataObj[this.Id] = true;
            });
            // new Data change work from here.
            var dup = [];
            list.each(function () {
                if (dataObj[this.Id]) {
                    dup.push(this);
                    return;
                }
                this.FormModel = { AnyDaySold: 0, AvgSold: 0}
                this.ItemId = this.Id;
                this.RequiredQuantity = this.MinStockToAlert - this.TotalStock;
                this.UnitTradePrice = this.UnitPurchasePrice;
                this.TradePrice = this.PayableAmount = this.RequiredQuantity.mlt(this.UnitTradePrice);
                this.TotalDiscount = this.TradePrice.mlt(this.PurchaseDiscount).div(100);

                this.RequiredQuantity = this.CalculatedQuentity = this.RequiredQuantity.toFloat();
                this.OrderedQuentity = this.RequiredQuantity.div(this.UnitConversion).toFloat();
                response.Data.Data.push(this);
                gridModel.Add(this);
            });
            if (dup.length) {
                alert(dup.length + ' Items was duplicated.But we did not add the duplicate elements.')
            }
            console.log(list);
        };
        (function () {
            function onchange(data) {
                data.PayableAmount = data.RequiredQuantity.mlt(data.UnitTradePrice);
                data.TotalDiscount = data.PayableAmount.mlt(data.PurchaseDiscount).div(100);
                data.TotalVat = data.PayableAmount.mlt(data.Vat).div(100)
                data.TradePrice = (data.PayableAmount).toFloat();
                data.TotalDiscount = data.TotalDiscount.toFloat();
                data.PayableAmount = (data.PayableAmount + data.TotalVat - data.TotalDiscount).toFloat();
                recalculateSummary();
            };
            function onSaleQntChanged(model) {
                var value = parseInt(this.value || '0');
                model.RequiredQuantity = value;
                model.FormModel.OrderedQuentity = model.OrderedQuentity = value.div(model.UnitConversion).toFloat();
                onchange(model);
            }
            function onParchaseQntChanged(model) {
                var value = parseInt(this.value || '0');
                model.OrderedQuentity = value;
                model.FormModel.RequiredQuantity = model.RequiredQuantity = value.mlt(model.UnitConversion).toFloat();
                onchange(model);
            }
            this.Set = function (td, model) {
                td.html(getInput('RequiredQuantity', 'Sale Unit Qnt', onSaleQntChanged, model));
                td.append(getInput('OrderedQuentity', 'Parchase Unit Qnt', onParchaseQntChanged, model));
            };
        }).call(selfService.UnitQuentity = {});
        (function () {
            function onchange(data) {

            };
            function onAnyDayChanged(model) {
                var page = Global.Copy({}, gridModel.page);
                page.filter=[{ field: 'Id', value: model.ItemId, Operation: 0 }];
                load(this.value, page, function (response) {
                    response.Data.each(function () {
                        anyDay[this.ItemId] = this;
                        if (defaultData[this.ItemId] && defaultData[this.ItemId].FormModel) {
                            defaultData[this.ItemId].FormModel.AnyDaySold = this.SoldQuentity
                        }
                    });
                });
            }
            function onAvgDayChanged(model) {
                var page = Global.Copy({}, gridModel.page),
                    days = parseFloat(this.value || '1');
                page.filter = [{ field: 'Id', value: model.ItemId, Operation: 0 }];
                load(formModel.ConsedarDay, page, function (response) {
                    response.Data.each(function () {
                        avgData[this.ItemId] = this;
                        if (this.NumberOfDays > 0)
                            this.SoldQuentity = this.SoldQuentity.mlt(days).div(this.NumberOfDays).toFloat();
                        if (defaultData[this.ItemId] && defaultData[this.ItemId].FormModel) {
                            defaultData[this.ItemId].FormModel.AvgSold = this.SoldQuentity
                        }
                    });
                });
            }
            this.Set = function (td, model) {
                td.html('<div>' + model.SoldDaysForParchaseRequired + '</div>');
                td.append(getInput('AnyDay', 'Any Day', onAnyDayChanged, model));
                td.append(getInput('AvgDay', 'Avg Day', onAvgDayChanged, model));
            };
        }).call(selfService.Days = {});
        (function () {
            this.Set = function (td, model) {
                td.html('<div>' + model.SoldQuentity + '</div>' +
                '<hr/><div class="auto_bind" data-binding="AnyDaySold">' + (model.FormModel.AnyDaySold ||'')+ '</div>' +
                '<hr/><div class="auto_bind" data-binding="AvgSold">' + (model.FormModel.AvgSold || '') + '</div>');
            };
        }).call(selfService.SoldQuentity = {});
        (function () {
            this.Set = function (td, model) {
                var tp = model.UnitTradePrice;
                td.html('<div><span  class="auto_bind" data-binding="UnitTradePriceSl">' + tp.toFloat() + '</span> *  <span class="auto_bind" data-binding="UnitConversion">' + model.UnitConversion + '</span></div>' +
                '<hr/><div class="auto_bind" data-binding="UnitTradePriceTr">' + tp.mlt(model.UnitConversion).toFloat() + '</div>');
            };
        }).call(selfService.Unit = {});
        (function () {
            var timer, avarageDay;
            function onShowAllChange() {
                page.filter = [{ field: 'CounterId', value: callerOptions.CounterId, Operation: 0 }, { field: 'SuplierId', value: callerOptions.SuplierId, Operation: 0 }];
                if (!formModel.ShowAll) {
                    page.filter.push(filterModel);
                }
                gridModel.Reload();
            };
            function onAnyDayChange() {
                formModel.IsAnyDay && formModel.AnyDay && loadAnyDayData();
            };
            function onAvarageDayChange() {
                formModel.IsAvarageDay && formModel.AvarageDay && loadAvgData();
            };
            function onAnyDayKeyUp() {
                formModel.IsAnyDay = true;
                onAnyDayChange()
            };
            function onAvarageDayKeyUp() {
                formModel.IsAvarageDay = true;
                onAvarageDayChange();
            };
            function getMaxQnt(data, prec) {
                var qnt = -1;
                if (formModel.IsAnyDaySelect && anyDay[data.ItemId]) {
                    qnt = anyDay[data.ItemId].SoldQuentity;
                }
                //console.log(qnt);
                if (formModel.IsAvgDaySelect && avgData[data.ItemId]) {
                    qnt = Math.max(avgData[data.ItemId].SoldQuentity, qnt);
                }
                //console.log([qnt,data.TotalStock,data.UnitConversion,prec,data]);
                qnt = Math.floor((qnt - data.TotalStock) / data.UnitConversion + prec).toFloat();
                //console.log(qnt);
                if (qnt < 0) {
                    qnt = 0;
                }
                //console.log(qnt);
                if (formModel.IsDefaultSelect) {
                    qnt = Math.max(data.OrgOrderedQuentity, qnt);
                }
                //console.log(qnt);
                return qnt;
            };
            function onDefaultSelectionChanged() {
                var data, summary = {
                        Total: 0,
                        Discount: 0,
                        Vat: 0,
                        Items: 0,
                        Qunt: 0
                }, prec = 0.999999999999 - parseFloat(formModel.Precetion || '0');
                //formModel.IsAnyDaySelect = false;
                //formModel.IsAvgDaySelect = false;
                for (var key in defaultData) {
                    data = defaultData[key];
                    data.OrderedQuentity = getMaxQnt(data, prec);
                    recalculateAmount(data, summary);
                    if (data.OrderedQuentity > 0) {
                        data.FormModel.IsSelected = data.IsSelected = formModel.IsDefaultSelect || formModel.IsAnyDaySelect || formModel.IsAvgDaySelect;
                    }
                    else {
                        data.FormModel.IsSelected = data.IsSelected = false;
                    }
                    data.FormModel.UnitTradePriceSl = data.UnitTradePrice.toFloat();
                    data.FormModel.UnitTradePriceTr = data.UnitTradePrice.mlt(data.UnitConversion).toFloat();
                    data.IsSelected && summary.Items++;
                }
                setSummary(summary);
            };
            function onAnyDaySelectionChanged() {
                if (!formModel.IsAnyDaySelect) {
                    onDefaultSelectionChanged();
                    return;
                }
                var data, prec = 0.999999999999 - parseFloat(formModel.Precetion || '0'),
                    summary = {
                        Total: 0,
                        Discount: 0,
                        Vat: 0,
                        Items: 0,
                        Qunt: 0
                    };
                //formModel.IsDefaultSelect = false;
                //formModel.IsAvgDaySelect = false;
                for (var key in defaultData) {
                    data = defaultData[key];
                    if (anyDay[data.ItemId]) {
                        data.OrderedQuentity = getMaxQnt(data, prec);
                        //data.OrderedQuentity = Math.floor((anyDay[data.ItemId].SoldQuentity - data.TotalStock) / data.UnitConversion + prec).toFloat();
                        if (data.OrderedQuentity < 0) {
                            data.OrderedQuentity = 0;
                        }
                    } else {
                        data.OrderedQuentity = data.OrgOrderedQuentity;
                    }
                    recalculateAmount(data, summary);
                    if (data.OrderedQuentity > 0) {
                        data.FormModel.IsSelected = data.IsSelected = true;
                    }
                    else {
                        data.FormModel.IsSelected = data.IsSelected = false;
                    }
                    data.FormModel.UnitTradePriceSl = data.UnitTradePrice.toFloat();
                    data.FormModel.UnitTradePriceTr = data.UnitTradePrice.mlt(data.UnitConversion).toFloat();
                    data.FormModel.AnyDay = formModel.AnyDay;
                    data.IsSelected && summary.Items++;
                }
                setSummary(summary);
            };
            function onAvgDaySelectionChanged() {
                if (!formModel.IsAvgDaySelect) {
                    onDefaultSelectionChanged();
                    return;
                }
                //formModel.IsDefaultSelect = false;
                //formModel.IsAnyDaySelect = false;
                var data, prec = 0.999999999999 - parseFloat(formModel.Precetion || '0'),
                    summary = {
                        Total: 0,
                        Discount: 0,
                        Vat: 0,
                        Items: 0,
                        Qunt: 0
                    };
                for (var key in defaultData) {
                    data = defaultData[key];
                    if (avgData[data.ItemId]) {
                        data.OrderedQuentity = getMaxQnt(data, prec);
                        //data.OrderedQuentity = Math.floor((avgData[data.ItemId].SoldQuentity- data.TotalStock) / data.UnitConversion + prec).toFloat();
                        if (data.OrderedQuentity < 0) {
                            data.OrderedQuentity = 0;
                        }
                    } else {
                        data.OrderedQuentity = data.OrgOrderedQuentity;
                    }
                    recalculateAmount(data, summary);
                    if (data.OrderedQuentity > 0) {
                        data.FormModel.IsSelected = data.IsSelected = true;
                    }
                    else {
                        data.FormModel.IsSelected = data.IsSelected = false;
                    }
                    data.FormModel.UnitTradePriceSl = data.UnitTradePrice.toFloat();
                    data.FormModel.UnitTradePriceTr = data.UnitTradePrice.mlt(data.UnitConversion).toFloat();
                    data.FormModel.AvgDay = formModel.AvarageDay || '1';
                    data.IsSelected && summary.Items++;
                }
                setSummary(summary);
            };
            function setDropdown() {
                Global.DropDown.Bind({
                    elm: $(inputs['ConsedarDay']),
                    dataSource: [
                        { text: 'One Year', value: 365 },
                        { text: '8 Months', value: 240 },
                        { text: '6 Months', value: 180 },
                        { text: '3 Months', value: 90 }
                    ], change: function () {
                        onAvarageDayChange();
                    }
                });
            };
            this.Bind = function (td, model) {
                $(inputs['ShowAll']).change(onShowAllChange);
                $(inputs['IsAnyDay']).change(onAnyDayChange);
                $(inputs['IsAvarageDay']).change(onAvarageDayChange);
                $(inputs['AnyDay']).keyup(function () {
                    timer && clearTimeout(timer);
                    timer = setTimeout(onAnyDayKeyUp, 300);
                });
                $(inputs['AvarageDay']).keyup(function () {
                    timer && clearTimeout(timer);
                    timer = setTimeout(onAvarageDayKeyUp, 300);
                });
                $(inputs['Precetion']).keyup(function () {
                    timer && clearTimeout(timer);
                    timer = setTimeout(onChange, 300);
                });

                $(inputs['IsDefaultSelect']).change(onDefaultSelectionChanged);
                $(inputs['IsAnyDaySelect']).change(onAnyDaySelectionChanged);
                $(inputs['IsAvgDaySelect']).change(onAvgDaySelectionChanged);
                setDropdown();
            };
        }).call(selfService.Events = {});
    }).call(service.Grid = {});
};