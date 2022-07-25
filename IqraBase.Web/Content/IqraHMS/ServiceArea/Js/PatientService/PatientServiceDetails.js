var Controller = new function () {
    var callarOptions, service = {},
        filter = { "field": "AdmissionId", title: 'Customer', "value": "", Operation: 0 };

    function onAddPayment(model) {
        Global.Add({
            CustomerId: callarOptions.CustomerId,
            OnSuccess: function (response) {
                model.Grid.Model.Reload();
                callarOptions.OnChange && callarOptions.OnChange(response);
            },
            name: 'OnAddInventoryDuePayment',
            url: '/Content/IqraPharmacy/InventoryArea/Content/InventoryDuePayment/AddNew.js',
        });
    };

    this.Show = function (model) {
        callarOptions = model;
        filter.value = model.AdmissionId;

        Global.Add({
            title: 'Admission Details',
            selected: callarOptions.selected || 1,
            Tabs: [
                {
                    title: 'Basic Info',
                    Columns: [
                        { field: 'CustomerId', filter: true, position: 1 },
                        { field: 'Name', filter: true, position: 3 },
                        { field: 'Sex', filter: true, Add: false },
                        { field: 'Address1', filter: true, required: false, position: 20, Add: { type: 'textarea' } },
                        { field: 'CellPhone', filter: true, position: 5 },
                        { field: 'Discount', position: 4, filter: true },
                        { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                        { field: 'Creator', required: false, filter: true, Add: false },
                        { field: 'Address2', required: false, title: 'Permanent Address', position: 21, Add: { type: 'textarea' } },
                        { field: 'PostCode', required: false, title: '', position: 9 },
                        { field: 'PostOffice', required: false, title: '', position: 10 },
                        { field: 'Thana', title: '', required: false, position: 11 },
                        { field: 'Zilla', title: '', required: false, position: 12 },
                        { field: 'LandPhone', title: '', required: false, position: 6 }
                    ],
                    DetailsUrl: function () {
                        return '/CustomerArea/Customer/Details?Id=' + callarOptions.CustomerId;
                    }
                },
                {
                    title: 'History',
                    Grid: [{
                        Id: '89B0399C-2C50-4175-B6EB-CB727B0ABEBF',
                        Header: 'Payments',
                        filter: [filter],
                        elm: $('#grid'),
                        columns: [
                            { field: 'Customer', filter: true },
                            { field: 'Relation', filter: true },
                            { field: 'TotalAmount', title: 'Total Due', type: 2 },
                            { field: 'PaidAmount', title: 'PaidAmount', type: 2 },
                            { field: 'DueAmount', type: 2, title: 'Due After Payment' },
                            { field: 'ChangeAmount', title: 'Changes', type: 2 },
                            { field: 'Remarks', filter: true, selected: false },
                            { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                            { field: 'Creator', required: false, filter: true, className: 'creator' }
                        ],
                        url: '/CustomerArea/CustomerDueHistory/Get',
                        onDataBinding: function (response) {

                        },
                        summary: {
                            items: [
                                { field: 'ChangeAmount', title: 'Changes', type: 2 },
                                //{ field: 'Due', type: 2 },
                            ]
                        },
                        periodic: {
                            container: '.summary_container',
                        },
                        Printable: {
                            reportTitle: function (model) {
                                return 'Customer Payment Report';
                            }
                        }
                    }],
                }
            ],
            name: 'OnAdmissionDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=AdmissionDetails',
        });
    };
};