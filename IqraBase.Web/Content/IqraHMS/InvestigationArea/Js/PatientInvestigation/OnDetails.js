var Controller = new function () {
    var callarOptions, service = {},
        filter = { "field": "PatientInvestigationId", "value": "", Operation: 0 }, gridModel;
    function getView() {
        return $(`<div><div id="summary_container" class="row">
                                        </div>
                                        <div id="filter_container" class="row">
                                        </div>
                                        <div style="margin-top:10px;">
                                            <div id="button_container" class="empty_style button_container row">
                                            </div>
                                            <div id="grid_container">
                                            </div>
                                        </div></div>`);
    };
    function onSampleCollect(model) {
        Global.Controller.Call({
            url: IqraConfig.Url.Js.WarningController,
            functionName: 'Show',
            options: {
                name: 'Warning',
                Message: 'Are you sure, the sample is collected?',
                Save: '/InvestigationArea/SampleCollection/SampleCollectedAt',
                data: { Id: model.Id },
                onsavesuccess: function (response) {
                    gridModel.Reload();
                }
            }
        });
    };
    function onStatusChange(model) {
        //Global.Add({
        //    model: model,
        //    name: 'SampleCollection',
        //    url: '/InvestigationArea/PathologistInvestigationStatus/ChangeStatus',
        //    onSaveSuccess: function () {
        //        alert('Released Successfully');
        //        gridModel.Reload();
        //    }
        //});

        Global.Controller.Call({
            url: IqraConfig.Url.Js.WarningController,
            functionName: 'Show',
            options: {
                name: 'Warning',
                Message: 'Are you sure,This Investigation is Done ?',
                Save: '/InvestigationArea/PathologistInvestigationStatus/ChangeStatus',
                data: { Id: model.Id },
                onsavesuccess: function (response) {
                    gridModel.Reload();
                }
            }
        });
    };
    function onListBillCancel(model) {
        if (model && model.Status == DefinedString.InvestigationStatus.BillCanceled) {
            alert('This Bill is Already Canceled.');
            return;
        } else {
            Global.Controller.Call({
                url: IqraConfig.Url.Js.WarningController,
                functionName: 'Show',
                options: {
                    name: 'Warning',
                    Message: 'Are you sure,Cancel This Bill ?',
                    Save: '/InvestigationArea/PatientInvestigationList/ListBillCancel',
                    data: { Id: model.Id },
                    onsavesuccess: function (response) {
                        gridModel.Reload();
                    }
                }
            }); }
    };
    function onPrintBarcode(model) {
        Global.Add({
            type: 'Duplicate',
            PatientInvestigationId: model.Id,
            name: 'InvoicePrintPreview',
            url: '/Content/IqraHMS/BillingArea/Js/InvestigationInvoice/PrintInvestigationInvoiceBarcodeSticker.js',
        });
    };
    function getTab(title, caller) {
        return {
            title: title,
            Grid: [function (windowModel, container, position, model, func) {
                caller(container, model);
            }],
        }
    };
    this.Show = function (model) {
        callarOptions = model;
        filter.value = callarOptions.PatientInvestigationId;
        Global.Add({
            title: 'Patient Investigation Details',
            model: model.model,
            Tabs: [
                getTab('Investigations', service.Investigations.Bind),
                {
                    title: 'Basic Info',
                    Columns: [
                            { field: 'Code', title: 'Code', filter: true },
                            { field: 'BillNo', title: 'BillNo', filter: true },
                            { field: 'Status', title: 'Status', filter: true },
                            { field: 'Patient', title: 'Patient', filter: true },
                            { field: 'Sample', title: 'Sample', filter: true },
                            { field: 'TotalItem', title: 'Total-Item' },
                            { field: 'TotalAmount', title: 'Total-Amount', type: 2 },
                            { field: 'DiscountPercentage', title: 'Discount(%)', type: 2 },
                            { field: 'DiscountTaka', title: 'Total-Discount', type: 2 },
                            { field: 'DiscountType', title: 'Discounte-Type', filter: true },
                            { field: 'Vat', title: 'Vat', type: 2},
                            { field: 'DiscountedAmount', title: 'Net-Amount', type: 2 },
                            { field: 'PaidAmount', title: 'Paid', type: 2 },
                            { field: 'DueAmount', title: 'Due', type: 2, className: 'due' },
                            { field: 'Doctor', title: 'Doctor', filter: true },
                            { field: 'ReferencedBy', title: 'ReferencedBy', filter: true },
                            { field: 'SampleCollected', title: 'Sample-Collected' },
                            { field: 'DeliveryDate', title: 'Delivery-Date', dateFormat: 'dd mmm-yyyy hh:mm' },
                            { field: 'DeliveredAt', title: 'Delivered-At', dateFormat: 'dd mmm-yyyy hh:mm' },
                            { field: 'DiscountedRemarks', title: 'Discounted-Remarks', filter: true },
                            { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy hh:mm' },
                            { field: 'Creator', title: 'Creator', filter: true },
                            { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy hh:mm' },
                            { field: 'IsDeleted', title: 'IsDeleted' },
                            { field: 'Remarks', title: 'Remarks' }
                    ],
                    model: model.model,
                    Id: callarOptions.PatientInvestigationId,
                    DetailsUrl: function () {
                        return '/InvestigationArea/PatientInvestigation/Details?Id=' + callarOptions.PatientInvestigationId;
                    }
                }
            ],
            name: 'OnPatientInvestigationDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=PatientInvestigationDetails',
        });
    };
    (function () {
        var tabModel = {}, view = getView();
        function deliver(data) {
            Global.Add({
                InvestigationId: data.Id,
                name: 'onMakeDelivered',
                url: '/Content/IqraHMS/InvestigationArea/Js/PatientInvestigation/MakeDelivered.js',
                onSaveSuccess: function () {
                    gridModel.Reload();
                }
            });
        };
        function rowBound(elm) {
            if (callarOptions.type == 'Delivered' && this.Status == 'Delivered') {
                elm.find('.btn_make_it_delivered').remove();
            }
        };
        function getButtons() {
            if (callarOptions.type == 'SampleCollection') {
                return [ {
                    click: onSampleCollect,
                    html: '<a style="margin-right:8px;"  class="icon_container" title="Sample Collected"><span class="glyphicon glyphicon-file"></span></a>'
                }, {
                    click: onPrintBarcode,
                    html: '<a style="margin-right:8px;"  class="icon_container" title="Sticker-Print"><span class="glyphicon glyphicon-print"></span></a>'
                }]
            } else if (callarOptions.type == 'Pathologist') {
                return [{
                    click: onStatusChange,
                    html: '<a style="margin-right:8px;"  class="icon_container" title="Investigation Done"><span class="glyphicon glyphicon-ok"></span></a>'
                }]
            } else if (callarOptions.type == 'Delivered') {
                return [{
                    click: deliver,
                    html: '<a style="margin-right:8px;"  class="icon_container btn_make_it_delivered" title="Investigation Done"><span class="glyphicon glyphicon-ok"></span></a>'
                }]
            }else {
                return [{
                    click: onListBillCancel,
                    html: '<a style="margin-right:8px;" id="btn_bill_cancel" class="icon_container" title="Bill Cancel"><span class="glyphicon glyphicon-remove"></span></a>'
                }]
            }
        };
        this.Bind = function (container, model) {
            container.append(view);
            model.Reload = function () {
                Global.List.Bind({
                    Name: 'PatientInvestigationItem',
                    Grid: {
                        elm: view.find('#grid_container'),
                        columns: [
                            { field: 'Code', title: 'Code', filter: true },
                            { field: 'Investigation', title: 'Name', filter: true },
                            { field: 'Patient', filter: true },
                            { field: 'Doctor', filter: true },
                            { field: 'Cost', type: 2 },
                            { field: 'Status', filter: true },
                            { field: 'DeliveryDate', title: 'Delivery-Date', dateFormat: 'dd/MM/yyyy hh:mm' },
                            { field: 'SampleCollectedAt', title: 'Sample-Collected-At', dateFormat: 'dd/MM/yyyy hh:mm' },
                            { field: 'DeliveredAt', title: 'Delivered-At', dateFormat: 'dd/MM/yyyy hh:mm' },
                            { field: 'Creator', filter: true },
                            { field: 'CreatedAt', title: 'Created At', dateFormat: 'dd/MM/yyyy hh:mm' },
                            { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                            { field: 'Remarks', filter: true },
                            { field: 'IsDeleted' },
                        ],
                        url: callarOptions.dataUrl || '/InvestigationArea/PatientInvestigationList/Get',
                        page: { 'PageNumber': 1, 'PageSize': 30, showingInfo: ' {0}-{1} of {2} Items ', filter: [filter] },
                        rowBound: rowBound,
                        actions: getButtons(),
                        Printable: false
                    },
                    onComplete: function (model) {
                        gridModel = model;
                    },
                    Add: false,
                    Edit: false,
                    remove: false
                });
                model.Reload = function () {
                    gridModel && gridModel.Reload();
                };
            };
        };
    }).call(service.Investigations = {});

};