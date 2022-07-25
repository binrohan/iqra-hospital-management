
(function () {
    var opts = {
        name: 'AddNewWeekend',
        url: '/Content/IqraPharmacy/HRIS/Content/Weekend/AddNewWeekend.js',
        onSaveSuccess: function () {
            gridModel.Reload();
        }
    };
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };

    function onAdd() {
        opts.model = undefined;
        Global.Add(opts);
    };
    function onDataBinding(data) {
        var str = '';
        data.Data.Data.each(function () {
            this.DayOfWeek = days[this.DayOfWeek];
        });
    };
    var that = this, gridModel, days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    Global.List.Bind({
        Name: 'Weekend',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Employee', filter: true },
                { field: 'From', dateFormat: 'dd/MM/yyyy', },
                { field: 'To', dateFormat: 'dd/MM/yyyy', },
                { field: 'DayOfWeek', },
                { field: 'Approver', filter: true },
                { field: 'Status' }
            ],
            url: '/HRIS/Weekend/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Weekends ' },
            onDataBinding: onDataBinding,
            //Actions: [{
            //    click: onEdit,
            //    html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-edit"></span></span>'
            //}]
        }, onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit: false,
        remove:false
    });
    Global.Click($('#btn_add_new'), onAdd);
})();
