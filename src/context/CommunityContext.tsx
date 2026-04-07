import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type ReactionType = '❤️' | '🙌' | '💡' | '👏' | '🔥' | '💪';

export const REACTION_OPTIONS: ReactionType[] = ['❤️', '🙌', '💡', '👏', '🔥', '💪'];

/** Map of emoji → count. User's own reactions tracked separately. */
export type Reactions = Partial<Record<ReactionType, number>>;

export interface Reply {
  id: string;
  author: string;
  time: string;
  content: string;
  likes: number;
  likedByUser: boolean;
  reactions?: Reactions;
  userReactions?: ReactionType[];
}

export type CommunitySpace = 'sleep' | 'anxiety' | 'movement' | 'nutrition';

export interface Post {
  id: string;
  author: string;
  time: string;
  content: string;
  replies: Reply[];
  likes: number;
  likedByUser: boolean;
  pinned?: boolean;
  space?: CommunitySpace;
  reactions?: Reactions;
  userReactions?: ReactionType[];
}

export interface Comment {
  id: string;
  author: string;
  time: string;
  content: string;
  likes: number;
  likedByUser: boolean;
}

interface CommunityContextType {
  posts: Post[];
  addPost: (content: string, space?: CommunitySpace) => Post;
  addReply: (postId: string, content: string) => Reply | null;
  toggleLikePost: (postId: string) => void;
  toggleLikeReply: (postId: string, replyId: string) => void;
  toggleReaction: (postId: string, reaction: ReactionType) => void;
  toggleReplyReaction: (postId: string, replyId: string, reaction: ReactionType) => void;
  getPost: (postId: string) => Post | undefined;

  getComments: (contentId: string) => Comment[];
  addComment: (contentId: string, content: string) => void;
  toggleLikeComment: (contentId: string, commentId: string) => void;
}

const initialPosts: Post[] = [
  {
    id: '1',
    author: 'Dr. Maya Chen',
    time: '2 hours ago',
    content: 'Welcome to the Solace Community! This is a safe space to share your wellness journey, ask questions, and support one another. Please be kind and respectful in all interactions.',
    likes: 89,
    likedByUser: false,
    pinned: true,
    reactions: { '❤️': 42, '🙌': 28, '💡': 19 },
    userReactions: [],
    replies: [
      { id: '1-1', author: 'Priya K.', time: '1 hour ago', content: "Thank you for creating this space! Already feeling supported just by reading everyone's posts.", likes: 12, likedByUser: false, reactions: { '❤️': 8, '🙌': 4 }, userReactions: [] },
      { id: '1-2', author: 'Marcus T.', time: '45 min ago', content: 'So glad to be here. Looking forward to connecting with everyone.', likes: 8, likedByUser: false, reactions: { '❤️': 5, '🙌': 3 }, userReactions: [] },
    ],
  },
  {
    id: '2',
    author: 'Jordan Rivera',
    time: '5 hours ago',
    content: "Just finished recording a new breathwork session for the Sleep & Rest space. It focuses on the 4-7-8 technique — really effective for those nights when your mind won't quiet down. Look for it in the library this week!",
    likes: 45,
    likedByUser: false,
    space: 'sleep',
    reactions: { '❤️': 20, '🔥': 15, '🙌': 10 },
    userReactions: [],
    replies: [
      { id: '2-1', author: 'Sarah Wells', time: '4 hours ago', content: "Can't wait to try this! The 4-7-8 technique has been a game changer for me.", likes: 5, likedByUser: false, reactions: { '❤️': 3, '🔥': 2 }, userReactions: [] },
    ],
  },
  {
    id: '3',
    author: 'Priya K.',
    time: '8 hours ago',
    content: "Has anyone tried combining their evening meditation with journaling? I've been doing both for the past week and it's been transformative for my sleep quality.",
    likes: 32,
    likedByUser: false,
    space: 'sleep',
    reactions: { '❤️': 15, '💡': 10, '🙌': 7 },
    userReactions: [],
    replies: [
      { id: '3-1', author: 'Dr. Maya Chen', time: '7 hours ago', content: 'This is a wonderful practice! Research shows that expressive writing before bed can reduce cognitive arousal and help you fall asleep faster.', likes: 15, likedByUser: false, reactions: { '💡': 9, '❤️': 6 }, userReactions: [] },
      { id: '3-2', author: 'Jordan Rivera', time: '6 hours ago', content: 'I do this every night! I meditate for 10 minutes, then journal for 5. It really helps process the day.', likes: 9, likedByUser: false, reactions: { '❤️': 5, '🙌': 4 }, userReactions: [] },
      { id: '3-3', author: 'Sarah L.', time: '4 hours ago', content: 'Just tried this last night after reading your post — slept so much better. Thank you for the suggestion!', likes: 7, likedByUser: false, reactions: { '❤️': 4, '🙌': 3 }, userReactions: [] },
    ],
  },
  {
    id: '4',
    author: 'Marcus T.',
    time: '1 day ago',
    content: "Week 3 of the Sleep Reset program and I'm already noticing improvements. My average time to fall asleep has dropped from 45 minutes to about 20. The guided body scan before bed has been a game changer.",
    likes: 56,
    likedByUser: false,
    space: 'sleep',
    reactions: { '❤️': 28, '💪': 16, '🙌': 12 },
    userReactions: [],
    replies: [
      { id: '4-1', author: 'Dr. Maya Chen', time: '23 hours ago', content: "That's fantastic progress, Marcus! The body scan is one of the most effective techniques for transitioning into sleep.", likes: 11, likedByUser: false, reactions: { '❤️': 7, '👏': 4 }, userReactions: [] },
    ],
  },
  {
    id: '5',
    author: 'Sarah Wells',
    time: '1 day ago',
    content: "Reminder: Our Community Wellness Circle is coming up on April 25th. It's a great opportunity to connect with fellow members and share what's been working for you. Hope to see you there!",
    likes: 28,
    likedByUser: false,
    reactions: { '❤️': 14, '👏': 8, '🙌': 6 },
    userReactions: [],
    replies: [],
  },
  // Anxiety Support posts
  {
    id: '6',
    author: 'Dr. Maya Chen',
    time: '3 hours ago',
    content: "A reminder that anxiety is not a character flaw — it's your nervous system doing its best to protect you. Today, try placing a hand on your chest and taking three slow breaths. Sometimes the simplest gestures carry the most power.",
    likes: 41,
    likedByUser: false,
    space: 'anxiety',
    reactions: { '❤️': 22, '💡': 12, '🙌': 7 },
    userReactions: [],
    replies: [
      { id: '6-1', author: 'Sarah L.', time: '2 hours ago', content: 'Needed this today. Thank you, Dr. Chen.', likes: 6, likedByUser: false, reactions: { '❤️': 4, '🙌': 2 }, userReactions: [] },
    ],
  },
  {
    id: '7',
    author: 'Marcus T.',
    time: '6 hours ago',
    content: "Does anyone else find their anxiety spikes in the late afternoon? I've started doing a 5-minute breathing exercise around 3pm and it's been helping. Would love to hear what works for others.",
    likes: 23,
    likedByUser: false,
    space: 'anxiety',
    reactions: { '❤️': 10, '🙌': 8, '💡': 5 },
    userReactions: [],
    replies: [
      { id: '7-1', author: 'Priya K.', time: '5 hours ago', content: 'Yes! Mine peaks right after lunch. The Calm Your Nervous System video in the library has been a lifesaver for those moments.', likes: 9, likedByUser: false, reactions: { '❤️': 5, '💡': 4 }, userReactions: [] },
      { id: '7-2', author: 'Jordan Rivera', time: '4 hours ago', content: 'Afternoon anxiety is very common — it often correlates with blood sugar and cortisol patterns. Try a short walk + breathwork combo.', likes: 12, likedByUser: false, reactions: { '💡': 7, '❤️': 5 }, userReactions: [] },
    ],
  },
  // Mindful Movement posts
  {
    id: '8',
    author: 'Jordan Rivera',
    time: '4 hours ago',
    content: "New gentle morning stretch routine just dropped in the library! It's only 15 minutes and designed for all levels. Perfect way to wake up your body without pushing too hard.",
    likes: 37,
    likedByUser: false,
    space: 'movement',
    reactions: { '❤️': 18, '🔥': 12, '🙌': 7 },
    userReactions: [],
    replies: [
      { id: '8-1', author: 'Sarah Wells', time: '3 hours ago', content: 'Just tried it — my shoulders feel amazing. Adding this to my morning routine for sure.', likes: 8, likedByUser: false, reactions: { '❤️': 5, '🔥': 3 }, userReactions: [] },
    ],
  },
  {
    id: '9',
    author: 'Priya K.',
    time: '1 day ago',
    content: "I used to think movement had to be intense to 'count.' This community has completely changed that for me. A 10-minute walk in nature does more for my mental health than any gym session ever did.",
    likes: 52,
    likedByUser: false,
    space: 'movement',
    reactions: { '❤️': 25, '💪': 18, '🙌': 9 },
    userReactions: [],
    replies: [
      { id: '9-1', author: 'Marcus T.', time: '22 hours ago', content: 'This resonates so much. Gentle movement has been a game changer for my recovery.', likes: 11, likedByUser: false, reactions: { '❤️': 7, '💪': 4 }, userReactions: [] },
    ],
  },
  // Nutrition & Nourishment posts
  {
    id: '10',
    author: 'Aisha Patel',
    time: '5 hours ago',
    content: "This week's meal planning tip: batch cook one grain, one protein, and one roasted veggie on Sunday. You'll have the building blocks for 4-5 different meals without the daily decision fatigue.",
    likes: 44,
    likedByUser: false,
    space: 'nutrition',
    reactions: { '❤️': 22, '💡': 14, '🙌': 8 },
    userReactions: [],
    replies: [
      { id: '10-1', author: 'Sarah L.', time: '4 hours ago', content: 'The weekly meal planning template in the Resources section pairs perfectly with this approach!', likes: 7, likedByUser: false, reactions: { '❤️': 4, '💡': 3 }, userReactions: [] },
    ],
  },
  {
    id: '11',
    author: 'Sarah Wells',
    time: '1 day ago',
    content: "Started the Nourish program last week and I'm already rethinking my relationship with food. It's not about restriction — it's about fueling your body with intention. Highly recommend it.",
    likes: 29,
    likedByUser: false,
    space: 'nutrition',
    reactions: { '❤️': 16, '💪': 8, '💡': 5 },
    userReactions: [],
    replies: [],
  },
];

const initialContentComments: Record<string, Comment[]> = {
  'sleep-reset': [
    { id: 'c1', author: 'Marcus T.', time: '2 days ago', content: "Week 3 and I'm already noticing improvements. My average time to fall asleep has dropped from 45 minutes to about 20.", likes: 14, likedByUser: false },
    { id: 'c2', author: 'Sarah Wells', time: '3 days ago', content: 'The guided body scan in lesson 2 is incredible. I fall asleep before it even finishes most nights now.', likes: 9, likedByUser: false },
  ],
  'guided-body-scan': [
    { id: 'c3', author: 'Priya K.', time: '2 hours ago', content: 'This was really helpful for understanding how to create a better evening routine. Thank you for sharing!', likes: 6, likedByUser: false },
    { id: 'c4', author: 'Jordan R.', time: '5 hours ago', content: "I've been trying the breathing technique mentioned here and it's made a noticeable difference in my sleep quality.", likes: 4, likedByUser: false },
  ],
  'body-keeps-score': [
    { id: 'c5', author: 'Sarah L.', time: '1 day ago', content: 'This article completely changed how I think about anxiety. The mind-body connection explanation was so clear.', likes: 11, likedByUser: false },
  ],
  'mindful-mornings': [
    { id: 'c6', author: 'Jordan R.', time: '4 hours ago', content: "I've been doing this program for a week now and my mornings feel completely different. So much calmer.", likes: 7, likedByUser: false },
  ],
  'calm-nervous-system': [
    { id: 'c7', author: 'Priya K.', time: '1 day ago', content: 'Quick and effective — exactly what I needed for those anxious moments at work. Bookmarked this one!', likes: 8, likedByUser: false },
  ],
};

let nextPostId = 100;
let nextReplyId = 1000;
let nextCommentId = 2000;

const CommunityContext = createContext<CommunityContextType | null>(null);

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [contentComments, setContentComments] = useState<Record<string, Comment[]>>(initialContentComments);

  const addPost = useCallback((content: string, space?: CommunitySpace): Post => {
    const newPost: Post = {
      id: String(nextPostId++),
      author: 'Maya',
      time: 'Just now',
      content,
      replies: [],
      likes: 0,
      likedByUser: false,
      space,
      reactions: {},
      userReactions: [],
    };
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  }, []);

  const addReply = useCallback((postId: string, content: string): Reply | null => {
    const newReply: Reply = {
      id: String(nextReplyId++),
      author: 'Maya',
      time: 'Just now',
      content,
      likes: 0,
      likedByUser: false,
      reactions: {},
      userReactions: [],
    };
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p
    ));
    return newReply;
  }, []);

  const toggleLikePost = useCallback((postId: string) => {
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, likedByUser: !p.likedByUser, likes: p.likedByUser ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  }, []);

  const toggleLikeReply = useCallback((postId: string, replyId: string) => {
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? {
            ...p,
            replies: p.replies.map(r =>
              r.id === replyId
                ? { ...r, likedByUser: !r.likedByUser, likes: r.likedByUser ? r.likes - 1 : r.likes + 1 }
                : r
            ),
          }
        : p
    ));
  }, []);

  const toggleReaction = useCallback((postId: string, reaction: ReactionType) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const userReactions = p.userReactions || [];
      const reactions = { ...p.reactions } as Reactions;
      const hasReacted = userReactions.includes(reaction);
      if (hasReacted) {
        // Remove reaction
        const count = (reactions[reaction] || 1) - 1;
        if (count <= 0) {
          delete reactions[reaction];
        } else {
          reactions[reaction] = count;
        }
        return { ...p, reactions, userReactions: userReactions.filter(r => r !== reaction) };
      } else {
        // Add reaction
        reactions[reaction] = (reactions[reaction] || 0) + 1;
        return { ...p, reactions, userReactions: [...userReactions, reaction] };
      }
    }));
  }, []);

  const toggleReplyReaction = useCallback((postId: string, replyId: string, reaction: ReactionType) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        replies: p.replies.map(r => {
          if (r.id !== replyId) return r;
          const userReactions = r.userReactions || [];
          const reactions = { ...r.reactions } as Reactions;
          const hasReacted = userReactions.includes(reaction);
          if (hasReacted) {
            const count = (reactions[reaction] || 1) - 1;
            if (count <= 0) {
              delete reactions[reaction];
            } else {
              reactions[reaction] = count;
            }
            return { ...r, reactions, userReactions: userReactions.filter(x => x !== reaction) };
          } else {
            reactions[reaction] = (reactions[reaction] || 0) + 1;
            return { ...r, reactions, userReactions: [...userReactions, reaction] };
          }
        }),
      };
    }));
  }, []);

  const getPost = useCallback((postId: string) => {
    return posts.find(p => p.id === postId);
  }, [posts]);

  const getComments = useCallback((contentId: string): Comment[] => {
    return contentComments[contentId] || [];
  }, [contentComments]);

  const addComment = useCallback((contentId: string, content: string) => {
    const newComment: Comment = {
      id: String(nextCommentId++),
      author: 'Maya',
      time: 'Just now',
      content,
      likes: 0,
      likedByUser: false,
    };
    setContentComments(prev => ({
      ...prev,
      [contentId]: [...(prev[contentId] || []), newComment],
    }));
  }, []);

  const toggleLikeComment = useCallback((contentId: string, commentId: string) => {
    setContentComments(prev => ({
      ...prev,
      [contentId]: (prev[contentId] || []).map(c =>
        c.id === commentId
          ? { ...c, likedByUser: !c.likedByUser, likes: c.likedByUser ? c.likes - 1 : c.likes + 1 }
          : c
      ),
    }));
  }, []);

  return (
    <CommunityContext.Provider value={{ posts, addPost, addReply, toggleLikePost, toggleLikeReply, toggleReaction, toggleReplyReaction, getPost, getComments, addComment, toggleLikeComment }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error('useCommunity must be used within CommunityProvider');
  return ctx;
}
