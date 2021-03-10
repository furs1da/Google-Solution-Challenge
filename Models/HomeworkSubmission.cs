using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class HomeworkSubmission
    {
        public int IdSubmission { get; set; }
        public int StudentId { get; set; }
        public int HomeworkId { get; set; }
        public DateTime DateOfSubmission { get; set; }
        public byte[] HomeworkFile { get; set; }
        public string FileFormatAttr { get; set; }
        public string Comments { get; set; }
        public int IdTeacher { get; set; }
        public string Filename { get; set; }

        public virtual HomeworkInfo Homework { get; set; }
        public virtual Teacher IdTeacherNavigation { get; set; }
        public virtual Pupil Student { get; set; }
    }
}
