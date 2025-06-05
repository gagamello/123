import json
from pathlib import Path
import tkinter as tk
from tkinter import messagebox

TASKS_FILE = Path("tasks.json")

def load_tasks():
    if TASKS_FILE.exists():
        with TASKS_FILE.open("r", encoding="utf-8") as f:
            return json.load(f)
    return []


def save_tasks(tasks):
    with TASKS_FILE.open("w", encoding="utf-8") as f:
        json.dump(tasks, f, ensure_ascii=False, indent=2)


def refresh_listbox(listbox):
    listbox.delete(0, tk.END)
    for task in load_tasks():
        status = "✔" if task.get("done") else "✗"
        listbox.insert(tk.END, f"{task['id']}: [{status}] {task['desc']}")


def add_task(entry, listbox):
    desc = entry.get().strip()
    if not desc:
        return
    tasks = load_tasks()
    task_id = max([t["id"] for t in tasks], default=0) + 1
    tasks.append({"id": task_id, "desc": desc, "done": False})
    save_tasks(tasks)
    entry.delete(0, tk.END)
    refresh_listbox(listbox)


def delete_task(listbox):
    selection = listbox.curselection()
    if not selection:
        messagebox.showinfo("Remove task", "Select a task to remove.")
        return
    index = selection[0]
    tasks = load_tasks()
    tasks.pop(index)
    save_tasks(tasks)
    refresh_listbox(listbox)


def main():
    root = tk.Tk()
    root.title("Discipline Tasks")

    listbox = tk.Listbox(root, width=50)
    listbox.pack(padx=10, pady=10)

    entry = tk.Entry(root, width=50)
    entry.pack(padx=10)

    btn_frame = tk.Frame(root)
    btn_frame.pack(padx=10, pady=5)

    add_btn = tk.Button(btn_frame, text="Add", command=lambda: add_task(entry, listbox))
    add_btn.pack(side=tk.LEFT, padx=5)

    del_btn = tk.Button(btn_frame, text="Remove", command=lambda: delete_task(listbox))
    del_btn.pack(side=tk.LEFT, padx=5)

    refresh_listbox(listbox)
    root.mainloop()


if __name__ == "__main__":
    main()
