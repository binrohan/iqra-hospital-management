using IqraBase.Data.Models;
using IqraBase.Service;
using IqraHMS.OT.Data.Entities.SurgeryArea;
using IqraHMS.OT.Data.Models.SurgeryArea;
using IqraService.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static App.SetUp.DefinedString;

namespace IqraHMS.OT.Service.SurgonArea
{
    public class SurgonService : DropDownBaseService<Surgon>
    {
        private string Alias { get; set; } = "srgn.";
        public override string GetName(string name)
        {
            name = name ?? "[CreatedAt]";
            switch (name.ToLower())
            {
                case "creator":
                    name = "ctr.Name";
                    break;
                case "updator":
                    name = "pdtr.Name";
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
                return await db.GetPages(page, SurgonQuery.Get());
            }
        }

        public override ResponseJson OnCreate(AppBaseModel model, Guid userId, bool isValid)
        {
            var surgonModel = (SurgonModel)model;

            var surgonFromDb = Get(s => s.SurgeryId == surgonModel.SurgeryId
                                        && s.DoctorId == surgonModel.DoctorId).FirstOrDefault();

            if (surgonFromDb != null && surgonFromDb.IsDeleted)
            {
                surgonFromDb.IsDeleted = false;
                surgonFromDb.Remarks = surgonModel.Remarks;
                surgonFromDb.Charge = surgonModel.Charge;
                surgonFromDb.Status = surgonModel.Status;

                SaveChange();

                return new ResponseJson()
                {
                    IsError = false,
                    Msg = "This surgon is register to the surgery.",
                    Id = 00,
                };
            }

            if (surgonFromDb != null && !surgonFromDb.IsDeleted)
            {
                return new ResponseJson()
                {
                    IsError = true,
                    Msg = "Doctor already registered to the surgery",
                    Id = -6,
                };
            }

            surgonModel.Status = SURGON_STATUS.ACTIVE;
            return base.OnCreate(surgonModel, userId, isValid);
        }

        public async Task<ResponseList<Pagger<Dictionary<string, object>>>> ExceptGetAll(Page page)
        {
            Alias = "dctr.";
            page.SortBy = page.SortBy ?? "[Name] asc";
            using (var db = new DBService(this))
            {
                var query = db.GetWhereClause(page);
                page.filter = new List<FilterModel>();
                if (string.IsNullOrEmpty(query))
                {
                    query = " Where dctr.[Id] Not in (SELECT [DoctorId] FROM [dbo].[Surgon] Where [SurgeryId] = '" + page.Id + @"' And [IsDeleted] = 0) And dctr.[IsDeleted] = 0";
                }
                else
                {
                    query += " And dctr.[Id] Not in (SELECT [SurgonId] FROM [dbo].[OperationSurgon] Where [SurgeryId] ='" + page.Id + @"' And [IsDeleted] = 0) And dctr.[IsDeleted] = 0";
                }
                return await db.GetPages(page, SurgonQuery.Surgon + query);
            }
        }
    }
    public class SurgonQuery
    {
        public static string Get()
        {
            return @"[srgn].[Id]
                    ,[srgn].[CreatedAt]
                    ,[srgn].[CreatedBy]
                    ,[srgn].[UpdatedAt]
                    ,[srgn].[UpdatedBy]
                    ,[srgn].[Remarks]
                    ,[srgn].[Status]
                    ,[srgn].[DoctorId]
                    ,[srgn].[SurgeryId]
                    ,[srgn].[Charge]
	                ,[dctr].Name [DoctorName]
	                ,[dctr].BMDCNo
	                ,[dctr].DoctorTitle
	                ,[dctr].Phone
	                ,[dprtmnt].Name [Department]
	                ,[dsgntn].Name [Designation]
                    FROM [dbo].[Surgon] [srgn]
                    LEFT JOIN [dbo].[Doctor] [dctr] ON [dctr].Id = [srgn].DoctorId
                    LEFT JOIN [dbo].[Designation] [dsgntn] ON [dctr].DesignationId = [dsgntn].Id
                    LEFT JOIN [dbo].[Department] [dprtmnt] ON [dctr].DepartmentId = [dprtmnt].Id";
        }

        public static string Surgon 
        { 
            get 
            { 
               return @"dctr.[Id]
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
              left join [dbo].[Department] dprtmnt on dctr.[DepartmentId] = dprtmnt.Id"; 
            } 
        }
    }
}

