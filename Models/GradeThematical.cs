using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class GradeThematical
    {
        public int IdThematic { get; set; }
        public int Grade { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public int IdStudent { get; set; }
        public int IdSubject { get; set; }

        public virtual Pupil IdStudentNavigation { get; set; }
        public virtual Subject IdSubjectNavigation { get; set; }
    }
}
