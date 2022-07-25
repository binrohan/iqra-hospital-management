using System.Web.Mvc;

namespace IqraHMS.OT.Web.Areas.OTServiceArea
{
    public class OTServiceAreaAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "OTServiceArea";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "OTServiceArea_default",
                "OTServiceArea/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}