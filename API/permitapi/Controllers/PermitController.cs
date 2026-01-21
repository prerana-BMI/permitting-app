using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using contract;
using contract.Entities;
using Data.DbEntities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using Microsoft.EntityFrameworkCore;

namespace permitapi.Controllers
{

    [Authorize]

    [Route("api/[controller]")]
    public class PermitController : ControllerBase
    {
        private readonly permit_account_serviceContext _context;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUserService;

        public PermitController(permit_account_serviceContext context, IMapper mapper, ICurrentUserService currentUserService)
        {
            _context = context;
            _mapper = mapper;
            _currentUserService = currentUserService;
        }
        
        [HttpGet]
        [Route("GetAllMasterPermits")]
        public BaseReturn<List<EPermitMaster>> GetAllMasterPermits(EPermitMaster Request)
        {
            var BaseObj = new BaseReturn<List<EPermitMaster>>();
            List<EPermitMaster> Result = new List<EPermitMaster>();
            try
            {
               
                Result = _context.PermitMasters.Where(a =>
                                                (a.Category.Contains(Request.Category) || string.IsNullOrEmpty(Request.Category)) &&
                                                (a.PermitName.Contains(Request.PermitName) || string.IsNullOrEmpty(Request.PermitName)))
                .Select(a => new EPermitMaster
                {
                    Category = a.Category,
                    PermitName = a.PermitName,
                    State = a.State,
                    City = a.City,
                    County = a.County,
                    Level = a.Level,
                    RegulatoryAgencyName = a.RegulatoryAgencyName,
                    Id = a.Id,
                    pageIndex = Request.pageIndex,
                    pageSize = Request.pageSize
                })
                .OrderByDescending(a => a.Id)
                .ToList();
                BaseObj.Count = Result.Count;
                if (Result.Count > 0 && Request.pageSize > 0)
                {
                    Result = Result.Skip((Request.pageIndex - 1) * Request.pageSize).Take(Request.pageSize).ToList();
                }
                BaseObj.Data = Result;
                BaseObj.Success = true;

            }
            catch (Exception ex)
            {
                BaseObj.Message = ex.Message;
                BaseObj.Success = false;
            }
            finally
            {

            }
            return BaseObj;
        }

        [HttpGet]
        [Route("GetPermitByLocation")]
        public BaseReturn<List<EPermitMaster>> GetPermitByLocation(EPermitByLocation Request)
        {
            var BaseObj = new BaseReturn<List<EPermitMaster>>();
            List<EPermitMaster> Result = new List<EPermitMaster>();
            try
            {
                if (Request.Level == "State")
                {
                    Result = _context.PermitMasters.Where(a =>
                    Request.State.Contains(a.State) && 
                    a.Level == "State"  && 
                   (string.IsNullOrEmpty(Request.Category) || a.Category == Request.Category) &&
                   (string.IsNullOrEmpty(Request.PermitName) || a.PermitName == Request.PermitName) &&
                   (string.IsNullOrEmpty(Request.RegulatoryAgencyName) || a.RegulatoryAgencyName == Request.RegulatoryAgencyName) && !string.IsNullOrEmpty(a.PermitName))
                                        .Select(a => new EPermitMaster
                                                           {
                                                               Category = a.Category,
                                                               PermitName = a.PermitName,
                                                               State = a.State,
                                                               City = a.City,
                                                               County = a.County,
                                                               Level = a.Level,
                                                               RegulatoryAgencyName = a.RegulatoryAgencyName,
                                                               Id = a.Id
                                                           })
                                        .OrderByDescending(a => a.Level)
                                        .ToList();

                }
               else if (Request.Level == "County")
                {
                    Result = _context.PermitMasters.Where(a =>
                    Request.State.Contains(a.State) &&
                    Request.County.Contains(a.County) &&
                    a.Level == "County"  && 
                   (string.IsNullOrEmpty(Request.Category) || a.Category == Request.Category) &&
                   (string.IsNullOrEmpty(Request.PermitName) || a.PermitName == Request.PermitName) &&
                   (string.IsNullOrEmpty(Request.RegulatoryAgencyName) || a.RegulatoryAgencyName == Request.RegulatoryAgencyName) && !string.IsNullOrEmpty(a.PermitName))
                                        .Select(a => new EPermitMaster
                                                           {
                                                               Category = a.Category,
                                                               PermitName = a.PermitName,
                                                               State = a.State,
                                                               City = a.City,
                                                               County = a.County,
                                                               Level = a.Level,
                                                               RegulatoryAgencyName = a.RegulatoryAgencyName,
                                                               Id = a.Id
                                                           })
                                        .OrderByDescending(a => a.Level)
                                        .ToList();

                }

                else if (Request.Level == "City")
                {

                    Result = _context.PermitMasters.Where(a =>
                    Request.State.Contains(a.State)  &&
                    Request.County.Contains(a.County) &&
                    Request.City.Contains(a.City) &&
                    a.Level == "City"  && 
                   (string.IsNullOrEmpty(Request.Category) || a.Category == Request.Category) &&
                   (string.IsNullOrEmpty(Request.PermitName) || a.PermitName == Request.PermitName) &&
                   (string.IsNullOrEmpty(Request.RegulatoryAgencyName) || a.RegulatoryAgencyName == Request.RegulatoryAgencyName) && !string.IsNullOrEmpty(a.PermitName)
                                                           ).Select(a => new EPermitMaster
                                                           {
                                                               Category = a.Category,
                                                               PermitName = a.PermitName,
                                                               State = a.State,
                                                               City = a.City,
                                                               County = a.County,
                                                               Level = a.Level,
                                                               RegulatoryAgencyName = a.RegulatoryAgencyName,
                                                               Id = a.Id
                                                           })
                           .OrderByDescending(a => a.Level)
                           .ToList();




                }

                 else if (Request.Level == "All")
                {

                    Result = _context.PermitMasters.Where(a =>
                    Request.State.Contains(a.State)  &&
                    Request.County.Contains(a.County) &&
                    Request.City.Contains(a.City) &&
                   (string.IsNullOrEmpty(Request.Category) || a.Category == Request.Category) &&
                   (string.IsNullOrEmpty(Request.PermitName) || a.PermitName == Request.PermitName) &&
                   (string.IsNullOrEmpty(Request.RegulatoryAgencyName) || a.RegulatoryAgencyName == Request.RegulatoryAgencyName) && !string.IsNullOrEmpty(a.PermitName) ||
                    a.Level == "Federal" 
                                                           ).Select(a => new EPermitMaster
                                                           {
                                                               Category = a.Category,
                                                               PermitName = a.PermitName,
                                                               State = a.State,
                                                               City = a.City,
                                                               County = a.County,
                                                               Level = a.Level,
                                                               RegulatoryAgencyName = a.RegulatoryAgencyName,
                                                               Id = a.Id
                                                           })
                           .OrderByDescending(a => a.Level)
                           .ToList();




                }
                   
                else 
                {

                    Result = _context.PermitMasters.Where(a =>
                    a.Level == "Federal" &&
                   (string.IsNullOrEmpty(Request.Category) || a.Category == Request.Category) &&
                   (string.IsNullOrEmpty(Request.PermitName) || a.PermitName == Request.PermitName) &&
                   (string.IsNullOrEmpty(Request.RegulatoryAgencyName) || a.RegulatoryAgencyName == Request.RegulatoryAgencyName) && !string.IsNullOrEmpty(a.PermitName))
                                                         .Select(a => new EPermitMaster
                                                           {
                                                               Category = a.Category,
                                                               PermitName = a.PermitName,
                                                               State = a.State,
                                                               City = a.City,
                                                               County = a.County,
                                                               Level = a.Level,
                                                               RegulatoryAgencyName = a.RegulatoryAgencyName,
                                                               Id = a.Id
                                                           })
                           .OrderByDescending(a => a.Level)
                           .ToList();



                }
                
                    BaseObj.Count = Result.Count;
                    BaseObj.Data = Result;
                    BaseObj.Success = true;
               
            }
            catch (Exception ex)
            {
                BaseObj.Message = ex.Message;
                BaseObj.Success = false;
            }
            finally
            {

            }
            return BaseObj;
        }

        [HttpGet]
        [Route("GetAllFederalPermits")]
        public BaseReturn<List<EPermitMaster>> GetAllFederalPermits(EPermitByLocation Request)
        {
            var BaseObj = new BaseReturn<List<EPermitMaster>>();
            List<EPermitMaster> Result = new List<EPermitMaster>();
            try
            {

                Result = _context.PermitMasters.Where(a =>
                                            a.Level == "Federal" && 
                                              (a.Category == Request.Category || string.IsNullOrEmpty(Request.Category)) &&
                                                  (a.PermitName == Request.PermitName || string.IsNullOrEmpty(Request.PermitName)) &&
                                                   (a.RegulatoryAgencyName == Request.RegulatoryAgencyName || string.IsNullOrEmpty(Request.RegulatoryAgencyName))

                                                )
                .Select(a => new EPermitMaster
                {
                    Category = a.Category,
                    PermitName = a.PermitName,
                    State = a.State,
                    City = a.City,
                    County = a.County,
                    Level = a.Level,
                    RegulatoryAgencyName = a.RegulatoryAgencyName,
                    Id = a.Id
                })
                .OrderByDescending(a => a.Id)
                .ToList();
                BaseObj.Count = Result.Count;
                BaseObj.Data = Result;
                BaseObj.Success = true;

            }
            catch (Exception ex)
            {
                BaseObj.Message = ex.Message;
                BaseObj.Success = false;
            }
            finally
            {

            }
            return BaseObj;
        }

        [HttpGet]
        [Route("GetPermitById")]
        public BaseReturn<EPermitMasterDetail> GetPermitById(int PermitId)
        {
            var BaseObj = new BaseReturn<EPermitMasterDetail>();

            try
            {
                BaseObj.Data = _context.PermitMasters
                  .Where(master => master.Id == PermitId)
                  .Join(_context.PermitMasterDetails.Where(a => a.PermitId == PermitId),
                          master => master.Id,
                          detail => detail.PermitId,
                          (master, detail) => new EPermitMasterDetail
                          {
                              Category = master.Category,
                              RegulatoryAgencyName = master.RegulatoryAgencyName,
                              RegulatoryAgencyId = master.RegulatoryAgencyId,
                              Level = master.Level,
                              State = master.State,
                              City = master.City,
                              County = master.County,
                              CreatedBy = master.CreatedBy,
                              CreatedOn = master.CreatedOn,
                              TypeOfProject = master.TypeOfProject,
                              Description = detail.Description,
                              Threshold = detail.Threshold,
                              PrepTimeMin = detail.PrepTimeMin,
                              PrepTimeMax = detail.PrepTimeMax,
                              AgencyReviewTimeMin = detail.AgencyReviewTimeMin,
                              AgencyReviewTimeMax = detail.AgencyReviewTimeMax,
                              BasicFees = detail.BasicFees,
                              PermitName = master.PermitName,
                              Id = master.Id
                          })
                  .FirstOrDefault();
                BaseObj.Success = true;

            }
            catch (Exception ex)
            {
                BaseObj.Message = ex.Message;
                BaseObj.Success = false;
            }
            finally
            {

            }
            return BaseObj;
        }

        [HttpPost]
        [Route("SavePermits")]
        public BaseReturn<int> SavePermits([FromBody] EPermitMasterDetail Request)
        {
            var BaseObj = new BaseReturn<int>();

            try
            {
                if (Request.Id > 0)
                {
                    var permitObj = _context.PermitMasters.FirstOrDefault(a => a.Id == Request.Id);
                    var PermitDetailsObj = _context.PermitMasterDetails.FirstOrDefault(a => a.PermitId == Request.PermitId);

                    if (permitObj != null && PermitDetailsObj != null)
                    {
                        permitObj.Category = Request.Category;
                        permitObj.PermitName = Request.PermitName;
                        permitObj.TypeOfProject = Request.TypeOfProject;
                        permitObj.Level = Request.Level;
                        permitObj.City = Request.City;
                        permitObj.State = Request.State;
                        permitObj.CreatedBy = _currentUserService.User.UserId;
                        permitObj.RegulatoryAgencyName = Request.RegulatoryAgencyName;
                        permitObj.RegulatoryAgencyId = Request.RegulatoryAgencyId;
                        PermitDetailsObj.Description = Request.Description;
                        PermitDetailsObj.Threshold = Request.Threshold;
                        PermitDetailsObj.PrepTimeMin = Request.PrepTimeMin;
                        PermitDetailsObj.PrepTimeMax = Request.PrepTimeMax;
                        PermitDetailsObj.AgencyReviewTimeMin = Request.AgencyReviewTimeMin;
                        PermitDetailsObj.AgencyReviewTimeMax = Request.AgencyReviewTimeMax;
                        PermitDetailsObj.BasicFees = Request.BasicFees;
                        PermitDetailsObj.AdditionalBasic = Request.AdditionalBasic;
                        _context.PermitMasters.Update(permitObj);
                        _context.PermitMasterDetails.Update(PermitDetailsObj);

                        BaseObj.Message = "Permit Detils Updated";
                    }
                }
                else
                {
                    var PermitObj = new PermitMaster()
                    {
                        Category = Request.Category,
                        PermitName = Request.PermitName,
                        Level = Request.Level,
                        City = Request.City,
                        State = Request.State,
                        RegulatoryAgencyName = Request.RegulatoryAgencyName,
                        RegulatoryAgencyId = Request.RegulatoryAgencyId,
                        TypeOfProject = Request.TypeOfProject,
                    };
                    _context.PermitMasters.Add(PermitObj);
                    _context.SaveChanges();
                    _context.PermitMasterDetails.Add(new PermitMasterDetail()
                    {
                        Description = Request.Description,
                        Threshold = Request.Threshold,
                        PrepTimeMin = Request.PrepTimeMin,
                        PrepTimeMax = Request.PrepTimeMax,
                        AgencyReviewTimeMin = Request.AgencyReviewTimeMin,
                        AgencyReviewTimeMax = Request.AgencyReviewTimeMax,
                        BasicFees = Request.BasicFees,
                        AdditionalBasic = Request.AdditionalBasic,
                        PermitId = PermitObj.Id
                    });

                    _context.SaveChanges();
                    BaseObj.Message = "New Permit Added";

                }
                BaseObj.Success = true;

            }
            catch (Exception ex)
            {
                BaseObj.Message = ex.Message;
                BaseObj.Success = false;
            }
            finally
            {

            }
            return BaseObj;
        }

        [HttpPost]
        [Route("SavePermitMatrix")]
        public BaseReturn<int> SavePermitMatrix([FromBody] EPermitMatrix Request)
        {
            var BaseObj = new BaseReturn<int>();

            try
            {

                if (Request.Id > 0)
                {
                    var UpdatePermit = _context.PermitMatrices.Where(a => a.Id == Request.Id).FirstOrDefault();
                    UpdatePermit.PermitList = Request.PermitList;

                    _context.PermitMatrices.Update(UpdatePermit);
                    _context.SaveChanges();
                    BaseObj.Message = "Matrix Updated";
                    BaseObj.Success = true;
                    return BaseObj;
                }
                var PermitObj = new PermitMatrix()
                {
                    TypeOfProject = Request.TypeOfProject,
                    MatrixName = Request.MatrixName,
                    ClientName = Request.ClientName,
                    PermitList = Request.PermitList,
                    CreatedBy = _currentUserService.User.UserId,
                    Status = 1
                };
                _context.PermitMatrices.Add(PermitObj);
                _context.SaveChanges();

                BaseObj.Message = "New Matrix Added";


                BaseObj.Success = true;

            }
            catch (Exception ex)
            {
                BaseObj.Message = ex.Message;
                BaseObj.Success = false;
            }
            finally
            {

            }
            return BaseObj;
        }

        [HttpGet]
        [Route("GetAllMatrix")]
        public BaseReturn<List<EPermitMatrix>> GetAllMatrix(EPermitMatrix Request)
        {
            var BaseObj = new BaseReturn<List<EPermitMatrix>>();

            try
            {
                var Result = _context.PermitMatrices.Where(a => (a.MatrixName == Request.MatrixName || string.IsNullOrEmpty(Request.MatrixName)) &&
                                                       (a.ClientName == Request.ClientName || Request.ClientName == null) &&  a.Status== 1)
                                                       .Select(a => new EPermitMatrix()
                                                        {
                                                            TypeOfProject = a.TypeOfProject,
                                                            MatrixName = a.MatrixName,
                                                            ClientName = a.ClientName,
                                                            PermitCount = a.PermitList.Split(new[] { "," }, StringSplitOptions.None).Length,
                                                            Id = a.Id

                                                        })
                                                        .OrderByDescending(a => a.Id)
                                                        .ToList();

                if (Result.Count > 0 && Request.pageSize > 0)
                {
                    Result = Result.Skip((Request.pageIndex - 1) * Request.pageSize).Take(Request.pageSize).ToList();
                }
                BaseObj.Data = Result;
                BaseObj.Count = Result.Count;
                BaseObj.Message = "";
                BaseObj.Success = true;

            }
            catch (Exception ex)
            {
                BaseObj.Message = ex.Message;
                BaseObj.Success = false;
            }
            finally
            {

            }
            return BaseObj;
        }

        [HttpGet]
        [Route("GetMatrixDetailsById")]
        public BaseReturn<EMatrixWisePermit> GetMatrixDetailsById(int MatrixId)
        {
            var BaseObj = new BaseReturn<EMatrixWisePermit>();

            try
            {
                var Result = _context.PermitMatrices.Where(a => a.Id == MatrixId)
                       .Select(a => new EPermitMatrix()
                    {
                        TypeOfProject = a.TypeOfProject,
                        MatrixName = a.MatrixName,
                        ClientName = a.ClientName,
                        PermitList = a.PermitList,
                        Id = a.Id
                    })
                    .FirstOrDefault();

                if (Result == null || string.IsNullOrEmpty(Result.PermitList))
                {
                    BaseObj.Message = "Matrix not found or PermitList is empty.";
                    BaseObj.Success = false;
                    return BaseObj;
                }

                int[] permitData = Result.PermitList
                    .Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(int.Parse)
                    .ToArray();

                var data = _context.PermitMasters
                    .Where(pm => permitData.Contains(pm.Id))
                    .Join(_context.PermitMasterDetails.Where(pmd => permitData.Contains(pmd.PermitId ?? 0)),
                        permit => permit.Id,
                        detail => detail.PermitId,
                        (permit, detail) => new EPermitMasterDetail
                        {
                            Category = permit.Category,
                            TypeOfProject = permit.TypeOfProject,
                            Level = permit.Level,
                            State = permit.State,
                            City = permit.City,
                            PermitName = permit.PermitName,
                            RegulatoryAgencyName = permit.RegulatoryAgencyName,
                            PrepTimeMin = detail.PrepTimeMin,
                            PrepTimeMax = detail.PrepTimeMax,
                            AgencyReviewTimeMin = detail.AgencyReviewTimeMin,
                            AgencyReviewTimeMax = detail.AgencyReviewTimeMax,
                            BasicFees = detail.BasicFees,
                            Id =permit.Id,
                            Description = detail.Description,
                            Threshold = detail.Threshold
                        })
                    .ToList();

                var res = new EMatrixWisePermit()
                {
                    MatrixDetails = new EPermitMatrix()
                    {
                        TypeOfProject = Result.TypeOfProject,
                        MatrixName = Result.MatrixName,
                        ClientName = Result.ClientName,
                        PermitList = Result.PermitList,
                        Id = Result.Id
                    },
                    PermitList = data
                };

                BaseObj.Data = res;
                BaseObj.Message = "";
                BaseObj.Success = true;
            }
            catch (Exception ex)
            {
                BaseObj.Message = ex.Message;
                BaseObj.Success = false;
            }

            return BaseObj;
        }

        [HttpGet]
        [Route("ExportPermitToExcel")]
        public BaseReturn<List<EPermitMasterDetail>> ExportPermitsToExcel(EPermitByLocation Request)
        {
            var BaseObj = new BaseReturn<List<EPermitMasterDetail>>();
            List<EPermitMasterDetail> Result = new List<EPermitMasterDetail>();
            try
            {
                if (Request.Level != "All")
                {
                    Result = _context.PermitMasters.Where(a =>
                       (Request.Level == "Federal" ? true : Request.State.Contains(a.State)) &&
                       (Request.City == null || Request.City.Count == 0 || Request.Level != "City" ? true : Request.City.Contains(a.City)) &&
                       (string.IsNullOrEmpty(Request.Category) || a.Category == Request.Category) &&
                       (string.IsNullOrEmpty(Request.PermitName) || a.PermitName == Request.PermitName) &&
                       (string.IsNullOrEmpty(Request.RegulatoryAgencyName) || a.RegulatoryAgencyName == Request.RegulatoryAgencyName) && !string.IsNullOrEmpty(a.PermitName)
                                                   ).ToList()
                                                    .Join(_context.PermitMasterDetails,
                                                    permit => permit.Id,
                                                    detail => detail.PermitId,
                                                    (permit, detail) => new { permit, detail })

                    .Select(a => new EPermitMasterDetail
                    {
                        Category = a.permit.Category,
                        PermitName = a.permit.PermitName,
                        State = a.permit.State,
                        City = a.permit.City,

                        Level = a.permit.Level,
                        RegulatoryAgencyName = a.permit.RegulatoryAgencyName,
                        Description = a.detail.Description,
                        Threshold = a.detail.Threshold,
                        PrepTimeMin = a.detail.PrepTimeMin,
                        PrepTimeMax = a.detail.PrepTimeMax,
                        AgencyReviewTimeMin = a.detail.AgencyReviewTimeMin,
                        AgencyReviewTimeMax = a.detail.AgencyReviewTimeMax,
                        BasicFees = a.detail.BasicFees,
                        Id = a.permit.Id
                    })
                    .OrderByDescending(a => a.Id)
                    .ToList();

                }
                else
                {

                    Result = _context.PermitMasters.Where(a =>
                       (Request.State.Contains(a.State) || Request.City.Contains(a.City) || a.Level == "Federal") &&
                       (string.IsNullOrEmpty(Request.Category) || a.Category == Request.Category) &&
                       (string.IsNullOrEmpty(Request.PermitName) || a.PermitName == Request.PermitName) &&
                       (string.IsNullOrEmpty(Request.RegulatoryAgencyName) || a.RegulatoryAgencyName == Request.RegulatoryAgencyName) && !string.IsNullOrEmpty(a.PermitName)
                                                   ).ToList()
                                                    .Join(_context.PermitMasterDetails,
                                                    permit => permit.Id,
                                                    detail => detail.PermitId,
                                                    (permit, detail) => new { permit, detail })

                    .Select(a => new EPermitMasterDetail
                    {
                        Category = a.permit.Category,
                        PermitName = a.permit.PermitName,
                        State = a.permit.State,
                        City = a.permit.City,

                        Level = a.permit.Level,
                        RegulatoryAgencyName = a.permit.RegulatoryAgencyName,
                        Description = a.detail.Description,
                        Threshold = a.detail.Threshold,
                        PrepTimeMin = a.detail.PrepTimeMin,
                        PrepTimeMax = a.detail.PrepTimeMax,
                        AgencyReviewTimeMin = a.detail.AgencyReviewTimeMin,
                        AgencyReviewTimeMax = a.detail.AgencyReviewTimeMax,
                        BasicFees = a.detail.BasicFees,
                        Id = a.permit.Id
                    })
                    .OrderByDescending(a => a.Id)
                    .ToList();
                }
                BaseObj.Count = Result.Count;
                BaseObj.Data = Result;
                BaseObj.Success = true;
            }
            catch (Exception ex)
            {
                BaseObj.Message = ex.Message;
                BaseObj.Success = false;
            }
            finally
            {

            }
            return BaseObj;
        }


        [HttpPost]
        [Route("DeleteMatrixDetailsById")]
        public BaseReturn<bool> DeleteMatrixDetailsById(int MatrixId)
        {
            var BaseObj = new BaseReturn<bool>();

            try
            {
                var Result = _context.PermitMatrices.Where(a => a.Id == MatrixId).FirstOrDefault();
                Result.Status = 2;
                _context.PermitMatrices.Update(Result);
                _context.SaveChanges();

                if (Result == null)
                {
                    BaseObj.Message = "Record not Found";
                    BaseObj.Success = false;
                    return BaseObj;
                }
                BaseObj.Data = true;
                BaseObj.Message = "Matrix Deleted Successfully";
                BaseObj.Success = true;
            }
            catch (Exception ex)
            {
                BaseObj.Message = ex.Message;
                BaseObj.Success = false;
            }

            return BaseObj;
        }

        [Route("DownloadExcel")]
        public IActionResult DownloadExcel()
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using var package = new ExcelPackage();
            var mainSheet = package.Workbook.Worksheets.Add("Permit");

            // FINAL ORDERED HEADERS
            string[] headers = new[]
            {
        "Category", "Level", "State", "City", "Permit Name",
        "Basic Fees", "Prep Time Min", "Prep Time Max",
        "Agency Review Time Min", "Agency Review Time Max",
        "Type Of Project", "Additional Basic Fees",
        "Description", "Threshold",
        "Regulatory Agency",         // O (15)
        "Regulatory Agency ID"       // P (16) hidden
    };

            for (int i = 0; i < headers.Length; i++)
                mainSheet.Cells[1, i + 1].Value = headers[i];

            // HEADER STYLING
            using (var range = mainSheet.Cells[1, 1, 1, headers.Length])
            {
                range.Style.Font.Bold = true;
                range.Style.Font.Color.SetColor(System.Drawing.Color.White);
                range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(79, 129, 189));
                range.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                range.Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
            }

            // DB DATA
            var permitData = _context.PermitMasters.AsNoTracking().ToList();
            var cityData = _context.CityMasters.AsNoTracking().ToList();
            var LevelList = new List<string> { "Federal", "State", "County" };

            var categoriesList = permitData
                .Where(a => !string.IsNullOrEmpty(a.Category))
                .Select(a => a.Category).Distinct().OrderBy(a => a).ToList();

            var CityList = cityData.Select(a => a.City).Distinct().OrderBy(a => a).ToList();
            var StateList = cityData.Select(a => a.State).Distinct().OrderBy(a => a).ToList();

            var regulatoryLookup = permitData
                .Where(a => !string.IsNullOrEmpty(a.RegulatoryAgencyName))
                .Select(a => new { a.RegulatoryAgencyName, a.RegulatoryAgencyId })
                .Distinct()
                .OrderBy(a => a.RegulatoryAgencyName)
                .ToList();

            var TypeOfprojectList = permitData.Select(a => a.TypeOfProject).Distinct().OrderBy(a => a).ToList();

            // CREATE HIDDEN SHEET
            var listSheet = package.Workbook.Worksheets.Add("Lists");

            // CATEGORY LIST (Column A)
            for (int i = 0; i < categoriesList.Count; i++)
                listSheet.Cells[i + 1, 1].Value = categoriesList[i];

            // City List (Column B)
            for (int i = 0; i < CityList.Count; i++)
                listSheet.Cells[i + 1, 2].Value = CityList[i];

            // State List (Column C)
            for (int i = 0; i < StateList.Count; i++)
                listSheet.Cells[i + 1, 3].Value = StateList[i];

            // Level List (Column D)
            for (int i = 0; i < LevelList.Count; i++)
                listSheet.Cells[i + 1, 4].Value = LevelList[i];

            // Regulatory List (Name = Column E, ID = Column F)
            for (int i = 0; i < regulatoryLookup.Count; i++)
            {
                listSheet.Cells[i + 1, 5].Value = regulatoryLookup[i].RegulatoryAgencyName;
                listSheet.Cells[i + 1, 6].Value = regulatoryLookup[i].RegulatoryAgencyId;
            }
            for (int i = 0; i < TypeOfprojectList.Count; i++)
            {
                listSheet.Cells[i + 1, 11].Value = TypeOfprojectList[i];

            }

            // Create named ranges
            package.Workbook.Names.Add("CategoryList", listSheet.Cells[$"A1:A{categoriesList.Count}"]);
            package.Workbook.Names.Add("CityList", listSheet.Cells[$"B1:B{CityList.Count}"]);
            package.Workbook.Names.Add("StateList", listSheet.Cells[$"C1:C{StateList.Count}"]);
            package.Workbook.Names.Add("LevelList", listSheet.Cells[$"D1:D{LevelList.Count}"]);
            package.Workbook.Names.Add("RegAgencyLookup", listSheet.Cells[$"E1:F{regulatoryLookup.Count}"]);
            package.Workbook.Names.Add("TypeOfprojectList", listSheet.Cells[$"K1:K{TypeOfprojectList.Count}"]);

            // Add dropdowns
            mainSheet.DataValidations.AddListValidation("A2:A100").Formula.ExcelFormula = "=CategoryList";
            mainSheet.DataValidations.AddListValidation("B2:B100").Formula.ExcelFormula = "=LevelList";
            mainSheet.DataValidations.AddListValidation("C2:C100").Formula.ExcelFormula = "=StateList";
            mainSheet.DataValidations.AddListValidation("D2:D100").Formula.ExcelFormula = "=CityList";
            mainSheet.DataValidations.AddListValidation("K2:K100").Formula.ExcelFormula = "=TypeOfprojectList";
            // Regulatory Agency dropdown at Column "O" (15)
            var regVal = mainSheet.DataValidations.AddListValidation("O2:O100");
            regVal.Formula.ExcelFormula = "=INDEX(RegAgencyLookup,0,1)";

            // Fill Regulatory Agency ID at Column "P" (16)
            for (int row = 2; row <= 500; row++)
            {
                mainSheet.Cells[row, 16].Formula = $"IFERROR(VLOOKUP(O{row},RegAgencyLookup,2,FALSE),\"\")";
            }

            // Hide ID column (P)
            mainSheet.Column(16).Hidden = true;

            // Hide hidden sheet
            listSheet.Hidden = eWorkSheetHidden.VeryHidden;

            // Auto-fit
            mainSheet.Cells.AutoFitColumns();

            return File(
                package.GetAsByteArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "PermitBulkUpload.xlsx"
            );
        }


        [HttpPost("ImportExcelFile")]
        public BaseReturn<bool> ReadExcel(IFormFile file)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            var BaseObj = new BaseReturn<bool>();
            if (file == null || file.Length == 0)
            {
                BaseObj.Success = false;
                BaseObj.Data = false;
                BaseObj.Message = "File not found";
                return BaseObj;
            }

            var rowList = new List<Dictionary<string, string>>();
            using (var stream = file.OpenReadStream())
            using (var package = new ExcelPackage(stream))
            {
                var ws = package.Workbook.Worksheets[0];

                int colCount = ws.Dimension.End.Column;
                int rowCount = GetLastUsedRow(ws);   // ← only read rows with data

                var headers = new List<string>();

                // Read headers
                for (int col = 1; col <= colCount; col++)
                    headers.Add(ws.Cells[1, col].Text);

                // Read data rows
                for (int row = 2; row <= rowCount; row++)
                {
                    var rowData = new Dictionary<string, string>();

                    for (int col = 1; col <= colCount; col++)
                    {
                        string header = headers[col - 1];
                        string value = ws.Cells[row, col].Text?.Trim();

                        rowData[header] = value;
                    }

                    rowList.Add(rowData);


                }
            }
            var PermitObjBulk = new PermitMaster();
            var PermitObjBulkList = new List<PermitMaster>();
            var PermitMasterDetailsList = new List<PermitMasterDetail>();
            var PermitMasterDetails = new PermitMasterDetail();

            foreach (var item in rowList)
            {
                PermitObjBulk = new PermitMaster()
                {
                    Category = item.GetValueOrDefault("Category"),
                    Level = item.GetValueOrDefault("Level"),
                    State = item.GetValueOrDefault("State"),
                    City = item.GetValueOrDefault("City"),
                    PermitName = item.GetValueOrDefault("Permit Name"),
                    RegulatoryAgencyName = item.GetValueOrDefault("Regulatory Agency"),
                    RegulatoryAgencyId = Convert.ToInt32(item.GetValueOrDefault("Regulatory Agency ID")),
                    TypeOfProject = item.GetValueOrDefault("Type Of Project"),
                    FromBulkUpload = true
                };

                var PermitMasterDetailsObj = new PermitMasterDetail()
                {
                    BasicFees = Convert.ToDecimal(item.GetValueOrDefault("Basic Fees")),
                    PrepTimeMin = Convert.ToInt32(item.GetValueOrDefault("Prep Time Min")),
                    PrepTimeMax = Convert.ToInt32(item.GetValueOrDefault("Prep Time Max")),
                    AgencyReviewTimeMin = Convert.ToInt32(item.GetValueOrDefault("Agency Review Time Min")),
                    AgencyReviewTimeMax = Convert.ToInt32(item.GetValueOrDefault("Agency Review Time Max")),
                    AdditionalBasic = item.GetValueOrDefault("Additional Basic Fees"),
                    Description = item.GetValueOrDefault("Description"),
                    Threshold = item.GetValueOrDefault("Threshold")

                };
                PermitObjBulkList.Add(PermitObjBulk);
                PermitMasterDetailsList.Add(PermitMasterDetailsObj);

            }
            _context.PermitMasters.AddRange(PermitObjBulkList);
            _context.SaveChanges();
            for (int i = 0; i < PermitObjBulkList.Count; i++)
            {
                PermitMasterDetailsList[i].PermitId = PermitObjBulkList[i].Id;
            }

            _context.PermitMasterDetails.AddRange(PermitMasterDetailsList);
            _context.SaveChanges();
            BaseObj.Success = true;
            BaseObj.Data = true;
            BaseObj.Message = "Permits uploaded successfully";
            return BaseObj;

        }

        private int GetLastUsedRow(ExcelWorksheet ws)
        {
            int lastRow = ws.Dimension.End.Row;

            for (int row = lastRow; row >= 1; row--)
            {
                bool hasValue = false;

                for (int col = 1; col <= ws.Dimension.End.Column; col++)
                {
                    if (!string.IsNullOrWhiteSpace(ws.Cells[row, col].Text))
                    {
                        hasValue = true;
                        break;
                    }
                }

                if (hasValue)
                    return row;
            }

            return 1; // only header exists
        }



    }
}