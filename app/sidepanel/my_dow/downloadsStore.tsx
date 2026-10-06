import AsyncStorage from "@react-native-async-storage/async-storage";

export interface DownloadedVideo {
  id: string;
  lecture: string;
  title: string;
  author: string;
  duration: string;
  thumbnail: string;
  videoUrl?: string;
}

export interface DownloadedNote {
  id: string;
  lecture: string;
  title: string;
  author?: string;
  pages?: string;
}

const STORAGE_KEYS = {
  VIDEOS: "@raos_downloaded_videos",
  NOTES: "@raos_downloaded_notes",
};

export const INITIAL_VIDEOS: DownloadedVideo[] = [
  {
    id: "1",
    lecture: "LECTURE 1",
    title: "Introduction Of Civil Procedure Code",
    author: "By Srinivas",
    duration: "35:22",
    thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
    videoUrl: "https://youtu.be/FBhPc7U8WPY?si=E4KrIc69A8UFeZo5",
  },
  {
    id: "2",
    lecture: "LECTURE 2",
    title: "Title Description",
    author: "By Srinivas",
    duration: "35:22",
    thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
    videoUrl: "https://youtu.be/FBhPc7U8WPY?si=E4KrIc69A8UFeZo5",
  },
  {
    id: "3",
    lecture: "LECTURE 3",
    title: "Section 1 - Section 25",
    author: "By Srinivas",
    duration: "26:44",
    thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
    videoUrl: "https://youtu.be/FBhPc7U8WPY?si=E4KrIc69A8UFeZo5",
  },
];

export const INITIAL_NOTES: DownloadedNote[] = [
  {
    id: "1",
    lecture: "Lecture 1",
    title: "Civil Procedure Code Notes",
    author: "By Srinivas",
    pages: "24 Pages",
  },
  {
    id: "2",
    lecture: "Lecture 2",
    title: "Indian Evidence Act Notes",
    author: "By Srinivas",
    pages: "18 Pages",
  },
  {
    id: "3",
    lecture: "Lecture 3",
    title: "Criminal Procedure Code Notes",
    author: "By Srinivas",
    pages: "32 Pages",
  },
  {
    id: "4",
    lecture: "Lecture 4",
    title: "Constitutional Law Notes",
    author: "By Srinivas",
    pages: "40 Pages",
  },
];

export async function getDownloadedVideos(): Promise<DownloadedVideo[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.VIDEOS);
    if (!raw) {
      await AsyncStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(INITIAL_VIDEOS));
      return INITIAL_VIDEOS;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error fetching downloaded videos:", error);
    return INITIAL_VIDEOS;
  }
}

export async function getDownloadedNotes(): Promise<DownloadedNote[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.NOTES);
    if (!raw) {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(INITIAL_NOTES));
      return INITIAL_NOTES;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error fetching downloaded notes:", error);
    return INITIAL_NOTES;
  }
}

export async function deleteDownloadedVideo(id: string): Promise<DownloadedVideo[]> {
  try {
    const current = await getDownloadedVideos();
    const updated = current.filter((v) => v.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("Error deleting downloaded video:", error);
    return [];
  }
}

export async function deleteDownloadedNote(id: string): Promise<DownloadedNote[]> {
  try {
    const current = await getDownloadedNotes();
    const updated = current.filter((n) => n.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("Error deleting downloaded note:", error);
    return [];
  }
}

export async function addDownloadedVideo(video: DownloadedVideo): Promise<DownloadedVideo[]> {
  try {
    const current = await getDownloadedVideos();
    const exists = current.some((v) => v.id === video.id);
    const updated = exists ? current : [video, ...current];
    await AsyncStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("Error saving downloaded video:", error);
    return [];
  }
}

export async function addDownloadedNote(note: DownloadedNote): Promise<DownloadedNote[]> {
  try {
    const current = await getDownloadedNotes();
    const exists = current.some((n) => n.id === note.id);
    const updated = exists ? current : [note, ...current];
    await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("Error saving downloaded note:", error);
    return [];
  }
}