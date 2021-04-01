import React, { Component } from 'react';
import { NavLink, Router, Route, Link } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { LoginPage } from './components/LoginPage';
import { history, Role } from './helpers';
import { authenticationService } from './services';
import { PrivateRoute } from './components/PrivateRoute';
import './custom.css'
import { RegisterPage } from './components/RegisterPage';
import { CreateTeacher } from './components/CreateTeacher';
import { CreateAdmin } from './components/CreateAdmin';
import { CreatePupil } from './components/CreatePupil';
import { RegisterPageParent } from './components/RegisterPageParent';
import { RegisterPageParentCode } from './components/RegisterParentCodeCheck';
import { CreateClass } from './components/CreateClass';
import { CreateCurricular } from './components/CreateCurricular';
import { FeedBackAdmin } from './components/WriteFeedBackAdmin';
import { FeedBackPupil } from './components/WriteFeedBackPupil';
import { FeedBackParent } from './components/WriteFeedBackParent';
import { FeedBackTeacher } from './components/WriteFeedBackTeacher';
import { FeedBackClassRoomTeacher } from './components/WriteFeedBackClassRoomTeacher';
import { AnnouncementAdmin } from './components/AnnouncementAdmin';
import { Attendance } from './components/AttendanceTeacher';
import { HomeworkInfo } from './components/HomeworkInfoTeacher';
import { HomeworkStudent } from './components/AllHomeworkForStudent'; 
import { submitHomework } from './components/HomeworkSubmissionPupil';
import { PostTeacher } from './components/PostTeacherSubject';
import { HomeworkStudentSubmissionsTeacher } from './components/TeacherStudentHomeworkSubmissions';
import { checkHomework } from './components/CheckHomework';
import { WatchTeacherPosts } from './components/StudentWatchTeacherPosts';
import { WatchTeacherAnnouncements } from './components/WatchAnnouncementsTeacher';
import { WatchAdminAnnouncements } from './components/WatchAnnouncementsAdmin';
import { WatchParentAnnouncements } from './components/WatchAnnouncementsParent';
import { WatchStudentAnnouncements } from './components/WatchAnnouncementsStudent';
import { WatchFeedbackResponseAdmin } from './components/WatchFeedbackResponsesAdmin';
import { WatchFeedbackResponseParent } from './components/WatchFeedbackResponsesParent';
import { WatchFeedbackResponseStudent } from './components/WatchFeedbackResponsesStudent';
import { WatchFeedbackResponseTeacher } from './components/WatchFeedbackResponsesTeacher';
import { ThematicalGrades } from './components/TermMarksTeacher';
import { FinalGrades } from './components/FinalMarksTeacher';
import { WatchStudentGrades } from './components/WatchStudentsGrades';
import { WatchParentGrades } from './components/ParentGrades';
import { WatchClassroomTeacherGrades } from './components/ClassroomTeacherGrades';
import { WatchStudentAttendance } from './components/WatchStudentsAttendance';
import { WatchParentAttendance } from './components/ParentAttendance';
import { WatchClassroomTeacherAttendance } from './components/ClassroomTeacherAttendance';
import { WatchAdminAttendance } from './components/AdminWatchAttendance';
import { ListOfTeachersAdmin } from './components/ListOfTeachers';
import { EditTeacher } from './components/ChangeTeacherInfo';
import { ChangeAdmin } from './components/ChangeAdminInfo';
import { ChangePupil } from './components/ChangeStudentInfo';
import { ChangeClass } from './components/ChangeClassInfo';
import { ChangeHomeworkInfo } from './components/HomeworkInfoEditor';
import { ChangePostInfo } from './components/TeacherPostsEditor';
import { AddChildParent } from './components/ParentAddChild';
import { ListOfAdminsAdmin } from './components/ListOfAdmins';
import { ListOfAnnouncementsAdmin } from './components/ListOfAnnouncements';
import { ListOfClassesAdmin } from './components/ListOfClasses';
import { ListOfHomeworksInfoAdmin } from './components/ListOfHomeworkInfos';
import { ListOfParentsAdmin } from './components/ListOfParents';
import { ListOfStudentsAdmin } from './components/ListOfStudents';
import { ListOfTeachersPostAdmin } from './components/ListOfTeacherPosts';
import { ChangeAnnouncementInfo } from './components/AnnouncementsEditor';
import { ListOfChildsParent } from './components/ListOfChilds';
import { ChangeAdminPersonal } from './components/EditPersonalDataAdmin';
import { EditPersonalDataParent } from './components/EditPersonalDataParent';
import { EditPersonalDataTeacher } from './components/EditPersonalDataTeacher';
import { EditPersonalDataPupil } from './components/EditPersonalDataStudent';
import { ChooseRegistration } from './components/SelectTypeOfRegistration';

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { DropdownSubmenu, NavDropdownMenu } from "react-bootstrap-submenu";

export default class App extends Component {
    static displayName = App.name;

    constructor(props) {
        super(props);

        this.state = {
            currentUser: null,
            isAdmin: false,
            isPupil: false,
            isParent: false,
            isTeacher: false,
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x,
            isAdmin: x && x.roleId === 1,
            isPupil: x && x.roleId === 2,
            isParent: x && x.roleId === 3,
            isTeacher: x && x.roleId === 4,
        }));
    }

    logout() {
        authenticationService.logout();
        history.push('/login');
    }

    render() {
        const { currentUser, isAdmin, isPupil, isTeacher, isParent } = this.state;
        return (
            <Router history={history}>
                <div>
                    {currentUser && isPupil &&
                        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                 <Navbar.Brand as={Link} to="/"><i class="book icon"></i>Step-by-step</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">                       
                                <Nav.Link as={Link} to="/Homeworks">Homework assignments</Nav.Link>
                                <Nav.Link as={Link} to="/grades">Marks</Nav.Link>
                                <Nav.Link as={Link} to="/watchAnnouncementsPupil">Announcements</Nav.Link>
                                <NavDropdown title="Communication" as={Link} to="/" id="collasible-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/watchFeedbackPupil">Mails</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/feedbackPupil">Send mail</NavDropdown.Item>
                                </NavDropdown> 
                                <Nav.Link as={Link} to="/attendanceStudent">Attendance</Nav.Link>
                                <Nav.Link as={Link} to="/watchPosts">Posts</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link as={Link} to="/myInfoPupil"><i class="user outline icon"></i>Edit personal data</Nav.Link>
                        <Nav.Link as={Link} to="/watchFeedbackPupil"><i class="envelope outline icon"></i>Mails</Nav.Link>
                        <Nav.Link onClick={this.logout}><i class="sign out alternate icon"></i>Exit</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                    </Navbar>   
                    }
                    {currentUser && isParent &&
                        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                            <Navbar.Brand as={Link} to="/"><i class="book icon"></i>Step-by-step</Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                            <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="mr-auto">
                                <Nav.Link as={Link} to="/watchAnnouncementsParent">Announcements</Nav.Link>
                                <Nav.Link as={Link} to="/attendanceParent">Attendance</Nav.Link>
                                <Nav.Link as={Link} to="/gradesParent">Marks</Nav.Link>
                           
                                    <NavDropdown title="Ваші діти" as={Link} to="/" id="collasible-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/listOfChilds">List of children</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/addChild">Add a child</NavDropdown.Item>
                                </NavDropdown>

                                <NavDropdown title="Communication" as={Link} to="/" id="collasible-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/watchFeedbackParent">Mails</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/feedbackParent">Send mail</NavDropdown.Item>
                                </NavDropdown>

                                </Nav>
                                <Nav>
                                <Nav.Link as={Link} to="/myInfoParent"><i class="user outline icon"></i>Edit personal data</Nav.Link>
                                <Nav.Link as={Link} to="/watchFeedbackParent"><i class="envelope outline icon"></i>Mails</Nav.Link>
                                    <Nav.Link onClick={this.logout}><i class="sign out alternate icon"></i>Exit</Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                    }
                    {currentUser && isTeacher &&
                        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                            <Navbar.Brand as={Link} to="/"><i class="book icon"></i>Step-by-step</Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav className="mr-auto">
                                    <Nav.Link as={Link} to="/watchAnnouncementsTeacher">Announcements</Nav.Link>
                                    <Nav.Link as={Link} to="/attendanceTeacher">Attendance</Nav.Link>

                                <NavDropdown title="Communication" as={Link} to="/" id="collasible-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/watchFeedbackTeacher">Mails</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/feedbackTeacher">Send mail</NavDropdown.Item>
                                </NavDropdown>

                                <NavDropdown title="Homework assignments" as={Link} to="/" id="collasible-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/allHWSubmissions">All homework submissions</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/listOfHomeworkInfos">Your homework assignments</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/createHomework">Post homework assignments</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="Posts" as={Link} to="/" id="collasible-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/listOfTeachersPosts">Posts</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/postSubject">Publish your post</NavDropdown.Item>                                   
                                </NavDropdown>
                                <NavDropdown title="Marks" as={Link} to="/" id="collasible-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/thematicalGrades">Thematic marks</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/finalGrades">Semester marks</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="For classroom teachers" as={Link} to="/" id="collasible-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/feedbackClassroomTeacher">Send a mail to your class</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/attendanceClassroomTeacher">Attendance in your class</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/gradesClassroomTeacher">Marks in your class</NavDropdown.Item>
                                </NavDropdown>
                                </Nav>
                                <Nav>
                                <Nav.Link as={Link} to="/myInfoTeacher"><i class="user outline icon"></i>Edit personal data</Nav.Link>
                                <Nav.Link as={Link} to="/watchFeedbackTeacher"><i class="envelope outline icon"></i>Mails</Nav.Link>
                                    <Nav.Link onClick={this.logout}><i class="sign out alternate icon"></i>Exit</Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                    }
                    {currentUser && isAdmin &&       
                        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                            <Navbar.Brand as={Link} to="/"><i class="book icon"></i>Step-by-step</Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav className="mr-auto">
                                    <NavDropdownMenu title="Administration" id="collasible-nav-dropdown">
                                        <DropdownSubmenu title="Administration">
                                            <NavDropdown.Item as={Link} to="/createAdmin">Create an administrator</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/createTeacher">Create a teacher</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/createPupil">Create a student</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/createClass">Create a class</NavDropdown.Item>
                                        </DropdownSubmenu>
                                        <NavDropdown.Divider />
                                        <DropdownSubmenu title="Lists">
                                            <NavDropdown.Item as={Link} to="/listOfAdmins">List of administrators</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/listOfTeachers">List of teachers</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/listOfStudents">List of students</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/listOfParents">List of parents</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/listOfClasses">List of classes</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/listOfAnnouncements">List of announcements</NavDropdown.Item>
                                        </DropdownSubmenu>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/createCurricular">Create a timetable</NavDropdown.Item>
                                    </NavDropdownMenu>
                                    <NavDropdown title="Announcements" as={Link} to="/" id="collasible-nav-dropdown">
                                        <NavDropdown.Item as={Link} to="/watchAnnouncementsAdmin">Announcements</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/listOfAnnouncements">Your announcements</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/announcementAdmin">Create an announcement</NavDropdown.Item>
                                    </NavDropdown>
                                <NavDropdown title="Communication" as={Link} to="/" id="collasible-nav-dropdown">
                                        <NavDropdown.Item as={Link} to="/watchFeedbackAdmin">Mails</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/feedbackAdmin">Send mail</NavDropdown.Item>
                                    </NavDropdown>
                                    <Nav.Link as={Link} to="/attendanceAdmin">Attendance</Nav.Link>
                                </Nav>
                                <Nav>
                                    <Nav.Link as={Link} to="/myInfoAdmin"><i class="user outline icon"></i>Change personal data</Nav.Link>
                                    <Nav.Link as={Link} to="/watchFeedbackAdmin"><i class="envelope outline icon"></i>Mails</Nav.Link>
                                    <Nav.Link onClick={this.logout}><i class="sign out alternate icon"></i>Exit</Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                    }

                    <div className="jumbotron" style={{ minHeight: 90 + "vh", paddingBottom: 0, marginBottom: 0 }}>
                        <div className="container" class="d-flex justify-content-center" >
                            <div class="container-fluid">
                            <PrivateRoute exact path="/" component={Home} />
                            <PrivateRoute path="/createAdmin" roles={[Role.Admin]} component={CreateAdmin} />
                            <PrivateRoute path="/createTeacher" roles={[Role.Admin]} component={CreateTeacher} />
                            <PrivateRoute path="/createPupil" roles={[Role.Admin]} component={CreatePupil} />
                            <PrivateRoute path="/createCurricular" roles={[Role.Admin]} component={CreateCurricular} />
                            <PrivateRoute path="/createClass" roles={[Role.Admin]} component={CreateClass} />

                            <PrivateRoute path="/feedbackAdmin" roles={[Role.Admin]} component={FeedBackAdmin} />                        
                            <PrivateRoute path="/feedbackPupil" roles={[Role.Pupil]} component={FeedBackPupil} />
                            <PrivateRoute path="/feedbackParent" roles={[Role.Parent]} component={FeedBackParent} />
                            <PrivateRoute path="/feedbackTeacher" roles={[Role.Teacher]} component={FeedBackTeacher} />
                            <PrivateRoute path="/feedbackClassroomTeacher" roles={[Role.Teacher]} component={FeedBackClassRoomTeacher} />

                            <PrivateRoute path="/announcementAdmin" roles={[Role.Admin]} component={AnnouncementAdmin} />
                            <PrivateRoute path="/attendanceTeacher" roles={[Role.Teacher]} component={Attendance} />
                            <PrivateRoute path="/createHomework" roles={[Role.Teacher]} component={HomeworkInfo} />
                            <PrivateRoute path="/Homeworks" roles={[Role.Pupil]} component={HomeworkStudent} />  
                            <PrivateRoute path="/uploadHomework" roles={[Role.Pupil]} component={submitHomework} /> 
                            <PrivateRoute path="/postSubject" roles={[Role.Teacher]} component={PostTeacher} /> 

                            <PrivateRoute path="/listOfTeachers" roles={[Role.Admin]} component={ListOfTeachersAdmin} />
                            <PrivateRoute path="/listOfAdmins" roles={[Role.Admin]} component={ListOfAdminsAdmin} />
                            <PrivateRoute path="/listOfAnnouncements" roles={[Role.Admin]} component={ListOfAnnouncementsAdmin} />
                            <PrivateRoute path="/listOfClasses" roles={[Role.Admin]} component={ListOfClassesAdmin} />
                            <PrivateRoute path="/listOfHomeworkInfos" roles={[Role.Teacher]} component={ListOfHomeworksInfoAdmin} />
                            <PrivateRoute path="/listOfParents" roles={[Role.Admin]} component={ListOfParentsAdmin} />
                            <PrivateRoute path="/listOfStudents" roles={[Role.Admin]} component={ListOfStudentsAdmin} />
                            <PrivateRoute path="/listOfTeachersPosts" roles={[Role.Teacher]} component={ListOfTeachersPostAdmin} />

                            

                            <PrivateRoute path="/allHWSubmissions" roles={[Role.Teacher]} component={HomeworkStudentSubmissionsTeacher} /> 
                            <PrivateRoute path="/checkHomework" roles={[Role.Teacher]} component={checkHomework} /> 

                            <PrivateRoute path="/changeTeacherInfo" roles={[Role.Admin]} component={EditTeacher} />
                            <PrivateRoute path="/changeAdminInfo" roles={[Role.Admin]} component={ChangeAdmin} />
                            <PrivateRoute path="/changeStudentInfo" roles={[Role.Admin]} component={ChangePupil} />
                            <PrivateRoute path="/changeClassInfo" roles={[Role.Admin]} component={ChangeClass} />
                            <PrivateRoute path="/changeHomeworkInfo" roles={[Role.Teacher]} component={ChangeHomeworkInfo} />
                            <PrivateRoute path="/changePostInfo" roles={[Role.Teacher]} component={ChangePostInfo} />
                            <PrivateRoute path="/changeAnnouncementInfo" roles={[Role.Admin]} component={ChangeAnnouncementInfo} />


                            <PrivateRoute path="/myInfoAdmin" roles={[Role.Admin]} component={ChangeAdminPersonal} />
                            <PrivateRoute path="/myInfoParent" roles={[Role.Parent]} component={EditPersonalDataParent} />
                            <PrivateRoute path="/myInfoTeacher" roles={[Role.Teacher]} component={EditPersonalDataTeacher} />
                            <PrivateRoute path="/myInfoPupil" roles={[Role.Pupil]} component={EditPersonalDataPupil} />
                            
                            <PrivateRoute path="/attendanceStudent" roles={[Role.Pupil]} component={WatchStudentAttendance} />
                            <PrivateRoute path="/attendanceParent" roles={[Role.Parent]} component={WatchParentAttendance} />
                            <PrivateRoute path="/attendanceClassroomTeacher" roles={[Role.Teacher]} component={WatchClassroomTeacherAttendance} />
                            <PrivateRoute path="/attendanceAdmin" roles={[Role.Admin]} component={WatchAdminAttendance} />

                            <PrivateRoute path="/addChild" roles={[Role.Parent]} component={AddChildParent} />
                            <PrivateRoute path="/listOfChilds" roles={[Role.Parent]} component={ListOfChildsParent} />
                            

                            <PrivateRoute path="/watchPosts" roles={[Role.Pupil]} component={WatchTeacherPosts} /> 

                            <PrivateRoute path="/watchAnnouncementsTeacher" roles={[Role.Teacher]} component={WatchTeacherAnnouncements} /> 
                            <PrivateRoute path="/watchAnnouncementsPupil" roles={[Role.Pupil]} component={WatchStudentAnnouncements} /> 
                            <PrivateRoute path="/watchAnnouncementsAdmin" roles={[Role.Admin]} component={WatchAdminAnnouncements} /> 
                            <PrivateRoute path="/watchAnnouncementsParent" roles={[Role.Parent]} component={WatchParentAnnouncements} /> 

                            <PrivateRoute path="/finalGrades" roles={[Role.Teacher]} component={FinalGrades} />
                            <PrivateRoute path="/thematicalGrades" roles={[Role.Teacher]} component={ThematicalGrades} /> 
                            <PrivateRoute path="/grades" roles={[Role.Pupil]} component={WatchStudentGrades} /> 
                            <PrivateRoute path="/gradesClassroomTeacher" roles={[Role.Teacher]} component={WatchClassroomTeacherGrades} />
                            <PrivateRoute path="/gradesParent" roles={[Role.Parent]} component={WatchParentGrades} />

                            <PrivateRoute path="/watchFeedbackTeacher" roles={[Role.Teacher]} component={WatchFeedbackResponseTeacher} />
                            <PrivateRoute path="/watchFeedbackPupil" roles={[Role.Pupil]} component={WatchFeedbackResponseStudent} />
                            <PrivateRoute path="/watchFeedbackAdmin" roles={[Role.Admin]} component={WatchFeedbackResponseAdmin} />
                            <PrivateRoute path="/watchFeedbackParent" roles={[Role.Parent]} component={WatchFeedbackResponseParent} /> 

                            <Route path="/login" component={LoginPage} />
                            <Route path="/registerPupil" component={RegisterPage} />
                            <Route path="/registerParent" component={RegisterPageParent} />
                            <Route path="/registerParentCode" component={RegisterPageParentCode} />
                            <Route path="/chooseRegistration" component={ChooseRegistration} />
                                </div>
                        </div> 
                        
                    </div>
                   
                </div>
                <footer id="sticky-footer" class="py-4  text-white-50" style={{
                    minHeight: 10 + "vh",
                    backgroundColor: "#343a40"
                }}>
                    <div class="container text-center align-self-center" >
                        <p>Dmytrii Furs &copy; {new Date().getFullYear()}</p>
                    </div>
                </footer>
            </Router>      
    );
    }


}
