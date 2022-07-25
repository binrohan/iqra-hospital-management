using IqraBase.Data.Models;
using IqraBase.Service;
using IqraBaseService.Helper;
using IqraHMS.Data.Entities.DoctorsArea;
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
    public class OperationSurgonService : AppBaseService<OperationSurgon>
    {
        private string Alias { get; set; }
        public OperationSurgonService()
        {
            Alias = "prtnsrgn.";
        }
        public override string GetName(string name)
        {
            switch (name.ToLower())
            {
                case "product":
                    name = "pdct.[Name]";
                    break;
                case "code":
                    name = "pdct.[Code]";
                    break;
                case "approvedquantity":
                    name = "dprtmntbdgt.[ApprovedQuantity]";
                    break;
                case "approvedamount":
                    name = "dprtmntbdgt.[ApprovedAmount]";
                    break;
                case "productcategory":
                    name = "pdctctgr.[Name]";
                    break;
                case "unittype":
                    name = "unt.[Name]";
                    break;
                case "department":
                    name = "dprtmnt.[Name]";
                    break;
                case "phone":
                    name = "dprtmnt.[Phone]";
                    break;
                case "departmentcategory":
                    name = "dprtmntctgr.[Name]";
                    break;
                case "creator":
                    name = "ctr.Name";
                    break;
                case "updator":
                    name = "updtr.Name";
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
                return await db.GetPages(page, OperationSurgonQuery.Get);
            }
        }

        public ResponseJson Remove(Guid id, Guid userId)
        {
            var operationSugonFromDb = Entity.Find(id);
            var operationSurgonModel = new OperationSurgonModel();

            if (operationSugonFromDb is null) return new ResponseJson()
            {
                IsError = true,
                Id = ErrorCodes.NotFound
            };

            operationSugonFromDb.CopyProperties<OperationSurgonModel>(operationSurgonModel);

            var operationFromDb = GetEntity<Operation>().Find(operationSugonFromDb.OperationId);

            var prevPayable = operationFromDb.TotalPayment;

            var currPayable = prevPayable - operationSugonFromDb.Payable;

            operationFromDb.TotalPayment = currPayable;

            var history = new OperationHistoryModel(operationSugonFromDb.OperationId);

            Insert<OperationHistory>(GetEntity<OperationHistory>(),
                                     history.RemoveSurgonHistory(operationSurgonModel, prevPayable, currPayable),
                                     userId);

            SetLog(operationSugonFromDb);
            
            operationSugonFromDb.IsDeleted = true;

            SaveChange();

            return new ResponseJson() { IsError = false };
        }

        public override ResponseJson OnCreate(AppBaseModel model, Guid userId, bool isValid)
        {
            var surgonModel = (OperationSurgonModel)model;

            var operationSurgonFromDb = Get(u => u.SurgonId == surgonModel.SurgonId
                                        && u.OperationId == surgonModel.OperationId).FirstOrDefault();
            var operationFromDb = GetEntity<Operation>().Find(surgonModel.OperationId);

            if (operationSurgonFromDb != null && !operationSurgonFromDb.IsDeleted)
                return new ResponseJson()
                {
                    IsError = true,
                    Msg = "This Surgon is already added.",
                    Id = -4,
                };

            var prevPayable = operationFromDb.TotalPayment;

            var currPayable = prevPayable + surgonModel.Payable;

            operationFromDb.TotalPayment = currPayable;

            var history = new OperationHistoryModel(surgonModel.OperationId);

            Insert<OperationHistory>(GetEntity<OperationHistory>(),
                                    history.AssignSurgonHistory(surgonModel, prevPayable, currPayable),
                                    userId);

            if (operationSurgonFromDb != null && operationSurgonFromDb.IsDeleted)
            {
                operationSurgonFromDb.Payable = surgonModel.Payable;
                operationSurgonFromDb.Remarks = surgonModel.Remarks;
                operationSurgonFromDb.IsDeleted = false;

                SaveChange();

                return new ResponseJson()
                {
                    IsError = false,
                    Msg = "This Surgon is Added.",
                    Id = 00,
                };
            }

            
            return base.OnCreate(model, userId, isValid);
            
        }
        public override ResponseJson Update(AppBaseModel model, Guid userId)
        {
            var appModel = (OperationSurgonModel)model;
            var data = Get(u => u.SurgonId == appModel.SurgonId && u.OperationId == appModel.OperationId && u.Id != appModel.Id).FirstOrDefault();
            if (data != null)
            {
                if (data.IsDeleted)
                {
                    data.IsDeleted = false;
                    SaveChange();
                    return new ResponseJson();
                }
                return new ResponseJson()
                {
                    IsError = true,
                    Msg = "This Product is already exist.",
                    Id = -4,
                };
            }
            return base.Update(model, userId);
        }

        public async Task<ResponseList<Pagger<Dictionary<string, object>>>> SurgonByOperatrion(Page page)
        {
            Alias = "dctr.";
            page.SortBy = page.SortBy ?? "[CreatedAt] desc";
            using (var db = new DBService(this))
            {
                var query = db.GetWhereClause(page);
                page.filter = new List<FilterModel>();
                if (string.IsNullOrEmpty(query))
                {
                    query = " Where dctr.[Id] Not in (SELECT [SurgonId] FROM [dbo].[OperationSurgon] Where [OperationId] = '" + page.Id + @"' And [IsDeleted] = 0) And dctr.[IsDeleted] = 0";
                }
                else
                {
                    query += " And dctr.[Id] Not in (SELECT [SurgonId] FROM [dbo].[OperationSurgon] Where [OperationId] ='" + page.Id + @"' And [IsDeleted] = 0) And dctr.[IsDeleted] = 0";
                }
                return await db.GetPages(page, OperationSurgonQuery.Surgon + query);
            }
        }
    }
    public class OperationSurgonQuery
    {
        public static string Get { get { return @"prtnsrgn.[Id]
      ,prtnsrgn.[CreatedAt]
      ,prtnsrgn.[CreatedBy]
      ,prtnsrgn.[UpdatedAt]
      ,prtnsrgn.[UpdatedBy]
      ,prtnsrgn.[IsDeleted]
      ,prtnsrgn.[Remarks]
      ,prtnsrgn.[ActivityId]
      ,prtnsrgn.[OperationId]
      ,prtnsrgn.[SurgonId]
      ,prtnsrgn.[Payable]
      ,dctr.[Name] [SurgonName]
	  ,dctr.[BMDCNo]
      ,dctr.[Phone]
	  ,dprtmnt.[Name] [Department]
      ,dsgntn.[Name] [Designation]
	  ,prtn.[Name] [Operation]
	  ,ctr.[Name] [Creator]
	  ,updtr.[Name] [Updator]
  FROM [dbo].[OperationSurgon] prtnsrgn
  left join [dbo].[Doctor] dctr on prtnsrgn.[SurgonId]=dctr.Id 
  left join [dbo].[User] usr on dctr.[StuffId] = usr.Id
  left join [dbo].[Designation] dsgntn on dctr.[DesignationId] = dsgntn.Id
  left join [dbo].[Department] dprtmnt on dctr.[DepartmentId] = dprtmnt.Id
  left join [dbo].[Operation] prtn on prtnsrgn.[OperationId] = prtn.Id
  left join [dbo].[User] [ctr] on prtnsrgn.[CreatedBy]=[ctr].Id 
  left join [dbo].[User] [updtr] on prtnsrgn.[UpdatedBy]=[updtr].Id"; } }

        public static string Surgon { get { return @"dctr.[Id]
	  ,dctr.[Name]
	  ,dctr.[BMDCNo]
	  ,dctr.[ChamberAddress]
      ,dctr.[Fee]
      ,dctr.[Phone]
      ,dctr.[DoctorTitle]
      ,dctr.[Gender]
      ,dctr.[Remarks]
	  ,usr.[EmployeeCode]
	  ,dprtmnt.[Name] [Department]
      ,dsgntn.[Name] [Designation]
  FROM [dbo].[Doctor] dctr
  inner join [dbo].[User] usr on dctr.[StuffId] = usr.Id
  left join [dbo].[Designation] dsgntn on dctr.[DesignationId] = dsgntn.Id
  left join [dbo].[Department] dprtmnt on dctr.[DepartmentId] = dprtmnt.Id"; } }
        public static string Details { get { return @"select " + Get; } }
    }
}
