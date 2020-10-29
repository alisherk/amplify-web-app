import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

function App() {
  return (
    <div>
     <h1> Welcome to Sample App build with amplify </h1>
     <AmplifySignOut/>
    </div>
  );
}

export default withAuthenticator(App);
