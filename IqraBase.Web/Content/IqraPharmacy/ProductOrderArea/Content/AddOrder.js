
var Controller = new function () {
    var service = {}, windowModel, formModel = {}, callerOptions, gridModel, formInputs = {}, dataCache = {};
    var typeFilter = { field: 'i.TypeId', value: OrderTypeId, Operation: 0 };
    function getData() {
        var items = service.Grid.GetData();
        var model = {
            Type:ItemType,
            Items: items.List,
            SuplierId: formModel.SuplierId,
            SuplierEmail: formModel.SuplierEmail,
            OrderedQuentity: formModel.TotalItems,
            TotalTradePrice: formModel.TotalPrice,
            TotalPayablePrice: formModel.PayablePrice,
            TotalSalePrice: formModel.TotalMRPPrice,
            IsValid: formModel.IsValid && items.IsValid,
            msg: items.msg
        };
        if (parseFloat(formModel.TotalPrice)>0) {
            model.Vat = parseFloat(formModel.TotalVAT) * 100 / parseFloat(formModel.TotalPrice);
            model.Discount = parseFloat(formModel.TotalDiscount) * 100 / parseFloat(formModel.TotalPrice);
        } else {
            model.Vat = 0;
            model.Discount = 0;
        }
        return model;
    };
    function save() {
        var model = getData();
        if (model.IsValid) {
            //windowModel.View.find('#progress_ba_container').show();
            windowModel.Wait('Please Wait while saving data......');
            //windowModel.Image.files[0] && (model.Image = { IsFile: true, File: windowModel.Image.files[0] });
            Global.Uploader.upload({
                data: model,
                url: '/Order/AddNew',
                onProgress: function (data) {
                    //console.log(data);
                },
                onComplete: function (response) {
                    windowModel.Free();
                    if (!response.IsError) {
                        //windowModel.View.find('#progress_ba_container #myBar').css({ width: 0 + '%' });
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
            alert('Validation Errors');
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
    function onSelectItem() {
        var opts = {
            name: 'PharmacyItem',
            url: '/Content/IqraPharmacy/ProductOrderArea/Content/ItemListController.js',
            SuplierId: formModel.SuplierId,
            ItemType:ItemType,
            onSaveSuccess: function (list) {
                var newList = [];
                list.each(function () {
                    newList.push(Global.Copy({},this,true));
                });
                service.Grid.AddItems(newList);
            }
        };
        Global.Add(opts);
    };
    function clearItems() {
        service.Grid.Clear();
    };
    this.Show = function (model) {
        callerOptions = model;
        dataCache = {};
        if (windowModel) {
            windowModel.Show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ProductOrderArea/Templates/AddOrder.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '99%' });
                formInputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.View.find('.btn_add_item').click(onSelectItem);
                windowModel.View.find('.btn_clear_item').click(clearItems);
                Global.Click(windowModel.View.find('.btn_save'), save);
                windowModel.Image = $('#btn_image').change(readURL)[0];
                windowModel.Show();
                service.Grid.Bind();
                service.Suplier.Bind();
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
    (function (none) {
        var filter = { "field": "SuplierId", "value": "", Operation: 0 };
        this.Bind = function () {
            Global.AutoComplete.Bind({
                Id: 'SuplierId',
                url: autoComplete,//'/SuplierArea/Suplier/AutoCompleteWithEmail',
                type: 'AutoComplete',
                position: 4,
                onDataBinding: function (response) {
                    response.Data = response.Data.Data;
                },
                change: function (item) {
                    if (item) {
                        gridModel && (gridModel.page.filter = [typeFilter,filter]);
                        filter.value = item.Id;
                        formModel.SuplierEmail = item.Email;
                        formModel.SuplierId = item.Id;
                    } else {
                        gridModel && (gridModel.page.filter = [typeFilter]);
                        formModel.SuplierEmail = none;
                        formModel.SuplierId = none;
                    }
                    gridModel&&gridModel.Reload();
                },
                elm: $(formInputs['SuplierId']).empty()
            });
        }
    }).call(service.Suplier = {});
    (function () {
        var dataSource = [], tPrice = 0, tVat = 0, tDiscount = 0,tmrpPrice=0;
        function up(elm, func, option) {
            elm.keyup(function () {
                func.call(this, option);
            }).focus(function () { $(this).select(); });
            return elm;
        }
        function summaryChanged() {
            tPrice = 0, tVat = 0, tmrpPrice=0;
            for (var i = 0; i < dataSource.length; i++) {
                tPrice += dataSource[i].TotalPrice;
                tVat += dataSource[i].VatTotal;
                tmrpPrice += dataSource[i].TotalMRPPrice;
            }
            formModel.PayablePrice = (tPrice + tVat - tDiscount).toFloat();
            formModel.TotalPrice = tPrice.toFloat();
            formModel.TotalVAT = tVat.toFloat();
            formModel.TotalMRPPrice = tmrpPrice.toFloat();
        };
        function summaryDiscountChanged() {
            tDiscount = 0;
            for (var i = 0; i < dataSource.length; i++) {
                tDiscount += dataSource[i].TotalDiscount;
            }
            formModel.PayablePrice = (tPrice + tVat - tDiscount).toFloat();
            formModel.TotalDiscount = tDiscount.toFloat();
        };
        function onOrderedQuentityChanged(model) {
            model.OrderedQuentity = parseFloat(model.FormModel.OrderedQuentity || '0', 10);
            model.TotalPrice = (model.OrderedQuentity * (model.UnitTPrice || 0)).toFloat();
            model.TotalMRPPrice = model.OrderedQuentity * (model.UnitMRPPrice || 0);
            model.VatTotal = model.TotalPrice * model.VAT / 100;
            summaryChanged();
            onDiscountChanged(model);
        };
        function onUnitPriceChanged(model) {
            model.UnitPrice = parseFloat(model.FormModel.UnitPrice || '0', 10);
            model.TotalPrice = (model.OrderedQuentity * (model.UnitPrice || 0)).toFloat();
            model.VatTotal = model.TotalPrice * model.VAT / 100;
            summaryChanged();
        };
        function onVATChanged(model) {
            model.VAT = parseFloat(model.FormModel.VAT || '0', 10);
            //model.TotalPrice = model.UnitQuentity * (model.UnitPrice || 0);
            //model.TotalPrice = model.OrderedQuentity * (model.UnitTPrice || 0);
            model.VatTotal = model.TotalPrice * model.VAT / 100;
            summaryChanged();
        };
        function onDiscountChanged(model) {
            model.Discount = parseFloat(model.FormModel.Discount || '0', 10);
            model.TotalDiscount = model.TotalPrice * model.Discount / 100
            summaryDiscountChanged();
        };
        function setIndex() {
            gridModel.Body.view.find('tr').each(function (i) {
                var model = $(this).data('model');
                model.Index = i + 1;
            });
        }
        function onRemove(model) {
            var list = [], i = 1;
            //console.log(dataSource);
            dataSource.each(function () {
                if (model.Id != this.Id) {
                    list.push(this);
                }
            });
            dataSource = list;
            formModel.TotalItems = dataSource.length;
            //console.log(dataSource);
            $(this).closest('tr').remove();
            setIndex();
            summaryChanged();
            summaryDiscountChanged();
        };
        function rowBound(elm) {
            var td = elm.find('td'),index=1;
            $(td[index+8]).html(up($('<input required="" data-binding="OrderedQuentity" name="OrderedQuentity" class="form-control" type="text" style="width: calc(100% - 12px);" autocomplete="off">'), onOrderedQuentityChanged, this));
            //$(td[7]).html(up($('<input required="" data-binding="UnitPrice" name="UnitPrice" class="form-control" type="text" style="width: calc(100% - 12px);" autocomplete="off">'), onUnitPriceChanged, this));
            $(td[index+11]).html(up($('<input required="" data-binding="VAT" name="VAT" class="form-control" type="text" style="width: calc(100% - 12px);" autocomplete="off">'), onVATChanged, this));
            $(td[index + 12]).html(up($('<input required="" data-binding="Discount" name="Discount" class="form-control" type="text" style="width: calc(100% - 12px);" autocomplete="off">'), onDiscountChanged, this));
            var pModel = this.FormModel;
            this.FormModel = {};
            Global.Form.Bind(this.FormModel, elm);
            for (var key in this.FormModel) { if (typeof (this[key]) != 'undefined') this.FormModel[key] = this[key]; }
            if (pModel) {
                for (var key in pModel) { this.FormModel[key] = pModel[key]; }
            }
            //console.log(this);
        };
        this.Bind = function () {
            Global.Grid.Bind({
                elm: windowModel.View.find('#item_grid'),
                columns: [{ field: 'Index', title: 'Sr', sorting: false,width:30 },
                    { field: 'Name', title: 'Trade Name', filter: true },
                    { field: 'Category', title: 'Category', filter: true },
                    { field: 'Suplier', filter: true,width:200 },
                    { field: 'Strength', title: 'Strength', width: 80,filter:true },
                    { field: 'TotalStock', title: 'Stock', width: 60 },
                    { field: 'SoldDaysForParchaseRequired', title: 'Days', width: 60 },
                    { field: 'SoldQuentity', title: 'Sold', width: 60,sorting: false, },
                    { field: 'PurchaseUnitType', title: 'PUnit', width: 70 },
                    { field: 'OrderedQuentity', title: 'OrderedQnty', sorting: false, className: 'ordered_quentity', autobind: false, width: 80 },
                    { field: 'UnitTPriceStr', actionField: 'UnitTPrice', width: 80, title: 'TPPrice', className: 'unit_price', autobind: false },
                    { field: 'UnitMRPPriceStr', actionField: 'UnitMRPPrice', width: 80, title: 'MRPPrice', className: 'unit_price', autobind: false },
                    { field: 'VAT', width: 70, className: 'vat', autobind: false },
                    { field: 'Discount', width: 80, className: 'discount', sorting: false, autobind: false },
                    { field: 'TotalPrice', title: 'TotalPrice', width: 70, sorting: false },
                    { field: 'delete', title: 'Action', width: 70, click: onRemove }],
                url: '/Order/GetRequired',
                dataBinding: function (response) {
                    //response.Data.Data = response.Data;
                    console.log(dataCache);
                    response.Data.Data.each(function (i) {
                        //if (this.Vat !== this.PurchaseDiscount) {
                        //    this.UnitTradePrice = this.UnitTradePrice * 100 / (100 + this.Vat - this.PurchaseDiscount);
                        //}

                        this.UnitTradePrice = this.UnitPurchasePrice;
                        this.SoldQuentity = this.SoldQuentity / this.UnitConversion;
                        this.TotalStock = this.TotalStock / this.UnitConversion;

                        if (dataCache[this.Id]) {
                            var dd = dataCache[this.Id];
                            this.OrderedQuentity = dd.OrderedQuentity;
                            this.VAT = dd.VAT;
                            this.Discount = dd.Discount;
                        } else {
                            this.OrderedQuentity = this.SoldQuentity - this.TotalStock;
                            this.VAT = (this.Vat == -1 ? this.DefaultVat : this.Vat);
                            this.Discount = (this.PurchaseDiscount == -1 ? this.DefaultPurchaseDiscount : this.PurchaseDiscount);
                        }

                        this.UnitTPrice = (this.UnitTradePrice || 0) * this.UnitConversion;
                        this.UnitMRPPrice = (this.UnitSalePrice || 0) * this.UnitConversion;
                        this.UnitTPriceStr = this.UnitTPrice.toFloat();
                        this.UnitMRPPriceStr = this.UnitMRPPrice.toFloat();
                        this.TotalPrice = (this.OrderedQuentity * (this.UnitTPrice || 0)).toFloat();
                        this.TotalMRPPrice = this.OrderedQuentity * (this.UnitMRPPrice || 0);
                        this.VatTotal = this.TotalPrice * this.VAT / 100;
                        this.TotalDiscount = this.TotalPrice * this.Discount / 100;
                        
                        dataCache[this.Id] = this;
                        this.delete = 'Delete';
                        this.Index = i + 1;
                    });
                    dataSource = response.Data.Data;
                    summaryChanged();
                    summaryDiscountChanged();
                    formModel.TotalItems = dataSource.length;
                },
                rowBound: rowBound,
                //pagging: false,
                page: { 'PageNumber': 1, 'PageSize': 10, filter: [typeFilter] },
                pagger: { showingInfo: ' {0}-{1} of {2} Items ' },
                oncomplete: function (model) {
                    gridModel = model;
                },
                onrequest: function (data) {

                },
                Printable: false
            });
        }
        this.Clear = function () {

            if (gridModel) {
                tPrice = 0;
                tVat = 0;
                tDiscount = 0;
                tmrpPrice = 0;
                dataSource = [];
                formModel.TotalItems = 0;
                gridModel.Body.view.empty();
                summaryChanged();
                summaryDiscountChanged();
            }
        };
        this.AddItems = function (list) {
            var dataObj = {};
            dataSource.each(function () {
                dataObj[this.Id] = true;
            });
            var dup = [];
            list.each(function () {
                if (dataObj[this.Id]) {
                    dup.push(this);
                    return;
                }
                this.VAT = this.VAT || this.Vat || 0;
                this.Discount = this.PurchaseDiscount || 0;
                this.PurchaseDiscount = this.PurchaseDiscount || 0;
                //if (this.VAT !== this.PurchaseDiscount) {
                //    this.UnitTradePrice = this.UnitTradePrice * 100 / (100 + this.VAT - this.PurchaseDiscount);
                //}
                this.UnitTradePrice = this.UnitPurchasePrice;

                this.SoldQuentity = this.SoldQuentity / this.UnitConversion;
                this.TotalStock = this.TotalStock / this.UnitConversion;
                this.OrderedQuentity = this.SoldQuentity - this.TotalStock;
                this.UnitTPrice = (this.UnitTradePrice || 0) * this.UnitConversion;
                this.UnitMRPPrice = (this.UnitSalePrice || 0) * this.UnitConversion;
                this.TotalPrice = (this.OrderedQuentity * (this.UnitTPrice || 0)).toFloat();
                this.TotalMRPPrice = this.OrderedQuentity * (this.UnitMRPPrice || 0);
                this.VatTotal = this.TotalPrice * this.VAT / 100;
                this.UnitPrice = this.UnitPrice || 0;
                this.UnitTPriceStr = this.UnitTPrice.toFloat();
                this.UnitMRPPriceStr = this.UnitMRPPrice.toFloat();
                this.TotalDiscount = this.TotalPrice * this.Discount / 100;
                this.delete = 'Delete';
                gridModel.Add(this);
                dataSource.push(this);
            });
            setIndex();
            summaryChanged();
            summaryDiscountChanged();
            formModel.TotalItems = dataSource.length;
            if (dup.length) {
                alert(dup.length+' Items was duplicated.But we did not add the duplicate elements.')
            }
        };
        this.GetData = function () {
            var list = [],isValid=true,msg='';
            dataSource.each(function () {
                var totalPrice = this.OrderedQuentity .mlt( this.UnitTPrice),
                     totalSPrice = this.OrderedQuentity .mlt( this.UnitMRPPrice);
                list.push({
                    ItemId: this.Id,
                    Name: this.Name,
                    Strength: this.Strength,
                    Category: this.Category,
                    TotalStock: this.TotalStock,
                    CalculatedDays: this.SoldDaysForParchaseRequired,
                    CalculatedQuentity: this.SoldQuentity,
                    OrderedQuentity: this.OrderedQuentity,
                    UnitTradePrice: this.UnitTPrice,
                    UnitPurchasePrice:this.UnitPurchasePrice,
                    UnitSalePrice: this.UnitMRPPrice,
                    Vat: this.VAT,
                    Discount: this.Discount,
                    DefaultVat: (this.Vat == -1 ? this.DefaultVat : this.Vat),
                    DefaultDiscount: (this.PurchaseDiscount == -1 ? this.DefaultPurchaseDiscount : this.PurchaseDiscount),
                    TotalTradePrice: totalPrice + (totalPrice.mlt(this.VAT) - totalPrice.mlt(this.Discount)).div(100),
                    TotalSalePrice: totalSPrice,
                    PurchaseUnitTypeId: this.PurchaseUnitTypeId,
                    SalesUnitTypeId: this.SalesUnitTypeId,
                    UnitConversion: this.UnitConversion,
                    Position: this.Index
                });
                if(this.OrderedQuentity<=0){
                    isValid = false;
                    msg = 'Ordered Quentity must be greater than 0.'
                }
            });
            if (list.length < 1) {
                isValid = false;
                msg = 'Please select at least one item and the proceed'
            }
            return { List: list, IsValid: isValid, msg: msg };
        };
    }).call(service.Grid = {});
};