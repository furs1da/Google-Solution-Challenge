using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class ThematicalStudentModel
    {
        public int idStudent { get; set; }
        public string FIO { get; set; }
        public int grade { get; set; }
        public string gradesPeriod { get; set; }
        public ThematicalStudentModel(int idStudent, string FIO, int grade, string gradesPeriod)
        {
            this.idStudent = idStudent;
            this.FIO = FIO;
            this.grade = grade;
            this.gradesPeriod = gradesPeriod;
        }
    }
}
