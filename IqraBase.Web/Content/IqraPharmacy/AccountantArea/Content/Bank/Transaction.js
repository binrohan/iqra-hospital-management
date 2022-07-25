
(function () {
    var that = this, gridModel, service = {}, formModel = {}, date = new Date(),
        from = { field: 'CreatedAt', value: "'" + date.format('yyyy/MM/dd') + ' 00:00' + "'", Operation: 2 },
        to = { field: 'CreatedAt', value: "'" + new Date(date.setDate(new Date().getDate() + 1)).format('yyyy/MM/dd') + ' 00:00' + "'", Operation: 3 };
    function getTypeFileter() {
        return {
            DropDown: {
                dataSource: [
                    { text: 'Select Type', value: '' },
                    { text: 'Deposit', value: '1' },
                    { text: 'Withdraw', value: '0' }
                ]
            }
        };
    };
    function onDataBinding(response) {
        //{"Total":6,"Deposit":51000,"Withdraw":36000}
        formModel.Deposit = (response.Data.Total.Deposit || 0).toMoney(4);
        formModel.Withdraw = (response.Data.Total.Withdraw || 0).toMoney(4);
        formModel.Balance = (response.Data.Total.Deposit - response.Data.Total.Withdraw).toMoney(4);
        response.Data.Total = response.Data.Total.Total;
        response.Data.Data.each(function () {
            this.Amount = this.Amount.toMoney();
            this.IsDeposit = this.IsDeposit ? "Deposit" : 'Withdraw';
        });
    };
    function onRowBound(elm) {
        if (!this.IsEditable) {
            elm.find('.icon_container').remove();
        }
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    function getColumns(){
        return [
                { field: 'Account', filter: true, add: false },
                { field: 'Amount', add: { dataType: 'float', sibling: 3 }, position: 2 },
                { field: 'CheckNumber', filter: true,required:false, add: { sibling: 3 }, position: 3 },
                { field: 'IsDeposit', add: false, filter: getTypeFileter() },
                { field: 'Descroption', filter: true, required: false, add: { type: 'textarea', sibling: 1 }, position: 10 }
        ]
    };
    function addTransaction(isDeposit,name){
        Global.Add({
            Name: name,
            IsDeposit:isDeposit,
            onSuccess: function () {
                gridModel.Reload();
            },
            url: '/Content/IqraPharmacy/AccountantArea/Content/Bank/AddTransaction.js?v=' + name
        });
    };
    (function () {
        var inputs = Global.Form.Bind(formModel, $('#filter_container'));
        function onChange() {
            var filter = [];
            if (!gridModel)
                return;
            gridModel.page.filter = gridModel.page.filter || [];
            (gridModel.page.filter || []).each(function () {
                if (this.field != 'CreatedAt') {
                    filter.push(this);
                }
            });
            if (formModel.From) {
                from.value = "'" + formModel.From + ' 00:00' + "'";
                filter.push(from);
            }
            if (formModel.To) {
                to.value = "'" + formModel.To + ' 00:00' + "'";
                filter.push(to);
            }
            gridModel.page.filter = filter;
            gridModel.Reload();
        };
        Global.DatePicker.Bind($(inputs['From']), { format: 'yyyy/MM/dd', onChange: onChange });
        Global.DatePicker.Bind($(inputs['To']), { format: 'yyyy/MM/dd', onChange: onChange });
        function onPeriodChange(data) {
            var today = new Date(), fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()), today = new Date(fromDate);
            switch (data.value) {
                case 'Yesterday':
                    fromDate.setDate(fromDate.getDate() - 1);
                    today = new Date(fromDate);
                    break;
                case 'ThisWeek':
                    fromDate.setDate(fromDate.getDate() - fromDate.getDay());
                    break;
                case 'LastWeek':
                    today.setDate(today.getDate() - today.getDay()-1);
                    fromDate.setDate(today.getDate() - 7);
                    console.log([today, fromDate]);
                    break;
                case 'ThisMonth':
                    fromDate.setDate(1);
                    break;
                case 'LastMonth':
                    today.setDate(0);
                    fromDate = new Date(fromDate);
                    fromDate.setMonth(fromDate.getMonth() - 1);
                    fromDate.setDate(1);
                    break;
                case 'ThisYear':
                    fromDate.setMonth(0);
                    fromDate.setDate(1);
                    break;
                case 'LastOneYear':
                    fromDate.setFullYear(fromDate.getFullYear() - 1);
                    break;
                case 'LastYear':
                    today.setMonth(0);
                    today.setDate(0);
                    fromDate = new Date(today);
                    fromDate.setMonth(0);
                    fromDate.setDate(1);
                    break;
            }
            formModel.From = fromDate.format('yyyy/MM/dd');
            formModel.To = new Date(today.setDate(today.getDate() + 1)).format('yyyy/MM/dd');
            onChange();
        };
        $(inputs['Period']).val('LastOneYear');
        //type: 'LastOneYear',
        Global.DropDown.Bind({
            Id: 'PeriodId',
            dataSource: [{ text: 'Today', value: 'Today' },
                { text: 'Yesterday', value: 'Yesterday' }, { text: 'This Week', value: 'ThisWeek' },
                { text: 'Last Week', value: 'LastWeek' }, { text: 'This Month', value: 'ThisMonth' },
                { text: 'Last Month', value: 'LastMonth' }, { text: 'This Year', value: 'ThisYear' },
                { text: 'Last One Year', value: 'LastOneYear' }, { text: 'Last Year', value: 'LastYear' }],
            elm: $(inputs['Period']),
            change: onPeriodChange,

        });
    }).call(service.Filter = {});
    Global.List.Bind({
        Name: 'BankTransaction',
        Grid: {
            elm: $('#grid'),
            columns: getColumns(),
            url: '/AccountantArea/Bank/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Transactions ', filter: [from, to] },
            onDataBinding: onDataBinding,
            rowbound: onRowBound,
            Actions: [
                //{
                //click: onEdit,
                //html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-edit"></span></span>'
                //}
            ]
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit: false,
        remove: false
    });
    (function () {
        Global.Click($('#btn_add_withdraw'), function () {
            addTransaction(false, 'Withdraw');
        });
        Global.Click($('#btn_add_deposite'), function () {
            addTransaction(true, 'Deposite');
        });
    })();
})();
