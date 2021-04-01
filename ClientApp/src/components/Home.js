import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render () {
      return (
      <div>
        <h1>Hello!</h1>
        <h2>You are on an educational platform Step-by-step</h2>
        <h3>Some editional resources to improve your coding skills:</h3>
        <ul>
          <li><a href='https://developers.google.com/learn/pathways?hl=en'>Google Developers</a></li>
          <li><a href='https://www.geeksforgeeks.org/'>Geeks For Geeks</a></li>
          <li><a href='https://www.khanacademy.org/computing/computer-programming'>Khan Academy</a></li>
        </ul>
        <p>Our website allows schools to conveniently conduct the learning process on the Internet:</p>
        <ul>
          <li><strong>Full administration: </strong> Once you have access to the administrator account, you can move your school here.</li>
          <li><strong>Completed cycle of the educational process: </strong> publishing lesson materials, homework, downloading homework by students and its assessment.</li>
          <li><strong>Wide communication network: </strong> You can always write a message to the person you need.</li>
        </ul>
        <p>For further cooperation, write to my e-mail - <a href="mailto:furs.dmitry@gmail.com">furs.dmitry@gmail.com</a> </p>
      </div>
    );
  }
}
