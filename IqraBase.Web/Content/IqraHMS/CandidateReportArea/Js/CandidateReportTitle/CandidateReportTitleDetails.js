var Controller = new function () {
    var callarOptions, service = {}, filter = { "field": "TitleId", title: 'Customer', "value": "", Operation: 0 };

    this.Show = function (model) {
        callarOptions = model;
        filter.value = model.TitleId;
        filter.printValue = model.Customer;
        Global.Add({
            title: 'Category Details',
            selected: callarOptions.selected === 0 ? 0 : 1,
            Tabs: [
                {
                    title: 'Basic Info',
                    Columns: [
                        { field: 'Name', title: 'Name', filter: true },
                        { field: 'IsMedical', title: 'Is Medical?', required: false, add: { type: 'checkbox' } },
                        { field: 'Remarks', filter: true, required: false, add: { type: 'textarea', sibling: 1 } },
                        { field: 'IsDeleted', title: 'IsDeleted', Add: false },
                        { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy hh:mm', Add: false },
                        { field: 'Creator', title: 'Creator', filter: true },
                    ],
                    DetailsUrl: function () {
                        return '/CandidateReportArea/CandidateReportCategory/Details?Id=' + callarOptions.TitleId;
                    }
                },
                {
                    title: 'Titles',
                    Grid: [{
                        Id: '84B26D84-EC66-4790-9F4D-F10D38A24ED9',
                        Header: 'Titles',
                        filter: [filter],
                        columns: AppComponent.CandidateReportItem.Columns(),
                        url: '/CandidateReportArea/CandidateReportItem/Get',
                        onDataBinding: function (response) {

                        },
                        buttons: [{
                            click: (tab) => {
                                console.log(['tab', tab]);
                                AppComponent.CandidateReportItem.AddDone({
                                    onSubmit: (postModel, data) => {
                                        postModel.TitleId = callarOptions.TitleId;
                                    },
                                    onSaveSuccess: () => {
                                        tab.Grid.Model.Reload()
                                    }
                                });
                            },
                            html: '<a class="btn btn-default btn-round btn_add_print pull-right" style="margin-left:10px;"><span class="glyphicon glyphicon-plus"></span> Add Title </a>'
                        }],
                        Printable: {
                            container: $('.saasaaaaaa')
                        }
                    }],
                }
            ],
            name: 'OnCandidateReportTitles',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=CandidateReportTitles',
        });
    };
};