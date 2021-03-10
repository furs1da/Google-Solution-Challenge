using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class FinalGrade
    {
        public int IdFinalGrade { get; set; }
        public int Grade { get; set; }
        public int IdStudent { get; set; }
        public int IdSubject { get; set; }

        public virtual Pupil IdStudentNavigation { get; set; }
        public virtual Subject IdSubjectNavigation { get; set; }
    }
}
