using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class Subjects
    {
        public Subjects()
        {
            Curricular = new HashSet<Curricular>();
            Grade = new HashSet<Grade>();
            HomeworkInfo = new HashSet<HomeworkInfo>();
            SubjectTeacher = new HashSet<SubjectTeacher>();
        }

        public int IdSubject { get; set; }
        public string SubjectName { get; set; }

        public virtual ICollection<Curricular> Curricular { get; set; }
        public virtual ICollection<Grade> Grade { get; set; }
        public virtual ICollection<HomeworkInfo> HomeworkInfo { get; set; }
        public virtual ICollection<SubjectTeacher> SubjectTeacher { get; set; }
    }
}
