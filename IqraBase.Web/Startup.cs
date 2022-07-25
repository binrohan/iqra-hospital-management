using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(IqraBase.Web.Startup))]
namespace IqraBase.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
