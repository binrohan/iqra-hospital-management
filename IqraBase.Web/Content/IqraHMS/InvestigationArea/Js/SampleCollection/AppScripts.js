
(function () {
    var isSearched;
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function printInvoice(model) {
        Global.Add({
            type: 'Duplicate',
            PatientInvestigationId: model.Id,
            name: 'InvoicePrintPreview',
            url: '/Content/IqraHMS/BillingArea/Js/InvestigationInvoice/PrintInvestigationInvoiceBarcodeSticker.js',
        });
    };
    function onSampleCollect(model) {
        if (model && model.PatientType == DefinedString.PatientType.InPatient) {
            alert('This patient is already admitted.');
            return;
        }
        Global.Add({
            model: model,
            name: 'AddRoomAllocation',
            url: '/Content/IqraHMS/PatientArea/Js/Patient/AddRoomAllocationCreate.js',
            onSaveSuccess: function () {
                alert('Admitted Successfully');
                gridModel.Reload();
            }
        });
    };
    function onDetails(model) {
        Global.Add({
            name: 'PatientInvestigationDetails',
            url: '/Content/IqraHMS/InvestigationArea/Js/PatientInvestigation/OnDetails.js',
            PatientInvestigationId: model.Id,
            model: model,
            type:'SampleCollection'
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
            onDetails(response.Data.Data[0]);
        }
        response.Data.Total = response.Data.Total.Total;
        isSearched = false;
    };
    function onPatientDetails(model) {
        Global.Add({
            PatientId: model.PatientId,
            name: 'PatientDetails',
            url: '/Content/IqraHMS/PatientArea/Js/Patient/PatientDetails.js',
        });
    };
    function onDoctorDetails(model) {
        Global.Add({
            DoctorId: model.DoctorId,
            name: 'DoctorDetails',
            url: '/Content/IqraHMS/DoctorsArea/Js/Doctor/DoctorDetails.js',
        });
    };
    var that = this, gridModel;
    
    Global.List.Bind({
        Name: 'Sample Collection',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Code', title: 'Code', filter: true, click: onDetails  },
                { field: 'BillNo', title: 'BillNo', filter: true },
                { field: 'Patient', title: 'Patient', filter: true, click: onPatientDetails },
                { field: 'Doctor', title: 'Doctor', filter: true, click: onDoctorDetails },
                { field: 'Sample', title: 'Sample', filter: false },
                { field: 'Status', title: 'Status', filter: false },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'Remarks', title: 'Remarks', required: false, sorting: false }
            ],
            Actions: [
            //    {
            //    click: onSampleCollect,
            //    html: '<a style="margin-right:8px;" class="icon_container" title="Sample Collection"><span class="glyphicon glyphicon-open"></span></a>'
                //}, 
                //{
                //    click: printInvoice,
                //    html: '<a style="margin-right:8px;" class="icon_container" title="Sticker-Print"><span class="glyphicon glyphicon-print"></span></a>'
                //}
            ],
            url: '/InvestigationArea/PatientInvestigation/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Investigations ' },
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
                if (txt)
                {
                    gridModel.page.filter.push({ "field": "Code", "value": txt, Operation: 0 });
                }
                gridModel.Reload();
            }
        };
        $('#txt_search').keyup(function (e, i) {
            console.log(['e.keyCode===13', e.keyCode, e.keyCode === 13]);
            if (e.keyCode===13) {
                search(this.value);
            }
        });
    })();
})();;
