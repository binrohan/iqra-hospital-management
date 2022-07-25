using IqraBase.Web.SetUp;
using IqraBaseService.Helper;
using IqraService;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace IqraBase.Web
{
    public class MvcApplication : IqraApplication
    {
        public MvcApplication() : base(new LogInService(), new AccessService(), new SetUp.ControllerService())
        {

        }
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            //GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            ControllerInfo.Set();
            IControllerFactory factory = new IqraControllerFactory();
            ControllerBuilder.Current.SetControllerFactory(factory);
            //setController();
            
        }
        public override void SetLogService()
        {
            IqraBaseService.DAL.DataService.LogService = IqraBaseService.DAL.DataService.LogService ?? new LogService();
        }
        private void setController()
        {
            var Info = new ControllerInfo() { Name = "Account", Type = typeof(BaseProject.Controllers.AccountController) };
            ControllerInfo.Set(Info);
        }
        protected void Application_BeginRequest()
        {
            CultureInfo newCulture = (CultureInfo)System.Threading.Thread.CurrentThread.CurrentCulture.Clone();
            newCulture.DateTimeFormat.FullDateTimePattern = "dd/MM/yyyy hh:mm";
            newCulture.DateTimeFormat.LongDatePattern = "dd/MM/yyyy hh:mm";
            newCulture.DateTimeFormat.ShortDatePattern = "dd/MM/yyyy";
            newCulture.DateTimeFormat.DateSeparator = "/";
            Thread.CurrentThread.CurrentCulture = newCulture;
        }
    }
}
