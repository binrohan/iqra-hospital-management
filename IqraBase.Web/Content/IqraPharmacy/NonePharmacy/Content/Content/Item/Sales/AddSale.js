
var Controller = new function () {
    var service = {}, windowModel, formModel = {}, callerOptions, formInputs = {};
    function getData() {
        var items=service.Grid.GetData();
        var model = {
            Items: items.List,
            SuplierId: formModel.SuplierId,
            PaymentType: formModel.PaymentType,
            Discount: formModel.TotalDiscount,
            VAT: formModel.TotalVAT,
            Price: formModel.PayablePrice,
            ChallanDate: formModel.ChallanDate,
            VoucherNo: formModel.VoucherNo,
            ChallanNo: formModel.ChallanNo,
            IsValid: formModel.IsValid && items.IsValid
        };
        return model;
    };
    function save() {
        var model = getData();
        if (model.IsValid) {
            windowModel.View.find('#progress_ba_container').show();
            windowModel.Wait('Please Wait while saving data......');
            windowModel.Image.files[0] && (model.Image = { IsFile: true, File: windowModel.Image.files[0] });
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
        if (formModel.SuplierId) {
            var opts = {
                name: 'PharmacyItem',
                url: '/Content/IqraPharmacy/Pharmacy/Content/Item/ItemListController.js',
                SuplierId: formModel.SuplierId,
                onSaveSuccess: function (list) {
                    service.Grid.AddItems(list);
                }
            };
            Global.Add(opts);
        } else {
            alert('Please select a suplier');
        }
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/Pharmacy/Templates/Sales.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '96%' });
                formInputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.View.find('.btn_add_item').click(onSelectItem);
                Global.Submit(windowModel.View.find('form'), save);
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
    (function () {
        this.Bind = function () {
            Global.AutoComplete.Bind({
                Id: 'SuplierId',
                url: '/Suplier/DropDown',
                type: 'AutoComplete',
                position: 4,
                elm: $(formInputs['SuplierId']).empty()
            });
        }
    }).call(service.Suplier = {});
    (function () {
        var gridModel, dataSource = [], tPrice = 0, tVat = 0, tDiscount=0;
        function up(elm, func, option) {
            elm.keyup(function () {
                func.call(this, option);
            });
            return elm;
        }
        function summaryChanged() {
            tPrice = 0, tVat = 0;
            for (var i = 0; i < dataSource.length; i++) {
                tPrice += dataSource[i].TotalPrice;
                tVat += dataSource[i].VatTotal;
            }
            formModel.PayablePrice = tPrice + tVat - tDiscount;
            formModel.TotalPrice = tPrice;
            formModel.TotalVAT = tVat;
        };
        function summaryDiscountChanged() {
            tDiscount = 0;
            for (var i = 0; i < dataSource.length; i++) {
                tDiscount += dataSource[i].Discount;
            }
            formModel.PayablePrice = tPrice + tVat - tDiscount;
            formModel.TotalDiscount = tDiscount;
        };
        function onPackQuentityChanged(model) {
            model.PackQuentity = parseFloat(model.FormModel.PackQuentity || '0', 10);
            model.FormModel.UnitQuentity = model.UnitQuentity = model.PackQuentity * model.PackSize;
            model.TotalPrice = model.UnitQuentity * (model.UnitPrice || 0);
            model.VatTotal = model.TotalPrice * model.Vat / 100;
            summaryChanged();
        };
        function onUnitQuentityChanged(model) {
            model.UnitQuentity = parseFloat(model.FormModel.UnitQuentity || '0', 10);
            model.FormModel.PackQuentity = model.PackQuentity = model.UnitQuentity / model.PackSize;
            model.TotalPrice = model.UnitQuentity * (model.UnitPrice || 0);
            model.VatTotal = model.TotalPrice * model.Vat / 100;
            summaryChanged();
        };
        function onUnitPriceChanged(model) {
            model.UnitPrice = parseFloat(model.FormModel.UnitPrice || '0', 10);
            model.TotalPrice = model.UnitQuentity * (model.UnitPrice || 0);
            model.VatTotal = model.TotalPrice * model.Vat / 100;
            summaryChanged();
        };
        function onUnitSalePriceChanged(model) {
            model.UnitSalePrice = parseFloat(model.FormModel.UnitSalePrice || '0', 10);
        };
        function onVatChanged(model) {
            model.Vat = parseFloat(model.FormModel.Vat || '0', 10);
            model.VatTotal = model.TotalPrice * model.Vat / 100;
            summaryChanged();
        };
        function onDiscountChanged(model) {
            model.Discount = parseFloat(model.FormModel.Discount || '0', 10);
            summaryDiscountChanged();
        };
        function onRemove(model){
            $(this).closest('tr').remove();
        };
        function rowBound(elm) {
            var td = elm.find('td');
            $(td[3]).html(up($('<input required="" data-binding="PackQuentity" name="PackQuentity" class="form-control" type="text" style="width: calc(100% - 24px);">'), onPackQuentityChanged, this));
            $(td[4]).html(up($('<input required="" data-binding="UnitQuentity" name="UnitQuentity" class="form-control" type="text" style="width: calc(100% - 24px);">'), onUnitQuentityChanged, this));
            $(td[5]).html(up($('<input required="" data-binding="UnitPrice" name="UnitPrice" class="form-control" type="text" style="width: calc(100% - 24px);">'), onUnitPriceChanged, this));
            $(td[7]).html(up($('<input required="" data-binding="UnitSalePrice" name="UnitSalePrice" class="form-control" type="text" style="width: calc(100% - 24px);">'), onUnitSalePriceChanged, this));
            $(td[8]).html(up($('<input required="" data-binding="Vat" name="Vat" class="form-control" type="text" style="width: calc(100% - 24px);">'), onVatChanged, this));
            //$(td[9]).html($('<input required="" data-binding="VatTotal" name="Vat" class="form-control" type="text" style="width: calc(100% - 24px);">'));
            $(td[10]).html(up($('<input required="" data-binding="Discount" name="Discount" class="form-control" type="text" style="width: calc(100% - 24px);">'), onDiscountChanged, this));
            $(td[11]).html(Global.Click($('<button class="btn btn_cancel btn-white btn-default btn-round" type="button"><span class="glyphicon glyphicon-remove"></span> </button>'), onRemove,this));
            var pModel = this.FormModel;
            this.FormModel = {};
            Global.Form.Bind(this.FormModel, elm);
            for (var key in this.FormModel) { if (typeof (this[key]) != 'undefined') this.FormModel[key] = this[key];}
            if (pModel) {
                for (var key in pModel) { this.FormModel[key] = pModel[key]; }
            }
        };
        this.Bind = function () {
            Global.Grid.Bind({
                elm: windowModel.View.find('#item_grid'),
                columns: [{ field: 'Name', title: 'Trade Name' },
                    { field: 'Strength', title: 'Strength', autobind:false },
                    { field: 'PackSize', title: 'Pack Size' },
                    { field: 'PackQuentity', title: 'Pack Quentity', className: 'pack_quentity', autobind: false },
                    { field: 'UnitQuentity', title: 'Unit Quentity', className: 'unit_quentity', autobind: false },
                    { field: 'UnitPrice', title: 'UnitPrice', className: 'unit_price', autobind: false },
                    { field: 'TotalPrice', title: 'TotalPrice' },
                    { field: 'UnitSalePrice', title: 'Unit Sale Price', className: 'unit_sale_price', autobind: false },
                    { field: 'Vat', title: 'VAT(%)', className: 'vat', width: 70, autobind: false },
                    { field: 'VatTotal', title: 'VAT(Total)', className: 'vat' },
                    { field: 'Discount', className: 'discount', autobind: false },
                    { field: 'Action', className: 'action', width:60}],
                dataSource: [],
                dataBinding: function (response) {
                    dataSource = response;
                },
                rowBound: rowBound,
                pagging: false,
                page: { 'PageNumber': 1, 'PageSize': 10 },
                pagger: { showingInfo: ' {0}-{1} of {2} Items ' },
                oncomplete: function (model) {
                    gridModel = model;
                    console.log(model);
                },
                onrequest: function (data) {
                   
                }
            });
        }
        this.AddItems = function (list) {
            list.each(function () {
                gridModel.dataSource.push(this);
                this.VatTotal = this.VatTotal || 0;
                this.TotalPrice = this.TotalPrice || 0;
                this.Discount = this.Discount || 0;
                this.SuplierId = formModel.SuplierId;
            });
            formModel.TotalItems = gridModel.dataSource.length;
            gridModel.Reload();
        };
        this.GetData = function () {
            var list = [];
            gridModel.dataSource.each(function () {
                list.push({
                    ItemId: this.Id,
                    SuplierId: this.SuplierId,
                    PackSize: this.PackSize,
                    PackQuentity: this.PackQuentity,
                    UnitQuentity: this.UnitQuentity,
                    TradePrice: this.UnitPrice,
                    TotalTradePrice: this.TotalPrice,
                    UnitSalePrice: this.UnitSalePrice,
                    Vat: this.Vat,
                    Discount: this.Discount
                });
            });
            return { List: list, IsValid :true};
        };
    }).call(service.Grid = {});
};