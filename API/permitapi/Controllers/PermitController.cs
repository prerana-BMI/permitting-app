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
                if (Request.Level == "State" || Request.Level == "City")
                {
                    Result = _context.PermitMasters.Where(a =>
                    Request.State.Contains(a.State) &&
                   (Request.Level != "City" ? true : Request.City.Contains(a.City)) &&
                   (string.IsNullOrEmpty(Request.Category) || a.Category == Request.Category) &&
                   (string.IsNullOrEmpty(Request.PermitName) || a.PermitName == Request.PermitName) &&
                   (string.IsNullOrEmpty(Request.RegulatoryAgencyName) || a.RegulatoryAgencyName == Request.RegulatoryAgencyName)
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
                           .OrderByDescending(a => a.Id)
                           .ToList();

                }
                else if (Request.Level == "All")
                {

                    Result = _context.PermitMasters.Where(a =>
                    Request.State.Contains(a.State) || Request.City.Contains(a.City) || a.Level == "Federal" &&
                   (string.IsNullOrEmpty(Request.Category) || a.Category == Request.Category) &&
                   (string.IsNullOrEmpty(Request.PermitName) || a.PermitName == Request.PermitName) &&
                   (string.IsNullOrEmpty(Request.RegulatoryAgencyName) || a.RegulatoryAgencyName == Request.RegulatoryAgencyName)
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
                           .OrderByDescending(a => a.Id)
                           .ToList();




                }
                else
                {

                    Result = _context.PermitMasters.Where(a =>
                   a.Level == "Federal" &&
                   (string.IsNullOrEmpty(Request.Category) || a.Category == Request.Category) &&
                   (string.IsNullOrEmpty(Request.PermitName) || a.PermitName == Request.PermitName) &&
                   (string.IsNullOrEmpty(Request.RegulatoryAgencyName) || a.RegulatoryAgencyName == Request.RegulatoryAgencyName)
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
                        RegulatoryAgencyId = Request.RegulatoryAgencyId
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
                    ClientId = Request.ClientId,
                    PermitList = Request.PermitList,
                    CreatedBy = _currentUserService.User.UserId
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
                                                        (a.ClientId == Request.ClientId || Request.ClientId == null))
                                                        .Select(a => new { a.TypeOfProject, a.MatrixName, a.ClientId, a.PermitList, a.Id })
                                                        .ToList()
                                                        .GroupJoin(_context.RegulatoryAgencyMasters,
                                                        matrix => matrix.ClientId,
                                                        agency => agency.Id,
                                                        (matrix, agency) => new { matrix, agency })
                                                        .Select(a => new EPermitMatrix()
                                                        {
                                                            TypeOfProject = a.matrix.TypeOfProject,
                                                            MatrixName = a.matrix.MatrixName,
                                                            ClientName = a.agency.FirstOrDefault().Name,
                                                            PermitCount = a.matrix.PermitList.Split(new[] { "," }, StringSplitOptions.None).Length,
                                                            Id = a.matrix.Id

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
                        .ToList()
                    .GroupJoin(_context.RegulatoryAgencyMasters,
                        matrix => matrix.ClientId,
                        agency => agency.Id,
                        (matrix, agency) => new { matrix, agency })
                    .Select(a => new EPermitMatrix()
                    {
                        TypeOfProject = a.matrix.TypeOfProject,
                        MatrixName = a.matrix.MatrixName,
                        ClientName = a.agency.FirstOrDefault().Name,
                        PermitList = a.matrix.PermitList,
                        Id = a.matrix.Id
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
                            Id =permit.Id
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

                Result = _context.PermitMasters.Where(a =>
                                                Request.State.Contains(a.State) &&
                                                Request.City.Contains(a.City) && 
                                                (a.Category == Request.Category || string.IsNullOrEmpty(Request.Category)) &&
                                                (a.PermitName == Request.PermitName || string.IsNullOrEmpty(Request.PermitName)) &&
                                                (a.RegulatoryAgencyName == Request.RegulatoryAgencyName || string.IsNullOrEmpty(Request.RegulatoryAgencyName)))
                                                .ToList()
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



    }
}