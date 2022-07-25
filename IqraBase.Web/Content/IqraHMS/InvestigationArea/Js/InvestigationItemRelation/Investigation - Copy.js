var Controller = {};
(function () {
    var that = this, gridModel, service = {}, accessModel, callarOptions = {},
        model = {}, formModel = {}, filter;
    function onSubmit(formModel, data, model) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onCreatorDetails(model) {
        Global.Add({
            UserId: model.CreatedBy,
            name: 'UserDetails',
            url: '/Areas/EmployeeArea/Content/User/UserDetails.js',
        });
    }
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
        //this.Updator && elm.find('.updator').append('</br><small><small>' + this.UpdatedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
        //this.Creator && elm.find('.creator').append('</br><small><small>' + this.CreatedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
    };
    function setGrid(container) {
        Global.List.Bind({
            Name: 'InvestigationItem',
            Grid: {
                elm: container.find('#grid_container'),
                columns: [
                    { field: 'Investigation', filter: true, click: service.Details.Bind, Add: false },
                    { field: 'Cost', title: 'Cost', add: false, Type: 2 },
                    { field: 'RlnRemarks', title: 'Remarks', filter: true, required: false, position: 4, Add: { type: 'textarea', sibling: 1 } },
                    { field: 'InvRemarks', title: 'Investigation-Remarks', filter: true, Add: false, selected: false },
                    { field: 'RlnCreatedAt', title: 'Relation-Created-At', dateFormat: 'dd mmm-yyyy', Add: false },
                    { field: 'InvCreatedAt', title: 'Investigation-Created-At', dateFormat: 'dd mmm-yyyy', Add: false, selected: false },
                    { field: 'Creator', add: false, filter: true, click: onCreatorDetails }
                ],
                url: '/InvestigationArea/InvestigationItem/GetInvestigations',
                page: { 'PageNumber': 1, 'PageSize': 10, filter: [filter], showingInfo: ' {0}-{1} of {2} Investigations ' },
                //onDataBinding: onDataBinding,
                rowBound: rowBound
            },
            onComplete: function (model) {
                gridModel = model;
            },
            Add: {
                elm: container.find('#btn_add_new_item'),
                onSubmit: callarOptions.onSubmit || onSubmit,
                save: '/InvestigationArea/InvestigationItem/OnSetInvestigation',
                saveChange: '/InvestigationArea/InvestigationItem/Edit',
                dropdownList: callarOptions.drp || [{
                    Id: 'InvestigationId',
                    position: 2,
                    url: '/InvestigationArea/Investigation/AutoComplete',
                    Type: 'AutoComplete'
                }]
            },
            remove: { save: '/InvestigationArea/InvestigationItem/OnRemoveInvestigation' },
            onSuccess: function () {
                if (gridModel) {
                    gridModel.Reload();
                }
            }
        });
        callarOptions.BaseModel.Reload = function () {
            gridModel && gridModel.Reload();
        };
    };
    (function () {
        var filter = { "field": "SuplierId", "value": "", Operation: 0 };

        function onDetails(data) {
            Global.Add({
                title: 'Investigation-Item Details',
                Tabs: [{
                    title: 'Basic Info',
                    Columns: [
                        { field: 'TaxType', title: 'Tax Type' },
                        { field: 'Debit', type: 2 },
                        { field: 'Credit', type: 2 },
                        { field: 'DebitTax', title: 'Tax Expense', type: 2 },
                        { field: 'CreditTax', title: 'Tax Payable', type: 2 },
                        { field: 'Amount', title: 'Amount', type: 2 },
                        { field: 'Date', dateFormat: 'dd/MM/yyyy hh:mm' },
                        { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                        { field: 'Creator' },
                        { field: 'Remarks' }
                    ],
                    model: data,
                    DetailsUrl: function () {
                        return '/AccountantArea/ManualJournal/Details?Id=' + data.Id;
                    }
                }, {
                    title: 'Items',
                    Grid: [{
                        Header: 'Items',
                        filter: [filter],
                        Columns: [
                            { field: 'AccountName', title: 'Account' },
                            { field: 'Debit', type: 2 },
                            { field: 'Credit', type: 2 },
                            { field: 'TaxRate', type: 2 },
                            { field: 'DebitTax', title: 'Tax Expense', type: 2 },
                            { field: 'CreditTax', title: 'Tax Payable', type: 2 },
                            { field: 'Date', dateFormat: 'dd/MM/yyyy hh:mm' },
                            { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                            { field: 'Creator' },
                            { field: 'Description' }
                        ],
                        Url: '/AccountantArea/ManualJournal/GetItems',
                    }],
                }],
                name: 'OnInvestigationItemDetails',
                url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=InvestigationItemDetails',
            });
        };
        this.Bind = function (data) {
            filter.value = data.Id;
            onDetails(data);
        };
    }).call(service.Details = {});
    Controller.Show = function (opt) {
        callarOptions = opt;
        console.log(['callarOptions', opt]);
        opt.BaseModel = opt.BaseModel || {};
        var container = opt.container || $('#page_container');
        filter = filter || opt.filter || [];
        setGrid(container);
        opt.OnLoaded && !service.Loaded && opt.OnLoaded(model);
        service.Loaded = true;
    };
})();