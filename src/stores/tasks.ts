import { defineStore } from 'pinia';

// Görev Arayüzü
interface Task {
  id: number;  // Görevlerin benzersiz kimliği
  title: string;  // Görev başlığı
  description: string;  // Görev açıklaması
  type: 'daily' | 'weekly' | 'monthly';  // Görev türü
}

// Pinia Store'u tanımlama
export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],  // Görevlerin dizisi
    nextId: 1,  // Sonraki benzersiz ID
  }),
  actions: {
    // Yeni görev ekleme
    addTask(task: Omit<Task, 'id'>) {
      this.tasks.push({
        id: this.nextId++,  // Yeni görev için benzersiz ID oluştur
        ...task,
      });
    },
    // Görev silme
    removeTask(taskId: number) {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
    },
    // Belirli bir görevi ID ile alma
    getTaskById(taskId: number) {
      return this.tasks.find(task => task.id === taskId) || null;  // Bulamazsa null döner
    },
    // Tüm görevleri alma
    getAllTasks() {
      return this.tasks;  // Tüm görevleri döner
    },
    // Görev türüne göre filtreleme
    getTasksByType(type: 'daily' | 'weekly' | 'monthly') {
      return this.tasks.filter(task => task.type === type);  // Belirtilen türdeki görevleri döner
    }
  },
});
