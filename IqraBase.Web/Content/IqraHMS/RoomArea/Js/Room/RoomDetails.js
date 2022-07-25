
var Controller = new function () {
    var service = {}, windowModel, callerOptions,
        filter = { "field": "RoomId", "value": "", Operation: 0 };

    function close() {
        windowModel && windowModel.Hide();
    };
    function reset() {
        windowModel.View.find('.tab-content .tab-pane').removeClass('in active');
        windowModel.View.find('ul.nav.nav-tabs li').removeClass('active');
    }
    function setTabEvent() {
        windowModel.View.find('ul.nav.nav-tabs li').click(function () {
            service[this.dataset.field].Bind();
        });
    };
    this.Show = function (model) {
        callerOptions = model;
        filter.value = model.RoomId;
        if (windowModel) {
            windowModel.Show();
            service.RoomDetails.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/RoomArea/Templates/RoomDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.RoomDetails.Bind();
                setTabEvent();
            }, noop);
        }
    };

    (function () {
        var gridModel, roomId, txtStatus = ['', 'Login', 'Logout', '', ''];
        function bind() {
            if (!gridModel) {
                roomId = filter.value;
                Global.List.Bind(getOptions());
            }
            reset();
            windowModel.View.find('#room_details').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[2]).addClass('active');
        }
        function onSubmit(formModel, data) {
            formModel.RoomId = filter.value;
            if (data) {
                formModel.Id = data.Id
            }
        };
        function rowBound(elm) {
            if (this.IsDeleted) {
                elm.css({ color: 'red' }).find('.product_name a, .updator a').css({ color: 'red' });
                elm.find('.fa-times').removeClass('fa-times').addClass('fa-check');
            }
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {

            });
        };
        function getOptions() {
            var opts = {
                Name: 'RoomDetails',
                Grid: {
                    elm: windowModel.View.find('#room_details_grid'),
                    columns: [
                            { field: 'Name', filter: true, Add: false },
                            { field: 'BedNumber', title: 'Fee', filter: true, position: 1 },
                            { field: 'PerDayCharge', filter: true },
                            { field: 'IsAvailable', required: false, filter: true, position: 3, Add: { Type: 'checkbox' } },
                            { field: 'IsDeleted', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                    ],
                    url: '/RoomArea/Bed/Get',
                    page: { 'PageNumber': 1, 'PageSize': 50, showingInfo: ' {0}-{1} of {2}  Room Details', filter: [filter] },
                    onDataBinding: onDataBinding,
                    rowBound: rowBound,
                    Actions: [],
                    Printable: {
                        Container: function () {
                            return windowModel.View.find('#room_details #button_container');
                        },
                        html: '<a class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                    },
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Add: {
                    elm: windowModel.View.find('#btn_add_new_bed'),
                    onSubmit: onSubmit,
                    save: '/RoomArea/Bed/Create',
                    saveChange: '/RoomArea/Bed/Edit',
                },
                Edit: false,
                remove: false

            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != roomId) {
                gridModel.page.filter = [filter];
                gridModel.Reload();
            }
            roomId = filter.value;
        }
    }).call(service.RoomDetails = {});
};