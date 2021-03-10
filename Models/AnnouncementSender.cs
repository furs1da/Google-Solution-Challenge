using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class AnnouncementSender
    {
        public int IdAnnouncement { get; set; }
        public int IdAdminSender { get; set; }
        public int? IdClass { get; set; }
        public int? IdFlow { get; set; }
        public int? IdRole { get; set; }
        public int? IdSubject { get; set; }
        public string AnnouncementContent { get; set; }
        public DateTime DateOfAnnouncement { get; set; }
        public string TitleAnnouncement { get; set; }
        public byte[] Attachements { get; set; }
        public string AttchFormatExst { get; set; }
        public string Filename { get; set; }
        public bool? Actual { get; set; }

        public virtual Admin IdAdminSenderNavigation { get; set; }
        public virtual Classes IdClassNavigation { get; set; }
        public virtual FlowNumber IdFlowNavigation { get; set; }
        public virtual Roles IdRoleNavigation { get; set; }
        public virtual Subject IdSubjectNavigation { get; set; }
    }
}
