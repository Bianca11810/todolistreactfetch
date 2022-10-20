import React, {useState, useEffect} from "react";

const TodoList = () => {
    const [todos, setTodos] = useState(
        [
            // {"id": 1, "name": "", "completed": false},
            // {"id": 2, "name": "", "completed": false},
            // {"id": 3, "name": "", "completed": false}
        ]
    )

    // happens only on component load
    useEffect(()=>{
        fetch('https://assets.breatheco.de/apis/fake/todos/user/bean')
        .then((response) => response.json())
        .then((data) => setTodos([...data]));
    },[])

    const handleSubmit = (event) => {
        // with the event, we need to cancel the default
        event.preventDefault()
        let task = {
            
            "label": event.target.todo.value, 
            "done": false
        }
        todos.push(task);
        console.log(todos);
        // fetch call to add new list
        fetch('https://assets.breatheco.de/apis/fake/todos/user/bean', {
        method: "PUT",
        body: JSON.stringify(todos),
        headers: {
            "Content-Type": "application/json"
        }
        })
        .then(resp => {
            return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results
        })
        .then(data => {
            //reset value of input
            event.target.todo.value = ""
            //if we make it here and no errors, set the state to the new list
            setTodos([...todos])
        })
        .catch(error => {
            //error handling
            console.log(error);
        });
        
    }

    const doneTask = (i) => {
        todos.forEach(todo => {
            if (todo.i == i) {
                todo.done = true;
            }
        })

        // for(let i = 0; i < todos.length; i++) {
        //     if (todos[i].id == id) {
        //         todos[i].completed = true
        //     }
        // }

        setTodos([...todos])
    }

    const deleteTask = (i) => {
        // filter everything that does not match the ID
        let filtered = todos.filter((todo,idx) => {
            console.log(i, idx);
            return idx !== i
        })
        console.log(filtered)
        //todos.pop(filtered)
        // console.log(todos)

        fetch('https://assets.breatheco.de/apis/fake/todos/user/bean', {
            method: "PUT",
            body: JSON.stringify(filtered),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(resp => {
            return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results
        })
        .then(data => {
            setTodos([...filtered])
            // console.log(todos)
        })
        .catch(error => {
            //error handling
            console.log(error);
        })
           
        

    }

    const handleDeleteAll = () => {
        fetch('https://assets.breatheco.de/apis/fake/todos/user/bean', {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(resp => {
              return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results
          })
          .then(data => {
              //here is were your code should start after the fetch finishes
              console.log(data); //this will print on the console the exact object received from the server
              setTodos([]);
          })
          .catch(error => {
              //error handling
              console.log(error);
          });
        }

    const showDelete = (i) => {
        const btn = document.querySelector("#delete-btn-" + i)
        btn.style.visibility = "visible"
    }

    const hideDelete = (i) => {
        const btn = document.querySelector("#delete-btn-" + i)
        btn.style.visibility = "hidden"
    }

    return (
            <>
            <h1>Today To do's</h1>
            <div className="todo-wrapper">
                <form className="todo-form" onSubmit={handleSubmit}>
                    <input type="text" name="todo" placeholder={todos[0] ? "add todo" : "no todo, add todo"} />
                </form>
            </div>
            <ul className="todo-list">
            {todos.map((todo, i) => {
               
               return (
                    <li key={i} className="todo-item"
                        onMouseOver={() => showDelete(i)}
                        onMouseOut={() => hideDelete(i)}
                    >
                        <p className={todo.done ? "done" : ""}>{todo.label}</p>
                        {/* <button className="complete-task" onClick={() => completeTask(todo.id)}>Complete</button> */}
                        <button 
                            id={"delete-btn-" + i} 
                            className="delete-task" 
                            onClick={() => deleteTask(i)}
                        >Delete
                        </button>
                       
                    </li>
                );

            })}
        </ul>
        <button className="btn btn-primary" onClick={() => handleDeleteAll()}>DELETE ALL</button>
            </>
            )
}

export default TodoList