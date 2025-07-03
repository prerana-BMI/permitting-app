using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using contract;
using contract.Entities;
using Data.DbEntities;
using Microsoft.AspNetCore.Mvc;

namespace permitapi.Controllers
{
    [Route("api/[controller]")]
    public class PermitController : ControllerBase
    {
        private readonly permit_account_serviceContext _context;
        private readonly IMapper _mapper;

        public PermitController(permit_account_serviceContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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
                    Id = a.Id
                })
                .OrderByDescending(a=>a.Id)
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
        [Route("GetPermitById")]
        public BaseReturn<EPermitMasterDetail> GetPermitById(int PermitId)
        {
            var BaseObj = new BaseReturn<EPermitMasterDetail>();
           
            try
            {
              BaseObj.Data = _context.PermitMasters
                .Where(master => master.Id == PermitId)
                .Join(_context.PermitMasterDetails.Where(a=>a.PermitId == PermitId),
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
        public BaseReturn<int> SavePermits([FromBody] EPermitMasterDetail Request )
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


    }
}