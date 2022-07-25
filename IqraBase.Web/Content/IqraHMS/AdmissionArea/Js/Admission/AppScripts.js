(function () {
    var service = {};
    (function () {
        accessModel && accessModel.Data && accessModel.Data.each(function () {
            accessModel[this.Name] = true;
        });
    })();
    function onCreatorDetails(model) {
        Global.Add({
            UserId: model.CreatedBy,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function getAccessButton() {
        var list = [{
            click: onPrint,
            html: '<a style="margin-right:8px;" titler="Print"><i class="fa fa-print" aria-hidden="true"></i></a>'
        }];
        if (accessModel.ResendMail) {
            list.push({
                click: onResend,
                html: '<a style="margin-right:8px;" titler="Resend Mail"><i class="fa fa-envelope" aria-hidden="true"></i></a>'
            });
        };
        if (accessModel.SetStatus) {
            list.push({
                click: onApprove,
                html: '<a style="margin-right:8px;" titler="Approve"><span class="glyphicon glyphicon-ok"></span></a>'
            });
            list.push({
                click: onReject,
                html: '<a style="margin-right:8px;" titler="Reject"><span class="glyphicon glyphicon-remove"></span></a>'
            });
        };
        if (accessModel.Cancel) {
            list.push({
                click: onRemove,
                html: '<span class="icon_container btn_approve" titler="Cancel"><span class="glyphicon glyphicon-open"></span></span>'
            });
        };
        if (!accessModel.Addnew) {
            $('#btn_add_new').remove();
        };
        console.log(['list', list, accessModel.Delete, accessModel.Approve]);
        return list;
    };
    function getItemColumns() {
        return AppComponent.Admission.Columns();
    };
    function getDailyColumns() {
        return [
            { field: 'CreatedAt', title: 'Date' },
            { field: 'AdmissionCharge', title: 'Fees', type: 2 },
            { field: 'Advance', type: 2 }
        ];
    };
    function onDataBinding(response) {
        response.Data.Data.each(function () {

        });
    };
    function onAdmittedRequest(page) {
        page.filter = page.filter.where('itm=>itm.field != "Status" && itm.field != "' + page.Id + '"');
        page.filter.push({ field: 'Status', value: 'Admitted', Operation: 12 });
    };
    function onDischargedRequest(page) {
        page.filter = page.filter.where('itm=>itm.field!="Status"');

        page.filter.push({ field: 'Status', value: 'Discharged', Operation: 12 });
    };
    function getDaily(id, title, name, onrequest, columns) {
        columns = columns || getItemColumns();
        return {
            Id: id,
            Name: name,
            title: title,
            Url: 'Get',
            //filter: filter ? { field: 'Status', value: filter, Operation: 13 }:none,
            columns: columns,
            binding: onDataBinding,
            onrequest: onrequest,
            Printable: {

            },
        }
    };
    var model = {}, formModel = {};
    model = service.Model = {
        container: $('#page_container'),
        Base: {
            Url: '/AdmissionArea/Admission/',
        },
        items: [
            getDaily('D058E2AA-3AE6-4E89-AF25-0D52AB44FCA7', 'All Admissions','all_admissions'),
            getDaily('4B8B7E90-65D1-4A4C-A82D-8A6AA7E984EA', 'Released Patients', 'released_patients', onDischargedRequest),
            getDaily('7A236C93-A55B-4B92-A3FB-F2D726B039C9', 'Active Patients', 'admitted_patients', onAdmittedRequest),
        ],
        periodic: {
            container: '.filter_container',
            format:'yyyy/MM/dd HH:mm'
        },
        Summary: {
            Container: '.filter_container',
            Items: getDailyColumns().slice(1)
        }
    };
    Global.Tabs(model);
    model.items[2].set(model.items[2]);
    (function () {
        function onAdd() {
            Global.Add({
                name: 'AddOrder',
                url: '/Content/IqraPharmacy/ProductOrderArea/Content/AddOrder.js',
                onSaveSuccess: function () {
                    model.gridModel && model.gridModel.Reload();
                }
            });
        };
        function onAddByRequired() {
            Global.Add({
                name: 'AddByRequiredItem',
                url: '/Content/IqraPharmacy/ProductOrderArea/Content/RequiredItem/ReportBase.js',
                onSaveSuccess: function () {
                    model.gridModel && model.gridModel.Reload();
                }
            });
        };
        Global.Click($('#btn_add_new'), onAdd);
        Global.Click($('#btn_add_by_required_item'), onAddByRequired);
    })();
})();

