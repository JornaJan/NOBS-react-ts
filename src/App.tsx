import {FC, ReactNode, useCallback, useRef, useState} from "react";
import {useTodos} from "./useTodos.ts";

const Heading = ({title}: {title: string}) => <h2>{title}</h2>

const Box = ({children}: {children: ReactNode}) => (
    <div
        style={{
            padding: "1rem",
            fontWeight: "bold"
        }}
    >{children}</div>
)

const Button: FC<
    React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> & { title?: string } = ({title, children, ...rest}) => (
    <button
        style={{
            backgroundColor: "red",
            color: "white",
            fontSize: "xx-large"
        }}
        {...rest}>{title ?? children}</button>
)









function App() {
    const {todos, addTodo, removeTodo} = useTodos([
        { id: 0, text: 'Hey there', done: false },
    ])

    const newTodoRef = useRef<HTMLInputElement>(null)

    const onAddTodo = useCallback(() => {
        if (newTodoRef.current && newTodoRef.current.value !== "") {
            addTodo(newTodoRef.current.value)
            newTodoRef.current.value = ''
        }
    }, [addTodo])


    return (
        <div className="App">
            <Heading title="Introducing" />
            <Box>hello there</Box>



            <Heading title="Todos" />
            {todos.map((todo) => (
                <div key={todo.id}>
                    {todo.text}
                    <Button onClick={() =>
                        removeTodo(todo.id)
                    }>Remove</Button>
                </div>
            ))}
            <div>
                <input type="text" ref={newTodoRef} />
                <Button onClick={onAddTodo}>Add Todo</Button>
            </div>
        </div>
    )
}

export default App