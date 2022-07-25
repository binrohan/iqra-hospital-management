var Controller = new function () {
    var callarOptions, service = {}, filter = { "field": "InvestigationId", "value": "", Operation: 0 };
    function getView() {
        return $(`<div><div id="summary_container" class="row">
                                        </div>
                                        <div id="filter_container" class="row">
                                        </div>
                                        <div style="margin-top:10px;">
                                            <div id="button_container" class="empty_style button_container row">
                                                <a href="#" class="btn btn-white btn-success btn-round pull-right" id="btn_add_new_report_category" style="margin-left: 1%"><span class="glyphicon glyphicon-plus"></span>New</a>
                                            </div>
                                            <div id="grid_container">
                                            </div>
                                        </div></div>`);
    };
    function onRemoveItem() {

    };
    this.Show = function (model) {
        callarOptions = model;
        filter.value = model.InvestigationId;
        Global.Add({
            title: 'Investigation',
            OnChange: model.OnChange,
            Tabs: [
                {
                    title: 'Basic Info',
                    Columns: [
                        { field: 'Name', title: 'Test Name', filter: true, position: 4, Add: { sibling: 3 } },
                        { field: 'InvestigationCategory', title: 'Category', filter: true, Add: false, position: 1 },
                        { field: 'Room', title: 'Room', filter: true, Add: false, position: 3 },
                        { field: 'Cost', title: 'Cost', position: 9, Type: 2, Add: { sibling: 3, dataType: 'float' } },
                        { field: 'MaxDiscount', title: 'Max Discount', position: 9, Type: 2, required: false, selected: false, Add: { sibling: 3, dataType: 'float|null' } },
                        { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false, selected: false },
                        { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false, selected: false },
                        { field: 'Creator', add: false, filter: true },
                        { field: 'Remarks', title: 'Remarks', filter: true, required: false, Add: { type: 'textarea', sibling: 1 } }
                    ],
                    DetailsUrl: function () {
                        return '/InvestigationArea/Investigation/Details?Id=' + callarOptions.InvestigationId;
                    }
                },
                {
                    title: 'Items',
                    Grid: [{
                        Header: 'Items',
                        filter: [filter, { "field": "IsDeleted", "value": 0, "Operation": 0 }],
                        Columns: AppComponent.InvestigationItem.Columns(false, true),
                        Url: '/InvestigationArea/InvestigationItem/Get',
                        actions: [{
                            click: onRemoveItem,
                            html: '<span class="icon_container btn_delete" title="Remove" style="margin: 0px 10px; cursor: pointer;"><span class="glyphicon glyphicon-trash"></span></span>'
                        }],
                        buttons: [{
                            click: (tab) => {
                                AppComponent.InvestigationItem.AddDone({
                                    onsavesuccess: () => {
                                        tab.Grid.Model.Reload();
                                    },
                                    onSubmit: (postData) => {
                                        postData.InvestigationId = callarOptions.InvestigationId;
                                    }
                                });
                            },
                            html: '<a class="btn btn-white btn-default btn-round pull-right margin-l-5"><span class="glyphicon glyphicon-plus"></span>New</a>'
                        }, {
                            click: (tab) => {
                                    var grid = tab.Grid.Model, data = grid.response.Data.Data.filter((itm) => itm.IsSelected);
                                console.log(['data >=', data, grid]);
                                if (data.length) {
                                    Global.Add({
                                        columns:[],
                                        save: '/InvestigationArea/InvestigationItem/SetCategory',
                                        onsavesuccess: () => {
                                            tab.Grid.Model.Reload();
                                        },
                                        onSubmit: function (postModel) {
                                            postModel.ItemId = data.map((item) => item.Id);
                                            console.log([postModel]);
                                        },
                                        dropdownList: [{
                                            Id: 'CategoryId',
                                            position: 1,
                                            url: function () {
                                                return '/InvestigationArea/InvestigationReportCategory/AutoComplete'
                                            },
                                            Type: 'AutoComplete',
                                            textField:'Title'
                                        }],

                                    });
                                } else {
                                    alert('Please select items');
                                }
                                },
                                html: '<a class="btn btn-white btn-default btn-round pull-right margin-l-5"><span class="glyphicon glyphicon-list"></span>Add Category</a>'
                            }, {
                                click: (tab) => {
                                    var grid = tab.Grid.Model, data = grid.response.Data.Data.filter((itm) => itm.IsSelected);
                                    console.log(['data >=', data, grid]);
                                    if (data.length) {
                                        Global.Add({
                                            columns: [],
                                            save: '/InvestigationArea/InvestigationItem/SetGroup',
                                            onsavesuccess: () => {
                                                tab.Grid.Model.Reload();
                                            },
                                            onSubmit: function (postModel) {
                                                postModel.ItemId = data.map((item) => item.Id);
                                            },
                                            dropdownList: [{
                                                Id: 'GroupId',
                                                position: 1,
                                                url: function () {
                                                    return '/InvestigationArea/InvestigationReportGroup/AutoComplete'
                                                },
                                                Type: 'AutoComplete',
                                                textField: 'Title'
                                            }],

                                        });
                                    } else {
                                        alert('Please select items');
                                    }
                                },
                                html: '<a class="btn btn-white btn-default btn-round pull-right margin-l-5"><span class="glyphicon glyphicon-list"></span>Add Group</a>'
                            }]
                    }],
                },
            ],
            name: 'OnInvestigationDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=InvestigationDetails',
        });
    };
};