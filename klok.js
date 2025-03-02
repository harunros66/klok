import fs from 'fs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';

function showBanner() {
    console.log('\n\x1b[37m' + `
                              APPLE                      
                                                                 
              Follow me: https:/x.com/rosyidin_harun            
  ` + '\x1b[0m\n');
}

const CONFIG = {
    API_BASE_URL: 'https://api1-pp.klokapp.ai/v1',
    TOKEN_FILE: 'tokens.txt', // File to read tokens
    PROXY_FILE: 'proxy.txt', // File to read proxies
    CHAT_INTERVAL: 60000, // 1 minute
    RANDOM_MESSAGES: [
        "Hey there!",
        "What's your favorite way to enjoy a family outing?",
        "What's new?",
        "If you could have any experience with a historical event, what would it be?",
        "How's it going?",
        "What's your favorite thing about your current lifestyle choices?",
        "Tell me something interesting",
        "What do you think about AI?",
        "Have you heard the latest news?",
        "What's your favorite topic?",
        "Let's discuss something fun",
        "Do you prefer coffee or tea?",
        "What's your favorite food?",
        "Are you into sports?",
        "What's your favorite music genre?",
        "Do you play any musical instruments?",
        "What's the best advice you've ever received?",
        "If you could have dinner with anyone, who would it be?",
        "What's your favorite childhood memory?",
        "Do you believe in aliens?",
        "What's your favorite season and why?",
        "If you could time travel, where would you go?",
        "What's your favorite way to relax?",
        "Do you have any pets?",
        "What's your favorite app on your phone?",
        "If you could learn any skill instantly, what would it be?",
        "What's your favorite quote?",
        "Do you prefer the beach or the mountains?",
        "What's your favorite holiday?",
        "If you could live in any country, where would it be?",
        "What's your favorite thing about your job?",
        "Do you have a favorite podcast?",
        "What's your go-to comfort food?",
        "If you could change one thing about the world, what would it be?",
        "What's your favorite way to spend a Saturday?",
        "Do you enjoy cooking?",
        "What's your favorite dessert?",
        "If you could meet any historical figure, who would it be?",
        "What's your favorite game to play?",
        "Do you prefer reading fiction or non-fiction?",
        "What's your favorite way to exercise?",
        "If you could have any superpower, what would it be?",
        "What's your favorite thing to do outdoors?",
        "Do you enjoy traveling?",
        "What's your favorite city that you've visited?",
        "If you could master any language, which one would it be?",
        "What's your favorite childhood cartoon?",
        "Do you have a favorite family tradition?",
        "What's your favorite way to celebrate your birthday?",
        "If you could be any animal, what would you be?",
        "What's your favorite thing about your best friend?",
        "Do you prefer watching movies at home or in the theater?",
        "What's your favorite type of cuisine?",
        "If you could have any job for a day, what would it be?",
        "What's your favorite thing to do on a rainy day?",
        "Do you have a favorite board game?",
        "What's your favorite ice cream flavor?",
        "If you could visit any planet, which one would it be?",
        "What's your favorite way to stay organized?",
        "Do you have a favorite charity or cause?",
        "What's your favorite thing about your hometown?",
        "If you could invent something, what would it be?",
        "What's your favorite way to give back to the community?",
        "Do you have a favorite family recipe?",
        "What's your favorite thing to do with friends?",
        "If you could change one thing about yourself, what would it be?",
        "What's your favorite way to unwind after a long day?",
        "Do you have a favorite childhood toy?",
        "What's your favorite thing about being an adult?",
        "If you could have any car, what would it be?",
        "What's your favorite way to stay active?",
        "Do you have a favorite type of flower?",
        "What's your favorite thing to do in your free time?",
        "If you could have any celebrity as a best friend, who would it be?",
        "What's your favorite thing about your culture?",
        "Do you have a favorite family vacation spot?",
        "What's your favorite way to express creativity?",
        "If you could have any talent, what would it be?",
        "What's your favorite thing about your partner?",
        "Do you have a favorite type of art?",
        "What's your favorite way to celebrate achievements?",
        "If you could have any animal as a pet, what would it be?",
        "What's your favorite thing about your education?",
        "Do you have a favorite outdoor activity?",
        "What's your favorite way to connect with nature?",
        "If you could have any historical event happen differently, what would it be?",
        "What's your favorite thing about your family?",
        "Do you have a favorite type of music to dance to?",
        "What's your favorite way to learn new things?",
        "If you could have any fictional character as a friend, who would it be?",
        "What's your favorite thing about your community?",
        "Do you have a favorite way to celebrate holidays?",
        "What's your favorite thing about your job?",
        "If you could have any wish granted, what would it be?",
        "What's your favorite way to spend time with family?",
        "Do you have a favorite type of exercise?",
        "What's your favorite thing about your life right now?",
        "If you could have any piece of technology, what would it be?",
        "What's your favorite way to stay motivated?",
        "Do you have a favorite type of clothing?",
        "What's your favorite thing about your friends?",
        "If you could have any dream come true, what would it be?",
        "What's your favorite way to celebrate milestones?",
        "Do you have a favorite type of dessert to make?",
        "What's your favorite thing about your personality?",
        "If you could have any experience, what would it be?",
        "What's your favorite way to show appreciation?",
        "Do you have a favorite type of music to listen to while working?",
        "What's your favorite thing about your daily routine?",
        "If you could have any adventure, what would it be?",
        "What's your favorite way to practice self-care?",
        "Do you have a favorite type of tea or coffee?",
        "What's your favorite thing about your life goals?",
        "If you could have any mentor, who would it be?",
        "What's your favorite way to stay connected with friends?",
        "Do you have a favorite type of vacation?",
        "What's your favorite thing about your personal growth?",
        "If you could have any experience in nature, what would it be?",
        "What's your favorite way to celebrate small wins?",
        "Do you have a favorite type of music to relax to?",
        "What's your favorite thing about your future aspirations?",
        "If you could have any skill that you currently don't have, what would it be?",
        "What's your favorite way to enjoy a sunny day?",
        "Do you have a favorite type of movie genre?",
        "What's your favorite thing about your past experiences?",
        "If you could have any wish for the world, what would it be?",
        "What's your favorite way to enjoy a quiet evening?",
        "Do you have a favorite type of fruit?",
        "What's your favorite thing about your current situation?",
        "If you could have any experience with a famous person, who would it be?",
        "What's your favorite way to stay inspired?",
        "Do you have a favorite type of snack?",
        "What's your favorite thing about your daily challenges?",
        "If you could have any experience in a different culture, what would it be?",
        "What's your favorite way to enjoy a cozy night in?",
        "Do you have a favorite type of flower to grow?",
        "What's your favorite thing about your personal achievements?",
        "If you could have any experience in a different time period, what would it be?",
        "What's your favorite way to enjoy a rainy day?",
        "Do you have a favorite type of game to play?",
        "What's your favorite thing about your current hobbies?",
        "If you could have any experience with a fictional character, who would it be?",
        "What's your favorite way to enjoy a day off?",
        "Do you have a favorite type of music to sing along to?",
        "What's your favorite thing about your current lifestyle?",
        "If you could have any experience in a different profession, what would it be?",
        "What's your favorite way to enjoy a meal with friends?",
        "Do you have a favorite type of art to create?",
        "What's your favorite thing about your current relationships?",
        "If you could have any experience in a different country, what would it be?",
        "What's your favorite way to enjoy a cultural event?",
        "Do you have a favorite type of sport to watch?",
        "What's your favorite thing about your current environment?",
        "If you could have any experience with a historical event, what would it be?",
        "What's your favorite way to enjoy a festival?",
        "Do you have a favorite type of dance?",
        "What's your favorite thing about your current adventures?",
        "If you could have any experience in a different field, what would it be?",
        "What's your favorite way to enjoy a community event?",
        "Do you have a favorite type of outdoor activity to do alone?",
        "What's your favorite thing about your current projects?",
        "If you could have any experience with a famous artist, who would it be?",
        "What's your favorite way to enjoy a family gathering?",
        "Do you have a favorite type of music to play at parties?",
        "What's your favorite thing about your current lifestyle choices?",
        "If you could have any experience in a different industry, what would it be?",
        "What's your favorite way to enjoy a quiet moment?",
        "Do you have a favorite type of book to read?",
        "What's your favorite thing about your current learning journey?",
        "If you could have any experience with a mentor, who would it be?",
        "What's your favorite way to enjoy a spontaneous adventure?",
        "Do you have a favorite type of podcast to listen to?",
        "What's your favorite thing about your current self-discovery?",
        "If you could have any experience in a different hobby, what would it be?",
        "What's your favorite way to enjoy a creative project?",
        "Do you have a favorite type of social event to attend?",
        "What's your favorite thing about your current friendships?",
        "If you could have any experience with a celebrity, who would it be?",
        "What's your favorite way to enjoy a day in nature?",
        "Do you have a favorite type of cuisine to try?",
        "What's your favorite thing about your current goals?",
        "If you could have any experience in a different lifestyle, what would it be?",
        "What's your favorite way to enjoy a relaxing weekend?",
        "Do you have a favorite type of movie to watch with friends?",
        "What's your favorite thing about your current aspirations?",
        "If you could have any experience with a historical figure, who would it be?",
        "What's your favorite way to enjoy a day at the beach?",
        "Do you have a favorite type of drink to enjoy?",
        "What's your favorite thing about your current achievements?",
        "If you could have any experience in a different sport, what would it be?",
        "What's your favorite way to enjoy a night out?",
        "Do you have a favorite type of dessert to share?",
        "What's your favorite thing about your current lifestyle habits?",
        "If you could have any experience with a fictional character, who would it be?",
        "What's your favorite way to enjoy a family tradition?",
        "Do you have a favorite type of music to listen to while working out?",
        "What's your favorite thing about your current experiences?",
        "If you could have any experience in a different culture, what would it be?",
        "What's your favorite way to enjoy a cozy evening at home?",
        "Do you have a favorite type of game to play with friends?",
        "What's your favorite thing about your current interests?",
        "If you could have any experience with a famous author, who would it be?",
        "What's your favorite way to enjoy a day of relaxation?",
        "Do you have a favorite type of activity to do with family?",
        "What's your favorite thing about your current lifestyle changes?",
        "If you could have any experience in a different profession, what would it be?",
        "What's your favorite way to enjoy a cultural experience?",
        "Do you have a favorite type of music to listen to while relaxing?",
        "What's your favorite thing about your current journey?",
        "If you could have any experience with a mentor, who would it be?",
        "What's your favorite way to enjoy a spontaneous trip?",
        "Do you have a favorite type of art to appreciate?",
        "What's your favorite thing about your current passions?",
        "If you could have any experience in a different field, what would it be?",
        "What's your favorite way to enjoy a day of adventure?",
        "Do you have a favorite type of event to attend?",
    ]
};

function getRandomMessage() {
    const index = Math.floor(Math.random() * CONFIG.RANDOM_MESSAGES.length);
    return CONFIG.RANDOM_MESSAGES[index];
}

function getTokens() {
    try {
        return fs.readFileSync(CONFIG.TOKEN_FILE, 'utf8').trim().split('\n');
    } catch (error) {
        console.error('Error reading token file:', error);
        process.exit(1);
    }
}

function getProxies() {
    try {
        return fs.readFileSync(CONFIG.PROXY_FILE, 'utf8').trim().split('\n');
    } catch (error) {
        console.error('Error reading proxy file:', error);
        process.exit(1);
    }
}

function createApiClient(token, proxy) {
    const axiosConfig = {
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
    };

    if (proxy) {
        const proxyUrl = proxy.startsWith('http://') ? proxy : `http://${proxy}`;
        const isSocksProxy = proxy.startsWith('socks://');

        // Use the appropriate agent based on the proxy type
        if (isSocksProxy) {
            axiosConfig.httpAgent = new SocksProxyAgent(proxyUrl);
        } else {
            axiosConfig.httpAgent = new HttpsProxyAgent(proxyUrl);
        }
    }

    return axios.create(axiosConfig);
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
    const tokens = getTokens();
    const proxies = getProxies();
    let currentThreadId = null;

    // Create an array of promises for each token
    const botPromises = tokens.map(async (token, index) => {
        const proxy = proxies[index % proxies.length]; // Cycle through proxies
        const apiClient = createApiClient(token, proxy);

        await checkPoints(apiClient);

        const threads = await getThreads(apiClient);
        if (threads.length > 0) {
            currentThreadId = threads[0].id;
            console.log(`Using existing thread for token ${index + 1}:`, currentThreadId);
        } else {
            const newThread = await createNewThread(apiClient, "Starting new conversation");
            if (newThread) {
                currentThreadId = newThread.id;
                console.log(`Created new thread for token ${index + 1}:`, currentThreadId);
            }
        }

        // Set an interval for sending messages
        setInterval(async () => {
            if (!currentThreadId) {
                console.log(`No active thread available for token ${index + 1}. Creating new thread...`);
                const newThread = await createNewThread(apiClient, "Starting new conversation");
                if (newThread) {
                    currentThreadId = newThread.id;
                } else {
                    return;
                }
            }

            const points = await checkPoints(apiClient);
            if (!points || points.total_points <= 0) {
                console.log(`No points available for token ${index + 1}. Waiting for next interval...`);
                return;
            }

            const message = getRandomMessage();
            const result = await sendMessageToThread(apiClient, currentThreadId, message);

            if (!result) {
                console.log(`Failed to send message for token ${index + 1}, will try creating new thread next time`);
                currentThreadId = null;
            }

            await checkPoints(apiClient);
        }, CONFIG.CHAT_INTERVAL);
    });

    // Wait for all bot promises to complete
    await Promise.all(botPromises);
}

runBot().catch(error => {
    console.error('Bot crashed:', error);
    process.exit(1);
});
