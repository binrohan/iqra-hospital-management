

var Controller = new function () {
    var service = {}, windowModel, dataSource = [], selected = {}, callerOptions, gridModel, added = {},
        filter = { "field": "OperartionId", "value": "", "Operation": 13 };
    function onAddSurgon(model,grid) {
        
    };
    function close() {
        //dataSource = [];
        windowModel && windowModel.Hide();
    };
    function show(options) {
        var model;
        added = {};
        windowModel.Show();
        gridModel && gridModel.Reload();
    };
    this.Show = function (model) {
        filter.value = "'" + model.OperartionId+"'";
        callerOptions = model;
        if (windowModel) {
            show(callerOptions);
        } else {
            Global.LoadTemplate('/Content/HMSPharmacy/OperationArea/Templates/CreateOperation.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '90%' });
                windowModel.View.find('.btn_cancel').click(close);
                show(callerOptions);
                service.Grid.Bind();
            }, noop);
        }
    };
    (function () {
        function onSurgonDetails(model) {
            Global.Add({
                SurgonId: model.SurgonId,
                name: 'SurgonDetails',
                url: '/Areas/SurgonArea/Content/Surgon/SurgonDetails.js',
            });
        };
        this.Bind = function () {
            Global.Grid.Bind({
                elm: windowModel.View.find('#item_selector_grid'),
                columns: [
                    { field: 'Code', filter: true },
                    { field: 'Name', title: 'Surgery Name', filter: true },
                    { field: 'Price', title: 'Charge', filter: true, add:{dataType: 'float' }, type: 2},
                ],
                url: '/PatientArea/Patient/Get',
                page: { 'PageNumber': 1, 'PageSize': 10},
                Action: {
                    title: {
                        items: IqraConfig.Grid.Pagger.PageSize,
                        selected: IqraConfig.Grid.Pagger.Selected,
                        showingInfo: '{0}-{1} of {2} Items'
                    },
                    items: [{
                        click: onAddSurgon,
                        html: '<a style="margin-right:8px;" class="icon_container" title="Add This Surgon"><span class="glyphicon glyphicon-plus"></span> Add</a>'
                    }],
                    className: 'action'
                },
                //pagger: { showingInfo: '{0}-{1} of {2} Items' },
                oncomplete: function (model) {
                    gridModel = model;
                },
                Printable: false,
                onrequest: (page) => {
                   page.filter.push({ "field": "IsDeleted", "value": 0, "Operation": 0 });
                }
            });
        };
    }).call(service.Grid = {});
};