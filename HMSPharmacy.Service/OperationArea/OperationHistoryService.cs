using IqraBase.Data.Models;
using IqraBase.Service;
using IqraHMS.OT.Data.Entities.OperationArea;
using IqraHMS.OT.Data.Models.OperationArea;
using IqraService.Search;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Service.OperationArea
{
    public class OperationHistoryService : AppBaseService<OperationHistory>
    {
        private string Alias { get; set; }
        public OperationHistoryService()
        {
            Alias = "[prtnhstry].";
        }
        public override string GetName(string name)
        {
            switch (name.ToLower())
            {
                case "creator":
                    name = "ctr.Name";
                    break;
                default:
                    name = Alias + name;
                    break;
            }
            return base.GetName(name);
        }
        public async override Task<ResponseList<Pagger<Dictionary<string, object>>>> Get(Page page)
        {
            page.SortBy = page.SortBy ?? "CreatedAt DESC";
            using (var db = new DBService(this))
            {
                return await db.GetPages(page, OperationHistoryQuery.Get);
            }
        }
    }
    public class OperationHistoryQuery
    {
        public static string Get { get { return @"
            [prtnhstry].[Id]
          ,[prtnhstry].[CreatedAt]
          ,[prtnhstry].[CreatedBy]
          ,[prtnhstry].[ActionType]
          ,[prtnhstry].[Description]
          ,[prtnhstry].[AfterMath]
	      ,[crtr].[Name] [Creator]
          FROM [dbo].[OperationHistory] [prtnhstry]
          LEFT JOIN [dbo].[User] [crtr] ON [crtr].Id = [prtnhstry].[CreatedBy]
        "; } }
    }
}
