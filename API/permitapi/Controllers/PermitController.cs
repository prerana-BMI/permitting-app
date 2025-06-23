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
                    RegulatoryAgencyName = a.RegulatoryAgencyName
                }).ToList();
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
        public BaseReturn<EPermitMaster> GetPermitById(int PermitId)
        {
            var BaseObj = new BaseReturn<EPermitMaster>();
            var Result = new EPermitMaster();
            try
            {
                var data = _context.PermitMasters.Where(a => a.Id == PermitId).FirstOrDefault();
                Result = _mapper.Map<EPermitMaster>(data);
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
        [Route("SavePermits")]
        public BaseReturn<int> SavePermits(EPermitMaster Request )
        {
            var BaseObj = new BaseReturn<int>();

            try
            {
                if (Request.Id > 0)
                {
                    var permitObj = _context.PermitMasters.Where(a => a.Id == Request.Id).FirstOrDefault();
                    if (permitObj != null)
                    {
                        _context.PermitMasters.Update(permitObj);
                        BaseObj.Message = "Permit Data Updated";
                    }
                }
                else
                {
                    var NewPermit = _mapper.Map<PermitMaster>(Request);
                    _context.PermitMasters.Add(NewPermit);
                    BaseObj.Message = "Permit Saved";

                }
                _context.SaveChanges();
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