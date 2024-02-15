const axios = require('axios');

const NOTION_API_TOKEN = 'secret_iatESDBPJKAltfwJP7vcUmZ3TpHVqUSvJUC3YhscJFh';
const DATABASE_ID = '0235615d5e674ce3be1c431533706119';
const NOTION_WORKSPACE = '2d1da768360fbac6afc28f6a0b80afe42bb42f77';

const notionAPI = axios.create({
  // baseURL: 'https://api.notion.com/v1',
  baseURL: 'https://langracer.com',
  headers: {
    Authorization: `Bearer ${NOTION_API_TOKEN}`,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28',
  },
});

async function getDatabaseInfo(databaseId) {
  const response = await notionAPI.get(`/databases/${databaseId}`);
  console.log(response.data);
}

async function getPageInfo(pageId) {
  const response = await notionAPI.get(`/pages/${pageId}`);
  console.log(response.data);
}

async function addNew(newTodo) {
  try {
    const response = await notionAPI.post('/pages', {
      parent: { database_id: DATABASE_ID },
      properties: {
        Name: [{ text: { content: newTodo.name } }],
        Description: [{ text: { content: newTodo.description } }],
        Status: [{ text: { content: newTodo.status } }],
      },
    });

    console.log('New record created successfully:', response.data);
  } catch (error) {
    console.error('Error creating record:', error.message);
    console.error('API Response:', error.response.data);
  }
}
async function updateTodo(recordId, todo) {
  const keys = Object.keys(todo);
  const properties = {};
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
    const response = await notionAPI.patch(`/pages/${recordId}`, {
      parent: { database_id: DATABASE_ID },
      properties,
    });

    console.log('New record updated successfully:', response.data);
  } catch (error) {
    console.error('Error creating record:', error.message);
    console.error('API Response:', error.response.data);
  }
}

async function deleteTodo(recordId) {
  try {
    const response = await notionAPI.patch(`/pages/${recordId}`, {
      parent: { database_id: DATABASE_ID },
      properties: {
        'Is deleted': { checkbox: true },
      },
    });
    console.log('New record deleted successfully:', response.data);
  } catch (error) {
    console.error('Error creating record:', error.message);
    console.error('API Response:', error.response.data);
  }
}

async function getListTodo() {
  const currentDate = new Date().toISOString().split('T')[0];
  try {
    const response = await notionAPI.post(`/databases/${DATABASE_ID}/query`, {
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

    return response.data.results.map((record) => {
      return {
        id: record.id,
        name: JSON.stringify(record.properties.Name.title[0].plain_text),
        status: record.properties.Status.rich_text[0].plain_text || 'todo',
        description: record.properties.Description.rich_text[0].plain_text,
      };
    });
  } catch (error) {
    console.error('Error creating record:', error.message);
    console.error('API Response:', error.response.data);
  }
}

async function initApp(pageId) {
  try {
    const newDatabase = await notionAPI.post('/databases', {
      parent: { page_id: pageId },
      title: [
        {
          type: 'text',
          text: {
            content: 'Pomodoro DB',
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

    // Save database id
  } catch (error) {
    console.error('Error creating record:', error.message);
    console.error('API Response:', error.response.data);
  }
}

// initApp('d23ac5ca248546148e738b751da8fabe');
async function test() {
  console.log(await getListTodo());
}
test();
