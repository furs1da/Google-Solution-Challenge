import React from 'react';

import { userService, authenticationService } from '../services';

class AdminPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            genders: [],
            users: [],
            imges: []
    };
    }

    componentDidMount() {
        userService.GetAllPupils().then(users => this.setState({ users }));
    }
  

    render() {
        const { users } = this.state;
        return (
            <div>
                <h1>Admin</h1>
                <p>This page can only be accessed by administrators.</p>
                <div>                
                    { users &&
                        <ul>
                        {users.map(user => 
                            <li key={user.idPupil}><img src={'data:image/png;base64,' + user.imageOfPupil} /></li>                   
                            )}
                        </ul>
                    }
                </div>
            </div>
        );
    }
}

export { AdminPage };