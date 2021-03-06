
var Controller = new function (none) {
    var service = {}, windowModel, formModel = {}, orderModel = {}, callerOptions, gridModel, formInputs = {};
    function getData() {
        var items = service.Grid.GetData();
        var model = {
            Items: items.List,
            SuplierId: orderModel.SuplierId,
            PaymentType: formModel.PaymentType,
            ReduceAmount: formModel.ReduceAmount||0,
            Discount: formModel.Discount,
            TotalDiscount:items.TotalDiscount,
            VAT: formModel.VAT,
            TradePrice: formModel.PayablePrice,
            ChallanDate: formModel.ChallanDate,
            VoucherNo: formModel.VoucherNo,
            ChallanNo: formModel.ChallanNo,
            ItemCount: formModel.TotalItems,
            DefaultDiscount: orderModel.DefaultDiscount,
            DefaultVAT: orderModel.DefaultVat,
            SalePrice: formModel.TotalMRPPrice,
            OrderInfoId: orderModel.Id,
            Status: items.Status,
            msg: items.msg,
            IsValid: formModel.IsValid && items.IsValid,
            Type: window.ItemType,
            MarginDiscount: formModel.MarginDiscount
        };
        return model;
    };
    function save() {
        var model = getData();
        if (model.IsValid) {
            windowModel.View.find('#progress_ba_container').show();
            windowModel.Wait('Please Wait while saving data......');
            windowModel.Image.files[0] && (model.VoucherImage = { IsFile: true, File: windowModel.Image.files[0] });
            Global.Uploader.upload({
                data: model,
                url: '/PharmacyItemReceive/AddNew',
                onProgress: function (data) {
                    //windowModel.View.find('#progress_ba_container #myBar').css({ width: (data.loaded / data.total) * 100 + '%' });
                    console.log(data);
                },
                onComplete: function (response) {
                    windowModel.Free();
                    if (!response.IsError) {
                        windowModel.View.find('#progress_ba_container #myBar').css({ width: 0 + '%' });
                        callerOptions.onSaveSuccess();
                        close();
                    } else if (response.Id === -4) {
                        //alert('This email is already registered.');
                    }
                    else
                        Global.Error.Show(response);
                },
                onError: function () {
                    windowModel.Free();
                    response.Id = -8;
                    Global.Error.Show(response, { user: '' })
                }
            });
        } else if (model.msg) {
            alert(model.msg);
        } else {
            alert('Validation Errors.');
        }
    }
    function readURL() {
        var input = this;
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#img_prev').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function up(elm, func, option, onSelect) {
        elm.keyup(function () {
            func.call(this, option);
            if (option&&!option.Selected) {
                onSelect.call(elm.closest('tr')[0], option);
            }
        })
        .focus(function () { $(this).select(); })
        .click(function (e) {
            e.stopPropagation();
        });
        return elm;
    }
    function onSelectItem() {
        if (formModel.SuplierId) {
            var opts = {
                name: 'PharmacyItem',
                url: '/Content/IqraPharmacy/Pharmacy/Content/Item/ItemListController.js',
                SuplierId: formModel.SuplierId,
                onSaveSuccess: function (list) {
                    var newList = [], obj = {}, matchCount = 0;
                    gridModel.dataSource.each(function () {
                        obj[this.ItemId] = true;
                    });
                    list.each(function () {
                        if (obj[this.ItemId]) {
                            matchCount++;
                            return;
                        }
                        var item = Global.Copy({}, this, true);
                        newList.push(item);
                        item.UnitTradePrice = item.UnitPurchasePrice;
                        item.UnitSalePrice = item.UnitSalePrice.mlt(item.UnitConversion).toFloat();
                        item.UnitTradePrice = item.UnitTradePrice.mlt(item.UnitConversion).toFloat();
                    });
                    if (newList.length<1 && matchCount > 0) {
                        alert('The item is already selected.');
                        return;
                    } else if (newList.length <1) {
                        alert('No item is selected.');
                        return;
                    } else if (matchCount > 0) {
                        alert(matchCount + ' items is already selected. But we added ' + newList.length + ' items.');
                    }
                    service.Grid.AddItems(newList);
                }
            };
            Global.Add(opts);
        } else {
            alert('Please select a suplier');
        }
    };
    function onSelectOrder() {
        var opts = {
            name: 'OrderList',
            //FormModel:formModel,
            url: '/Content/IqraPharmacy/ProductOrderArea/Content/OrderSelector.js',
            onSaveSuccess: function (order) {
                orderModel = order;
                formModel.SuplierId = order.SuplierId;
                service.Loader.Load(order.Id);
            }
        };
        Global.Add(opts);
    };
    function fixNumber(num, div, mul) {

    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/Pharmacy/Templates/Received.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '99%' });
                formInputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.View.find('.btn_add_item').click(onSelectItem);
                windowModel.View.find('.btn_choose_order').click(onSelectOrder);
                Global.Submit(windowModel.View.find('form'), save);
                windowModel.Image = $('#btn_image').change(readURL)[0];
                windowModel.Show();
                service.Grid.Bind();
                service.Events.Bind();
            }, noop);
        }
    };
    this.Status = function (txt) {
        if (txt == 'End') {
            windowModel.View.find('.status_container').empty();
            //windowModel.View.find('#progress_ba_container').hide();
            windowModel.View.find('#progress_ba_container #myBar').css({ width: 0 });
            close();
            callerOptions.Success();
        } else {
            windowModel.View.find('.status_container').prepend('<div class="col-md-12">' + txt + '</div>');
        }
    };
    (function () {
        this.Load = function (orderInfoId) {
            gridModel.Busy();
            Global.CallServer('/Order/GetOrderItems?orderInfoId=' + orderInfoId, function (response) {
                gridModel.Free();
                gridModel.dataSource = [];
                response.Data = response.Data.orderBy('Position');
                orderModel.TotalItems = response.Data;
                service.Grid.AddItems(response.Data);
            }, function (response) {
            }, null, 'GET', null, false);
        }
    }).call(service.Loader = {});
    (function () {
        this.Bind = function () {
            Global.AutoComplete.Bind({
                Id: 'SuplierId',
                url: '/SuplierArea/Suplier/AutoComplete',
                type: 'AutoComplete',
                onDataBinding: function (response) {

                },
                position: 4,
                elm: $(formInputs['SuplierId']).empty()
            });
        }
    }).call(service.Suplier = {});
    (function () {
        function onVatChanged() {
            var value = formModel.VAT;
            service.Grid.OnVatChanged(parseFloat(value || '0', 10));
            formModel.VAT = value;
        };
        function onTotalVatChanged() {
            var value = formModel.TotalVAT;
            service.Grid.OnVatChanged(parseFloat(value || '0', 10) * 100 / parseFloat(formModel.TotalTPPrice, 10));
            formModel.TotalVAT = value;
        };
        function onDiscountChanged() {
            var value = formModel.Discount;
            service.Grid.OnDiscountChanged(parseFloat(value || '0', 10));
            formModel.Discount = value;
        };
        function onTotalDiscountChanged() {
            var value = formModel.TotalDiscount;
            service.Grid.OnDiscountChanged(parseFloat(value || '0', 10) * 100 / parseFloat(formModel.TotalTPPrice, 10));
            formModel.TotalDiscount = value;
        };
        function onReduceAmountChanged() {
            service.Grid.OnReduceAmountChanged();
        };
        this.Bind = function () {
            up($(formInputs['TotalVAT']), onTotalVatChanged);
            up($(formInputs['VAT']), onVatChanged);
            up($(formInputs['Discount']), onDiscountChanged);
            up($(formInputs['TotalDiscount']), onTotalDiscountChanged);
            up($(formInputs['ReduceAmount']), onReduceAmountChanged);
            //formModel.ReduceAmount
        }
    }).call(service.Events = {});
    (function (nope) {
        var dataSource = [], selected = [], inputs = {}, tTPrice = 0, tSPrice = 0, tVat = 0, tDiscount = 0, selfService = {};
        function getInput(attr, placeHolder, func, option) {
            return up($('<input required="" data-binding="' + attr + '" name="' + attr + '" class="form-control" type="text" style="width: calc(100% - 10px); margin: 2px 0px;" placeholder="' + placeHolder + '" autocomplete="off">'), func, option,onSelect);
        };
        function getNoneRequiredInput(attr, placeHolder, func, option) {
            return up($('<input data-binding="' + attr + '" name="' + attr + '" class="form-control" type="text" style="width: calc(100% - 12px); margin: 2px 0px;" placeholder="' + placeHolder + '" autocomplete="off">'), func, option,onSelect);
        };
        function summaryChanged() {
            dataSource = gridModel.dataSource;
            tTPrice = 0, tVat = 0, tSPrice = 0;
            for (var i = 0; i < dataSource.length; i++) {
                tTPrice += dataSource[i].TotalTradePrice;
                tSPrice += dataSource[i].TotalSalePrice;
                tVat += dataSource[i].VatTotal;
            }
            var tdPrice = tTPrice + tVat - tDiscount;
            //formModel.PayablePrice = tdPrice;
            formModel.TotalTPPrice = tTPrice.toFloat();
            formModel.TotalMRPPrice = tSPrice.toFloat();
            formModel.TotalVAT = tVat.toFloat();
            formModel.VAT = (100 * tVat / tTPrice).toFloat();
            //formModel.MarginDiscount = (100 * (tSPrice - tdPrice) / tdPrice).toFixed(3);
            summaryDiscountChanged();
        };
        function summaryDiscountChanged() {
            dataSource = gridModel.dataSource;
            tDiscount = 0;
            for (var i = 0; i < dataSource.length; i++) {
                tDiscount += dataSource[i].DiscountTotal;
            }
            var tdPrice = tTPrice + tVat - tDiscount;
            formModel.PayablePrice = (tdPrice - (parseFloat(formModel.ReduceAmount || '0'))).toFloat();
            formModel.TotalDiscount = tDiscount.toFloat();
            formModel.Discount = (100 * tDiscount / tTPrice).toFloat();
            formModel.MarginDiscount = (100 * (tSPrice - tdPrice) / tdPrice).toFloat();
        };
        function onRemove(model) {
            var list = [],i=1;
            gridModel.dataSource.each(function (position) {
                if (model.Id != this.Id) {
                    list.push(this);
                    this.Index = i++;
                }
            });
            gridModel.dataSource = list;
            formModel.TotalItems = list.length;
            summaryChanged();
            summaryDiscountChanged();
            $(this).closest('tr').remove();
        };
        function onSelect(model) {
            if (model.Selected) {
                model.Selected = false;
                $(this).removeClass('i-state-selected');
            } else {
                model.Selected = true;
                $(this).addClass('i-state-selected');
            }
        };
        function onItemDetails(model) {
            Global.Add({
                ItemId: model.ItemId,
                name: 'ProductDetails',
                url: '/Content/IqraPharmacy/ProductArea/Content/ProductDetails.js',
            });
        };
        function rowBound(elm) {
            var td = elm.find('td'), index = 1,model=this;
            elm.dblclick(function () { onItemDetails(model) });
            $(td[index+1]).html(getNoneRequiredInput('BatchName', 'BatchName', noop));
            selfService.Unit.Set($(td[index+2]), this);
            selfService.UnitQuentity.Set($(td[index + 3]), this);
            selfService.UnitSalePrice.Set($(td[index + 4]), this);
            selfService.UnitTradePrice.Set($(td[index + 5]), this);
            selfService.TotalPrice.Set($(td[index + 6]), this);
            selfService.VAT.Set($(td[index + 7]), this);
            selfService.Discount.Set($(td[index + 8]), this);
            selfService.PayablePrice.Set($(td[index + 9]), this);
            selfService.Date.Set($(td[index + 10]), this);
            $(td[index + 11]).html(Global.Click($('<button class="btn btn_cancel btn-white btn-default btn-round" type="button"><span class="glyphicon glyphicon-remove"></span> </button>'), onRemove, this));
            var pModel = this.FormModel;
            this.FormModel = {};
            Global.Click(elm, onSelect, this);
            inputs[this.ItemId] = Global.Form.Bind(this.FormModel, elm);
            inputs[this.ItemId].Elm = elm;
            for (var key in this.FormModel) { if (typeof (this[key]) != 'undefined') this.FormModel[key] = this[key]; }
            if (pModel) {
                for (var key in pModel) { this.FormModel[key] = pModel[key]; }
            }
            if (this.Selected) {
                elm.addClass('i-state-selected');
            }
            checkValidation(this);
        };
        function checkValidation(model) {
            if (model.PayablePrice / model.SaleUnitQuentity > model.SUnitSalePrice) {
                inputs[model.ItemId].Elm.addClass('validation_error');
            } else {
                inputs[model.ItemId].Elm.removeClass('validation_error');
            }
        };
        this.Bind = function () {
            Global.Grid.Bind({
                elm: windowModel.View.find('#item_grid'),
                columns: [{ field: 'Index', title: 'Sr', sorting: false, width: 30 },
                    { field: 'Name', title: 'Trade Name' },
                    { field: 'BatchName', autobind: false, width: 90 },
                    { field: 'SalesUnitType', title: 'Unit(S/P)', width: 70, },
                    //{ field: 'SalesUnitType', title: 'S. Unit' },
                    //{ field: 'PurchaseUnitType', title: 'P. Unit', autobind: false },
                    //{ field: 'UnitConversion', title: 'Conversion', autobind: false },
                    { field: 'UnitQuentity', title: 'Unit Qnt', className: 'unit_quentity', autobind: false, width: 70, },
                    { field: 'UnitSalePrice', title: 'UMRPPrice', className: 'unit_s_price', autobind: false },
                    { field: 'UnitTradePrice', title: 'UTPPrice', className: 'unit_t_price', autobind: false },
                    { field: 'TotalPrice', title: 'Total Price', autobind: false },
                    { field: 'Vat', title: 'VAT( % | Total )', className: 'vat', width: 110, autobind: false },
                    //{ field: 'VatTotal', title: 'VAT(Total)', className: 'vat' },
                    { field: 'Discount', title: 'Discnt( % | Total )', className: 'discount', width: 120, autobind: false },
                    //{ field: 'Discount', title: 'Discnt(Total)', className: 'discount', autobind: false },
                    { field: 'PayablePrice', title: 'PayablePrice', autobind: false },
                    { field: 'Date', title: 'MGF/EXP Date' },
                    { field: 'Action', className: 'action', width: 50 }],
                dataSource: [],
                dataBinding: function (response) {
                    dataSource = response;
                },
                rowBound: rowBound,
                pagging: false,
                page: { 'PageNumber': 1, 'PageSize': 999999 },
                pagger: { showingInfo: ' {0}-{1} of {2} Items ' },
                oncomplete: function (model) {
                    gridModel = model;
                },
                onrequest: function (data) {

                },
                Printable: false
            });
        }
        this.AddItems = function (list) {
            list.each(function (i) {
                gridModel.dataSource.push(this);
                this.Name = this.TradeName;
                this.SaleUnitQuentity = this.UnitConversion.mlt(this.OrderedQuentity).toFloat();
                this.ParchaseUnitQuentity = this.OrderedQuentity;
                this.SUnitSalePrice = this.UnitSalePrice.div(this.UnitConversion).toFloat();
                this.PUnitSalePrice = this.UnitSalePrice;
                this.OUnitSalePrice = this.UnitSalePrice;
                this.SUnitTradePrice = this.UnitPurchasePrice;
                this.PUnitTradePrice = this.UnitTradePrice;
                this.Discount = this.Discount.toFloat();
                this.TotalSalePrice = this.SUnitSalePrice.mlt(this.SaleUnitQuentity).toFloat();
                this.TotalTradePrice = this.UnitTradePrice.mlt(this.ParchaseUnitQuentity).toFloat();
                this.VatTotal = this.TotalTradePrice.mlt(this.Vat).div(100).toFloat();
                this.DiscountTotal = this.TotalTradePrice.mlt(this.Discount).div(100).toFloat();
                this.PayablePrice = (this.TotalTradePrice + this.VatTotal - this.DiscountTotal).toFloat();
                this.SuplierId = formModel.SuplierId;
                this.Index = gridModel.dataSource.length;
            });
            formModel.TotalItems = gridModel.dataSource.length;
            gridModel.Reload();
            summaryChanged();
            //summaryDiscountChanged();
        };
        this.GetData = function () {
            var list = [], totalDiscount=0, isValid = true, msg = '', priceChange = 0, totalTradePrice = 0, qntChange = 0, item = gridModel.dataSource.length == orderModel.TotalItems.length ? 1 : 5;

            gridModel.dataSource.each(function (position) {
                    if (!this.Selected) {
                    isValid = false;
                    msg = 'Some of the columns are not selected.';
                    return;
                }
                qntChange = this.SaleUnitQuentity == this.UnitConversion .mlt( this.OrderedQuentity) ? qntChange : 1;
                priceChange = this.OUnitSalePrice == this.PUnitSalePrice ? priceChange : 2;
                totalDiscount += parseFloat(this.FormModel.DiscountTotal, 10);
                totalTradePrice = (this.TotalTradePrice + parseFloat(this.FormModel.VatTotal, 10) - parseFloat(this.FormModel.DiscountTotal, 10)).toFloat();
                list.push({
                    ItemId: this.ItemId,
                    SuplierId: this.SuplierId,
                    SalesUnitTypeId: this.SalesUnitTypeId,
                    PurchaseUnitTypeId: this.PurchaseUnitTypeId,
                    UnitConversion: this.UnitConversion,
                    UnitTradePrice: totalTradePrice.div(this.SaleUnitQuentity),
                    UnitPurchasePrice: this.SUnitTradePrice,
                    TotalTradePrice: totalTradePrice,
                    UnitSalePrice: this.SUnitSalePrice,
                    VAT: this.Vat,
                    TotalVAT: this.FormModel.VatTotal,
                    UnitVAT: this.Vat.mlt(this.SUnitTradePrice).div(100),
                    Discount: this.Discount,
                    TotalDiscount: this.FormModel.DiscountTotal,
                    UnitDiscount: this.Discount.mlt(this.SUnitTradePrice).div(100),
                    Position: position,
                    DefaultVat: this.DefaultVat,
                    DefaultDiscount: this.DefaultDiscount,
                    MGFDate: this.FormModel.MGFDate,
                    EXPDate: this.FormModel.EXPDate,
                    BatchName: this.FormModel.BatchName,
                    UnitQuentity: this.SaleUnitQuentity,
                    Type: window.ItemType,
                    MarginDiscount: (100 * (this.SUnitSalePrice * this.SaleUnitQuentity - totalTradePrice) / totalTradePrice).toFloat()
                });
                if (this.SaleUnitQuentity <= 0) {
                    isValid = false;
                    msg = 'OrderedQuentity can not be 0.'
                } else if (this.SUnitSalePrice < totalTradePrice / this.SaleUnitQuentity) {
                    isValid = false;
                    msg = 'MRPPrice can not be less than TPPrice.'
                    console.log([msg, this, this.SUnitSalePrice , totalTradePrice , this.SaleUnitQuentity]);
                }
            });
            if (list.length < 1) {
                isValid = false;
                msg = 'Please select at least one item and the proceed'
            }
            return { List: list, IsValid: isValid, Status: priceChange + qntChange + item, msg: msg, TotalDiscount: totalDiscount };
        };
        this.OnVatChanged = function (value) {
            gridModel.dataSource.each(function () {
                this.FormModel.Vat = this.Vat = value;
                this.FormModel.VatTotal = this.VatTotal = (this.TotalTradePrice * this.Vat / 100).toFloat();
            });
            summaryChanged();
        };
        this.OnDiscountChanged = function (value) {
            gridModel.dataSource.each(function () {
                this.Discount = value;
                this.FormModel.Discount = value.toFloat();
                this.FormModel.DiscountTotal = this.DiscountTotal = (this.TotalTradePrice * this.Discount / 100).toFloat();
            });
            summaryDiscountChanged();
        };
        this.OnReduceAmountChanged = function () {
            formModel.PayablePrice = (tTPrice + tVat - tDiscount - (parseFloat(formModel.ReduceAmount || '0', 10))).toFloat();
        };
        (function () {
            this.Changed = function (model) {
                model.VatTotal = model.FormModel.VatTotal = model.TotalTradePrice.mlt(model.Vat).div(100).toFloat();
                model.FormModel.DiscountTotal = model.DiscountTotal = model.TotalTradePrice .mlt( model.Discount ).div( 100).toFloat();
                model.FormModel.PayablePrice = model.PayablePrice = (model.TotalTradePrice + model.VatTotal - model.DiscountTotal).toFloat();
                summaryChanged();
                checkValidation(model);
            };
        }).call(selfService);
        (function () {
            this.Set = function (td, model) {
                var input = getNoneRequiredInput('MGFDate', 'MGF Date', nope);
                Global.DatePicker.Bind(input, { format: 'dd/MM/yyyy' });
                td.html(input);
                input = getNoneRequiredInput('EXPDate', 'EXP Date', nope);
                Global.DatePicker.Bind(input, { format: 'dd/MM/yyyy' });
                td.append(input);
            };
        }).call(selfService.Date = {});
        (function () {
            function onchange(model) {
                selfService.Changed(model);
            };
            function onPayablePriceChanged(model) {
                var payablePrice = model.FormModel.PayablePrice;
                model.PayablePrice = parseFloat(payablePrice, 10).toFloat();
                model.FormModel.TotalTradePrice = (model.TotalTradePrice = model.PayablePrice - model.VatTotal + model.DiscountTotal).toFloat();
                model.FormModel.SUnitTradePrice = model.SUnitSalePrice = model.TotalTradePrice.div(model.SaleUnitQuentity).toFloat();
                model.FormModel.PUnitTradePrice = model.PUnitTradePrice = model.TotalTradePrice .div( model.ParchaseUnitQuentity).toFloat();
                onchange(model);
                model.FormModel.PayablePrice = payablePrice;
            };
            this.Set = function (td, model) {
                td.html(getInput('PayablePrice', 'PayablePrice', onPayablePriceChanged, model));
            };
        }).call(selfService.PayablePrice = {});
        (function () {
            function onchange(model) {
                summaryDiscountChanged();
                model.FormModel.PayablePrice = model.PayablePrice = (model.TotalTradePrice + model.VatTotal - model.DiscountTotal).toFloat();
                checkValidation(model);
            }
            function onDiscountChanged(model) {
                model.Discount = parseFloat(model.FormModel.Discount, 10).toFloat();
                model.FormModel.DiscountTotal = model.DiscountTotal = Math.round(model.TotalTradePrice * model.Discount).div(100).toFloat();
                onchange(model);
            }
            function onDiscountTotalChanged(model) {
                model.DiscountTotal = parseFloat(model.FormModel.DiscountTotal, 10).toFloat();
                if (model.TotalTradePrice)
                    model.FormModel.Discount = model.Discount = Math.round(100 * model.DiscountTotal / model.TotalTradePrice).toFloat();
                else
                    model.FormModel.Discount = model.Discount = 0;
                onchange(model);
            }
            this.Set = function (td, model) {
                td.html(getInput('Discount', 'Discount(%)', onDiscountChanged, model));
                td.append(getInput('DiscountTotal', 'Discount(total)', onDiscountTotalChanged, model));
            };
        }).call(selfService.Discount = {});
        (function () {
            function onchange(model) {
                summaryChanged();
                model.FormModel.PayablePrice = model.PayablePrice = (model.TotalTradePrice + model.VatTotal - model.DiscountTotal).toFloat();
                checkValidation(model);
            }
            function onVatChanged(model) {
                model.Vat = parseFloat(model.FormModel.Vat || '0', 10).toFloat();
                model.FormModel.VatTotal = model.VatTotal = model.TotalTradePrice.mlt(model.Vat).div(100).toFloat();
                onchange(model);
            }
            function onVatTotalChanged(model) {
                model.VatTotal = parseFloat(model.FormModel.VatTotal || '0', 10).toFloat();
                if (model.TotalTradePrice)
                    model.FormModel.Vat = model.Vat = model.VatTotal.mlt(100).div(model.TotalTradePrice).toFloat();
                else
                    model.FormModel.Vat = model.Vat = 0;

                onchange(model);
            }
            this.Set = function (td, model) {
                td.html(getInput('Vat', 'VAT(%)', onVatChanged, model));
                td.append(getInput('VatTotal', 'VAT(total)', onVatTotalChanged, model));
            };
        }).call(selfService.VAT = {});
        (function () {
            function onchange(model) {
                selfService.Changed(model);
            }
            function onSalePriceChanged(model) {
                model.TotalSalePrice = parseFloat(model.FormModel.TotalSalePrice, 10).toFloat();
                if (model.SaleUnitQuentity) {
                    model.FormModel.SUnitSalePrice = model.SUnitSalePrice = model.TotalSalePrice.div(model.SaleUnitQuentity).toFloat();
                    model.FormModel.PUnitSalePrice = model.PUnitSalePrice = model.TotalSalePrice .div( model.ParchaseUnitQuentity).toFloat();
                } else {
                    model.FormModel.SUnitSalePrice = model.SUnitSalePrice = 0;
                    model.FormModel.PUnitSalePrice = model.PUnitSalePrice = 0;
                }
                onchange(model);
            }
            function onTradePriceChanged(model) {
                model.TotalTradePrice = parseFloat(model.FormModel.TotalTradePrice, 10).toFloat();
                if (model.SaleUnitQuentity) {
                    model.FormModel.SUnitTradePrice = model.SUnitTradePrice = model.TotalTradePrice.div(model.SaleUnitQuentity).toFloat();
                    model.FormModel.PUnitTradePrice = model.PUnitTradePrice = model.TotalTradePrice.div(model.ParchaseUnitQuentity).toFloat();
                } else {
                    model.FormModel.SUnitTradePrice = model.SUnitTradePrice = 0;
                    model.FormModel.PUnitTradePrice = model.PUnitTradePrice= 0;
                }
                model.FormModel.PayablePrice = model.PayablePrice = (model.TotalTradePrice + model.VatTotal - model.DiscountTotal).toFloat();
                onchange(model);
            }
            this.Set = function (td, model) {
                td.html(getInput('TotalSalePrice', 'TotalSalePrice', onSalePriceChanged, model));
                td.append(getInput('TotalTradePrice', 'TotalTradePrice', onTradePriceChanged, model));
            };
        }).call(selfService.TotalPrice = {});
        (function () {
            function onchange(model) {
                model.FormModel.TotalTradePrice = model.TotalTradePrice = model.ParchaseUnitQuentity.mlt(model.UnitTradePrice).toFloat();
                model.FormModel.TotalTradePrice = model.TotalTradePrice = model.ParchaseUnitQuentity.mlt(model.UnitTradePrice).toFloat();
                model.FormModel.VatTotal = model.VatTotal = model.TotalTradePrice.mlt(model.Vat).div(100).toFloat();
                selfService.Changed(model);
            }
            function onTradePriceChanged(model) {
                model.SUnitTradePrice = parseFloat(model.FormModel.SUnitTradePrice, 10).toFloat();
                model.FormModel.PUnitTradePrice = model.PUnitTradePrice = model.UnitTradePrice = model.SUnitTradePrice.mlt(model.UnitConversion).toFloat();
                onchange(model);
            }
            function onParchasePriceChanged(model) {
                model.PUnitTradePrice = model.UnitTradePrice = parseFloat(model.FormModel.PUnitTradePrice, 10).toFloat();
                model.FormModel.SUnitTradePrice = model.SUnitTradePrice = model.PUnitTradePrice.div(model.UnitConversion).toFloat();
                onchange(model);
            }
            this.Set = function (td, model) {
                td.html(getInput('SUnitTradePrice', 'Sale Unit Price', onTradePriceChanged, model));
                td.append(getInput('PUnitTradePrice', 'Parchase Unit Price', onParchasePriceChanged, model));
            };
        }).call(selfService.UnitTradePrice = {});
        (function () {
            function onchange(model) {
                model.TotalTradePrice = model.FormModel.TotalTradePrice = model.ParchaseUnitQuentity.mlt(model.UnitTradePrice).toFloat();
                model.TotalSalePrice = model.FormModel.TotalSalePrice = model.ParchaseUnitQuentity .mlt( model.UnitSalePrice).toFloat();
                selfService.Changed(model);
            }
            function onSalePriceChanged(model) {
                model.SUnitSalePrice = parseFloat(model.FormModel.SUnitSalePrice, 10).toFloat();
                model.FormModel.PUnitSalePrice = model.PUnitSalePrice = model.UnitSalePrice = model.SUnitSalePrice.mlt(model.UnitConversion).toFloat();
                onchange(model);
            }
            function onParchasePriceChanged(model) {
                model.PUnitSalePrice = model.UnitSalePrice = parseFloat(model.FormModel.PUnitSalePrice, 10).toFloat();
                model.FormModel.SUnitSalePrice = model.SUnitSalePrice = model.PUnitSalePrice .div( model.UnitConversion).toFloat();
                onchange(model);
            }
            this.Set = function (td, model) {
                td.html(getInput('SUnitSalePrice', 'Sale Unit Price', onSalePriceChanged, model));
                td.append(getInput('PUnitSalePrice', 'Parchase Unit Price', onParchasePriceChanged, model));
            };
        }).call(selfService.UnitSalePrice = {});
        (function () {
            function onchange(model) {
                model.TotalTradePrice = model.FormModel.TotalTradePrice = model.ParchaseUnitQuentity.mlt(model.UnitTradePrice).toFloat();
                model.TotalSalePrice = model.FormModel.TotalSalePrice = model.ParchaseUnitQuentity .mlt( model.UnitSalePrice).toFloat();
                selfService.Changed(model);
            }
            function onSaleQntChanged(model) {
                model.SaleUnitQuentity = parseFloat(model.FormModel.SaleUnitQuentity, 10).toFloat();
                model.FormModel.ParchaseUnitQuentity = model.ParchaseUnitQuentity = model.SaleUnitQuentity.div(model.UnitConversion).toFloat();
                onchange(model);
            }
            function onParchaseQntChanged(model) {
                model.ParchaseUnitQuentity = parseFloat(model.FormModel.ParchaseUnitQuentity, 10).toFloat();
                model.FormModel.SaleUnitQuentity = model.SaleUnitQuentity = model.ParchaseUnitQuentity.mlt(model.UnitConversion).toFloat();
                onchange(model);
            }
            this.Set = function (td, model) {
                td.html(getInput('SaleUnitQuentity', 'Sale Unit Qnt', onSaleQntChanged, model));
                td.append(getInput('ParchaseUnitQuentity', 'Parchase Unit Qnt', onParchaseQntChanged, model));
            };
        }).call(selfService.UnitQuentity = {});
        (function () {
            function onUnitConversionChanged(model) {
                model.UnitConversion = parseFloat(model.FormModel.UnitConversion, 10);
                model.FormModel.ParchaseUnitQuentity = model.ParchaseUnitQuentity = model.SaleUnitQuentity.div( model.UnitConversion).toFloat();
                model.FormModel.PUnitSalePrice = model.PUnitSalePrice = model.UnitSalePrice = model.SUnitSalePrice .mlt( model.UnitConversion).toFloat();
                model.FormModel.PUnitTradePrice = model.PUnitTradePrice = model.UnitTradePrice = model.SUnitTradePrice.mlt(model.UnitConversion).toFloat();
            }
            this.Set = function (td, model) {
                td.html('<div>' + model.SalesUnitType + ' * </div>');
                td.append(getInput('UnitConversion', 'UnitConversion', onUnitConversionChanged, model));
                td.append('<hr/><div>' + model.PurchaseUnitType + '</div>');
            };
        }).call(selfService.Unit = {});
    }).call(service.Grid = {}, function () { });
};