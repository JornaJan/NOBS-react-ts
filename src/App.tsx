import {FC, ReactNode, useCallback, useEffect, useReducer, useRef, useState} from "react";

const Heading = ({title}: {title: string}) => <h2>{title}</h2>

const Box = ({children}: {children: ReactNode}) => (
    <div
        style={{
            padding: "1rem",
            fontWeight: "bold"
        }}
    >{children}</div>
)

const List: FC<{
    items: string[]
    onClick?: (item: string) => void
}> = ({items, onClick}) => (
    <ul>
        {items.map((item, index) => <li key={index} onClick={() => onClick?.(item)}>{item}</li>)}
    </ul>
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

interface Payload {
    text: string
}

interface Todo {
    id: number
    done: boolean
    text: string
}

type ActionType =
    | { type: 'ADD', text: string }
    | { type: 'REMOVE', id: number }

const useNumber = (initialValue: number) => useState<number>(initialValue)

type UseNumberValue = ReturnType<typeof useNumber>[0]
type UseNumberSetValue = ReturnType<typeof useNumber>[1]

const Incrementer: FC<{
    value: UseNumberValue,
    setValue: UseNumberSetValue
}> = ({ value, setValue }) => (
    <Button onClick={() => setValue(value +1)} title={`Add - ${value}`} />
)

function App() {
    const onListClick = useCallback((item: string) => {
        alert(item)
    }, [])

    const [checkedState, setCheckedState] = useState<Payload | null>(null)

    useEffect(() => {
        fetch('/data.json')
            .then(resp => resp.json())
            .then(data => {
                setCheckedState(data)
            })
    }, [])

    const [todos, dispatch] = useReducer((state: Todo[], action: ActionType) => {
        switch (action.type) {
            case 'ADD':
                return [
                    ...state,
                    {
                        id: state.length,
                        text: action.text,
                        done: false,
                    }
                ]
            case 'REMOVE':
                return state.filter(({id}) => id !== action.id)
            default:
                throw new Error()
        }
    }, [])

    const newTodoRef = useRef<HTMLInputElement>(null)

    const onAddTodo = useCallback(() => {
        if (newTodoRef.current) {
            dispatch({
                type: 'ADD',
                text: newTodoRef.current.value
            })
            newTodoRef.current.value = ''
        }
    }, [])

    const [value, setValue] = useNumber(0)

    return (
        <div className="App">
            <Heading title="Introducing" />
            <Box>hello there</Box>
            <List
                items={["one", "two", "three"]}
                onClick={onListClick}
            />
            <Box>{JSON.stringify(checkedState)}</Box>

            <Incrementer value={value} setValue={setValue} />

            <Heading title="Todos" />
            {todos.map((todo) => (
                <div key={todo.id}>
                    {todo.text}
                    <Button onClick={() => dispatch({
                        type: 'REMOVE',
                        id: todo.id
                    })}>Remove</Button>
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