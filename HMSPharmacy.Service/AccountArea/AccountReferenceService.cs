using IqraHMS.OT.Data.Entities.AccountArea;
using IqraBase.Service;
using IqraService.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Service.AccountArea
{

    public class AccountReferenceService : AppBaseService<AccountReference>
    {
        private string Alias { get; set; } = "acntrfnc.";
        public override string GetName(string name)
        {
            name = name ?? "[CreatedAt]";
            switch (name.ToLower())
            {
                case "creator":
                    name = "ctr.Name";
                    break;
                case "account":
                    name = "acnt.[AccountName]";
                    break;
                case "isdeletedaccount":
                    name = "acnt.[IsDeletedAccount]";
                    break;
                default:
                    name = Alias + name;
                    break;
            }
            return base.GetName(name);
        }
        public override async Task<ResponseList<Pagger<Dictionary<string, object>>>> Get(Page page)
        {
            using (DBService db = new DBService(this))
            {
                page.SortBy = page.SortBy ?? "[CreatedAt] desc";
                return await db.GetPages(page, AccountReferenceQuery.Get);
            }
        }
        public async Task<ResponseList<List<Dictionary<string, object>>>> AutoComplete(Page page, string reference)
        {
            using (DBService db = new DBService())
            {
                page.SortBy = page.SortBy ?? "[Position]";
                return await db.List(page, AccountReferenceQuery.AutoComplete(reference));
            }
        }
    }
    public class AccountReferenceQuery
    {
        public static string Get { get { return @"acntrfnc.[Id]
      ,acntrfnc.[CreatedAt]
      ,acntrfnc.[CreatedBy]
      ,acntrfnc.[UpdatedAt]
      ,acntrfnc.[UpdatedBy]
      ,acntrfnc.[IsDeleted]
      ,acntrfnc.[AccountId]
      ,acntrfnc.[Reference]
      ,acntrfnc.[Position]
      ,acntrfnc.[Remarks]
      ,acntrfnc.[ActivityId]
	  ,acnt.[AccountName] [Account]
	  ,acnt.[IsDeleted] [IsDeletedAccount]
	  ,ctr.[Name] [Creator]
  FROM [dbo].[AccountReference] acntrfnc
  left join [dbo].[Account] acnt on acntrfnc.[AccountId] = acnt.Id
  left join [dbo].[User] ctr on acntrfnc.[CreatedBy]=ctr.Id"; } }
        public static string AutoComplete(string reference)
        {
            return @"Select * From (
Select acnt.[Id]
	  ,acnt.[AccountName] [Name]
	  ,[Position]
  FROM [dbo].[AccountReference] acntrfnc
  inner join [dbo].[Account] acnt on acntrfnc.[AccountId] = acnt.Id 
  where acnt.[IsDeleted] = 0 And acntrfnc.[IsDeleted] = 0 And acntrfnc.[Reference] = '" + reference + @"' 
  ) itm";
        }
    }
}
