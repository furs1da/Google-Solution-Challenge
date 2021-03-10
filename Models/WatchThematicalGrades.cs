using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class WatchThematicalGrades
    {
        public int idGrade { get; set; }
        public int grade { get; set; }   
        public DateTime fromDate { get; set; }
        public DateTime toDate { get; set; }
        public WatchThematicalGrades(int idGrade, int grade, DateTime fromDate, DateTime toDate)
        {
            this.idGrade = idGrade;
            this.grade = grade;
            this.fromDate = fromDate;
            this.toDate = toDate;
        }
    }
}
