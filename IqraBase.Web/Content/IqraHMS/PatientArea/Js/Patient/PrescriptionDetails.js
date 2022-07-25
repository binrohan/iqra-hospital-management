var Controller = new function () {
    var service = {}, windowModel, callerOptions,currentDate=new Date(),
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
        filter.value = model.Id;
        if (windowModel) {
            windowModel.Show();
            service.Prescription.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/PatientArea/Templates/PrescriptionDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.Prescription.Bind();
                setTabEvent();
            }, noop);
        }
    };
    (function ()
    {
        var isBind, formModel = {}, dataSource = {}, Id, selfServicre = {};
        function bind() {
            if (!isBind) {
                isBind = true;
                Global.Form.Bind(formModel, windowModel.View.find('#prescription'));
            }
            reset();
            windowModel.View.find('#prescription').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[0]).addClass('active');
        };
        function setOrderedList(str,container) {
            var index = 1, value = '';
            str = str || '';
            str.split('\n').each(function () {
                value += (index+++'. '+this+'</br>');
            });
            container.append(value);
        };
        function populate(model) {
            var patientModel = model[0][0];
            var investigationModel = model[2][0];
            for (var key in formModel) {
                if (typeof patientModel[key] != 'undefined') {
                    formModel[key] = patientModel[key];
                }
            }
            setOrderedList(patientModel.Complain, windowModel.View.find('#complain'));
            setOrderedList(patientModel.PreviousInformation, windowModel.View.find('#previous_information'));
            setOrderedList(patientModel.AdditionalInformation, windowModel.View.find('#additional_information'));
            setOrderedList(patientModel.Advice, windowModel.View.find('#advice'));
            //setOrderedList(investigationModel.InvestigationRefference, windowModel.View.find('#investigation_container'));
            selfServicre.Medecine.Create(model[1]);
            selfServicre.Investigation.Create(model[2]);
            formModel.NextMeetingDate = patientModel.NextMeetingDate.getDate().format('dd/MM/yyyy hh:mm');

            currentDate = model[3][0].CurrentDate.getDate();
            patientModel.PatientDOB = patientModel.PatientDOB.getDate();
            patientModel.PatientAge = new Date(currentDate.getTime() - patientModel.PatientDOB.getTime());
            patientModel.PatientAge.setFullYear(patientModel.PatientAge.getFullYear() - 1970);
            formModel.PatientAge = patientModel.PatientAge.getFullYear() + ' yrs ' + (patientModel.PatientAge.getMonth() + 1) + ' mnths ' + patientModel.PatientAge.getDate() + ' days ';
            //console.log([patientModel,patientModel.PatientAge, patientModel.PatientAge.getFullYear(), patientModel.PatientAge.getMonth() + 1]); 
            //model.PatientAge.getMonth()+1;
            //model.PatientAge.getHours()
            //model.PatientAge.getMinutes()
            //formModel.CreatedAt = model.CreatedAt.getDate().format('dd/MM/yyyy hh:mm');
            //formModel.UpdatedAt = model.UpdatedAt === "\/Date(-2209010400000)\/" ? "" : model.UpdatedAt.getDate().format('dd/MM/yyyy hh:mm');
            
        };
        function load() {
            Global.CallServer('/PrescriptionArea/Prescription/Details?Id=' + callerOptions.PrescriptionId, function (response) {

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
        (function () {
            var container;
            function create(item) {
                var elm = $('<div>' +
                    '<span>' + '<b>' + (item.DrugBrand||'') + '</b>'+ '</span>' + ' ' + ' ' + ' ' + ' ' +
                    '<span>' + (item.Contains||'') + '</span>' +
                    '</div>' +
                    '<div>' +
                      '&nbsp;' + '&nbsp;' + '&nbsp;' + '&nbsp;' +
                    '<span>' + (item.Doses||'') + '</span>' + '--' +
                    '<span>' + (item.Timing||'') + '</span>' + '--' +
                    '<span>' + '(' + (item.DosesPeriod||'') + ')' + '</span>' +
                    '</div>');

                container.append(elm);
            };
            this.Create = function (list) {
                container = container || windowModel.View.find('#medecine_container');
                container.empty();
                list.each(function () {
                    create(this);
                });
            };
        }).call(selfServicre.Medecine = {});
        (function () {
            var container;
            function create(item,i) {
                var elm = $('<div>' +
                        '<span>'+i+". " + item.InvestigationRefference + '</span>' +
                    '</div>'
                    );

                container.append(elm);
            };
            this.Create = function (list) {
                container = container || windowModel.View.find('#investigation_container');
                container.empty();
                list.each(function (i) {
                    create(this,i+1);
                });
            };
        }).call(selfServicre.Investigation = {});
        this.Bind = function () {
            bind();
            if (Id === callerOptions.PrescriptionId) {
                return;
            }
            load();
            Id = callerOptions.PrescriptionId;
            service.PrintService.Bind();
        };
    }).call(service.Prescription = {});
    (function () {
        
        function printElem(elm) {
            var mywindow = window.open('', 'PRINT', 'height=800,width=1200');
            mywindow.document.write('<html><head><title>' + 'Prescription' + '</title>');
            mywindow.document.write('<link href="/Content/bootstrap.min.css" rel="stylesheet" /><script src="/Content/IqraService/Js/global.js"></script><style type="text/css" media="print">@page{size:  auto;margin: 0mm;}html{background-color: #FFFFFF;margin: 0px;}</style></head>');
            mywindow.document.write('<body style="padding: 20px;">');
            //mywindow.document.write('<table style="border-collapse: collapse;">');
            //printHeader(model, mywindow);
            //printData(model, mywindow);
            mywindow.document.write(elm.html())
            mywindow.document.write('<script type="text/javascript"> $(document).ready(function () { window.print();});</script>');
            mywindow.document.write('</body></html>');
            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10*/
            //mywindow.print();
            //mywindow.close();
            return true;
        }

        this.Print = function (elm) {
            printElem(elm);
        }
        this.Bind = function () {
            Global.Click(windowModel.View.find('.btn_print'), printElem, windowModel.View.find('#prescription'));
        };
    }).call(service.PrintService = {});
};