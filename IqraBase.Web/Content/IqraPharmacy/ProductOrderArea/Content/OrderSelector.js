
var Controller = new function () {
    var service = {}, windowModel, callerOptions, selectedModel, gridModel;
    function save() {
        if (selectedModel) {
            callerOptions.onSaveSuccess(selectedModel);
            close();
        } else {
            alert('Please select an order');
        }
    }
    function close() {
        windowModel && windowModel.Hide();
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ProductOrderArea/Templates/OrderSelector.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '99%' });
                windowModel.View.find('.btn_cancel').click(close);
                Global.Submit(windowModel.View.find('form'), save);
                windowModel.Show();
                service.Grid.Bind();
            }, noop);
        }
    };
    (function (none) {
        var selectedElm, status = ['Not Received Yet', 'Received', 'Received But Changed', ''];
        var filters = typeof window.ItemType == 'undefined' ? [] : [{ field: 'ord.Type', value: ItemType, Operation: 0 }];
        function onSelect(model) {
            if (selectedModel) {
                selectedModel.Selected = false;
                selectedElm.removeClass('i-state-selected');
            }
            selectedModel = model;
            selectedElm = $(this);

            selectedModel.Selected = true;
            selectedElm.addClass('i-state-selected');
        }
        function rowBound(elm) {
            var data = this;
            Global.Click(elm, onSelect, this);
            elm.dblclick(function () {
                selectedModel = data;
                save();
            });
        };
        function onDataBinding(response) {
            console.log(response);
            response.Data.Data.each(function () {
                this.StatusValue = this.Status;
                this.Status = status[this.Status];
            });
        };
        this.Bind = function () {
            Global.List.Bind({
                Name: 'Order',
                Grid: {
                    elm: windowModel.View.find('#order_selector_grid'),
                    columns: [
                        { field: 'Voucher', filter: true },
                        { field: 'Suplier', filter: true, width: 150 },
                        { field: 'SuplierEmail', title: 'Email', filter: true },
                        { field: 'Creator', filter: true },
                        { field: 'Status', width: 100 },
                        { field: 'OrderedQuentity', title: 'Qty', width: 60 },
                        { field: 'Vat', width: 80 },
                        { field: 'Discount', width: 80 },
                        { field: 'TotalTradePrice', title: 'Price', width: 80 },
                        { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' }
                    ],
                    action: { width: 80 },
                    url: '/Order/ToPurchase',
                    page: { 'PageNumber': 1, 'PageSize': 10, filter: filters, showingInfo: ' {0}-{1} of {2} Orders ' },
                    onDataBinding: onDataBinding,
                    rowBound: rowBound,
                    Printable: false
                }, onComplete: function (model) {
                    gridModel = model;
                }, Add: false, Edit: false,
                remove: false,
                Printable: false
            });
        }
        this.Reload = function (list) {
            if (gridModel) {
                gridModel.Reload();
            }
        }
    }).call(service.Grid = {});
};