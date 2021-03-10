using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;


namespace shagDiplom.Models
{
    public class TeacherPostForTeacher
    {
        public int idPost { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime dateOfPost { get; set; }
        public int flowNumber { get; set; }
        public string filename { get; set; }
        public TeacherPostForTeacher(int idPost, string Title, DateTime dateOfPost, int flowNumber, string filename, string Content)
        {
            this.idPost = idPost;
            this.Title = Title;
            this.dateOfPost = dateOfPost;
            this.flowNumber = flowNumber;
            this.filename = filename;
            this.Content = Content;
        }
    }
}
