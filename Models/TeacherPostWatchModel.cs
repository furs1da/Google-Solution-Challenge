using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class TeacherPostWatchModel
    {
        public int idPost { get; set; }
        public string teacherName { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Filename { get; set; }
        public DateTime DateOfPost { get; set; }
        public TeacherPostWatchModel(int idPost, string teacherName, string Title, string Content, string Filename, DateTime DateOfPost)
        {
            this.idPost = idPost;
            this.teacherName = teacherName;
            this.Title = Title;
            this.Content = Content;
            this.Filename = Filename;
            this.DateOfPost = DateOfPost;
        }
    }
}
