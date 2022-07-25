
(function () {
    var that = this, gridModel;
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }

    };
    function getDate(date) {
        return '<br/><small><small>' + date.getDate().format('dd/MM/yyyy hh:mm') +
            '</small></small>';
    };
    function onDataBinding(response) {
        response.Data.Data.each(function () {
            
        });
    };
    function onRowBound(elm) {
        elm.find('.creator').append(getDate(this.CreatedAt));
    };
    Global.List.Bind({
        Name: 'PaymentType',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', filter: true, position: 1, },
                { field: 'Account', filter: true, add: false },
                { field: 'Group', filter: true, add: false },
                { field: 'IsDefault', Add: { type: 'checkbox' }, position: 4, add: false },
                { field: 'Description', required: false, Add: { type: 'textarea', sibling: 1 }, position: 5 },
                { field: 'Creator', filter: true, className: 'creator', Add: false },
            ],
            url: '/AccountantArea/PaymentType/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Payment Types ' },
            onDataBinding: onDataBinding,
            rowbound: onRowBound
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: {
            onSubmit: onSubmit,
            save: '/AccountantArea/PaymentType/Create',
            saveChange: '/AccountantArea/PaymentType/Edit',
            dropdownList: [
            {
                Id: 'Group',
                position: 3,
                dataSource: [
                    { value: 'Cash', text: 'Cash' },
                    { value: 'Card', text: 'Card' },
                    { value: 'EPayment', text: 'EPayment' }
                ]
            },
            {
                Id: 'AccountId',
                position: 2,
                url: '/AccountantArea/AppAccount/AutoCompleteByCategory?code=1',
                Type: 'AutoComplete'
            }
            ]
        },
        remove: { save: '/AccountantArea/PaymentType/Delete' }
    });
})();
