import axios from 'axios';
import { Task } from '../types/Task';

const makeAxios = () => {
  const configData = JSON.parse(localStorage.getItem('config') || '{}');
  return axios.create({
    // baseURL: 'https://langracer.com?apiurl=https://api.notion.com/v1',
    baseURL: 'https://api.notion.com/v1',
    headers: {
      Authorization: `Bearer ${configData.notionKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
  });
};

const addTask = async (
  databaseId: string,
  todo: Partial<Task>,
): Promise<Task> => {
  try {
    const response = await makeAxios().post('/pages', {
      parent: { database_id: databaseId },
      properties: {
        Name: [{ text: { content: todo.name } }],
        Description: [{ text: { content: todo.description } }],
        Status: [{ text: { content: todo.status } }],
      },
    });

    return {
      ...todo,
      id: response.data.id,
    } as Task;
  } catch (error: any) {
    console.error('Error creating record:', error?.message);
    console.error('API Response:', error?.response?.data);
    throw error;
  }
};

async function updateTask(
  databaseId: string,
  recordId: string,
  todo: Partial<Task>,
): Promise<Partial<Task>> {
  const keys = Object.keys(todo);
  const properties: any = {};
  keys.forEach((key) => {
    switch (key) {
      case 'name':
        properties.Name = [{ text: { content: todo[key] } }];
        break;
      case 'description':
        properties.Description = [{ text: { content: todo[key] } }];
        break;
      case 'status':
        properties.Status = [{ text: { content: todo[key] } }];
        break;
      default:
        break;
    }
  });
  try {
    await makeAxios().patch(`/pages/${recordId}`, {
      parent: { database_id: databaseId },
      properties,
    });

    return todo;
  } catch (error: any) {
    console.error('Error updating record:', error?.message);
    console.error('API Response:', error?.response?.data);
    throw error;
  }
}

async function deleteTask(
  databaseId: string,
  recordId: string,
): Promise<Partial<Task>> {
  try {
    const response = await makeAxios().patch(`/pages/${recordId}`, {
      parent: { database_id: databaseId },
      properties: {
        'Is deleted': { checkbox: true },
      },
    });

    return { id: response.data.id };
  } catch (error: any) {
    console.error('Error updating record:', error?.message);
    console.error('API Response:', error?.response?.data);
    throw error;
  }
}

async function getTasks(databaseId: string): Promise<Task[]> {
  const currentDate = new Date().toISOString().split('T')[0];
  try {
    const response = await makeAxios().post(`/databases/${databaseId}/query`, {
      filter: {
        and: [
          {
            property: 'Is deleted',
            checkbox: {
              equals: false,
            },
          },
          {
            or: [
              {
                property: 'Created time',
                date: {
                  equals: currentDate,
                },
              },
              {
                property: 'Last edited time',
                date: {
                  equals: currentDate,
                },
              },
            ],
          },
        ],
      },
    });

    return response.data.results.map((record: any) => {
      return {
        id: record.id,
        name: JSON.stringify(record.properties.Name.title[0].plain_text),
        status: record.properties.Status.rich_text[0].plain_text || 'todo',
        description: record.properties.Description.rich_text[0].plain_text,
      };
    });
  } catch (error: any) {
    console.error('Error creating record:', error?.message);
    console.error('API Response:', error?.response?.data);
    throw error;
  }
}

async function initDatabase(pageId: string): Promise<string> {
  try {
    const newDatabase = await makeAxios().post('/databases', {
      parent: { page_id: pageId },
      title: [
        {
          type: 'text',
          text: {
            content: 'My Tasks',
            link: null,
          },
        },
      ],
      properties: {
        Name: { title: {} },
        Description: { rich_text: {} },
        Status: { rich_text: {} },
        'Created time': { created_time: {} },
        'Last edited time': { last_edited_time: {} },
        'Is deleted': { checkbox: {} },
      },
    });

    return newDatabase.data.id;
  } catch (error: any) {
    console.error('Error creating record:', error?.message);
    console.error('API Response:', error?.response?.data);
    throw error;
  }
}

export { initDatabase, addTask, updateTask, deleteTask, getTasks };
