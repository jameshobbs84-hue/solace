export type ContentType = 'Audio' | 'Video' | 'Article' | 'Program' | 'Resource' | 'Discussion';

export interface ProgramLesson {
  title: string;
  type: ContentType;
  author: string;
  duration: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  author: string;
  duration: string;
  description?: string;
  topics: string[];
  progress?: number; // 0-100
  lessonsTotal?: number;
  lessonsCompleted?: number;
  lessons?: ProgramLesson[];
}

export interface EventItem {
  id: string;
  title: string;
  host: string;
  date: string;
  time: string;
  month: string;
  day: string;
  attending: number;
  description?: string;
}

export const allContent: ContentItem[] = [
  {
    id: 'sleep-reset',
    title: 'The Sleep Reset',
    type: 'Program',
    author: 'Dr. Maya Chen',
    duration: '7 lessons',
    description: 'A 7-day guided program to rebuild your relationship with sleep. Transform your evenings and wake up refreshed.',
    topics: ['Sleep', 'Mindfulness'],
    lessonsTotal: 7,
    lessonsCompleted: 4,
    lessons: [
      { title: 'Understanding Your Sleep Cycle', type: 'Article', author: 'Dr. Maya Chen', duration: '8 min read' },
      { title: 'Creating Your Sleep Environment', type: 'Video', author: 'Dr. Maya Chen', duration: '12 min' },
      { title: 'Evening Wind-Down Ritual', type: 'Audio', author: 'Dr. Maya Chen', duration: '15 min' },
      { title: 'Managing Racing Thoughts', type: 'Article', author: 'Dr. Maya Chen', duration: '6 min read' },
      { title: 'Breathwork for Sleep', type: 'Audio', author: 'Jordan Rivera', duration: '20 min' },
      { title: 'Movement & Sleep Connection', type: 'Video', author: 'Jordan Rivera', duration: '18 min' },
      { title: 'Building Lasting Habits', type: 'Resource', author: 'Dr. Maya Chen', duration: 'PDF' },
    ],
  },
  {
    id: 'guided-body-scan',
    title: 'Guided Body Scan',
    type: 'Audio',
    author: 'Dr. Maya Chen',
    duration: '15 min',
    description: 'A soothing guided meditation that brings awareness to each part of your body, releasing tension and promoting deep relaxation.',
    topics: ['Mindfulness', 'Sleep'],
    progress: 60,
  },
  {
    id: 'body-keeps-score',
    title: 'Why Your Body Keeps the Score',
    type: 'Article',
    author: 'Dr. Maya Chen',
    duration: '8 min read',
    description: 'Understanding the mind-body connection and how trauma is stored in the body. Learn practical techniques for somatic release.',
    topics: ['Anxiety', 'Mindfulness'],
  },
  {
    id: 'mindful-mornings',
    title: 'Mindful Mornings',
    type: 'Program',
    author: 'Jordan Rivera',
    duration: '5 lessons',
    description: 'Start your day with intention through guided meditation and breathwork.',
    topics: ['Mindfulness'],
    lessonsTotal: 5,
    lessonsCompleted: 1,
    lessons: [
      { title: 'The Power of Morning Intention', type: 'Article', author: 'Jordan Rivera', duration: '5 min read' },
      { title: 'Sunrise Breathing Exercise', type: 'Audio', author: 'Jordan Rivera', duration: '10 min' },
      { title: 'Mindful Morning Movement', type: 'Video', author: 'Jordan Rivera', duration: '12 min' },
      { title: 'Gratitude Journaling Practice', type: 'Article', author: 'Jordan Rivera', duration: '6 min read' },
      { title: 'Building Your Morning Ritual', type: 'Resource', author: 'Jordan Rivera', duration: 'PDF' },
    ],
  },
  {
    id: 'calm-nervous-system',
    title: 'Calm Your Nervous System in 10 Minutes',
    type: 'Video',
    author: 'Jordan Rivera',
    duration: '10 min',
    description: 'Quick and effective techniques to activate your parasympathetic nervous system and find calm in moments of stress.',
    topics: ['Anxiety', 'Movement'],
  },
  {
    id: 'evening-wind-down',
    title: 'Evening Wind-Down Meditation',
    type: 'Audio',
    author: 'Dr. Maya Chen',
    duration: '20 min',
    description: 'Gently transition from your busy day into restful evening with this calming meditation practice.',
    topics: ['Sleep', 'Mindfulness'],
    progress: 35,
  },
  {
    id: 'movement-anxiety-relief',
    title: 'Movement for Anxiety Relief',
    type: 'Program',
    author: 'Jordan Rivera',
    duration: '6 lessons',
    description: 'Gentle movement practices designed to calm your nervous system.',
    topics: ['Anxiety', 'Movement'],
    lessonsTotal: 6,
    lessonsCompleted: 0,
    lessons: [
      { title: 'Understanding Anxiety in the Body', type: 'Article', author: 'Jordan Rivera', duration: '7 min read' },
      { title: 'Grounding Through Gentle Stretching', type: 'Video', author: 'Jordan Rivera', duration: '15 min' },
      { title: 'Shaking It Off: Tension Release', type: 'Video', author: 'Jordan Rivera', duration: '10 min' },
      { title: 'Breathwork for Anxious Moments', type: 'Audio', author: 'Jordan Rivera', duration: '12 min' },
      { title: 'Restorative Yoga for Calm', type: 'Video', author: 'Jordan Rivera', duration: '20 min' },
      { title: 'Building a Movement Routine', type: 'Resource', author: 'Jordan Rivera', duration: 'PDF' },
    ],
  },
  {
    id: 'walking-mindfulness',
    title: 'Walking Mindfulness',
    type: 'Audio',
    author: 'Aisha Patel',
    duration: '12 min',
    description: 'Transform your daily walk into a meditative practice that grounds you in the present moment.',
    topics: ['Mindfulness', 'Movement'],
  },
  {
    id: 'science-sleep-hygiene',
    title: 'The Science of Sleep Hygiene',
    type: 'Article',
    author: 'Dr. Maya Chen',
    duration: '10 min read',
    description: 'Evidence-based strategies for improving your sleep environment and nighttime routine.',
    topics: ['Sleep'],
    progress: 75,
  },
  {
    id: 'nourish-nutrition',
    title: 'Nourish: Nutrition Fundamentals',
    type: 'Program',
    author: 'Aisha Patel',
    duration: '8 lessons',
    description: 'Build a foundation of nutritional knowledge to fuel your wellness journey.',
    topics: ['Nutrition'],
    lessonsTotal: 8,
    lessonsCompleted: 0,
    lessons: [
      { title: 'Nutrition Basics: What Your Body Needs', type: 'Article', author: 'Aisha Patel', duration: '8 min read' },
      { title: 'Understanding Macronutrients', type: 'Video', author: 'Aisha Patel', duration: '14 min' },
      { title: 'Mindful Eating Meditation', type: 'Audio', author: 'Aisha Patel', duration: '10 min' },
      { title: 'Meal Prep Made Simple', type: 'Video', author: 'Aisha Patel', duration: '18 min' },
      { title: 'The Gut-Brain Connection', type: 'Article', author: 'Aisha Patel', duration: '7 min read' },
      { title: 'Hydration & Wellness', type: 'Article', author: 'Aisha Patel', duration: '5 min read' },
      { title: 'Cooking for Calm: Anti-Inflammatory Recipes', type: 'Video', author: 'Aisha Patel', duration: '22 min' },
      { title: 'Your Personal Nutrition Plan', type: 'Resource', author: 'Aisha Patel', duration: 'PDF' },
    ],
  },
  {
    id: 'morning-routine-tips',
    title: 'Tips for Building a Morning Routine',
    type: 'Video',
    author: 'Jordan Rivera',
    duration: '8 min',
    description: 'Practical tips for creating a sustainable morning routine that sets you up for success.',
    topics: ['Mindfulness'],
  },
  {
    id: 'weekly-wellness-checkin',
    title: 'Weekly Wellness Check-in',
    type: 'Discussion',
    author: 'Community',
    duration: '42 replies',
    description: 'Share your weekly wins, challenges, and intentions with the community.',
    topics: ['Mindfulness'],
  },
  {
    id: 'breathwork-sleep',
    title: 'Breathwork for Sleep',
    type: 'Audio',
    author: 'Jordan Rivera',
    duration: '20 min',
    description: 'Calming breathwork techniques designed to prepare your body and mind for restful sleep.',
    topics: ['Sleep'],
    progress: 50,
  },
  {
    id: 'breathing-techniques-calm',
    title: '3 Breathing Techniques for Instant Calm',
    type: 'Article',
    author: 'Jordan Rivera',
    duration: '5 min read',
    description: 'Three simple breathing exercises you can do anywhere to quickly reduce stress and anxiety.',
    topics: ['Anxiety', 'Mindfulness'],
  },
  {
    id: 'sleep-stories-mountain',
    title: 'Sleep Stories: The Mountain Lake',
    type: 'Audio',
    author: 'Sarah Wells',
    duration: '25 min',
    description: 'A gentle bedtime story set against the backdrop of a peaceful mountain lake.',
    topics: ['Sleep'],
  },
  {
    id: 'meditation-journaling',
    title: 'Combining Meditation with Journaling',
    type: 'Discussion',
    author: 'Priya K.',
    duration: '15 replies',
    description: 'Explore how combining meditation and journaling can deepen your mindfulness practice.',
    topics: ['Mindfulness'],
  },
  {
    id: 'starting-wellness-journey',
    title: 'Starting Your Wellness Journey',
    type: 'Article',
    author: 'Dr. Maya Chen',
    duration: '6 min read',
    description: 'A gentle introduction to beginning your wellness path with confidence.',
    topics: ['Mindfulness'],
  },
  {
    id: 'body-scan-beginners',
    title: 'Guided Body Scan for Beginners',
    type: 'Audio',
    author: 'Jordan Rivera',
    duration: '10 min',
    description: 'An accessible body scan meditation designed specifically for those new to the practice.',
    topics: ['Mindfulness'],
  },
  {
    id: 'morning-stretch-routine',
    title: 'Gentle Morning Stretch Routine',
    type: 'Video',
    author: 'Jordan Rivera',
    duration: '15 min',
    description: 'Wake up your body with gentle stretches that improve flexibility and energy.',
    topics: ['Movement'],
  },
  {
    id: 'what-helped-sleep',
    title: 'What Helped You Sleep Last Night?',
    type: 'Discussion',
    author: 'Community',
    duration: '31 replies',
    description: 'Community thread sharing sleep tips and what works for different people.',
    topics: ['Sleep'],
  },
  {
    id: 'intro-body-awareness',
    title: 'Introduction to Body Awareness',
    type: 'Video',
    author: 'Jordan Rivera',
    duration: '18 min',
    description: 'Learn to tune into your body\'s signals and develop a deeper mind-body connection.',
    topics: ['Mindfulness', 'Movement'],
  },
  {
    id: 'meal-planning-template',
    title: 'Weekly Meal Planning Template',
    type: 'Resource',
    author: 'Aisha Patel',
    duration: 'PDF',
    description: 'A downloadable template to help you plan nutritious meals for the week.',
    topics: ['Nutrition'],
  },
  {
    id: 'anxiety-toolkit',
    title: 'Anxiety Toolkit Workbook',
    type: 'Resource',
    author: 'Dr. Maya Chen',
    duration: 'PDF',
    description: 'A comprehensive workbook with exercises and techniques for managing anxiety.',
    topics: ['Anxiety'],
  },
];

export const events: EventItem[] = [
  {
    id: 'breathwork-intro',
    title: 'Introduction to Breathwork',
    host: 'Dr. Maya Chen',
    date: 'Sat, Apr 12',
    time: '10:00 AM',
    month: 'APR',
    day: '12',
    attending: 124,
    description: 'Join Dr. Maya Chen for an introductory session on breathwork techniques that can help reduce stress, improve sleep, and enhance overall wellbeing.',
  },
  {
    id: 'mindful-movement-workshop',
    title: 'Mindful Movement Workshop',
    host: 'Jordan Rivera',
    date: 'Fri, Apr 18',
    time: '6:00 PM',
    month: 'APR',
    day: '18',
    attending: 87,
    description: 'Experience the power of mindful movement in this interactive workshop led by Jordan Rivera.',
  },
  {
    id: 'community-wellness-circle',
    title: 'Community Wellness Circle',
    host: 'Solace Team',
    date: 'Fri, Apr 25',
    time: '12:00 PM',
    month: 'APR',
    day: '25',
    attending: 56,
    description: 'A safe space to connect with fellow members, share your journey, and support one another.',
  },
  {
    id: 'sleep-reset-qa',
    title: 'Sleep Reset Live Q&A',
    host: 'Dr. Maya Chen',
    date: 'Sat, May 3',
    time: '10:00 AM',
    month: 'MAY',
    day: '3',
    attending: 203,
    description: 'Got questions about sleep? Join Dr. Maya Chen for a live Q&A session covering all things sleep health.',
  },
];

export const topics = ['Sleep', 'Anxiety', 'Movement', 'Relationships', 'Nutrition', 'Mindfulness'] as const;

export const libraryFilters = ['All Topics', 'Sleep', 'Anxiety', 'Movement', 'Relationships', 'Nutrition', 'Mindfulness', 'Discussions'] as const;
