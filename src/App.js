import { useEffect, useState } from 'react';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { createTodo as createToDoMutation, deleteTodo as deleteToDoMutation  } from './graphql/mutations';
import { listTodos } from './graphql/queries';
import { API } from 'aws-amplify';

const initialFormState = { name: '', description: '' };

function App() {
  const [toDos, setToDos] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchToDos();
  }, []);

  async function fetchToDos() {
    const apiData = await API.graphql({ query: listTodos });
    setToDos(apiData.data.listTodos.items);
  }

  async function createToDo() {
    if (!formData.name || !formData.description) return;
    await API.graphql({
      query: createToDoMutation,
      variables: { input: formData },
    });
    setToDos([...toDos, formData]);
    setFormData(initialFormState);
  }
  
  async function deleteToDo({ id }) {
    const newNotesArray = toDos.filter(note => note.id !== id);
    setToDos(newNotesArray);
    await API.graphql({ query: deleteToDoMutation, variables: { input: { id } }});
  }

  return (
    <div>
      <h1> Welcome to Sample App build with AWS amplify framework </h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="To-do"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="To-do description"
        value={formData.description}
      />
       <button onClick={createToDo}>Create Note</button>
       <div style={{marginBottom: 30}}>
        {
          toDos.map(toDo => (
            <div key={toDo.id || toDo.name}>
              <h2>{toDo.name}</h2>
              <p>{toDo.description}</p>
              <button onClick={() => deleteToDo(toDo)}>Delete note</button>
            </div>
          ))
        }
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
