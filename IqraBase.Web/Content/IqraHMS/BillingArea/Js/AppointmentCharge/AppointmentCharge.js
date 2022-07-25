

var Controller = new function () {
    var service = {}, windowModel, formModel = {}, callerOptions,
        filter = { "field": "AppointmentChargeId", "value": "", Operation: 0 };
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
        filter.value = model.AppointmentChargeId;
        if (windowModel) {
            windowModel.Show();
            service.BasicInfo.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/BillingArea/Templates/AppointmentCharge.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.BasicInfo.Bind();
                service.ChangeStatus.Bind();
                setTabEvent();
            }, noop);
        }
    };

    (function () {

        //function printElem(elm) {
        //    var mywindow = window.open('', 'PRINT', 'height=800,width=1200');
        //    mywindow.document.write('<html><head><title>' + 'AppointmentCharge' + '</title>');
        //    mywindow.document.write('<link href="/Content/bootstrap.min.css" rel="stylesheet" /><script src="/Content/IqraService/Js/global.js"></script><style type="text/css" media="print">@page{size:  auto;margin: 0mm;}html{background-color: #FFFFFF;margin: 0px;}</style></head>');
        //    mywindow.document.write('<body style="padding: 20px;">');
        //    //mywindow.document.write('<table style="border-collapse: collapse;">');
        //    //printHeader(model, mywindow);
        //    //printData(model, mywindow);
        //    mywindow.document.write(elm.html())
        //    mywindow.document.write('<script type="text/javascript"> $(document).ready(function () { window.print();});</script>');
        //    mywindow.document.write('</body></html>');
        //    mywindow.document.close(); // necessary for IE >= 10
        //    mywindow.focus(); // necessary for IE >= 10*/
        //    //mywindow.print();
        //    //mywindow.close();
        //    return true;
        //};

        function changeStatus() {
            windowModel.Wait('Please Wait while saving data......');
            var model = {};
            saveUrl = '/BillingArea/AppointmentCharge/ChangeStatus';
            model.status = 'Paid';
            model.Id = callerOptions.AppointmentChargeId;
            Global.CallServer(saveUrl, function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    Global.Add({
                        AppointmentChargeId: callerOptions.AppointmentChargeId,
                        name: 'AppointmentChargePrintPreview',
                        url: '/Content/IqraHMS/BillingArea/Js/AppointmentCharge/AppointmentChargePrint.js',
                    });
                } else {
                    alert('');
                }
            }, function (response) {
                windowModel.Free();
                //response.Id = -8;
                alert('Network Errors.');
            }, model, 'POST');
           
        };


        //this.Print = function (elm) {
        //    printElem(elm);
        //}
        this.Bind = function () {
            Global.Click(windowModel.View.find('.btn_next'), changeStatus);
        };
    }).call(service.ChangeStatus = {});
    (function () {
        var isBind, formModel = {}, dataSource = {}, appointmentChargeId;
        function bind() {
            if (!isBind) {
                isBind = true;
                Global.Form.Bind(formModel, windowModel.View.find('#basic_info'));
            }
            reset();
            windowModel.View.find('#basic_info').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[0]).addClass('active');
        }
        function populate(model) {
            for (var key in formModel) {
                if (typeof model[key] != 'undefined') {
                    formModel[key] = model[key];
                }
            }
            formModel.CreatedAt = model.CreatedAt.getDate().format('dd/MM/yyyy hh:mm');
        };
        function load() {
            Global.CallServer('/AppointmentCharge/Details?Id=' + callerOptions.AppointmentChargeId, function (response) {
                if (!response.IsError) {
                    populate(response.Data);
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                response.Id = -8;
                Global.Error.Show(response, {});
            }, null, 'Get');
        };
        this.Bind = function () {
            bind();
            if (appointmentChargeId === callerOptions.AppointmentChargeId) {
                return;
            }
            load();
            appointmentChargeId = callerOptions.AppointmentChargeId;
        };

    }).call(service.BasicInfo = {});

};