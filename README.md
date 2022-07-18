# School Management System
### This project is dedicated to help and make online part of education more scructered and comfortable.

Most of the school in my home country (Ukraine) use 3 different services to make online education be possible: Google Site (for posting materials), 
Gmail (for submitting assignments) and Atoms (for grades). I thought that all these processes should be structured and accessible only in 1 app 
and it might be free, so I decided to make this project.

<hr/>

This project is made using ReactJS as a client-side, ASP.Net Core 3.1 as a server-side and SQL Server from Google Cloud as a database engine. Authorization is made by implementing JWT-tokens using Microsoft.AspNetCore.Authorization library. 

[Things I have learned while developing this project ⬇](#learned-things)

List of roles:
  * [School Administration](#administration)
  * [Teacher - Classroom Teacher](#teacher)
  * [Student](#student)
  * [Parent](#parent)
<br/>

List of functionality:
  * <a id="administration">School Administration</a>
    * [View, add, edit and delete teachers', students', administrators' accounts and class (group) entities](#admin_entities);
    * [View and delete parents of children](#admin_parents);
    * [View, publish, edit and delete announcements for certain groups with uploading files (for students, for teacher, for other administrators, for parents, etc)](#admin_announcements);
    * [Create a timetable for each class](#admin_timetable);
    * [Send and view messages across the system](#admin_messages);
    * [View attendance and calculate number of absences for each student](#admin_attendance);
    * [Change personal information](#admin_info);
  * <a id="teacher">Teacher - Classroom Teacher</a>
    * [Submit attendance for each class (group)](#teacher_attendance);
    * [View announcements](#teacher_announcement);
    * [View and send messages](#teacher_message);    
    * [View, publish, edit and delete posts (with uploading files)](#teacher_posts); 
    * [View, publish, edit, delete and give a mark for homework assignment](#teacher_marks);
    * [Give a final mark for a certain term and for whole year](#teacher_final_grades);
    * [Change personal information](#teacher_info);
    * [View attendance and marks of students of your class (group) as a classroom teacher](#teacher_classroom); 
  * <a id="student">Student</a>
    * [View homework assignments and submit them by uploading text and files](#student_assignments);
    * [View marks (grades)](#student_marks);
    * [View announcements](#student_announcement);
    * [View and send messages](#student_message);
    * [View attendance](#student_attendance);
    * [View teachers' posts](#student_posts);
    * [Change personal information](#student_info);
  * <a id="parent">Parent</a>
    * [View announcements](#parent_announcement);
    * [View attendance of their children](#parent_attendance);
    * [View marks (grades) of their children](#parent_marks);
    * [View and add their children to their accounts](#parent_children);
    * [View and send messages](#parent_messages);
    * [Change personal information](#parent_info);

<hr/>

1. <a id="administration">School Administration</a>

- <a id="">View, add, edit and delete teachers', students', administrators' accounts and class (group) entities;</a>
- <a id="">View and delete parents of children;</a>
- <a id="">View, publish, edit and delete announcements for certain groups with uploading files (for students, for teacher, for other administrators, for parents, etc);</a>
- <a id="">Create a timetable for each class;</a>
- <a id="">Send and view messages across the system;</a>
- <a id="">View attendance and calculate number of absences for each student;</a>
- <a id="">Change personal information;</a>

2. <a id="teacher">Teacher - Classroom Teacher</a>

- <a id="">Submit attendance for each class (group)</a>
- <a id="">View announcements</a>
- <a id="">View and send messages</a>
- <a id="">View, publish, edit and delete posts (with uploading files)</a>
- <a id="">View, publish, edit, delete and give a mark for homework assignment</a>
- <a id="">Give a final mark for a certain term and for whole year</a>
- <a id="">Change personal information</a>
- <a id="">View attendance and marks of students of your class (group) as a classroom teacher</a>

3. <a id="student">Student</a>

- <a id="">View homework assignments and submit them by uploading text and files</a>
- <a id="">View marks (grades)</a>
- <a id="">View announcements</a>
- <a id="">View and send messages</a>
- <a id="">View attendance</a>
- <a id="">View teachers' posts</a>
- <a id="">Change personal information</a>

4. <a id="parent">Parent</a>

- <a id="">View announcements</a>
- <a id="">View attendance of their children</a>
- <a id="">View marks (grades) of their children</a>
- <a id="">View and add their children to their accounts</a>
- <a id="">View and send messages</a>
- <a id="">Change personal information</a>

## License and copyright

© Dmytrii Furs, furs1268@gmail.com
