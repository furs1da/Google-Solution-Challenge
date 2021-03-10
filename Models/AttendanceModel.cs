using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class AttendanceModel
    {
        public int idStudent { get; set; }
        public string FIO { get; set; }
        public int attendance { get; set; }
        public int grade { get; set; }
        public string feedback { get; set; }
        public AttendanceModel(int idStudent, string FIO, int attendance, int grade, string feedback)
        {
            this.idStudent = idStudent;
            this.FIO = FIO;
            this.attendance = attendance;
            this.grade = grade;
            this.feedback = feedback;
        }
    }
}
