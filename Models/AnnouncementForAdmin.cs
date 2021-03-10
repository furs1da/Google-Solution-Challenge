using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;


namespace shagDiplom.Models
{
    public class AnnouncementForAdmin
    {
        public int idAnnouncement { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Actual { get; set; }
        public string Audience { get; set; }
        public DateTime dateOfAnnouncement { get; set; }
        public string filename { get; set; }
        public AnnouncementForAdmin(int idAnnouncement, string Content, DateTime dateOfAnnouncement, string Actual, string Audience, string filename, string Title)
        {
            this.idAnnouncement = idAnnouncement;
            this.Content = Content;
            this.dateOfAnnouncement = dateOfAnnouncement;
            this.Actual = Actual;
            this.Audience = Audience;
            this.filename = filename;
            this.Title = Title;
        }
    }
}
