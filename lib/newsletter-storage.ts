import fs from 'fs';
import path from 'path';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  locale: 'de' | 'en';
  source: string;
  lastOpened?: string;
  openCount: number;
}

const STORAGE_FILE = path.join(process.cwd(), 'data', 'newsletter-subscribers.json');

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.dirname(STORAGE_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Read subscribers from file
export const getSubscribers = (): NewsletterSubscriber[] => {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(STORAGE_FILE)) {
      return [];
    }
    const data = fs.readFileSync(STORAGE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading newsletter subscribers:', error);
    return [];
  }
};

// Save subscribers to file
export const saveSubscribers = (subscribers: NewsletterSubscriber[]): void => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(subscribers, null, 2));
  } catch (error) {
    console.error('Error saving newsletter subscribers:', error);
  }
};

// Add new subscriber
export const addSubscriber = (email: string, locale: 'de' | 'en' = 'de', source: string = 'Website'): NewsletterSubscriber => {
  const subscribers = getSubscribers();
  
  // Check if email already exists
  const existingSubscriber = subscribers.find(sub => sub.email.toLowerCase() === email.toLowerCase());
  if (existingSubscriber) {
    // Update existing subscriber
    existingSubscriber.status = 'active';
    existingSubscriber.locale = locale;
    existingSubscriber.source = source;
    saveSubscribers(subscribers);
    return existingSubscriber;
  }
  
  // Create new subscriber
  const newSubscriber: NewsletterSubscriber = {
    id: `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email,
    subscribedAt: new Date().toISOString(),
    status: 'active',
    locale,
    source,
    openCount: 0
  };
  
  subscribers.push(newSubscriber);
  saveSubscribers(subscribers);
  return newSubscriber;
};

// Update subscriber
export const updateSubscriber = (id: string, updates: Partial<NewsletterSubscriber>): NewsletterSubscriber | null => {
  const subscribers = getSubscribers();
  const index = subscribers.findIndex(sub => sub.id === id);
  
  if (index === -1) {
    return null;
  }
  
  subscribers[index] = { ...subscribers[index], ...updates };
  saveSubscribers(subscribers);
  return subscribers[index];
};

// Delete subscriber
export const deleteSubscriber = (id: string): boolean => {
  const subscribers = getSubscribers();
  const filteredSubscribers = subscribers.filter(sub => sub.id !== id);
  
  if (filteredSubscribers.length === subscribers.length) {
    return false; // Subscriber not found
  }
  
  saveSubscribers(filteredSubscribers);
  return true;
};

// Get subscriber by email
export const getSubscriberByEmail = (email: string): NewsletterSubscriber | null => {
  const subscribers = getSubscribers();
  return subscribers.find(sub => sub.email.toLowerCase() === email.toLowerCase()) || null;
};

