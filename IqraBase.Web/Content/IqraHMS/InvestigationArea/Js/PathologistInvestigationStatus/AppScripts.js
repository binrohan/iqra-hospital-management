
(function () {
    var that = this, gridModel, service = {};
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDeliver(model) {
        if (model && (model.Status == 'Done' || model.Status == 'Delivered')) {
            alert('This Report is already '+model.Status+'.');
            return;
        }
        Global.Controller.Call({
            url: IqraConfig.Url.Js.WarningController,
            functionName: 'Show',
            options: {
                name: 'Warning',
                Message: 'Is this Investigation Ready to Deliver ?',
                Save: '/InvestigationArea/PathologistInvestigationStatus/ChangeStatus',
                data: { Id: model.Id },
                onsavesuccess: function (response) {
                    gridModel.Reload();
                }
            }
        });
    };
    function onSetData(data, grid) {
        Global.Add({
            InvestigationListId: data.Id,
            name: 'SetData',
            url: '/Content/IqraHMS/InvestigationArea/Js/Investigation/OnSetData.js',
            onSaveSuccess: function () {
                //alert('Payment Successfully');
                grid.Reload();
            }
        });
    };
    function printInvestigation(model) {
        service.PatientInvestigation.Bind(model.Id);
    };
    function onPatientDetails(model) {
        Global.Add({
            PatientId: model.PatientId,
            name: 'PatientDetails',
            url: '/Content/IqraHMS/PatientArea/Js/Patient/PatientDetails.js',
        });
    };
    function onPatientInvestigatioDetails(model) {
        Global.Add({
            name: 'PatientInvestigationDetails',
            url: '/Content/IqraHMS/InvestigationArea/Js/PatientInvestigation/OnDetails.js',
            PatientInvestigationId: model.PatientInvestigationId,
            model: {}
        });
    };
    function onDoctorDetails(model) {
        Global.Add({
            DoctorId: model.DoctorId,
            name: 'DoctorDetails',
            url: '/Content/IqraHMS/DoctorsArea/Js/Doctor/DoctorDetails.js',
        });
    };
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
        if (this.Status != DefinedString.InvestigationStatus.SampleCollected) {
            elm.find('.btn_set_data').remove();
        }
        if (this.Status != DefinedString.InvestigationStatus.Done) {
            elm.find('.btn_print_investigation').remove();
        }
    };
    function onDataBinding(data) {
    };
    
    Global.List.Bind({
        Name: 'Investigation Status',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Code', title: 'Code', filter: true },
                { field: 'Investigation', title: 'Investigation', filter: true, click: onPatientInvestigatioDetails },
                { field: 'Doctor', title: 'Doctor', filter: true, click: onDoctorDetails },
                { field: 'Patient', title: 'Patient', filter: true, click: onPatientDetails },
                { field: 'Status', title: 'Status', filter: false },
                { field: 'SampleCollectedAt', title: 'Sample Collected At', dateFormat: 'dd mmm-yyyy hh:mm', Add: false },
                { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy hh:mm', Add: false },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'Remarks', title: 'Remarks', required: false, sorting: false }
            ],
            Actions: [{
                click: onSetData,
                html: '<a style="margin-right:8px;" class="icon_container btn_set_data" title="Set Report Data"><span class="glyphicon glyphicon-open"></span></a>'
            }, {
                click: onDeliver,
                html: '<a style="margin-right:8px;" id="btn_due_deliver" class="icon_container" title="Make Delivered"><span class="glyphicon glyphicon-check"></span></a>'
            }, {
                click: printInvestigation,
                html: '<a style="margin-right:8px;" class="icon_container btn_print_investigation" title="Re-Print Invoice"><span class="glyphicon glyphicon-print"></span></a>'
            }],
            url: '/InvestigationArea/PatientInvestigationList/StatusWiseInvList',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Samples ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: false,
        Edit: false,
        remove: false
    });


    (function () {
        var isBind, dataSource = {}, Id, selfServicre = {}, invgridModel;
        var dic = {};
        function setData(list) {
            dic = {};
            var datasource = [],
                group = {
                    dic: {},
                    list: []
                },
                category = {
                    dic: {},
                    list: [],
                    group: []
                };
            list.each(function () {
                if (this.Category) {
                    if (this.Group) {
                        if (group.dic[this.Group]) {
                            group.dic[this.Group].items.push(this);
                        } else {
                            group.dic[this.Group] = { items: [this], position: this.GroupPosition || 0 };
                            group.list.push(group.dic[this.Group]);
                            if (!category.dic[this.Category]) {
                                category.list.push(category.dic[this.Category] = { items: [], position: this.CategoryPosition || 0, groups: [] });

                            }
                            category.dic[this.Category].groups.push(group.dic[this.Group]);

                        }
                    } else {
                        if (category.dic[this.Category]) {
                            category.dic[this.Category].items.push(this);
                        } else {
                            category.dic[this.Category] = { items: [this], position: this.CategoryPosition || 0, groups: [] };
                            category.list.push(category.dic[this.Category]);
                        }
                    }
                } else {
                    datasource.push(this)
                }
            });
            category.list.orderBy('position');
            category.list.each(function () {
                var ctgr = this;
                this.groups.orderBy('position');
                this.groups.each(function () {
                    this.items[0].GroupHeader = this.items[0].Group || '';
                    ctgr.items = ctgr.items.concat(this.items);
                });
                this.items[0].CategoryHeader = this.items[0].Category || '';
                datasource = datasource.concat(this.items);
            });
            return datasource;
        };
        function load(id,callBack) {
            Global.CallServer('/InvestigationArea/PatientInvestigationList/DetailsForSetData?Id=' + id, function (response) {
                console.log(response);
                if (!response.IsError) {
                    response.Data[2] = setData(response.Data[2]);
                    //invgridModel.dataSource = response.Data[2] ;
                    //invgridModel.Reload();
                    //callerOptions.List = response.Data;
                    response.Data[0][0].Barcode = Global.Barcode.Get({ text: response.Data[0][0].Code, height: 30 });
                    response.Data[1][0].Barcode = Global.Barcode.Get({ text: response.Data[1][0].Code, height: 30 });
                    response.Data[1][0].ReportBarcode = Global.Barcode.Get({ text: response.Data[1][0].ReportNo, height: 30 });
                    //console.log(['Code=>', response.Data[0][0].Barcode, response.Data[0][0].Code, response.Data[0][0].Barcode, response.Data[1][0].Code]);
                    callBack(response.Data);
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                response.Id = -8;
                Global.Error.Show(response, {});
            }, null, 'Get');
        };
        function onResultBound(td) {

        };
        function onRowBound(elm, tbody, b, c) {
            //var id = Global.Guid();
            //elm.addClass(id);
            var prnt = elm.parent();
            if (this.CategoryHeader) {
                var tr = $('<tr><td colspan="5" style="font-size:1.8em;">' + this.CategoryHeader + '</td></tr>');
                //tr.insertBefore('.' + id);
                tbody.append(tr);
                //console.log(['tr', tr, elm, prnt, tbody, '<tr colspan="5" style="font-size:2em;">' + this.CategoryHeader + '</tr>', c]);
            }
            if (this.GroupHeader) {
                var tr = $('<tr><td colspan="5" style="font-size:1.3em;">' + this.GroupHeader + '</td></tr>');
                tbody.append(tr);
                //$('<tr colspan="5" style="font-size:1.5em;">' + this.GroupHeader + '</tr>').insertBefore('.' + id);
            }
        };
        function bind() {
            Global.Grid.Bind({
                elm: windowModel.View.find('#investigation_grid_container'),
                columns: [
                    { field: 'Name', filter: false, sorting: false },
                    { field: 'Unit', filter: false, sorting: false },
                    { field: 'Result', filter: false, sorting: false, AutoBind: false, bound: onResultBound, width: 200 },
                    { field: 'Refference', filter: false, sorting: false },
                    { field: 'Remarks', filter: false, sorting: false },
                ],
                dataSource: [],
                Printable: false,
                Responsive: false,
                selector: false,
                rowBound: onRowBound,
                page: { 'PageNumber': 1, 'PageSize': 1000, showingInfo: ' {0}-{1} of {2} Items ' },
                onComplete: function (model) {
                    invgridModel = model;
                },
            });
        };
        this.Bind = function (id) {
            var mywindow = window.open('', 'PRINT', 'height=800,width=1200');
            load(id,(list) => {
                service.PrintService.Print(mywindow, list);
            });
        };
    }).call(service.PatientInvestigation = {});
    (function () {
        var self = this;
        function getHeader() {
            return `<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/Content/IqraHMS/InvestigationArea/css/InvestigationPrint.css" />
    <script src="/Content/IqraService/Js/global.js"></script>
    <title>HAEMATOLOGY REPORT</title>
  </head>`;
        };
        function getPageHeader(list) {
            var patient = list[0][0], investigation = list[1][0];
            var age = patient.DateOfBirth.getDate();
            var currentDate = list[3][0].CurrentDate.getDate();
            list = list[2];

            patient.Age = new Date(currentDate.getTime() - age.getTime());
            patient.Age.setFullYear(patient.Age.getFullYear() - 1970);
            patient.Age = patient.Age.getFullYear() + ' Y ' + (patient.Age.getMonth()) + ' M ' + patient.Age.getDate() + ' D ';


            return `<div class="page-header">
      <div class="title">
        <div class="title__text">
          <p class="title__text__phone">Hotline: 911</p>
          <p class="title__text__name">Iqra Hospital Ltd, Dhaka</p>
          <p class="title__text__licence">
            Licence No: HSM45xxx6138 &nbsp; | &nbsp; Reg. Code: HSM45648xxx8
          </p>
        </div>
        <div class="title__logo">
          <img src="/Content/Img/logo.png" alt="Logo" />
        </div>
      </div>
      <div class="report">
        <div class="report__code">
          <img src="`+ (investigation.Barcode || '') + `" alt="Bar Code" />
        </div>
        <div class="report__name">
          <h1>HAEMATOLOGY REPORT</h1>
        </div>
        <div class="report__code">
          <img src="`+ (investigation.ReportBarcode || '') + `" alt="Bar Code" />
        </div>
      </div>
      <div class="invoice">
        <div>Invoice No</div>
        <div>: <span>`+ (investigation.Code || '') + `</span></div>
        <div>Invoice Date</div>
        <div>: <span>`+ (investigation.InvoiceDate.getDate().format('dd/MM/yyyy')) + `</span></div>
        <div>Delivery Date</div>
        <div>: <span>`+ (investigation.DeliveryDate.getDate().format('dd/MM/yyyy')) + `</span></div>
        <div>Report No</div>
        <div>: <span>`+ (investigation.ReportNo || '') + `</span></div>
        <div>Patient Name</div>
        <div style="grid-column: 2 / 5; text-transform: uppercase">
          : <span>`+ patient.Name + `</span>
        </div>
        <div>Age</div>
        <div>: <span>`+ patient.Age + `</span></div>
        <div>Gender</div>
        <div>: <span>`+ patient.Gender + `</span></div>
        <div>Address</div>
        <div style="grid-column: 2 / 7">:`+ (patient.CAddress || '') + ` <span></span></div>
        <div>Contact No</div>
        <div>:`+ patient.Mobile + `</div>

        <div>Reffered By</div>
        <div>: <span>`+ (investigation.Referar || '') + `</span></div>
      </div>
      <div class="test">
        <div>Sample Type</div>
        <div>: <b>WHOLE BLOOD</b></div>
        <div>LAB No</div>
        <div style="grid-column: 4 / 9">
          : <span>12202554896486</span>
        </div>
        <div>Tests</div>
        <div style="grid-column: 2 / 9">
          :
          <span>`+ (investigation.InvestigationName || '') + `</span>
        </div>
        <div>Sample Collected</div>
        <div>: <span>06/04/22 05:09PM</span></div>
        <div>Sample Received</div>
        <div>
          :
          <span
            >06/04/22 05:09PM</span
          >
        </div>
        <div>Received Time</div>
        <div>: <span>07/04/22 05:09PM </span></div>
      </div>
    </div>`;
        };
        function getPageFooter() {
            return `<div class="page-footer">
      <div class="print-info">
        <div class="print-info__personal">
          Print by & Date :: <span>namim on 17/04/2022 10:49:56 PM</span>
        </div>
        <div class="print-info__page">
          <div class="print-info__page__code">
            <img src="./assests/qr-code.png" alt="QR Code" />
          </div>
          <!-- <div>Page <span class="page-counter"></span> of 2</div> -->
        </div>
      </div>
      <address>
        House 858, Road 12, Avenue 3, Mirpur DOHS, Dhaka, Bangladesh, Phone:
        01778772327, E-mail: iqrasysinfo@gmail.com, Web: https://iqrasys.com
      </address>
    </div>`;
        };
        function printElem(mywindow, list) {
            var mywindow = window.open('', 'PRINT', 'height=800,width=1200');
            console.log(['mywindow', mywindow]);
            mywindow.document.write('<!DOCTYPE html><html lang="en">' + getHeader());
            mywindow.document.write('<body>');
            mywindow.document.write(getPageHeader(list));
            mywindow.document.write(getPageFooter(list));
            //console.log(self.Data.Get(list));
            mywindow.document.write(self.Data.Get(list));
            mywindow.document.write('<script type="text/javascript"> $(document).ready(function () { window.print();});</script>');
            mywindow.document.write('</body></html>');
            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus();
            return true;
        };
        (function () {
            function getHeader() {
                return ` <thead>
        <tr>
          <td>
            <div class="page-header-space"></div>
          </td>
        </tr>
      </thead>`;
            };
            function getpoweredBy(patient) {
                return `<div class="power">
                <div>B566522</div>
                <div>Powered by: iqrasys.com</div>
                <div class="power__bar-code">
                  HN:
                  <div><img src="`+ (patient.Barcode || '') + `" alt="" /></div>
                </div>
              </div>`;
            };
            function getColumnHeader() {
                return `<div class="result__header result--grid">
                  <div>Test</div>
                  <div>Unit</div>
                  <div>Result</div>
                  <div>Reference Value</div>
                </div>`;
            };
            function getResult(list) {
                var result = '';
                list.each(function () {
                    if (this.CategoryHeader) {
                        result += '<div class="result__section">' + this.CategoryHeader + '</div>'
                    }
                    if (this.GroupHeader) {
                        result += '<div class="result__section--su">' + this.GroupHeader + '</div>'
                    }
                    result += `<div class="result__row result--grid">
                  <div>`+ this.Name + `</div>
                  <div>`+ this.Unit + `</div>
                  <div>`+ this.Result + `</div>
                  <div>`+ this.Refference + `</div>
                  </div>`;
                });
                console.log(['result', result]);
                return result;
            };
            function getSignatories() {
                return `<div class="signatories">
                <div>
                  <p><b>Mst. Shamsunnahar</b></p>
                  <p>Medical Technologist</p>
                  <p>Automation Lab</p>
                </div>
                <div>
                  <p><b>DR. Taskia Sultana Zaman</b></p>
                  <p>MBBS(DMC), PhD(Japan)</p>
                  <p>Jr.Consultant(Immunology)</p>
                  <p>Iqra Hospital Ltd</p>
                </div>
              </div>`;
            };
            function getEndReport() {
                return `
              <div class="end-report">
                <div class="end-report__label">
                  -------------------------------------------------- End of
                  Report --------------------------------------------------
                </div>
                <div class="end-report__instructions">
                  <h4>IMPORTANT INSTRUCTIONS</h4>
                  <p>
                    *The test results should only be interpreted by qualified
                    and registered medical practitioners.*The laboratory test
                    results should be clinically correlated by the referring
                    physician *The reported results depend on the quality of the
                    samples and sensitivity/specificity of the test methods.*1n
                    case of grossly abnormal test results, the lab may perform
                    repeat test from the same/fresh sample at its own or on the
                    basis of clinicians/Clients request within 2 days post
                    reporting.*Inter-laboratory variations may be found in test
                    results, and Iqra Hospital Limited (Diagnostics) shall not
                    incur any liability due to such variance.*This test report
                    is not valid for medico-legal purpose.*Iqra Hospital Limited
                    (Diagnostics)and its staff will not take any responsibility
                    or liability for any loss or injury resulting from
                    incomplete or erroneous interpretation of the test results
                    contained herein *Due to unexpected circumstances. the
                    report delivery may rarely be delayed.*Partial reproduction
                    of this test report is not allowed.
                  </p>
                </div>
              </div>`;
            };
            function getTableFooter() {

                return `      <tfoot>
        <tr>
          <td>
            <!--place holder for the fixed-position footer-->
            <div class="page-footer-space"></div>
          </td>
        </tr>
      </tfoot>`;
            };
            this.Get = function (list) {
                var tbl = '<table class="">' + getHeader();
                tbl += '<tbody><tr><td><div class="page">' + getpoweredBy(list[0][0]);
                tbl += '<div class="result">' + getColumnHeader();
                tbl += getResult(list[2]);
                tbl += '</div>';
                tbl += getSignatories();
                tbl += getEndReport();
                tbl += '</div></td></tr></tbody>';
                tbl += getTableFooter();
                tbl += '</table>';
                //console.log(tbl);
                return tbl;
            };
        }).call(self.Data = {});
        this.Print = function (mywindow, list) {
            printElem(mywindow, list);
        }
    }).call(service.PrintService = {});
})();;
