
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, formModel = {}, gridModel, callerOptions, dprPeriod,
        page = { 'PageNumber': 1, 'PageSize': 500, showingInfo: ' {0}-{1} of {2} Items ', filter: [] };
    function save() {
        windowModel.Wait('Please Wait while saving data......');
        Global.Uploader.upload({
            data: { info: callerOptions.model.model, items: callerOptions.model.list },
            url: '/ProductReturnArea/PurchaseByReturn/AddNew',
            onProgress: function (data) {
                //console.log(data);
            },
            onComplete: function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    close(callerOptions.onSaveSuccess);
                } else if (response.Id === -4) {
                    alert('This voucher is already returned.')
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
    function close(func) {
        windowModel && windowModel.Hide(func);
    };
    function setSummaryTemplate(view) {
        inputs = Global.Form.Bind(formModel, view.View);
    };
    function populateSummary() {
        Global.Copy(formModel, callerOptions.model.formModel, true);
    };
    this.Show = function (model) {
        callerOptions = model;
        console.log(model);
        if (windowModel) {
            windowModel.Show();
            service.Grid.Bind();
        } else {
            Global.LoadTemplate(callerOptions.template||'/Content/IqraPharmacy/ProductReturnArea/Templates/ReturnByItemPreview.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                setSummaryTemplate(windowModel);
                Global.Click(windowModel.View.find('.btn_cancel'), close, noop);
                windowModel.View.find('.btn_save').click(save);
                windowModel.Show();
                service.Grid.Bind();
                formModel.title = 'Return Preview';
                formModel.QuentityTitle = 'Returned Items'
            }, noop);
        }
    };
    (function () {
        var counterId;
        function rowBound(elm) {
            //elm.find('.required_quantity').html(this.OrderedQuentity + '*' + this.UnitConversion);
        };
        function onDataBinding(response) {

        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('.preview_grid'),
                columns: [
                    { field: 'Name', filter: true },
                    { field: 'Strength', filter: true },
                    { field: 'Category', filter: true },
                    { field: 'Suplier', filter: true },
                    { field: 'ReturnQnt', title: 'Returned Qnt', className: 'returned_quantity', autobind: false },
                    { field: 'ReturnAmount', title: 'Returned Amount' }
                ],
                dataSource: callerOptions.model.previewList,
                page: page,
                dataBinding: onDataBinding,
                rowBound: rowBound,
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
            if (gridModel) {
                gridModel.dataSource = callerOptions.model.previewList;
                gridModel.Reload();
            } else {
                Global.Grid.Bind(getOptions());
            }
            populateSummary();
        };
    }).call(service.Grid = {});
};