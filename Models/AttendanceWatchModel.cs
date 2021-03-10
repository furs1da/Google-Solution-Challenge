using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class AttendanceWatchModel
    {
        public int idAttendance { get; set; }
        public string backgroundColor { get; set; }
        public string attendanceCheck { get; set; }
        public DateTime dateOfLesson { get; set; }
        public AttendanceWatchModel(int idAttendance, string backgroundColor, string attendanceCheck, DateTime dateOfLesson)
        {
            this.idAttendance = idAttendance;
            this.backgroundColor = backgroundColor;
            this.attendanceCheck = attendanceCheck;
            this.dateOfLesson = dateOfLesson;
        }
    }
}
