using System.Web.Mvc;

namespace IqraHMS.OT.Web.Areas.SurgeryArea
{
    public class SurgeryAreaAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "SurgeryArea";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "SurgeryArea_default",
                "SurgeryArea/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}