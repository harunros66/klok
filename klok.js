const fs = require('fs');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

function showBanner() {
    console.log('\n\x1b[37m' + `
                      🚀 AirdropInsiders 🚀                      
                                                                 
              Join us: https://t.me/AirdropInsiderID            
  ` + '\x1b[0m\n');
  }

const CONFIG = {
  API_BASE_URL: 'https://api1-pp.klokapp.ai/v1',
  TOKEN_FILE: 'token.txt',
  CHAT_INTERVAL: 60000, // 1 minute
  RANDOM_MESSAGES: [
    "Hey there!",
    "What's new?",
    "How's it going?",
    "Tell me something interesting",
    "What do you think about AI?",
    "Have you heard the latest news?",
    "What's your favorite topic?",
    "Let's discuss something fun",
  ]
};

function getRandomMessage() {
  const index = Math.floor(Math.random() * CONFIG.RANDOM_MESSAGES.length);
  return CONFIG.RANDOM_MESSAGES[index];
}

function getToken() {
  try {
    return fs.readFileSync(CONFIG.TOKEN_FILE, 'utf8').trim();
  } catch (error) {
    console.error('Error reading token file:', error);
    process.exit(1);
  }
}

function createApiClient(token) {
  return axios.create({
    baseURL: CONFIG.API_BASE_URL,
    headers: {
      'x-session-token': token,
      'accept': '*/*',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'en-US,en;q=0.9',
      'origin': 'https://klokapp.ai',
      'referer': 'https://klokapp.ai/',
      'sec-ch-ua': '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0'
    }
  });
}

async function getThreads(apiClient) {
  try {
    const response = await apiClient.get('/threads');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching threads:', error.response?.status, error.response?.data || error.message);
    return [];
  }
}

async function createNewThread(apiClient, message) {
  const threadData = {
    title: "New Chat",
    messages: [
      {
        role: "user",
        content: message
      }
    ],
    sources: null,
    id: uuidv4(),
    dataset_id: "34a725bc-3374-4042-9c37-c2076a8e4c2b",
    created_at: new Date().toISOString()
  };

  try {
    const response = await apiClient.post('/threads', threadData);
    return response.data;
  } catch (error) {
    console.error('Error creating thread:', error.response?.status, error.response?.data || error.message);
    return null;
  }
}

async function sendMessageToThread(apiClient, threadId, message) {
  try {
    const chatData = {
      id: threadId,
      title: "New Chat",
      messages: [
        {
          role: "user",
          content: message
        }
      ],
      sources: [],
      model: "llama-3.3-70b-instruct",
      created_at: new Date().toISOString(),
      language: "english"
    };

    const response = await apiClient.post('/chat', chatData);
    console.log('Message sent successfully to thread:', threadId);
    return response.data;
  } catch (error) {
    if (error.message.includes('stream has been aborted')) {
      console.log('Stream aborted, but message might have been sent successfully');
      return true;
    }
    console.error('Error sending message:', error.response?.status, error.response?.data || error.message);
    return null;
  }
}

async function checkPoints(apiClient) {
  try {
    const response = await apiClient.get('/points');
    const pointsData = response.data;
    
    console.log('\n\x1b[32m=== Points Information ===');
    console.log(`Points Balance: ${pointsData.points || 0}`);
    console.log(`Referral Points: ${pointsData.referral_points || 0}`);
    console.log(`Total Points: ${pointsData.total_points || 0}`);
    console.log('========================\x1b[0m\n');
    
    return pointsData;
  } catch (error) {
    console.error('Error checking points:', error.response?.status, error.response?.data || error.message);
    return null;
  }
}

async function runBot() {
  showBanner();
  console.log('Starting chat bot...');
  const token = getToken();
  const apiClient = createApiClient(token);
  let currentThreadId = null;

  await checkPoints(apiClient);

  const threads = await getThreads(apiClient);
  if (threads.length > 0) {
    currentThreadId = threads[0].id;
    console.log('Using existing thread:', currentThreadId);
  } else {
    const newThread = await createNewThread(apiClient, "Starting new conversation");
    if (newThread) {
      currentThreadId = newThread.id;
      console.log('Created new thread:', currentThreadId);
    }
  }

  setInterval(async () => {
    if (!currentThreadId) {
      console.log('No active thread available. Creating new thread...');
      const newThread = await createNewThread(apiClient, "Starting new conversation");
      if (newThread) {
        currentThreadId = newThread.id;
      } else {
        return;
      }
    }

    const points = await checkPoints(apiClient);
    if (!points || points.total_points <= 0) {
      console.log('No points available. Waiting for next interval...');
      return;
    }

    const message = getRandomMessage();
    const result = await sendMessageToThread(apiClient, currentThreadId, message);
    
    if (!result) {
      console.log('Failed to send message, will try creating new thread next time');
      currentThreadId = null;
    }
    
    await checkPoints(apiClient);
  }, CONFIG.CHAT_INTERVAL);
}

runBot().catch(error => {
  console.error('Bot crashed:', error);
  process.exit(1);
});