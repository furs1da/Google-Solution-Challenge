using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class TeacherPost
    {
        public int IdPost { get; set; }
        public int IdSubject { get; set; }
        public int IdTeacher { get; set; }
        public int IdFlow { get; set; }
        public string Title { get; set; }
        public string PostContent { get; set; }
        public DateTime DateOfPost { get; set; }
        public byte[] Attachements { get; set; }
        public string AttchFormatExst { get; set; }
        public string Filename { get; set; }

        public virtual FlowNumber IdFlowNavigation { get; set; }
        public virtual Subject IdSubjectNavigation { get; set; }
        public virtual Teacher IdTeacherNavigation { get; set; }
    }
}
