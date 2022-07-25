using IqraBaseService.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IqraBase.Web.SetUp
{
    public class LogService : ILogService, IqraBase.Service.ILogService
    {
        public void Error(ExceptionContext filterContext)
        {

        }

        public void Error(Exception Exeption)
        {

        }

        public void Error(string Exeption, HttpRequest Request)
        {
            //Stream req = Request.InputStream;
            //req.Seek(0, System.IO.SeekOrigin.Begin);
            //string json = new StreamReader(req).ReadToEnd();
        }

        public void Error(Exception Exeption, HttpRequestBase Request)
        {

        }

        public void Error(Exception Exeption, object Model)
        {

        }

        public void Error(Exception Exeption, object model, string path)
        {

        }
    }
}