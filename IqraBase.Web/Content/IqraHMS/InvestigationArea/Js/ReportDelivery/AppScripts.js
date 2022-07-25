
(function () {
    var that = this, gridModel, isSearched;
    function onPatientDetails(model) {
        Global.Add({
            PatientId: model.PatientId,
            name: 'PatientDetails',
            url: '/Content/IqraHMS/PatientArea/Js/Patient/PatientDetails.js',
        });
    };
    function onPatientInvestigatioDetails(model) {
        Global.Add({
            name: 'PatientInvestigationDetails',
            url: '/Content/IqraHMS/InvestigationArea/Js/PatientInvestigation/OnDetails.js',
            PatientInvestigationId: model.PatientInvestigationId,
            type:'Delivered',
            model: {}
        });
    };
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    function onDataBinding(response) {
        if (isSearched && response.Data.Data.length == 1) {
            var model = response.Data.Data[0];
            if (model.Status == 'Delivered') {
                alert('This Report is already delivered.');
            } else if (model.Status != 'Done') {
                alert('This Report is not ready yet.');
            } else if (model.DueAmount >0) {
                alert('Due Payment.');
            } else {
                //Global.CallServer('/InvestigationArea/ReportDelivery/ReportDeliveryStatus?Id=' + model.Id, function (response) {
                //    if (!response.IsError) {
                //        alert('Success.');
                //        gridModel.Reload();
                //    } else {
                //        Global.Error.Show(response, {});
                //    }
                //}, function (response) {
                //    response.Id = -8;
                //    Global.Error.Show(response, {});
                //}, null, 'Get');
            }
        }
        isSearched = false;
    };
    Global.List.Bind({
        Name: 'Sample Collection',
        Grid: {
            elm: $('#grid'),
            columns: [//
                { field: 'Code', title: 'Code', filter: true, click: onPatientInvestigatioDetails},
                { field: 'BillNo', title: 'BillNo', filter: true },
                { field: 'Patient', title: 'Patient', filter: true, click: onPatientDetails },
                { field: 'DiscountedAmount', title: 'Amount to Pay', filter: true },
                { field: 'PaidAmount', title: 'Paid', filter: true },
                { field: 'DueAmount', title: 'Due', filter: false },
                { field: 'Status', title: 'Status', filter: false },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'Remarks', title: 'Remarks', required: false, sorting: false }

            ],
            Actions: [],
            url: '/InvestigationArea/PatientInvestigationList/ReadytoDeliverInvList',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Samples ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: false,
        Edit: false,
        remove: false
    });

    (function () {
        function search(txt) {
            isSearched = true;
            gridModel.page.filter = [];
            if (gridModel) {
                if (txt) {
                    gridModel.page.filter.push({ "field": "Code", "value": txt, Operation: 0 });
                }
                gridModel.Reload();
            }
        };
        $('#txt_search').keyup(function (e, i) {
            console.log(['e.keyCode===13', e.keyCode, e.keyCode === 13]);
            if (e.keyCode === 13) {
                search(this.value);
            }
        });
    })();
})();;
