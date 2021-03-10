using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class WatchGradesModel
    {
        public int idGrade { get; set; }
        public string fioTeacher { get; set; }
        public int grade { get; set; }
        public string typeGrade { get; set; }
        public DateTime dateGrade { get; set; }
        public string feedbackGrade { get; set; }

        public WatchGradesModel(int idGrade, string fioTeacher, int grade, string typeGrade, DateTime dateGrade, string feedbackGrade)
        {
            this.idGrade = idGrade;
            this.fioTeacher = fioTeacher;
            this.grade = grade;
            this.typeGrade = typeGrade;
            this.dateGrade = dateGrade;
            this.feedbackGrade = feedbackGrade;
        }
    }
}
