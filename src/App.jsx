
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import './App.css'
import { createTodo, deleteTodo, getTodos, updateTodo } from './util/api'

function App() {
  const [task, setTask] = useState("")

  const queryClient = useQueryClient()
  

  // const { data, isLoading } = useQuery( {
  //   queryFn: () => fetch("http://localhost:8080/api/v1/todos").then(res => res.json()),
  //   queryKey: ["todos"],
  // })

  const { data, isLoading } = useQuery({
    queryFn: getTodos,
    queryKey: ["todos"],
  })


  const { mutate: createTask } = useMutation({
    mutationFn: (task) => createTodo(task),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"])
  }})

  const { mutate: deleteTask } = useMutation({
    mutationFn: (id) => deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"])
  }}) 

  const { mutate: updateTask } = useMutation({
    mutationFn: (task) => updateTodo(task),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"])
  }}) 

  if (isLoading) {
    return <div>Loading...</div>
  }


  const onHandleSubmit =  (e) => {
    e.preventDefault()
    const newTodo = {
      task,
      completed: false
    }
    createTask(newTodo)
    setTask("")
  }

  // const onHandleDelete = (id) => {
  //   deleteTask(id)
  // }

  const onHandleUpdate = (task) => {
    updateTask({...task, completed: !task.completed})
  }

  return (
    <>
      {data?.map((task) => {
        return (
          <div className='task' key={task.id}>
            <input type="checkbox" checked={task.completed} onChange={() => onHandleUpdate(task)}/>
            <h1 className={` ${task.completed ? "completed" : ""} `} >{task.task}</h1>
            {/* <button onClick={() => onHandleDelete(task.id)}>Delete task</button> */}
            <button onClick={() => deleteTask(task.id)}>Delete task</button>
          </div>
        )
      })}
      <form onSubmit={onHandleSubmit}>
        <div>
          <label htmlFor="task">Task:</label>
        <input value={task} onChange={(e) => setTask(e.target.value)} type="text" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  )
}

export default App
