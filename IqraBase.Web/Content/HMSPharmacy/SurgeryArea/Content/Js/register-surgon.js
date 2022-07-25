

var Controller = new function () {
    var service = {}, windowModel, dataSource = [], selected = {}, callerOptions, gridModel, added = {},
        filter = { "field": "OperartionId", "value": "", "Operation": 13 };
    function registerSurgon(model, grid) {
        Global.Add({
            name: 'OnAddSurgon',
            title: 'Add Surgon',
            model: {...model, Id: null},
            columns: [
                { field: 'Name', title: 'Name', required: false },
                { field: 'Charge', title: 'Charge',  },
                { field: 'Remarks', title: 'Remarks', add: {sibling: 1}}
            ],
            onSubmit: function (formModel) {
                formModel.SurgeryId = callerOptions.surgeryId;
                formModel.DoctorId = model.Id;
                formModel.ActivityId = window.ActivityId;
            },
            onSaveSuccess: function (reponse) {
                grid.Reload();
                callerOptions.onSaveSuccess(reponse);
            },
            SaveChange: '/SurgeryArea/Surgon/Create'
        });
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
        filter.value = '00000000-0000-0000-0000-000000000000';
        callerOptions = model;
        if (windowModel) {
            show(callerOptions);
        } else {
            Global.LoadTemplate('/Content/HMSPharmacy/SurgeryArea/Templates/RegisterSurgon.html', function (response) {
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
                    { field: 'Name', filter: true, Click: onSurgonDetails },
                    { field: 'BMDCNo', title: 'BMDC Number', filter: true },
                    { field: 'DoctorTitle', title: 'Title', filter: true },
                    { field: 'Department', title: 'Department', filter: true },
                    { field: 'Designation', title: 'Designation', filter: true },
                    { field: 'Phone', title: 'Phone', filter: true },
                ],
                url: '/SurgeryArea/Surgon/ExceptGetAll',
                page: { 'PageNumber': 1, 'PageSize': 10},
                Action: {
                    title: {
                        items: IqraConfig.Grid.Pagger.PageSize,
                        selected: IqraConfig.Grid.Pagger.Selected,
                        showingInfo: '{0}-{1} of {2} Items'
                    },
                    items: [{
                        click: registerSurgon,
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
                    page.Id = callerOptions.surgeryId
                }
            });
        };
    }).call(service.Grid = {});
};