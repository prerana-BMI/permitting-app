using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    }
}