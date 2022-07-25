
(function () {
    function getSummaryClmn() {
        return [
            { field: 'PaidAmount', title: 'Paid-Amount', type: 2 },
            { field: 'Discount', title: 'Discount', type: 2 },
            { field: 'BillAmount', title: 'Bill-Amount', type: 2 },
            { field: 'Balance', title: 'Balance', type: 2, className: 'balance',sorting:false }
        ]
    }
    function getDailyColumns() {
        return [{ field: 'CreatedAt', title: 'Date' }].concat(getSummaryClmn());
    };
    function getTransectionTypeWiseColumns() {
        return [{ field: 'TransectionType', title: 'Transection-Type', filter: true }].concat(getSummaryClmn())
    };
    function getPatientWiseColumns() {
        return [{ field: 'Patient', title: 'Patient', filter: true  }].concat(getSummaryClmn());
    };
    function onDataBinding(response) {
        var data = response.Data.Total;
        formModel.Balance = ((data.PaidAmount||0) + (data.Discount||0) - (data.BillAmount||0)).toMoney();
        response.Data.Data.each(function () {
            this.Balance = this.PaidAmount + this.Discount - this.BillAmount;
        });
    };
    function onRowBound(elm) {
        if (this.Balance < 0) {
            var balance = -this.Balance;
            elm.find('.balance').html('<span style="color:red">' + balance.toMoney()+' ( Due )'+'</span>');
        }
    };
    function getDaily(name,dataUrl, func) {
        func = func || getDailyColumns;
        return {
            Name: name,
            Url: dataUrl || name,
            filter: filters.slice(),
            columns: func(),
            binding: onDataBinding,
            bound: onRowBound
        }
    };
    function getItemWise() {
        return {
            Name: 'Item-Wise',
            Url: 'Get',
            filter: filters.slice(),
            columns: [
                { field: 'Patient', title: 'Patient', filter: true },
                { field: 'TransectionType', title: 'TransectionType', filter: true },
                { field: 'PaidAmount', title: 'PaidAmount', type: 2 },
                { field: 'Discount', title: 'Discount', type: 2 },
                { field: 'BillAmount', title: 'BillAmount', type: 2 },
                { field: 'Balance', title: 'Balance', type: 2, className: 'balance' },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy hh:mm', Add: false },
                { field: 'Creator', title: 'Creator', filter: true },
                { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'IsDeleted', title: 'IsDeleted', Add: false },
                { field: 'Remarks', title: 'Remarks' }
            ],
            isList: true,
            //actions: getAccessButton(),
            binding: function (response) {
                var data = response.Data.Total;
                formModel.Balance = (data.PaidAmount + data.Discount - data.BillAmount).toMoney();
            },
            bound: onRowBound
        }
    };
    function setTemplate() {
        $('#button_container').append('<div class="col-md-2 col-sm-4 col-xs-6">' +
            '<div><label>Balance</label> : <span data-binding="Balance" class="auto_bind" /></div>' +
            '</div>');
    };
    var formModel = {}, filters = Global.Filters().Bind({
        container: $('#filter_container'),
        formModel: formModel,
        type:'ThisMonth',
        onchange: function (filter) {
            console.log([model, filter]);
            if (model && model.gridModel) {
                model.gridModel.page.filter = filter;
                model.gridModel.Reload();
            }
        }
    });
    var model = {
        Base: {
            Url: '/TransectionArea/PatientTransection/',
        },
        items: [
            getDaily('Daily','GetDaily'),
            getDaily('Monthly','GetMonthly'),
            getDaily('TransectionType-Wise', 'TypeWise', getTransectionTypeWiseColumns),
            getDaily('Patient-Wise', 'PatientWise', getPatientWiseColumns),
            getItemWise()
        ],
        Summary: {
            Container: $('#filter_container'),
            Items: [
                { field: 'BillAmount', title: 'Bill-Amount', type: 2 },
                { field: 'PaidAmount', title: 'Paid-Amount', type: 2 },
                { field: 'Discount', title: 'Discount', type: 2 }
            ] 
        }
    };
    Global.Tabs(model);
    setTemplate();
    Global.Form.Bind(formModel, $('#button_container'));
    model.items[0].set(model.items[0]);
})();
                