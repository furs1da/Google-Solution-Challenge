using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class Subject
    {
        public Subject()
        {
            AnnouncementSender = new HashSet<AnnouncementSender>();
            Attendance = new HashSet<Attendance>();
            Curricular = new HashSet<Curricular>();
            FinalGrade = new HashSet<FinalGrade>();
            Grade = new HashSet<Grade>();
            GradeThematical = new HashSet<GradeThematical>();
            HomeworkInfo = new HashSet<HomeworkInfo>();
            SubjectTeacher = new HashSet<SubjectTeacher>();
            TeacherPost = new HashSet<TeacherPost>();
        }

        public int IdSubject { get; set; }
        public string SubjectName { get; set; }

        public virtual ICollection<AnnouncementSender> AnnouncementSender { get; set; }
        public virtual ICollection<Attendance> Attendance { get; set; }
        public virtual ICollection<Curricular> Curricular { get; set; }
        public virtual ICollection<FinalGrade> FinalGrade { get; set; }
        public virtual ICollection<Grade> Grade { get; set; }
        public virtual ICollection<GradeThematical> GradeThematical { get; set; }
        public virtual ICollection<HomeworkInfo> HomeworkInfo { get; set; }
        public virtual ICollection<SubjectTeacher> SubjectTeacher { get; set; }
        public virtual ICollection<TeacherPost> TeacherPost { get; set; }
    }
}
