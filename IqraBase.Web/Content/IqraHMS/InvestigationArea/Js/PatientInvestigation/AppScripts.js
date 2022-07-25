
(function () {
    var type = ['', 'Doctor Discount', 'Referral Discount', 'Hospital Discount', 'Applicable for All'];
    var model, formModel = {};
    function printInvoice(model) {
        Global.Add({
            type: 'Duplicate',
            PatientInvestigationId: model.Id,
            name: 'InvoicePrintPreview',
            url: '/Content/IqraHMS/BillingArea/Js/InvestigationInvoice/PrintInvestigationInvoice.js',
        });
    };
    function duePayment(data) {
        Global.Add({
            InvestigationId: data.Id,
            name: 'onDuePayment',
            url: '/Content/IqraHMS/InvestigationArea/Js/PatientInvestigation/DuePayment.js',
            onSaveSuccess: function () {
                alert('Payment Successfully');
                model.gridModel.Reload();
            }
        });
    };

    function onBillCancel(model) {
        if (model && model.Status == DefinedString.InvestigationStatus.BillCanceled) {
            alert('This Investigation is Already Canceled.');
            return;
        } else if (model && model.Status != DefinedString.InvestigationStatus.Waiting) {
            alert('This Investigation can not be Canceled(' + model.Status + ').');
            return;
        } else {
            Global.Controller.Call({
                url: IqraConfig.Url.Js.WarningController,
                functionName: 'Show',
                options: {
                    name: 'Warning',
                    Message: 'Are you sure,Cancel This Bill ?',
                    Save: '/InvestigationArea/PatientInvestigation/BillCancel',
                    data: { Id: model.Id },
                    onsavesuccess: function (response) {
                        model.gridModel && model.gridModel.Reload();
                    }
                }
            });
        }


        
    };
    function deliver(data) {
        Global.Add({
            InvestigationId: data.Id,
            name: 'onMakeDelivered',
            url: '/Content/IqraHMS/InvestigationArea/Js/PatientInvestigation/MakeDelivered.js',
            onSaveSuccess: function () {
                alert('Payment Successfully');
                model.gridModel.Reload();
            }
        });
    };
    function getSummaryClmn() {
        return [
            { field: 'TotalAmount', title: 'Total-Amount', type: 2 },
            { field: 'DiscountTaka', title: 'Total-Discount', type: 2 },
            { field: 'DiscountedAmount', title: 'Payable-Amount', type: 2 },
            { field: 'PaidAmount', title: 'Paid-Amount', type: 2 },
            { field: 'DueAmount', title: 'Due-Amount', type: 2, className: 'due' }
        ]
    }
    function getDailyColumns() {
        return [{ field: 'CreatedAt', title: 'Date' }].concat(getSummaryClmn());
    };
    function getDoctorWiseColumns() {
        return [{ field: 'Doctor', title: 'Doctor', filter: true }].concat(getSummaryClmn())
    };
    function getReferenceWiseColumns() {
        return [{ field: 'ReferencedBy', title: 'ReferencedBy', filter: true  }].concat(getSummaryClmn());
    };
    function onDataBinding(response) {
        response.Data.Data.each(function () {
            if (this.DeliveryDate === "/Date(253402279199997)/") {
                this.DeliveryDate = 'N/A';
            } if (this.DeliveredAt === "/Date(253402279199997)/") {
                this.DeliveredAt = 'Not Yet';
            }
            this.DiscountType = type[this.DiscountType]||'';
        });
    };
    function onRowBound(elm) {
        //if (this.Balance < 0) {
        //    var balance = -this.Balance;
        //    elm.find('.balance').html('<span style="color:red">' + balance.toMoney()+' ( Due )'+'</span>');
        //}
    };
    function onPatientDetails(model) {
        Global.Add({
            PatientId: model.PatientId,
            name: 'PatientDetails',
            url: '/Content/IqraHMS/PatientArea/Js/Patient/PatientDetails.js',
        });
    };
    function onDetails(model) {
        Global.Add({
            name: 'PatientInvestigationDetails',
            url: '/Content/IqraHMS/InvestigationArea/Js/PatientInvestigation/OnDetails.js',
            PatientInvestigationId: model.Id,
            model: model
        });
    };
    function getDaily(name,dataUrl, func) {
        func = func || getDailyColumns;
        return {
            Name: name,
            Url: dataUrl || name,
            columns: func(),
            //binding: onDataBinding,
            bound: onRowBound
        }
    };
    function getItemWise() {
        return {
            Name: 'Item-Wise',
            Url: 'Get',
            columns: [
                { field: 'Code', title: 'Code', filter: true, click: onDetails },
                { field: 'BillNo', title: 'BillNo', filter: true },
                { field: 'Status', title: 'Status', filter: true },
                { field: 'Patient', title: 'Patient', filter: true, click: onPatientDetails },
                { field: 'Sample', title: 'Sample', filter: true, selected: false },
                { field: 'TotalItem', title: 'Total-Item', selected: false },
                { field: 'TotalAmount', title: 'Total-Amount', type: 2 },
                { field: 'DiscountPercentage', title: 'Discount(%)', type: 2, selected: false },
                { field: 'DiscountTaka', title: 'Total-Discount', type: 2 },
                { field: 'DiscountType', title: 'Discounte-Type', filter: true, selected: false },
                { field: 'Vat', title: 'Vat', type: 2, selected: false },
                { field: 'DiscountedAmount', title: 'Net-Amount', type: 2 },
                { field: 'PaidAmount', title: 'Paid', type: 2 },
                { field: 'DueAmount', title: 'Due', type: 2, className: 'due' },
                { field: 'Doctor', title: 'Doctor', filter: true },
                { field: 'ReferencedBy', title: 'ReferencedBy', filter: true },
                { field: 'SampleCollected', title: 'Sample-Collected' ,selected:false },
                { field: 'DeliveryDate', title: 'Delivery-Date', dateFormat: 'dd mmm-yyyy hh:mm' },
                { field: 'DeliveredAt', title: 'Delivered-At', dateFormat: 'dd mmm-yyyy hh:mm' },
                { field: 'DiscountedRemarks', title: 'Discounted-Remarks', filter: true, selected: false },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy hh:mm', Add: false },
                { field: 'Creator', title: 'Creator', filter: true },
                { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'IsDeleted', title: 'IsDeleted', Add: false },
                { field: 'Remarks', title: 'Remarks', filter: true }
            ],
            isList: true,
            actions: [{
                click: duePayment,
                html: '<a style="margin-right:8px;" class="icon_container btn_due_payment" title="Due Payment"><span class="glyphicon glyphicon-plus"></span></a>'
            }, {
                click: deliver,
                html: '<a style="margin-right:8px;" class="icon_container btn_due_deliver" title="Make Delivered"><span class="glyphicon glyphicon-file"></span></a>'
            }, {
                click: printInvoice,
                html: '<a style="margin-right:8px;" class="icon_container btn_print_invoice" title="Re-Print Invoice"><span class="glyphicon glyphicon-print"></span></a>'
                }, {
                    click: onBillCancel,
                html: '<a style="margin-right:8px;" class="icon_container btn_bill_cancel" title="Bill Cancel"><span class="glyphicon glyphicon-remove"></span></a>'
                }],
            binding: onDataBinding,
            bound: function (elm) {
                console.log(['this, elm', this, elm, this.DueAmount, this.DueAmount <= 0]);
                if (this.Status != DefinedString.InvestigationStatus.Done) {
                    elm.find('.btn_due_deliver').remove();
                }
                if (this.DueAmount <= 0) {
                    elm.find('.btn_due_payment').remove();
                }
                if (this.Status != DefinedString.InvestigationStatus.Waiting) {
                    elm.find('.btn_bill_cancel').remove();
                }
                if (this.Status == DefinedString.InvestigationStatus.BillCanceled) {
                    elm.find('.btn_print_invoice').remove();
                }
                if (this.Status === 'Delivered') {
                    elm.find('#btn_due_deliver').remove();
                }
            }
        }
    };
    model = {
        Base: {
            Url: '/InvestigationArea/PatientInvestigation/',
        },
        items: [
            getDaily('Daily','GetDaily'),
            getDaily('Monthly','GetMonthly'),
            getDaily('Doctor-Wise', 'DoctorWise', getDoctorWiseColumns),
            getDaily('Reference-Wise', 'ReferenceWise', getReferenceWiseColumns),
            getItemWise()
        ],
        Periodic: {
            container: $('#filter_container'),
            formModel: formModel,
            type: 'ThisMonth',
        },
        Summary: {
            Container: $('#summary_container'),
            Items: getSummaryClmn()
        }
    };
    Global.Tabs(model);
    model.items[4].set(model.items[4]);
    (function () {
        Global.Click($('#btn_add_new'), function () {
            Global.Add({
                name: 'AddInvestigation',
                url: '/Content/IqraHMS/InvestigationArea/Js/PatientInvestigation/Create.js',
                onSaveSuccess: function () {
                    alert('Created Successfully');
                    model.gridModel && model.gridModel.Reload();
                }
            });
        });
        Global.Click($('#btn_add_new_none'), function () {
            Global.Add({
                name: 'AddInvestigation',
                url: '/Content/IqraHMS/InvestigationArea/Js/PatientInvestigation/CreateForNonePatient.js',
                onSaveSuccess: function () {
                    alert('Created Successfully');
                    model.gridModel && model.gridModel.Reload();
                }
            });
        });
    })();
})();

//(function printInvoice(id) {
//    Global.Add({
//        type: 'New',
//        PatientInvestigationId: id,
//        name: 'InvoicePrintPreview',
//        url: '/Content/IqraHMS/BillingArea/Js/InvestigationInvoice/PrintInvestigationInvoice.js',
//    });
//})('34415BE7-D9E7-4D6E-ADD2-2ABA6642B608');
                