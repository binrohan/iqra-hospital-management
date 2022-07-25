(function ($, moment) {
    var pluginName = "bootstrapMaterialDatePicker";
    var pluginDataName = "plugin_" + pluginName,
        dayName = ['S','M','T','W','T','F','S'];
    
    function Plugin(element, options) {
        this.currentView = 0;

        this.minDate;
        this.maxDate;

        this._attachedEvents = [];

        this.element = element;
        this.$element = $(element);
        this.params = { date: true, time: true, format: 'dd/MM/yyyy', minDate: null, maxDate: null, currentDate: new Date(), lang: 'en', weekStart: 0, disabledDays: [], shortTime: false, clearButton: false, nowButton: false, cancelText: 'Cancel', okText: 'OK', clearText: 'Clear', nowText: 'Now', switchOnClick: false, triggerEvent: 'focus', monthPicker: false, year: true };
        this.params = $.fn.extend(this.params, options);
        this.params.shortTime = new RegExp("hh").test(this.params.format);
        this.params.time = new RegExp("hh|HH|mm").test(this.params.format);
        this.params.date = new RegExp("dd|MM|yyyy|mmm|mmmm").test(this.params.format);
        this.name = "dtp_";
        this.$element.attr("data-dtp", this.name);

        this.init();
    };
    $.fn[pluginName] = function (options, p) {
        this.each(function () {
            if (!$.data(this, pluginDataName)) {
                $.data(this, pluginDataName, new Plugin(this, options));
            } else {
                if (typeof ($.data(this, pluginDataName)[options]) === 'function') {
                    $.data(this, pluginDataName)[options](p);
                }
                if (options === 'destroy') {
                    delete $.data(this, pluginDataName);
                }
            }
        });
        return this;
    };
    Plugin.prototype =
            {
                init: function () {
                    //this.initDays();
                    this.currentDate = this.params.currentDate;
                    this.initTemplate();
                    this._attachEvent(this.$element, this.params.triggerEvent, this._fireCalendar.bind(this));
                },
                initTemplate: function () {
                    var yearPicker = "";
                    var y = this.currentDate.getFullYear();
                    this.midYear = y;


                    this.template = $('<div class="dtp hidden" style="width:200px;">' +
                            '<div class="dtp-picker-datetime">' +
                            '<div class="dtp-actual-meridien">' +
                            '<div class="left p20"><a class="dtp-meridien-am" href="javascript:void(0);">AM</a></div>' +
                            '<div class="dtp-actual-time p60"></div>' +
                            '<div class="right p20"><a class="dtp-meridien-pm selected" href="javascript:void(0);">PM</a></div>' +
                            '<div class="clearfix"></div></div>' +
                            '<div id="dtp-svg-clock"></div></div>' +
                            '</div>');

                    if ($('body').find("#" + this.name).length <= 0) {
                        $('body').append(this.template);

                        if (this)
                            this.dtpElement = $('body').find(this.template);
                        this.$dtpElement = $(this.dtpElement);
                    }
                },
                initMeridienButtons: function () {
                    this.$dtpElement.find('a.dtp-meridien-am').off('click').on('click', this._onSelectAM.bind(this));
                    this.$dtpElement.find('a.dtp-meridien-pm').off('click').on('click', this._onSelectPM.bind(this));
                },
                initHours: function () {
                    this.currentView = 1;

                    this.showTime(this.currentDate);
                    this.initMeridienButtons();

                    if (this.currentDate.getHours() < 12) {
                        this.$dtpElement.find('a.dtp-meridien-am').click();
                    } else {
                        this.$dtpElement.find('a.dtp-meridien-pm').click();
                    }

                    var hFormat = ((this.params.shortTime) ? 12 : 24);

                    this.$dtpElement.find('.dtp-picker-datetime').removeClass('hidden');
                    this.$dtpElement.find('.dtp-picker-calendar').addClass('hidden');
                    this.$dtpElement.find('.dtp-picker-year').addClass('hidden');

                    var svgClockElement = this.createSVGClock(true);

                    for (var i = 0; i < 12; i++) {
                        var x = -(162 * (Math.sin(-Math.PI * 2 * (i / 12))));
                        var y = -(162 * (Math.cos(-Math.PI * 2 * (i / 12))));

                        var fill = (((this.currentDate.getHours()) == i) ? "#8BC34A" : 'transparent');
                        var color = (((this.currentDate.getHours()) == i) ? "#fff" : '#000');

                        var svgHourCircle = this.createSVGElement("circle", { 'id': 'h-' + i, 'class': 'dtp-select-hour', 'style': 'cursor:pointer', r: '30', cx: x, cy: y, fill: fill, 'data-hour': i });

                        var svgHourText = this.createSVGElement("text", { 'id': 'th-' + i, 'class': 'dtp-select-hour-text', 'text-anchor': 'middle', 'style': 'cursor:pointer', 'font-weight': 'bold', 'font-size': '20', x: x, y: y + 7, fill: color, 'data-hour': i });
                        svgHourText.textContent = ((i === 0) ? ((this.params.shortTime) ? 12 : i) : i);

                        if (!this.toggleTime(i, true)) {
                            svgHourCircle.className += " disabled";
                            svgHourText.className += " disabled";
                            svgHourText.setAttribute('fill', '#bdbdbd');
                        } else {
                            svgHourCircle.addEventListener('click', this._onSelectHour.bind(this));
                            svgHourText.addEventListener('click', this._onSelectHour.bind(this));
                        }

                        svgClockElement.appendChild(svgHourCircle)
                        svgClockElement.appendChild(svgHourText)
                    }

                    if (!this.params.shortTime) {
                        for (var i = 0; i < 12; i++) {
                            var x = -(110 * (Math.sin(-Math.PI * 2 * (i / 12))));
                            var y = -(110 * (Math.cos(-Math.PI * 2 * (i / 12))));

                            var fill = ((this.currentDate.getHours() == (i + 12)) ? "#8BC34A" : 'transparent');
                            var color = ((this.currentDate.getHours() == (i + 12)) ? "#fff" : '#000');

                            var svgHourCircle = this.createSVGElement("circle", { 'id': 'h-' + (i + 12), 'class': 'dtp-select-hour', 'style': 'cursor:pointer', r: '30', cx: x, cy: y, fill: fill, 'data-hour': (i + 12) });

                            var svgHourText = this.createSVGElement("text", { 'id': 'th-' + (i + 12), 'class': 'dtp-select-hour-text', 'text-anchor': 'middle', 'style': 'cursor:pointer', 'font-weight': 'bold', 'font-size': '22', x: x, y: y + 7, fill: color, 'data-hour': (i + 12) });
                            svgHourText.textContent = i + 12;

                            if (!this.toggleTime(i + 12, true)) {
                                svgHourCircle.className += " disabled";
                                svgHourText.className += " disabled";
                                svgHourText.setAttribute('fill', '#bdbdbd');
                            } else {
                                svgHourCircle.addEventListener('click', this._onSelectHour.bind(this));
                                svgHourText.addEventListener('click', this._onSelectHour.bind(this));
                            }

                            svgClockElement.appendChild(svgHourCircle)
                            svgClockElement.appendChild(svgHourText)
                        }

                        this.$dtpElement.find('a.dtp-meridien-am').addClass('hidden');
                        this.$dtpElement.find('a.dtp-meridien-pm').addClass('hidden');
                    }

                    this._centerBox();
                },
                initMinutes: function () {
                    this.currentView = 2;

                    this.showTime(this.currentDate);

                    this.initMeridienButtons();

                    if (this.currentDate.getHours() < 12) {
                        this.$dtpElement.find('a.dtp-meridien-am').click();
                    } else {
                        this.$dtpElement.find('a.dtp-meridien-pm').click();
                    }

                    this.$dtpElement.find('.dtp-picker-year').addClass('hidden');
                    this.$dtpElement.find('.dtp-picker-calendar').addClass('hidden');
                    this.$dtpElement.find('.dtp-picker-datetime').removeClass('hidden');

                    var svgClockElement = this.createSVGClock(false);

                    for (var i = 0; i < 60; i++) {
                        var s = ((i % 5 === 0) ? 162 : 158);
                        var r = ((i % 5 === 0) ? 30 : 20);

                        var x = -(s * (Math.sin(-Math.PI * 2 * (i / 60))));
                        var y = -(s * (Math.cos(-Math.PI * 2 * (i / 60))));

                        var color = ((this.currentDate.format("m") == i) ? "#8BC34A" : 'transparent');

                        var svgMinuteCircle = this.createSVGElement("circle", { 'id': 'm-' + i, 'class': 'dtp-select-minute', 'style': 'cursor:pointer', r: r, cx: x, cy: y, fill: color, 'data-minute': i });

                        if (!this.toggleTime(i, false)) {
                            svgMinuteCircle.className += " disabled";
                        } else {
                            svgMinuteCircle.addEventListener('click', this._onSelectMinute.bind(this));
                        }

                        svgClockElement.appendChild(svgMinuteCircle)
                    }

                    for (var i = 0; i < 60; i++) {
                        if ((i % 5) === 0) {
                            var x = -(162 * (Math.sin(-Math.PI * 2 * (i / 60))));
                            var y = -(162 * (Math.cos(-Math.PI * 2 * (i / 60))));

                            var color = ((this.currentDate.format("m") == i) ? "#fff" : '#000');

                            var svgMinuteText = this.createSVGElement("text", { 'id': 'tm-' + i, 'class': 'dtp-select-minute-text', 'text-anchor': 'middle', 'style': 'cursor:pointer', 'font-weight': 'bold', 'font-size': '20', x: x, y: y + 7, fill: color, 'data-minute': i });
                            svgMinuteText.textContent = i;

                            if (!this.toggleTime(i, false)) {
                                svgMinuteText.className += " disabled";
                                svgMinuteText.setAttribute('fill', '#bdbdbd');
                            } else {
                                svgMinuteText.addEventListener('click', this._onSelectMinute.bind(this));
                            }

                            svgClockElement.appendChild(svgMinuteText)
                        }
                    }

                    this._centerBox();
                },
                animateHands: function () {
                    var H = this.currentDate.getHours();
                    var M = this.currentDate.getMinutes();

                    var hh = this.$dtpElement.find('.hour-hand');
                    hh[0].setAttribute('transform', "rotate(" + 360 * H / 12 + ")");

                    var mh = this.$dtpElement.find('.minute-hand');
                    mh[0].setAttribute('transform', "rotate(" + 360 * M / 60 + ")");
                },
                createSVGClock: function (isHour) {
                    var hl = ((this.params.shortTime) ? -120 : -90);

                    var svgElement = this.createSVGElement("svg", { class: 'svg-clock', viewBox: '0,0,400,400' });
                    var svgGElement = this.createSVGElement("g", { transform: 'translate(200,200) ' });
                    var svgClockFace = this.createSVGElement("circle", { r: '192', fill: '#eee', stroke: '#bdbdbd', 'stroke-width': 2 });
                    var svgClockCenter = this.createSVGElement("circle", { r: '15', fill: '#757575' });

                    svgGElement.appendChild(svgClockFace)

                    if (isHour) {
                        var svgMinuteHand = this.createSVGElement("line", { class: 'minute-hand', x1: 0, y1: 0, x2: 0, y2: -150, stroke: '#bdbdbd', 'stroke-width': 2 });
                        var svgHourHand = this.createSVGElement("line", { class: 'hour-hand', x1: 0, y1: 0, x2: 0, y2: hl, stroke: '#8BC34A', 'stroke-width': 8 });

                        svgGElement.appendChild(svgMinuteHand);
                        svgGElement.appendChild(svgHourHand);
                    } else {
                        var svgMinuteHand = this.createSVGElement("line", { class: 'minute-hand', x1: 0, y1: 0, x2: 0, y2: -150, stroke: '#8BC34A', 'stroke-width': 2 });
                        var svgHourHand = this.createSVGElement("line", { class: 'hour-hand', x1: 0, y1: 0, x2: 0, y2: hl, stroke: '#bdbdbd', 'stroke-width': 8 });

                        svgGElement.appendChild(svgHourHand);
                        svgGElement.appendChild(svgMinuteHand);
                    }

                    svgGElement.appendChild(svgClockCenter)

                    svgElement.appendChild(svgGElement)

                    this.$dtpElement.find("#dtp-svg-clock").empty();
                    this.$dtpElement.find("#dtp-svg-clock")[0].appendChild(svgElement);

                    this.animateHands();

                    return svgGElement;
                },
                createSVGElement: function (tag, attrs) {
                    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
                    for (var k in attrs) {
                        el.setAttribute(k, attrs[k]);
                    }
                    return el;
                },
                rotateElement: function (el, deg) {
                    $(el).css
                            ({
                                WebkitTransform: 'rotate(' + deg + 'deg)',
                                '-moz-transform': 'rotate(' + deg + 'deg)'
                            });
                },
                showTime: function (date) {
                    if (date) {
                        var minutes = date.getMinutes();
                        var content = this.params.shortTime ? date.format('hh:mm') : date.format('HH:mm');

                        if (this.params.date)
                            this.$dtpElement.find('.dtp-actual-time').html(content);
                        else {
                            if (this.params.shortTime)
                                this.$dtpElement.find('.dtp-actual-day').html(date.format('HH').substring(2));
                            else
                                this.$dtpElement.find('.dtp-actual-day').html('&nbsp;');

                            this.$dtpElement.find('.dtp-actual-maxtime').html(content);
                        }
                    }
                },
                toggleTime: function (value, isHours) {
                    var result = false;

                    if (isHours) {
                        var _date = new Date(this.currentDate);
                        _date.setHours(value % 23);
                        _date.setMinutes(0);
                        _date.setSeconds(0);

                        result = true;
                    } else {
                        var _date = new Date(this.currentDate);
                        _date.setMinutes(value);
                        _date.setSeconds(0);

                        result = true;
                    }

                    return result;
                },
                _fireCalendar: function () {
                    this.currentView = 0;
                    this.show();
                    this.$dtpElement.find('.dtp-time').removeClass('hidden');
                    this.initHours();
                },
                _onSelectHour: function (e) {
                    if (!$(e.target).hasClass('disabled')) {
                        var value = $(e.target).data('hour');
                        var parent = $(e.target).parent();

                        var h = parent.find('.dtp-select-hour');
                        for (var i = 0; i < h.length; i++) {
                            $(h[i]).attr('fill', 'transparent');
                        }
                        var th = parent.find('.dtp-select-hour-text');
                        for (var i = 0; i < th.length; i++) {
                            $(th[i]).attr('fill', '#000');
                        }

                        $(parent.find('#h-' + value)).attr('fill', '#8BC34A');
                        $(parent.find('#th-' + value)).attr('fill', '#fff');

                        this.currentDate.setHours(parseInt(value));

                        if (this.params.shortTime === true && this.isPM) {
                            this.currentDate.setHours(this.currentDate.getHours()+ 12);
                        }

                        this.showTime(this.currentDate);

                        this.animateHands();

                        setTimeout(this.initMinutes.bind(this), 200);
                            
                    }
                },
                _onSelectMinute: function (e) {
                    if (!$(e.target).hasClass('disabled')) {
                        var value = $(e.target).data('minute');
                        var parent = $(e.target).parent();

                        var m = parent.find('.dtp-select-minute');
                        for (var i = 0; i < m.length; i++) {
                            $(m[i]).attr('fill', 'transparent');
                        }
                        var tm = parent.find('.dtp-select-minute-text');
                        for (var i = 0; i < tm.length; i++) {
                            $(tm[i]).attr('fill', '#000');
                        }

                        $(parent.find('#m-' + value)).attr('fill', '#8BC34A');
                        $(parent.find('#tm-' + value)).attr('fill', '#fff');

                        this.currentDate.setMinutes(parseInt(value));
                        this.showTime(this.currentDate);

                        this.animateHands();

                        if (this.params.switchOnClick === true)
                            setTimeout(function () {
                                this.setElementValue();
                                this.hide();
                            }.bind(this), 200);
                    }
                },
                _onSelectAM: function (e) {
                    $('.dtp-actual-meridien').find('a').removeClass('selected');
                    $(e.currentTarget).addClass('selected');

                    if (this.currentDate.getHours() >= 12) {
                        if (this.currentDate.setHours(this.currentDate.getHours()-12))
                            this.showTime(this.currentDate);
                    }
                    this.toggleTime((this.currentView === 1));
                },
                _onSelectPM: function (e) {
                    $('.dtp-actual-meridien').find('a').removeClass('selected');
                    $(e.currentTarget).addClass('selected');

                    if (this.currentDate.getHours() < 12) {
                        if (this.currentDate.setHours(this.currentDate.getHours()+12))
                            this.showTime(this.currentDate);
                    }
                    this.toggleTime((this.currentView === 1));
                },
                _attachEvent: function (el, ev, fn) {
                    el.on(ev, null, null, fn);
                    //this._attachedEvents.push([el, ev, fn]);
                },
                show: function () {
                    this.$dtpElement.removeClass('hidden');
                    this.$element.trigger('open');
                },
                hide: function () {
                    $(window).off('keydown', null, null, this._onKeydown.bind(this));
                    this.$dtpElement.addClass('hidden');
                    this.$element.trigger('close');
                },
                _centerBox: function () {
                    //var h = (this.$dtpElement.height() - this.$dtpElement.find('.dtp-content').height()) / 2;
                    //this.$dtpElement.find('.dtp-content').css('marginLeft', -(this.$dtpElement.find('.dtp-content').width() / 2) + 'px');
                    //this.$dtpElement.find('.dtp-content').css('top', h + 'px');
                },
            };
})(jQuery, {});
