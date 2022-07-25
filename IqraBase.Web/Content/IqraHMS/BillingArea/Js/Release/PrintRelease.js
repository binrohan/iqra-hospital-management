var Controller = new function () {

    var service = {}, windowModel, formModel = {}, callerOptions, currentDate = new Date(),
        filter = { "field": "Id", "value": "", Operation: 0 };
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
        filter.value = callerOptions.PatientId;
        console.log(['model', model]);
        if (windowModel) {
            windowModel.Show();
            //console.log(['service.Prescription', service.Prescription, service.Prescription.Bind]);
            //service.Prescription.Bind();
            service.Release.Bind();
        } else {
            
            Global.LoadTemplate('/Content/IqraHMS/BillingArea/Templates/PrintRelease.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.Release.Bind();
                setTabEvent();
            }, noop);
        }
    };

    (function () {
        var isBind, dataSource = {}, Id, selfServicre = {};
        function bind() {
            if (!isBind) {
                isBind = true;
                Global.Form.Bind(formModel, windowModel.View.find('#printRelease'));
            }
            reset();
            windowModel.View.find('#printRelease').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[0]).addClass('active');
        };
        function populate(model) {
            var patientModel = model[0][0];
           
            for (var key in formModel) {
                if (typeof patientModel[key] != 'undefined') {
                    formModel[key] = patientModel[key];
                }
            }
           
            //console.log(['data', formModel, patientModel]);

            currentDate = model[1][0].CurrentDate.getDate();
            patientModel.DateOfBirth = patientModel.DateOfBirth.getDate();
            patientModel.PatientAge = new Date(currentDate.getTime() - patientModel.DateOfBirth.getTime());
            patientModel.PatientAge.setFullYear(patientModel.PatientAge.getFullYear() - 1970);
            formModel.PatientAge = patientModel.PatientAge.getFullYear() + ' yrs ' + (patientModel.PatientAge.getMonth() + 1) + ' mnths ' + patientModel.PatientAge.getDate() + ' days ';
        };
        function load() {
            console.log(['load()', callerOptions, callerOptions.PatientId]);
            Global.CallServer('/PatientArea/Patient/PrintRelease?Id=' + callerOptions.PatientId, function (response) {
                console.log(response);
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
            if (Id === callerOptions.PatientId) {
                return;
            }
            load();
            Id = callerOptions.PatientId;
            service.PrintService.Bind();
        };
    }).call(service.Release = {});

    (function () {

        function printElem(elm) {
            var mywindow = window.open('', 'PRINT', 'height=800,width=1200');
            mywindow.document.write('<html><head><title>' + 'Inv Invoice' + '</title>');
            mywindow.document.write('<link href="/Content/bootstrap.min.css" rel="stylesheet" /><script src="/Content/IqraService/Js/global.js"></script><style type="text/css" media="print">@page{size:  auto;margin: 0mm;}html{background-color: #FFFFFF;margin: 0px;}</style></head>');
            mywindow.document.write('<body style="padding: 20px;">');
            console.log(['page-wrap',elm,elm.html()]);
            mywindow.document.write(elm.html()+'')
            mywindow.document.write('<script type="text/javascript"> $(document).ready(function () { window.print();});</script>');
            mywindow.document.write('</body></html>');
            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus();
            return true;
        }
        this.Print = function (elm) {
            printElem(elm);
        }
        this.Bind = function () {
            Global.Click(windowModel.View.find('.btn_print'), printElem, windowModel.View.find('#page-wrap'));
        };
    }).call(service.PrintService = {});

};