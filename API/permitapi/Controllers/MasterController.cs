using contract;
using contract.Entities;
using Data.DbEntities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace permitapi.Controllers
{
    [Route("api/[controller]")]
    public class MasterController : ControllerBase
    {
        private readonly permit_account_serviceContext _context;
        public MasterController(permit_account_serviceContext context)
        {
            _context = context;
        }
        [HttpGet]
        [Route("GetCityBySearchText")]
        public BaseReturn<List<ECityMaster>> GetCityBySearchText(string City, string State)
        {
            var BaseObj = new BaseReturn<List<ECityMaster>>();
            List<ECityMaster> Result = new List<ECityMaster>();
            try
            {

                Result = _context.CityMasters.Where(a => a.City.ToLower().Contains(City) && a.State == State).AsNoTracking().Select(a => new ECityMaster
                {

                    City = a.City,
                    State = a.State,
                    Country = a.Country,

                }).ToList();
                BaseObj.Data = Result;
                BaseObj.Count = Result.Count;
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
        [Route("GetStateBySearchText")]
        public BaseReturn<List<ECityMaster>> GetStateBySearchText(string State)
        {
            var BaseObj = new BaseReturn<List<ECityMaster>>();
            List<ECityMaster> Result = new List<ECityMaster>();
            try
            {

                Result = _context.CityMasters.Where(a => a.State.ToLower().Contains(State))
                .ToList()
                .GroupBy(a => a.State)
                .Select(g => g.OrderBy(x => x.City).FirstOrDefault())
                .Select(a => new ECityMaster
                {
                    State = a.State,
                    Country = a.Country
                })
                .ToList();

                BaseObj.Data = Result;
                BaseObj.Count = Result.Count;
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
        [Route("GetRegulatoryAgencyBySearchText")]
        public BaseReturn<List<ERegulatoryAgencyMaster>> GetRegulatoryAgencyBySearchText(string SearchText)
        {
            var BaseObj = new BaseReturn<List<ERegulatoryAgencyMaster>>();
            List<ERegulatoryAgencyMaster> Result = new List<ERegulatoryAgencyMaster>();
            try
            {

                Result = _context.RegulatoryAgencyMasters.Where(a => a.Name.ToLower().Contains(SearchText))
                .ToList()
                .GroupBy(a => a.Name)
                .Select(a => a.FirstOrDefault())

                .Select(a => new ERegulatoryAgencyMaster
                {
                    Name = a.Name,
                    Id = a.Id
                })
                .Take(20)
                .ToList();
                BaseObj.Data = Result;
                BaseObj.Count = Result.Count;
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
        [Route("GetPermitNameBySearchText")]
        public BaseReturn<List<EPermitMaster>> GetPermitNameBySearchText(string SearchText)
        {
            var BaseObj = new BaseReturn<List<EPermitMaster>>();
            List<EPermitMaster> Result = new List<EPermitMaster>();
            try
            {

                Result = _context.PermitMasters.Where(a => a.PermitName.ToLower().Contains(SearchText))
                .Select(a => new EPermitMaster
                {
                    PermitName = a.PermitName,
                    Id = a.Id
                })
                .ToList();
                BaseObj.Data = Result;
                BaseObj.Count = Result.Count;
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