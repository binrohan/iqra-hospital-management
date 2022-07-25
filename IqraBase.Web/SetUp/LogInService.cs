using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using IqraBaseService.DAL;
using Microsoft.AspNet.Identity;
using IqraBase.Data;
//using IqraBase.Data.Entities.StuffArea;
using IqraBase.Service;
using IqraBase.App.LogInArea;
//using IqraBase.Data.Entities.DoctorsArea;
//using IqraBase.Data.Entities.PatientArea;

namespace IqraBase.Web.SetUp
{
    public class LogInService : ILogInService
    {
        public ILogInResult GetByUserName(HttpContextBase httpContext)
        {
            string userName = httpContext.User.Identity.GetUserName();
            return GetUser(httpContext, userName);
        }
        public LogInResult GetUser(HttpContextBase httpContext, string userName, string password = null)
        {
            using (var db = new Pharmacy.Data.AppDB())
            {
                Pharmacy.Data.Entities.EmployeeArea.User stuff = db.User.Where(u => u.UserName == userName && u.IsDeleted == false && (password == null || u.Password == password)).FirstOrDefault();
                if (stuff == null)
                    return null;
                return stuff.CopyProperties(new LogInResult() { });
                //return new LogInResult() {Id=new Guid("AD6C5C35-2F9F-440B-8838-7366C4034931"),Name= "IqraSys Solutions LTD.",DesignationId=new Guid("64EDC319-1097-4EFB-8D0D-DB8270EEA461") };
            }
        }

        public virtual LogInResult SetLogout(HttpContextBase httpContext)
        {
            return new LogInResult() { };
        }
        public ILogInResult Logout(HttpContextBase httpContext)
        {
            return SetLogout(httpContext);
        }
        ILogInResult ILogInService.GetByUserNamePassword(HttpContextBase httpContext, string userName, string password)
        {
            return GetUser(httpContext, userName, password);
        }
    }
}