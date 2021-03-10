using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class Attendance
    {
        public int IdAttendance { get; set; }
        public int IdStudent { get; set; }
        public int IdSubject { get; set; }
        public DateTime DateOfLesson { get; set; }
        public bool? AttendanceCheck { get; set; }

        public virtual Pupil IdStudentNavigation { get; set; }
        public virtual Subject IdSubjectNavigation { get; set; }
    }
}
