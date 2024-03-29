import { useEffect, useState } from 'react';
import {
  ProjectList,
  TodayTodos,
  ProjectLists,
  TodoTags,
} from '../types/types';
import { Provider } from './Context';

export type AppState = {
  lists: TodayTodos;
  todoTags: TodoTags;
  projectLists: ProjectLists;
  onAddNewList: (val: string, todoVal: string) => void;
  onEditTitle: (idList: number, value: string) => void;
  onEditTodo: (idList: number, value: string) => void;
  onTodoDone: (idList: number, checked: boolean) => void;
  onPriorityChange: (idList: number, value: number) => void;
  onAddTodoTag: (tagText: string, listId: number) => void;
  onAddProjectList: (todoListTitle: string) => void;
  onAddProjectTodo: (listId: number, todoText: string) => void;
  onProjectTodoDone: (listId: number, todoId: number) => void;
  onEditProjectTitle: (listId: number, newListTitle: string) => void;
  onEditProjectTodoText: (
    listId: number,
    todoId: number,
    newTodoText: string
  ) => void;
};

type Props = {
  children: (props: AppState) => JSX.Element;
};
const Container = ({ children }: Props) => {
  const [todayTodoLists, settodayTodoLists] = useState<TodayTodos>([]);
  const [todoTags, setTodoTags] = useState<TodoTags>([]);
  const [projectLists, setProjectLists] = useState<ProjectLists>([]);

  //localstorage
  useEffect(() => {
    const LSTodayTodoLists = JSON.parse(localStorage.getItem('todayTodoLists') || '{}');
    if (LSTodayTodoLists) settodayTodoLists(LSTodayTodoLists);
  }, []);

  useEffect(() => {
    localStorage.setItem('todayTodoLists', JSON.stringify(todayTodoLists));
  }, [todayTodoLists]);

  const handleAddNewTodoList = (val: string, todoVal: string) => {
    settodayTodoLists(prevList => [
      ...prevList,
      {
        id: prevList.length + 1,
        title: val,
        todo: todoVal,
        priority: 4,
        listTags: [],
      },
    ]);
  };

  const handleEditTitle = (idList: number, value: string) => {
    settodayTodoLists(prevList =>
      prevList.map(list => {
        if (list.id === idList) {
          if (value.length !== 0) {
            return { ...list, title: value };
          }
          return { ...list };
        }
        return list;
      })
    );
  };
  const handleEditTodo = (idList: number, value: string) => {
    settodayTodoLists(prevList =>
      prevList.map(list => {
        if (list.id === idList) {
          if (value.length !== 0) {
            return { ...list, todo: value };
          }
          return { ...list };
        }
        return list;
      })
    );
  };

  const handleTodoIsDone = (idList: number, checked: boolean) => {
    settodayTodoLists(prevList =>
      prevList.filter(list => {
        if (list.id === idList && checked === true) {
          return list.id !== idList;
        }
        return list;
      })
    );
  };

  const handlePriorityChanging = (idList: number, value: number) => {
    settodayTodoLists(prevList =>
      prevList.map(list => {
        if (list.id === idList) {
          return { ...list, priority: value };
        }
        return list;
      })
    );
  };

  const handleAddTag = (tagText: string, listId: number) => {
    const existingTag = todoTags.find(tag => tag.tagText === tagText);
    console.log(existingTag);

    if (!existingTag) {
      const newTag = {
        id: todoTags.length + 1,
        tagText: tagText,
      };
      setTodoTags(prevTags => [...prevTags, newTag]);
      settodayTodoLists(prevLists => {
        return prevLists.map(list => {
          if (list.id === listId) {
            return {
              ...list,
              listTags: [...list.listTags, newTag],
            };
          }

          return list;
        });
      });
    } else {
      settodayTodoLists(prevLists => {
        return prevLists.map(list => {
          if (list.id === listId) {
            return {
              ...list,
              listTags: [...list.listTags, existingTag],
            };
          }

          return list;
        });
      });
    }
  };

  const handleAddNewProjectList = (todoListTitle: string) => {
    setProjectLists(prevLists => [
      ...prevLists,
      { id: prevLists.length + 1, title: todoListTitle, todos: [] },
    ]);
  };

  const handleAddProjectTodo = (listId: number, todoText: string) => {
    setProjectLists(prevList => {
      return prevList.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            todos: [
              ...list.todos,
              {
                id: list.todos.length + 1,
                text: todoText,
                done: false,
              },
            ],
          };
        }
        return list;
      });
    });
  };

  const handleProjectTodoDone = (listId: number, todoId: number) => {
    setProjectLists(prevList => {
      return prevList.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            todos: list.todos.map(todo => {
              if (todo.id === todoId) {
                return {
                  ...todo,
                  done: !todo.done,
                };
              }

              return todo;
            }),
          };
        }

        return list;
      });
    });
  };

  const handleEditProjectTitle = (listId: number, newListTitle: string) => {
    setProjectLists(prevList =>
      prevList.map(list => {
        if (list.id === listId) {
          if (newListTitle.length !== 0) {
            return { ...list, title: newListTitle };
          }

          return { ...list };
        }

        return list;
      })
    );
  };

  const handleEditProjectTodoText = (
    listId: number,
    todoId: number,
    newTodoText: string
  ) => {
    setProjectLists(prevLists => {
      return prevLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            todos: list.todos.map(todo => {
              if (newTodoText.length !== 0) {
                if (todo.id === todoId) {
                  return { ...todo, text: newTodoText };
                }
                return { ...todo };
              }
              return { ...todo };
            }),
          };
        }

        return list;
      });
    });
  };


  const appState: AppState = {
    lists: todayTodoLists,
    todoTags: todoTags,
    projectLists: projectLists,
    onAddNewList: handleAddNewTodoList,
    onEditTitle: handleEditTitle,
    onEditTodo: handleEditTodo,
    onTodoDone: handleTodoIsDone,
    onPriorityChange: handlePriorityChanging,
    onAddTodoTag: handleAddTag,
    onAddProjectList: handleAddNewProjectList,
    onAddProjectTodo: handleAddProjectTodo,
    onProjectTodoDone: handleProjectTodoDone,
    onEditProjectTitle: handleEditProjectTitle,
    onEditProjectTodoText: handleEditProjectTodoText,
  };

  return <Provider value={appState}>{children(appState)}</Provider>;
};

export default Container;
